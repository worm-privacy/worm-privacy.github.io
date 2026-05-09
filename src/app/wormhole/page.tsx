'use client';

import { Footer } from '@/components/landing';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { EtherscanLink } from '@/lib/core/utils/etherscan-link';
import { useState } from 'react';
import WormholeErrorComponent from './error';
import WormholeFinishedComponent from './finished';
import WormholeLoadingComponent from './loading';
import WormholeReadyToSendComponent from './ready-to-send';
import WormholeRestComponent, { WormholeRestComponentResult } from './rest';

export default function Wormhole() {
  // state
  const [wormholeState, setWormholeState] = useState<WormholeState>('Rest');

  const [restResult, setRestResult] = useState<WormholeRestComponentResult | null>(null);

  const [burnLink, setBurnLink] = useState<EtherscanLink | null>(null);
  const [mintLink, setMintLink] = useState<EtherscanLink | null>(null);

  const topBarVisible = wormholeState === 'Rest' || wormholeState === 'ReadyToSend';

  const onBackClick = () => {
    switch (wormholeState) {
      case 'Rest':
        window.location.href = '/';
        break;
      case 'ReadyToSend':
        // safer way to back to 'Rest' state making sure we are wiping everything
        window.location.reload();
        break;
    }
  };

  const onStartClicked = (result: WormholeRestComponentResult) => {
    console.log('onStart', result);
    setRestResult(result);
    setWormholeState('ReadyToSend');
  };

  const onSendClicked = () => setWormholeState('Loading');

  const onProcessFinished = (burnTxHash: EtherscanLink, mintTrxHash: EtherscanLink) => {
    console.log(`onFinished ${burnTxHash} ${mintTrxHash}`);
    setBurnLink(burnTxHash);
    setMintLink(mintTrxHash);
    setWormholeState('Finished');
  };

  const onError = () => setWormholeState('Error');

  const onRecoverClick = async () => {
    setRestResult(null);
    setWormholeState('ReadyToSend');
  };

  const switchInnerComponent = () => {
    switch (wormholeState) {
      case 'Rest':
        return <WormholeRestComponent onRecoverClick={onRecoverClick} onStart={onStartClicked} />;
      case 'ReadyToSend':
        return <WormholeReadyToSendComponent restResult={restResult!} onSend={onSendClicked} />;
      case 'Loading':
        return (
          <WormholeLoadingComponent
            data={restResult ?? 'recover-mode'}
            onError={onError}
            onFinished={onProcessFinished}
          />
        );
      case 'Error':
        return <WormholeErrorComponent onRecoverClick={onRecoverClick} />;
      case 'Finished':
        return <WormholeFinishedComponent senderLink={burnLink!} receiverLink={mintLink!} />;
      default:
        throw 'state not supported';
    }
  };

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <WalletNotConnectedContainer>
          {topBarVisible && (
            <div>
              <div className="m-auto mt-5 flex max-w-[500px] flex-row items-center">
                <button onClick={onBackClick}>
                  <Icons.back width="15" className="m-4" />
                </button>
                <div className="text-[24px] font-bold text-white">Wormhole</div>
              </div>
              <div className="m-auto  flex max-w-[500px] text-white">
                Privacy-first swap, Send and receive anonymously!
              </div>
            </div>
          )}
          <div className="m-auto mt-5 flex w-[500px] flex-col rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
            {switchInnerComponent()}
          </div>
        </WalletNotConnectedContainer>
        <div className="min-h-12 grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

type WormholeState = 'Rest' | 'ReadyToSend' | 'Loading' | 'Error' | 'Finished';
