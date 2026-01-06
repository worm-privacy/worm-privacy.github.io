import { Icons } from '../ui/icons';

export default function ErrorComponent(props: { title: string; details?: string }) {
  return (
    <div className="h-full grow  rounded-lg bg-[#DC262629] p-4 text-white">
      <Icons.alert className="my-1 h-5 w-5" />
      <div>{props.title}</div>
      <div className="text-[#94A3B8]">{props.details}</div>
    </div>
  );
}
