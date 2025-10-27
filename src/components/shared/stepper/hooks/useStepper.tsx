import { useContext } from "react";
import { StepperContext } from "../context/StepperContext";

export default function useStepper() {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error(
      "Cannot use stepper context outside StepperContext.Provider"
    );
  }

  return context;
}
