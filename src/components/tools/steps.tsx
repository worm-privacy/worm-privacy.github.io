/// @param [selected] starts from 0
const StepsComponent = (props: { steps: StepItem[]; selected: number }) => {
  let steps = props.steps;
  let selected = props.selected;

  return (
    <div className=" text-white">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-[#1a1a2e] bg-[#010204] p-8 shadow-lg">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-start transition-all ${index == selected ? 'p-6' : 'p-3'}`}>
                <div
                  className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-orbitron transition-all   ${
                    index === selected ? 'text-[24px] text-[#00ff9d]' : 'text-[14px] text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className={`mb-1 text-[18px]  ${index === selected ? 'text-[#00ff9d]' : 'text-gray-300'}`}>
                    {step.title}
                  </h3>
                  <p className={` ${index === selected ? 'text-[16px] text-white' : 'text-[14px] text-gray-500'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsComponent;

export type StepItem = {
  title: string;
  description: string;
};
