import { forwardRef } from "react";
import InputProps from "./input.props";
// import { Error } from "../error";
import { css } from "@/utils";
import { Error } from "../error";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      suffix,
      hasPrefix = false,
      required = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <label className={css("inline-block relative cursor-pointer w-full")}>
          <input
            {...rest}
            autoComplete={rest.autoComplete || "off"}
            onWheel={(e) => (e.target as HTMLElement).blur()}
            placeholder={label}
            ref={ref}
            className={css(
              "w-full",
              "focus:border-black",
              "focus:ring-black",
              "px-5",
              "py-2.5",
              "border",
              "border-opacity-60",
              "font-light",
              "outline-none",
              "placeholder-opacity-0",
              "placeholder-gray-300",
              "transition-all duration-200",
              "rounded-sm",
              { "border-red-600": error },
              { "pr-10": suffix },
              { "ps-11": hasPrefix },
              {
                "cursor-not-allowed text-gray-500 border-gray-500 border-opacity-50":
                  rest.disabled || rest.readOnly,
              },
              className
            )}
          />
          <span
            className={css(
              "absolute top-2.5 left-4 pl-1 pr-2 font-light bg-white transition-all duration-200 input-text text-black/50",
              { "ms-6": hasPrefix },
              {
                "cursor-not-allowed text-gray-400":
                  rest.disabled || rest.readOnly,
              }
            )}
          >
            <span>{label}</span>
            {required && <span className="text-red-600 text-sm">*</span>}
          </span>
          <span
            className={css("absolute right-4 top-1/2 -translate-y-1/2", {
              "text-gray-400": rest.disabled || rest.readOnly,
            })}
          >
            {suffix}
          </span>
        </label>
        {error ? <Error className="mt-1" error={error} /> : null}
      </div>
    );
  }
);
