'use client';

import { Footer } from '@/components/landing';
import ErrorComponent from '@/components/tools/error-component';
import InputComponent from '@/components/tools/input-text';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput } from '@/hooks/use-input';
import { useNetwork, WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHContract } from '@/lib/core/contracts/beth';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { CypherETHQuoterContract } from '@/lib/core/contracts/cyphereth-quoter';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_get } from '@/lib/core/miner-api/relay-get';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { calculateMintAmount } from '@/lib/core/utils/beth-amount-calculator';
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { loadJson } from '@/lib/utils/load-json';
import { newSavableRecoverData, recoverDataFromJson } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { useEffect, useState } from 'react';
import { Client, formatEther, hexToBytes, parseEther, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, usePublicClient, useSendTransaction } from 'wagmi';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';

export default function Wormhole() {
  // inputs
  const burnAmount = useInput('', validateETHAmount);
  const receiverAddress = useInput('', validateAddress);

  // fees
  const [proverFee, setProverFee] = useState<bigint | null>(null); // null means not loaded yet
  const [broadcasterFee, setBroadcasterFee] = useState<bigint | null>(null); // null means not loaded yet

  const [proverAddress, setProverAddress] = useState<`0x${string}` | null>(null); // null means not loaded yet

  // calculate/estimate
  const [mintAmount, setMintAmount] = useState(0n); // this is BETH
  const receiveAmount = useInput('', validateETHAmount); // this is ETH

  // state
  const [wormholeState, setWormholeState] = useState<WormholeState>('Start');
  const isLoadingState = wormholeState === 'Calculating' || wormholeState == 'Sending';
  const [error, setError] = useState<string | null>(null); // null means no error state

  const [burnAddress, setBurnAddress] = useState<BurnAddressContent | null>(null);

  const resetStates = () => {
    setWormholeState('Start');
    burnAmount.update('');
    receiverAddress.update('');
    receiveAmount.update('');
    setError(null);
    setBurnAddress(null);
  };

  const { mutateAsync } = useSendTransaction();
  const client = useClient();
  const publicClient = usePublicClient();
  const network = useNetwork();

  useEffect(() => {
    // TODO call these two in parallel
    relay_get(DEFAULT_ENDPOINT.url)
      .then((response) => {
        setBroadcasterFee(response.min_broadcaster_fee);
      })
      .catch((e) => {
        console.error('relay_get:', e);
        setError('Error while getting info from server');
      });
    proof_get(DEFAULT_ENDPOINT.url)
      .then((response) => {
        setProverFee(response.min_prover_fee);
        setProverAddress(response.prover_address);
      })
      .catch((e) => {
        console.error('proof_get', e);
        setError('Error while getting info from server');
      });
  }, []);

  useEffect(() => {
    if (proverFee == null || broadcasterFee == null) return;
    // Swap amount sets 0 because we want to swap all of it anyway
    setMintAmount(calculateMintAmount(parseEther(burnAmount.value), 0n, proverFee, broadcasterFee));
  }, [burnAmount, proverFee, broadcasterFee]);

  useDebounceEffect(
    () => {
      CypherETHQuoterContract.estimateBethEtherSwap(client!, mintAmount)
        .then((estimatedAmount) => {
          console.log('estimatedAmount:', estimatedAmount);
          receiveAmount.update(formatEther(estimatedAmount));
        })
        .catch((e) => {
          console.error(e);
          setError('Error while Estimating receive amount');
        });
    },
    1000,
    [mintAmount]
  );

  const onPrimaryClick = async () => {
    switch (wormholeState) {
      case 'Start':
        onStartClick();
        break;
      case 'Send':
        onSendClick();
        break;
    }
  };

  const onSendClick = async () => {
    setWormholeState('Sending');
    try {
      await transferETH(mutateAsync, client!, burnAddress!.revealAmount, burnAddress!.burnAddress);
      await generateAndSubmit(client!, burnAddress!, publicClient, burnAddress!.revealAmount, network, proverAddress!);
      resetStates();
    } catch (e) {
      console.error('onSend', e);
      setError('Error happened');
    }
  };

  const onStartClick = async () => {
    // validation
    if (!validateAll(burnAmount, receiverAddress)) return;
    const burnAmountN = parseEther(burnAmount.value);
    if (parseEther(receiveAmount.value) < 0n) return burnAmount.setError('Burn amount is too low');
    if (burnAmountN > parseEther('10')) return burnAmount.setError('You can not burn more then 10 ETH');

    if (proverFee === null || broadcasterFee === null) return;

    try {
      // `swapAmount` sets 0n because we want to swap all of it anyway
      const mintAmount = calculateMintAmount(burnAmountN, 0n, proverFee, broadcasterFee);
      console.log('onStart', formatEther(burnAmountN), formatEther(mintAmount), receiverAddress);
      setWormholeState('Calculating');

      const swapCalldata = hexToBytes(
        BETHToETHContract.createSwapHook(mintAmount, receiverAddress.value as `0x${string}`)
      );

      const _burnAddress = await generateBurnAddress(
        receiverAddress.value,
        proverFee,
        broadcasterFee,
        burnAmountN,
        swapCalldata
      );
      setBurnAddress(_burnAddress);

      saveJson(newSavableRecoverData(_burnAddress), `burn_${_burnAddress.burnAddress}_backup.json`);

      setWormholeState('Send');
    } catch (e) {
      console.error('onStart', e);
      setError('Error happened');
    }
  };

  const onRecoverClick = async () => {
    const recoverData = recoverDataFromJson(await loadJson());
    console.log('onRecover', recoverData);

    burnAmount.update(formatEther(recoverData.burn.revealAmount));
    receiverAddress.update(recoverData.burn.receiverAddr);

    setWormholeState('Sending');
    try {
      await generateAndSubmit(
        client!,
        recoverData.burn,
        publicClient,
        recoverData.burn.revealAmount,
        network,
        undefined
      );
      resetStates();
    } catch (e) {
      console.error('onRecover', e);
      setError('Error happened');
    }
  };

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <WalletNotConnectedContainer>
          <div>
            <div className="m-auto mt-10 flex max-w-[500px] flex-col rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
              <div className="m-auto text-[24px] font-bold text-white">Wormhole</div>
              {error === null ? (
                <div className="flex flex-col gap-3 ">
                  <InputComponent
                    disabled={wormholeState !== 'Start'}
                    label="Send amount"
                    hint="0.0"
                    state={burnAmount}
                    inputType="number"
                    inputKind="ETH"
                  />

                  {/* arrow */}
                  <div className="mt-2 flex flex-row">
                    <div className="grow" />
                    <Icons.back className="rotate-270" />
                    <div className="grow" />
                  </div>

                  <InputComponent
                    disabled
                    label="Receive amount"
                    hint="0.0"
                    state={receiveAmount}
                    inputType="number"
                    inputKind="ETH"
                  />
                  <InputComponent
                    disabled={wormholeState !== 'Start'}
                    label="Receiver address"
                    hint="0xf3...fd23"
                    state={receiverAddress}
                    info="This address will get BETH (make sure you have private key of this address)"
                  />

                  <button
                    onClick={onPrimaryClick}
                    disabled={isLoadingState}
                    className={`mt-3 w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black ${isLoadingState ? 'opacity-60' : ''}`}
                  >
                    {wormholeState}
                    {isLoadingState ? '...' : ''}
                  </button>

                  {wormholeState === 'Start' ? (
                    <button
                      onClick={onRecoverClick}
                      className="flex w-full flex-row items-center justify-center py-3 text-sm font-medium text-brand"
                    >
                      <Icons.recover className="mr-2" />
                      Recover
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <ErrorComponent title={error} />
                </div>
              )}
            </div>
          </div>
        </WalletNotConnectedContainer>
        <div className="min-h-12 grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

const generateAndSubmit = async (
  client: Client,
  burnAddress: BurnAddressContent,
  publicClient: any, // pass whatever usePublicClient() returns
  burnAmount: bigint,
  network: WormNetwork,
  proverAddress?: `0x${string}`
) => {
  let blockNumber = (await publicClient!.getBlock()).number;
  let accountProof = await publicClient?.getProof({
    address: burnAddress.burnAddress as `0x${string}`,
    storageKeys: [],
    blockNumber: blockNumber,
  });

  await proof_post(
    DEFAULT_ENDPOINT.url,
    createProofPostRequest(
      blockNumber,
      network,
      burnAddress.burnKey,
      burnAddress.receiverAddr,
      burnAddress.broadcasterFee,
      burnAddress.proverFee,
      burnAddress.revealAmount,
      toHex(burnAddress.receiverHook),
      accountProof!
    )
  );

  const nullifier = calculateNullifier(burnAddress.burnKey);
  let rapidsnarkProof: RapidsnarkOutput | null = null;
  while (rapidsnarkProof === null) {
    const result = await proof_get_by_nullifier(DEFAULT_ENDPOINT.url, nullifier.toString());
    if (result.status == 'done') rapidsnarkProof = result.proof;
    await new Promise((resolve) => setTimeout(resolve, GET_PROOF_RESULT_POLLING_INTERVAL));
  }
  console.log('rapidsnarkProof:', rapidsnarkProof);

  const remainingCoin = calculateRemainingCoinHash(
    burnAddress.burnKey,
    burnAddress.revealAmount,
    burnAddress.revealAmount
  );

  const trxHash = await relay_post(DEFAULT_ENDPOINT.url, {
    network: network,
    proof: rapidsnarkProof!,
    nullifier,
    remaining_coin: remainingCoin,
    broadcaster_fee: burnAddress.broadcasterFee,
    reveal_amount: burnAmount,
    receiver: burnAddress.receiverAddr,
    prover_fee: burnAddress.proverFee,
    prover_address: proverAddress ?? (await proof_get(DEFAULT_ENDPOINT.url)).prover_address,
    swap_calldata: burnAddress.receiverHook,
  });

  console.log('waiting fot receipt trx_hash:', trxHash);
  try {
    let receipt = await waitForTransactionReceipt(client!, { hash: trxHash });
    if (receipt.status === 'reverted') throw 'mintCoin reverted';
    console.log('got receipt:', trxHash);
  } catch (e) {
    console.error(e);
    console.log('Plan B: checking for nullifier on contract');
    // plan B: check if nullifier exists on contract
    await new Promise((resolve) => setTimeout(resolve, 15000)); // wait for one block time
    const exists = await BETHContract.checkNullifier(client!, nullifier);
    if (!exists) throw 'nullifier is not on contract';
  }
};

type WormholeState = 'Start' | 'Calculating' | 'Send' | 'Sending';
