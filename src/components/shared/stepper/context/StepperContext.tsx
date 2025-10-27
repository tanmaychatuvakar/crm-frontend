import { createContext } from "react";
import type { StepperContext as StepperContextType } from "../types/StepperContext.type";

export const StepperContext = createContext<StepperContextType>(undefined);
