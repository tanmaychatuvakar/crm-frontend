import StepProps from "./Step/Step.props";
import { StepsProps } from "./Steps.props";

export type StepsType = React.FC<StepsProps> & {
  Step: React.FC<StepProps>;
};
