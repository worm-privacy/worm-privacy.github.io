import ErrorComponent from '@/components/tools/error-component';
import { Icons } from '@/components/ui/icons';
import { useInterval } from '@/hooks/use-interval';
import { useNetwork, WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHContract } from '@/lib/core/contracts/beth';
import { proof_get } from '@/lib/core/miner-api/proof-get';

import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { newSavableRecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import Link from 'next/link';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useClient, usePublicClient, useWriteContract } from 'wagmi';

export const MintBETHLayout = (props: {
  mintAmount: string;
  burnAddress: BurnAddressContent;
  proof: RapidsnarkOutput | null;
  setProof: Dispatch<SetStateAction<RapidsnarkOutput | null>>;
}) => {
  const [isLoading, setIsLoading] = useState<'submit' | 'proof' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // skip endpoint selection flow if proof is already provided (by recover mechanism)
  let [flowState, setFlowState] = useState<FlowState>(props.proof == null ? FlowState.EndPoint : FlowState.Generated);
  const [endPoint, setEndPoint] = useState(ENDPOINTS[0].url);
  const [inQueue, setInQueue] = useState<number | null>(null);
  let network = useNetwork();

  const client = useClient();
  const { mutateAsync } = useWriteContract();

  let nullifier = useMemo(() => calculateNullifier(props.burnAddress.burnKey), []);

  const onProofGenerated = (proof: RapidsnarkOutput) => {
    props.setProof(proof);
    setFlowState(FlowState.Generated);
    setIsLoading(null);
  };

  const onError = (msg: string) => {
    setError(msg);
    setIsLoading(null);
  };

  const onBackupProofDataClick = async () =>
    saveJson(
      newSavableRecoverData(props.burnAddress, props.proof!),
      `proof_${props.burnAddress.burnAddress}_backup.json`
    );

  const onSubmitClick = async () => {
    const remaining_coin = calculateRemainingCoinHash(
      props.burnAddress.burnKey,
      props.burnAddress.revealAmount,
      props.burnAddress.revealAmount
    );

    try {
      setIsLoading('submit');
      setError(null);

      const response = await proof_get(endPoint);

      await BETHContract.mintCoin(
        mutateAsync,
        client!,
        props.proof!,
        nullifier,
        remaining_coin,
        props.burnAddress.broadcasterFee,
        props.burnAddress.revealAmount,
        props.burnAddress.receiverAddr as `0x${string}`,
        props.burnAddress.proverFee,
        response.prover_address
      );

      // this uses relay for broadcasting
      // await relay_post(endPoint, {
      //   network: network,
      //   proof: props.proof!,
      //   nullifier: nullifier,
      //   remaining_coin: remaining_coin,
      //   broadcaster_fee: props.burnAddress.broadcasterFee,
      //   reveal_amount: props.burnAddress.revealAmount,
      //   receiver: props.burnAddress.receiverAddr,
      //   prover_fee: props.burnAddress.proverFee,
      //   swap_calldata: props.burnAddress.receiverHook,
      // });
      setIsLoading(null);
      setFlowState(FlowState.Submitted);
    } catch (e) {
      console.error(e);
      onError(typeof e == 'string' ? e : 'unknown error');
    }
  };

  if (isLoading == 'proof') {
    return (
      <div className="grow text-white">
        <div className="mb-6 text-[24px]">Hold on a sec</div>
        <div className="text-[18px]">Server is generating proofs!</div>
        {inQueue == null ? (
          <></>
        ) : inQueue == 0 ? (
          <div className="text-[18px]">It's your turn now</div>
        ) : (
          <div className="text-[18px]">You are number {inQueue} in the queue...</div>
        )}
      </div>
    );
  }

  if (isLoading == 'submit') {
    return (
      <div className="grow text-white">
        <div className="mb-6 text-[24px]">Hold on a sec</div>
        <div className="text-[18px]">Submitting proof...</div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ErrorComponent title="Error" details="An error happened while doing your request" />
      </>
    );
  }

  switch (flowState) {
    case FlowState.EndPoint:
      return (
        <>
          <EndPointSelection
            mintAmount={props.mintAmount}
            burnAddress={props.burnAddress}
            setIsLoading={setIsLoading}
            setError={setError}
            setFlowState={setFlowState}
            onProofGenerated={onProofGenerated}
            onProofGenerationFailed={onError}
            endPoint={endPoint}
            setEndPoint={setEndPoint}
            network={network}
            nullifier={nullifier}
            setInQueue={setInQueue}
          />
        </>
      );
    case FlowState.Generated:
      return (
        <>
          <Generated
            burnAddress={props.burnAddress}
            onSubmitClick={onSubmitClick}
            onBackupProofDataClick={onBackupProofDataClick}
          />
        </>
      );
    case FlowState.Submitted:
      return (
        <>
          <Submitted />
        </>
      );
    default:
      throw 'unreachable!';
  }
};

