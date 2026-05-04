import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { UserInputState } from '@/hooks/use-input';
import { TokenSelectionState } from '@/hooks/use-token-selection';
import { LISTED_TOKENS } from '@/lib/core/tokens-config';
import { useState } from 'react';

export type InputComponentProps = {
  amountState: UserInputState;
  tokenSelectionState: TokenSelectionState;
  disabled?: boolean;
  typeName: 'send' | 'receive';
};

export const SelectTokenDialog = (props: { inner: InputComponentProps }) => {
  const receiveToken = props.inner.tokenSelectionState.value;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const onSelect = (tokenAddress: `0x${string}`) => {
    props.inner.tokenSelectionState.onSelect(LISTED_TOKENS.find((e) => e.address === tokenAddress)!);
    setOpen(false);
  };

  const filteredTokens = LISTED_TOKENS.filter(
    (e) =>
      e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.symbol.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className={
            'flex flex-row items-center gap-3 rounded-lg px-4 py-2 ' +
            (receiveToken !== null
              ? 'bg-[rgba(var(--neutral-low-rgb),0.24)] hover:bg-[rgba(var(--neutral-low-rgb),0.36)]'
              : 'bg-[rgba(var(--brand-rgb),0.12)] hover:bg-[rgba(var(--brand-rgb),0.24)]')
          }
        >
          <div className={'font-bold ' + (receiveToken !== null ? 'text-white' : 'text-brand')}>
            {receiveToken == null ? 'Select receive token' : receiveToken.symbol}
          </div>
          <Icons.halfArrow className="rotate-90" fill={receiveToken != null ? 'white' : 'rgba(var(--brand-rgb),1)'} />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-150 pb-5">
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-6 right-8 z-10 w-max">
            <Icons.close />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>{'Choose what to ' + props.inner.typeName}</DialogTitle>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          Selecting the same token lets you receive your assets privately with no on-chain link
        </div>

        <div className="mx-8 flex h-11 flex-row items-center gap-3 rounded-lg bg-(--neutral-low) px-3">
          <Icons.search fill="#94A3B8" />
          <input
            type="text"
            onWheel={(e) => (e.target as any).blur()}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-45 flex-1 bg-transparent text-white placeholder-[#94A3B8] outline-none"
            placeholder="Search token"
          />
        </div>
        {filteredTokens.length === 0 ? <div className="m-5 text-center text-white">Can't find token</div> : undefined}
        <div className="flex flex-col">
          {filteredTokens.map((token) => {
            return (
              <div
                key={token.address}
                onClick={(_) => onSelect(token.address)}
                className="ml-16 cursor-pointer py-5 text-white"
              >
                {token.symbol} - <span className="opacity-60">{token.name}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
