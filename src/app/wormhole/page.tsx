'use client';

import { Footer } from '@/components/landing';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHContract } from '@/lib/core/contracts/beth';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { Dispatch, SetStateAction, useState } from 'react';
import { Client, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';
import WormholeErrorComponent from './error';
import WormholeFinishedComponent from './finished';
import WormholeLoadingComponent from './loading';
import WormholeReadyToSendComponent from './ready-to-send';
import WormholeRestComponent, { WormholeRestComponentResult } from './rest';

export default function Wormhole() {
  // state
  const [wormholeState, setWormholeState] = useState<WormholeState>('Rest');

  const [restResult, setRestResult] = useState<WormholeRestComponentResult | null>(null);

  const onStart = (result: WormholeRestComponentResult) => {
    console.log('result', result);
    setRestResult(result);
    setWormholeState('ReadyToSend');
  };

  const onSendClick = async () => {
    //TODO todo move this to loading component
    // try {
    //   setWormholeState('Sending to burn address');
    //   await transferETH(mutateAsync, client!, burnAddress!.revealAmount, burnAddress!.burnAddress);
    //   await generateAndSubmit(
    //     client!,
    //     burnAddress!,
    //     setWormholeState,
    //     publicClient,
    //     burnAddress!.revealAmount,
    //     network,
    //     proverAddress!
    //   );
    //   resetStates();
    // } catch (e) {
    //   console.error('onSend', e);
    //   setError('Error happened');
    // }
  };

  const onRecoverClick = async () => {
    // TODO check for burn address balance to see if transfer happened successfully and continue the process
    //
    // const recoverData = recoverDataFromJson(await loadJson());
    // console.log('onRecover', recoverData);
    // burnAmount.update(formatEther(recoverData.burn.revealAmount));
    // receiverAddress.update(recoverData.burn.receiverAddr);
    // try {
    //   await generateAndSubmit(
    //     client!,
    //     recoverData.burn,
    //     setWormholeState,
    //     publicClient,
    //     recoverData.burn.revealAmount,
    //     network,
    //     undefined
    //   );
    //   resetStates();
    // } catch (e) {
    //   console.error('onRecover', e);
    //   setError('Error happened');
    // }
  };

  const switchInnerComponent = () => {
    switch (wormholeState) {
      case 'Rest':
        return <WormholeRestComponent onRecoverClick={onRecoverClick} onStart={onStart} />;
      case 'ReadyToSend':
        return <WormholeReadyToSendComponent restResult={restResult!} />;
      case 'Loading':
        return <WormholeLoadingComponent />;
      case 'Error':
        return <WormholeErrorComponent />;
      case 'Finished':
        return <WormholeFinishedComponent />;
      default:
        throw 'state not supported';
    }
  };

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <WalletNotConnectedContainer>
          <div>
            <div className="m-auto mt-5 flex max-w-[500px] flex-row items-center">
              <Icons.back width="15" className="m-4" />
              <div className="text-[24px] font-bold text-white">Wormhole</div>
            </div>
            <div className="m-auto  flex max-w-[500px] text-white">
              Privacy-first swap, Send and receive anonymously!
            </div>
            <div className="m-auto mt-5 flex max-w-[500px] flex-col rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
              {switchInnerComponent()}
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
  setWormholeState: Dispatch<SetStateAction<WormholeState>>,
  publicClient: any, // pass whatever usePublicClient() returns
  burnAmount: bigint,
  network: WormNetwork,
  proverAddress?: `0x${string}`
) => {
  // setWormholeState('Generating proof'); // TODO change loading state
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

  // setWormholeState('Submitting proof'); // TODO change loading state
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

type WormholeState = 'Rest' | 'ReadyToSend' | 'Loading' | 'Error' | 'Finished';
