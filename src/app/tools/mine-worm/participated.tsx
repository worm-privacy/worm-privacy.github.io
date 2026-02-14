import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

export default function Participated(props: { amount: string; numberOfEpochs: string }) {
  return (
    <div className="flex grow flex-col gap-6 p-4 text-white">
      <div className="text-[24px] font-bold">Participated successfully</div>
      <div>
        Congratulation! <br /> <br />
        You successfully participate total <b>{props.amount} </b> <span className="text-[#FF47C0]">BETH </span>in next{' '}
        <b>{props.numberOfEpochs} </b>epochs. <br /> <br />
        Ready to claim your <span className="text-brand">TWORM</span>s.
      </div>

      <div className="grow" />

      <Link href="/tools/claim-worm">
        <button className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 font-semibold text-black">
          <Icons.target className="mr-2" />
          Claim TWORM
        </button>
      </Link>
    </div>
  );
}
