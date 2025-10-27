import React, { useState } from "react";
import { NavigationType } from "./Navigation/Navigation.type";
import { StepperContext } from "./context/StepperContext";
import { Navigation } from "./Navigation";

import StepperProps from "./Stepper.props";
import { StepsType } from "./Steps/Steps.type";
import { Steps } from "./Steps";

type StepperType = React.FC<StepperProps> & {
  Navigation: NavigationType;
  Steps: StepsType;
};

export const Stepper: StepperType = ({ children, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  return (
    <StepperContext.Provider value={[activeKey, setActiveKey]}>
      {children}
    </StepperContext.Provider>
  );
};

Stepper.Navigation = Navigation;
Stepper.Steps = Steps;
