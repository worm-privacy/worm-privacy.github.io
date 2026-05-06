'use client';

import { Footer } from '@/components/landing';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
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

  const [burnTrx, setBurnTrx] = useState<`0x${string}` | null>(null);
  const [mintTrx, setMintTrx] = useState<`0x${string}` | null>(null);

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

  const onStart = (result: WormholeRestComponentResult) => {
    console.log('result', result);
    setRestResult(result);
    setWormholeState('ReadyToSend');
  };

  const onSend = () => setWormholeState('Loading');

  const onError = () => setWormholeState('Error');

  const onRecoverClick = async () => {
    // TODO check for burn address balance to see if transfer happened successfully and continue the process
    // TODO prepare loading layout data and start loading state
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
        return <WormholeReadyToSendComponent restResult={restResult!} onSend={onSend} />;
      case 'Loading':
        return (
          <WormholeLoadingComponent
            restResult={restResult!}
            onError={onError}
            setBurnTrx={setBurnTrx}
            setMintTrx={setMintTrx}
          />
        );
      case 'Error':
        return <WormholeErrorComponent onRecoverClick={onRecoverClick} />;
      case 'Finished':
        return <WormholeFinishedComponent senderTx={burnTrx} receiverTx={mintTrx} />;
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