const GET_PROOF_RESULT_POLLING_INTERVAL = 5000;
const EndPointSelection = (props: {
  mintAmount: string;
  burnAddress: BurnAddressContent;
  setIsLoading: Dispatch<SetStateAction<'submit' | 'proof' | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setFlowState: Dispatch<SetStateAction<FlowState>>;
  onProofGenerated: (proof: RapidsnarkOutput) => void;
  onProofGenerationFailed: (msg: string) => void;
  endPoint: string;
  setEndPoint: Dispatch<SetStateAction<string>>;
  network: WormNetwork;
  nullifier: bigint;
  setInQueue: Dispatch<SetStateAction<number | null>>;
}) => {
  const fetchResultInterval = async () => {
    // keep polling until we get
    try {
      const result = await proof_get_by_nullifier(props.endPoint, props.nullifier.toString(10));
      if (result.status === 'done') {
        props.onProofGenerated(result.proof);
        stopPolling();
      } else {
        props.setInQueue(result.inQueue);
      }
    } catch (e) {
      console.error(e);
      stopPolling();
      props.onProofGenerationFailed(typeof e == 'string' ? e : 'unknown error');
    }
  };

  const { start: startPolling, stop: stopPolling } = useInterval(
    fetchResultInterval,
    GET_PROOF_RESULT_POLLING_INTERVAL
  );

  const client = usePublicClient();
  const onGenerateClick = async () => {
    props.setIsLoading('proof');
    props.setError(null);
    try {
      let blockNumber = (await client!.getBlock()).number;
      let proof = await client?.getProof({
        address: props.burnAddress.burnAddress as `0x${string}`,
        storageKeys: [],
        blockNumber: blockNumber,
      });

      const burnAddress = props.burnAddress;
      await proof_post(
        props.endPoint,
        createProofPostRequest(
          blockNumber,
          props.network,
          burnAddress.burnKey,
          burnAddress.receiverAddr,
          burnAddress.broadcasterFee,
          burnAddress.proverFee,
          burnAddress.revealAmount,
          '0x', // TODO
          proof!
        )
      );

      console.log('Proof request Pushed to queue');
      startPolling();
    } catch (e) {
      props.onProofGenerationFailed(typeof e == 'string' ? e : 'unknown error');
    }
  };

  return (
    <div className="flex w-full flex-col text-white">
      <div className="mb-6 text-[18px] font-normal">{props.mintAmount} BETH is going to be minted for address</div>
      <div className="mb-6 text-[18px] font-bold">{props.burnAddress.receiverAddr}</div>

      <div className="mb-2 text-[14px] font-normal">Proving Endpoint</div>
      <select
        id="pet-select"
        className="h-10 appearance-none rounded-lg bg-[rgba(var(--neutral-low-rgb),0.36)] px-3 text-[14px] outline-none"
        value={props.endPoint}
        onChange={(e) => {
          props.setEndPoint(e.target.value);
        }}
      >
        {ENDPOINTS.map((item) => (
          <option value={item.url} className="h-8 bg-[#05080F] text-[14px]" key={item.name}>
            {item.name} - {item.url}
          </option>
        ))}
      </select>

      <div className="grow" />

      <button onClick={onGenerateClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
        Generate proof
      </button>
    </div>
  );
};

const Generated = (props: {
  burnAddress: BurnAddressContent;
  onSubmitClick: () => void;
  onBackupProofDataClick: () => void;
}) => {
  return (
    <div className="flex w-full flex-col gap-6 text-white">
      <div className="text[24px]">Proof Generated</div>
      <div className="text[18px]">For burn address: {props.burnAddress.burnAddress}</div>
      <div className="grow" />
      <div className="flex justify-center">
        <button
          onClick={props.onBackupProofDataClick}
          className="flex w-full items-center justify-center text-sm text-[14px] font-bold text-brand"
        >
          <Icons.backup className="mr-2" />
          Backup proof data
        </button>
      </div>
      <button onClick={props.onSubmitClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
        Submit proof
      </button>
    </div>
  );
};

const Submitted = () => {
  return (
    <div className="flex w-full flex-col gap-6 text-white">
      <div className="text[24px] font-bold">Proof submitted successfully</div>
      <div className="text[18px] font-normal">Now you can Mine WORM.</div>
      <div className="grow" />

      <Link href="/tools/mine-worm">
        <button className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 font-semibold text-black">
          <Icons.target className="mr-2" />
          Mine Worm
        </button>
      </Link>
    </div>
  );
};

enum FlowState {
  EndPoint,
  Generated,
  Submitted,
}

const ENDPOINTS = [
  { name: 'WORM public prover #1', url: 'https://prover-1.worm.cx' },
  { name: 'Metatarz prover', url: 'https://worm-testnet.metatarz.xyz' },
  { name: 'Local machine', url: 'http://localhost:8080' },
];
