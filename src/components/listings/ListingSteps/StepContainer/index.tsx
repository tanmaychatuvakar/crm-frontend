const StepContainer = ({ title, children }: any) => (
  <div className="flex w-full flex-col gap-3 justify-center items-start">
    <span className="2">{title}</span>
    {children}
  </div>
);

export default StepContainer;
