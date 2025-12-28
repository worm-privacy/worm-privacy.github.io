import { useNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-api';
import { Dispatch, SetStateAction, useState } from 'react';
import { usePublicClient } from 'wagmi';

export const MintBETHLayout = (props: {
  mintAmount: string;
  burnAddress: BurnAddressContent;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  let [flowState, setFlowState] = useState<FlowState>('end-point');

  switch (flowState) {
    case 'end-point':
      return (
        <>
          <EndPointSelection
            mintAmount={props.mintAmount}
            burnAddress={props.burnAddress}
            setIsLoading={props.setIsLoading}
            setFlowState={setFlowState}
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
}) => {
  const [endPoint, setEndPoint] = useState(ENDPOINTS[0].url);
  let network = useNetwork();

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
    } catch (e) {
      console.error(e);
    } finally {
      props.setIsLoading(false);
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
