const StepsComponent = (props: { steps: StepItem[]; selected: number }) => {
  let steps = props.steps;
  let selected = props.selected;

  return (
    <div className=" text-white">
      <div className="mx-auto w-[580px]">
        <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start transition-all duration-700 ease-in-out ${index == selected ? 'p-5' : 'p-2'}`}
              >
                <div
                  className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-orbitron transition-all duration-700 ease-in-out ${
                    index === selected ? 'text-[24px] text-[#00ff9d]' : 'text-[14px] text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3
                    className={`mb-1 text-[18px] transition-all duration-700 ease-in-out  ${index === selected ? 'text-[#00ff9d]' : 'text-gray-300'}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`transition-all duration-700 ease-in-out ${index === selected ? 'text-[16px] text-white' : 'text-[14px] text-gray-500'}`}
                  >
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
