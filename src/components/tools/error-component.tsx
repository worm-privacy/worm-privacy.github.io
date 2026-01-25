import { Icons } from '../ui/icons';

export default function ErrorComponent(props: { title: string; details?: string; hFull?: boolean }) {
  let style = 'rounded-lg bg-[#DC262629] p-4 text-white ';
  style += (props.hFull ?? true) ? 'h-full grow' : '';
  return (
    <div className={style}>
      <Icons.alert className="my-1 h-5 w-5" />
      <div>{props.title}</div>
      <div className="text-[#94A3B8]">{props.details}</div>
    </div>
  );
}
