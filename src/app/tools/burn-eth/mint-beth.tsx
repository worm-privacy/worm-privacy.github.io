import { useState } from 'react';

export const MintBETHLayout = (props: { mintAmount: string; receiverAddress: string }) => {
  const [endPoint, setEndPoint] = useState(ENDPOINTS[0].url);

  const onGenerateClick = () => {
    console.log('generate!!');
  };

  return (
    <div className="flex w-full flex-col text-white">
      <div className="mb-5 font-normal">{props.mintAmount} BETH is going to minted for address</div>
      <div className="mb-5 text-[18px] font-bold">{props.receiverAddress}</div>

      <div className=" text-[14px] font-normal">Proving Endpoint</div>
      <select
        id="pet-select"
        className="appearance-none rounded-lg bg-[rgba(var(--neutral-low-rgb),0.36)] px-3 py-2.5"
        value={endPoint}
        onChange={(e) => {
          setEndPoint(e.target.value);
        }}
      >
        <div className="rounded-lg bg-[#05080F]">
          {ENDPOINTS.map((item) => (
            <option value={item.url} className="bg-[#05080F]" key={item.name}>
              {item.name} - {item.url}
            </option>
          ))}
        </div>
      </select>
      <div className="grow" />

      <button onClick={onGenerateClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
        Generate proof
      </button>
    </div>
  );
};

const ENDPOINTS = [
  { name: 'My Machine', url: 'http://localhost:8545' },
  // TODO
  { name: 'Worm Server 1', url: 'https://TODO1.com' },
  { name: 'Worm Server 2', url: 'https://TODO2.com' },
];
