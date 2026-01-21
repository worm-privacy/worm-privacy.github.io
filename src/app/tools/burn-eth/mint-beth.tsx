import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import { Icons } from '@/components/ui/icons';
import { useInterval } from '@/hooks/use-interval';
import { useNetwork, WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';

import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { newSavableRecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import Link from 'next/link';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { usePublicClient } from 'wagmi';

export const MintBETHLayout = (props: {
  mintAmount: string;
  burnAddress: BurnAddressContent;
  proof: RapidsnarkOutput | null;
  setProof: Dispatch<SetStateAction<RapidsnarkOutput | null>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // skip endpoint selection flow if proof is already provided (by recover mechanism)
  let [flowState, setFlowState] = useState<FlowState>(props.proof == null ? FlowState.EndPoint : FlowState.Generated);
  const [endPoint, setEndPoint] = useState(ENDPOINTS[0].url);
  const [blockNumber, setBlockNumber] = useState(0n);
  let network = useNetwork();

  let nullifier = useMemo(() => calculateNullifier(props.burnAddress.burnKey), []);

  const onProofGenerated = (proof: RapidsnarkOutput) => {
    props.setProof(proof);
    setFlowState(FlowState.Generated);
    setIsLoading(false);
  };

  const onError = (msg: string) => {
    setError(msg);
    setIsLoading(false);
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
      setIsLoading(true);
      setError(null);
      await relay_post(endPoint, {
        network: network,
        proof: props.proof!,
        block_number: blockNumber,
        nullifier: nullifier,
        remaining_coin: remaining_coin,
        broadcaster_fee: props.burnAddress.broadcasterFee,
        reveal_amount: props.burnAddress.revealAmount,
        receiver: props.burnAddress.receiverAddr,
        prover_fee: props.burnAddress.proverFee,
        swap_calldata: props.burnAddress.receiverHook,
      });
      setIsLoading(false);
      setFlowState(FlowState.Submitted);
    } catch (e) {
      console.error(e);
      onError(typeof e == 'string' ? e : 'unknown error');
    }
  };

  if (isLoading) {
    return (
      <>
        <LoadingComponent />
      </>
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
            setBlockNumber={setBlockNumber}
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
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setFlowState: Dispatch<SetStateAction<FlowState>>;
  onProofGenerated: (proof: RapidsnarkOutput) => void;
  onProofGenerationFailed: (msg: string) => void;
  endPoint: string;
  setEndPoint: Dispatch<SetStateAction<string>>;
  network: WormNetwork;
  nullifier: bigint;
  setBlockNumber: Dispatch<SetStateAction<bigint>>;
}) => {
  const fetchResultInterval = async () => {
    // keep polling until we get
    try {
      const result = await proof_get_by_nullifier(props.endPoint, props.nullifier.toString(10));
      if (result != 'waiting') {
        props.onProofGenerated(result);
        stopPolling();
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
    props.setIsLoading(true);
    props.setError(null);
    try {
      let blockNumber = (await client!.getBlock()).number;
      props.setBlockNumber(blockNumber);
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
      <div className="mb-5 font-normal">{props.mintAmount} BETH is going to minted for address</div>
      <div className="mb-5 text-[18px] font-bold">{props.burnAddress.receiverAddr}</div>

      <div className=" text-[14px] font-normal">Proving Endpoint</div>
      <select
        id="pet-select"
        className="appearance-none rounded-lg bg-[rgba(var(--neutral-low-rgb),0.36)] px-3 py-2.5"
        value={props.endPoint}
        onChange={(e) => {
          props.setEndPoint(e.target.value);
        }}
      >
        {ENDPOINTS.map((item) => (
          <option value={item.url} className="bg-[#05080F]" key={item.name}>
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
      <div className="text[18px]">for burn address: {props.burnAddress.burnAddress}</div>
      <div className="grow" />
      <div className="flex justify-center">
        <button
          onClick={props.onBackupProofDataClick}
          className="flex items-center text-sm text-[14px] font-bold text-brand"
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
  { name: 'My Machine', url: 'http://localhost:8080' },
  // TODO
  { name: 'Worm Server 1', url: 'https://TODO1.com' },
  { name: 'Worm Server 2', url: 'https://TODO2.com' },
];
