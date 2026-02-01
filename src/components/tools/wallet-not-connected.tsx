import { useConnection } from 'wagmi';

export const WalletNotConnectedContainer = (props: { children?: React.ReactNode }) => {
  const { isConnected } = useConnection();

  if (isConnected) {
    return props.children;
  } else {
    return (
      <div className="my-60 flex grow flex-col items-center text-white">
        <div className="grow" />
        <div className="text-3xl">Wallet is not connected</div>
        <div>Please connect your wallet</div>
        <div className="grow" />
      </div>
    );
  }
};
