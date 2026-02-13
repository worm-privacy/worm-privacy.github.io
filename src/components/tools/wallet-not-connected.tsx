import { mainnet } from 'viem/chains';
import { useConnection } from 'wagmi';

export const WalletNotConnectedContainer = (props: { children?: React.ReactNode }) => {
  const { isConnected, chainId } = useConnection();

  if (isConnected) {
    if (chainId !== mainnet.id) {
      return (
        <div className="my-60 flex grow flex-col items-center text-white">
          <div className="grow" />
          <div className="text-3xl">You are not on mainnet</div>
          <div>Please switch your network (check the top-right corner)</div>
          <div className="grow" />
        </div>
      );
    }

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
