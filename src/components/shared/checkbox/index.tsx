import { forwardRef } from "react";
import { CheckboxProps } from "./checkbox.props";
import { css } from "@/utils";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...rest }, ref) => {
    return (
      <div className="inline-flex items-start space-x-1">
        <input
          ref={ref}
          {...rest}
          type="checkbox"
          className={css(
            "focus:ring-0 mt-[3px]",
            {
              "cursor-not-allowed text-gray-400": rest.disabled,
            },
            { "cursor-pointer": !rest.disabled }
          )}
        />
        {label ? (
          <label
            className={css("font-light text-sm", {
              "cursor-not-allowed text-gray-400": rest.disabled,
            })}
            htmlFor={rest.id}
          >
            {label}
          </label>
        ) : null}
      </div>
    );
  }
);
