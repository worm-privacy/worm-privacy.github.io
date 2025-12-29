import LoadingComponent from '@/components/tools/loading';
import { useInterval } from '@/hooks/use-interval';
import { useNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';

import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';

import { Dispatch, SetStateAction, useState } from 'react';
import { usePublicClient } from 'wagmi';

export const MintBETHLayout = (props: {
  mintAmount: string;
  burnAddress: BurnAddressContent;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  let [flowState, setFlowState] = useState<FlowState>('end-point');
  const [proof, setProof] = useState<RapidsnarkOutput | null>(null);

  const onProofGenerated = (proof: RapidsnarkOutput) => {
    setProof(proof);
    setFlowState('generated');
    setIsLoading(false);
  };

  const onProofGenerationFailed = (msg: string) => {
    //TODO show error
    console.error(msg);
    setIsLoading(false);
  };

  if (isLoading) {
    return;
    <>
      <LoadingComponent />
    </>;
  }

  switch (flowState) {
    case 'end-point':
      return (
        <>
          <EndPointSelection
            mintAmount={props.mintAmount}
            burnAddress={props.burnAddress}
            setIsLoading={setIsLoading}
            setFlowState={setFlowState}
            onProofGenerated={onProofGenerated}
            onProofGenerationFailed={onProofGenerationFailed}
          />
        </>
      );
    case 'generated':
      return (
        <>
          <Generated />
        </>
      );
    case 'submitted':
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
  setFlowState: Dispatch<SetStateAction<FlowState>>;
  onProofGenerated: (proof: RapidsnarkOutput) => void;
  onProofGenerationFailed: (msg: string) => void;
}) => {
  const [endPoint, setEndPoint] = useState(ENDPOINTS[0].url);
  let network = useNetwork();

  let nullifier = calculateNullifier(props.burnAddress.burnKey).toString(10);
  console.log(`nullifier: ${nullifier}`);

  const fetchResultInterval = async () => {
    // keep polling until we get
    try {
      const result = await proof_get_by_nullifier(endPoint, nullifier);
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
    try {
      let blockNumber = (await client!.getBlock()).number;
      let proof = await client?.getProof({
        address: props.burnAddress.burnAddress as `0x${string}`,
        storageKeys: [],
        blockNumber: blockNumber,
      });

      const burnAddress = props.burnAddress;
      await proof_post(
        endPoint,
        createProofPostRequest(
          blockNumber,
          network,
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
        value={endPoint}
        onChange={(e) => {
          setEndPoint(e.target.value);
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

const Generated = (props: {}) => {
  return <div>Proof Generated</div>;
};

const Submitted = (props: {}) => {
  return <div> Submitted! </div>;
};

type FlowState = 'end-point' | 'generated' | 'submitted';

const ENDPOINTS = [
  { name: 'My Machine', url: 'http://localhost:8080' },
  // TODO
  { name: 'Worm Server 1', url: 'https://TODO1.com' },
  { name: 'Worm Server 2', url: 'https://TODO2.com' },
];
