import React from "react";

import { Step } from "./Step";
import { Button } from "@/components/shared";
import { StepsType } from "./Steps.type";

import StepProps from "./Step/Step.props";
import useStepper from "../hooks/useStepper";
import classNames from "classnames";

export const Steps: StepsType = ({ children }) => {
  const [activeKey, setActiveKey] = useStepper();
  const steps = React.Children.toArray(children);
  const eventKeys = steps.map((step: any) => step.props.eventKey);

  const activeKeyIndex = eventKeys.indexOf(activeKey);
  const prevKey = activeKeyIndex !== -1 ? eventKeys[activeKeyIndex - 1] : null;
  const nextKey = activeKeyIndex !== -1 ? eventKeys[activeKeyIndex + 1] : null;

  return (
    <div className="relative">
      {steps.map((step, index) => {
        if (React.isValidElement<StepProps>(step)) {
          return React.cloneElement(step, {
            key: index,
          });
        }
      })}
      <div className="flex justify-between my-4">
        {prevKey ? (
          <Button
            className="bg-transparent shadow-none text-black border border-black w-32"
            type="button"
            onClick={() => setActiveKey(prevKey)}
          >
            Previous
          </Button>
        ) : null}
        {nextKey ? (
          <div
            className={classNames({
              "ml-auto": !prevKey,
            })}
          >
            <Button
              className="bg-transparent shadow-none text-black border border-black w-32"
              type="button"
              onClick={() => setActiveKey(nextKey)}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

Steps.Step = Step;
