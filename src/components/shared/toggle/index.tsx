import { forwardRef } from "react";

import { css } from "@/utils";

import { ToggleProps } from "./Toggle.props";

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ disabled, label, className, ...rest }, ref) => {
    return (
      <label
        className={css(
          "relative inline-flex items-center",
          {
            "cursor-pointer bg-white": !disabled,
          },
          {
            "cursor-not-allowed": disabled,
          },
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
          {...rest}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        {label ? (
          <span className="text-md font-medium ml-3 text-gray-900">
            {label}
          </span>
        ) : null}
      </label>
    );
  }
);
