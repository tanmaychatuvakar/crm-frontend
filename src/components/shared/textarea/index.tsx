import { forwardRef } from "react";

import { css } from "@/utils";
// import { Error } from '../error'
import TextareaProps from "./props";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, label, ...rest }, ref) => {
    return (
      <div className="w-full">
        <label className="inline-block relative cursor-pointer w-full">
          <textarea
            ref={ref}
            onWheel={(e) => (e.target as HTMLElement).blur()}
            placeholder={label}
            className={css(
              "z-20",
              "focus:border-black",
              "focus:ring-black",
              "px-5",
              "py-2.5",
              "border",
              "font-light",
              "border-black",
              "border-opacity-60",
              "outline-none",
              "placeholder-gray-300",
              "placeholder-opacity-0",
              "transition-all duration-200",
              "w-full",
              "rounded-sm",
              { "border-red-600": error },
              className
            )}
            {...rest}
          />
          <span
            className={css(
              "absolute left-4 top-3 pl-1 pr-2 font-light bg-white transition-all duration-200 input-text text-black/50"
            )}
          >
            {label}
          </span>
        </label>
        {/* {error && <Error error={error} />} */}
      </div>
    );
  }
);
