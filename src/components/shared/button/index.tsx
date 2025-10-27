import { ButtonProps } from "./button.props";
import { css } from "@/utils";

import { TailSpin } from "react-loader-spinner";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className,
  trailingIcon,
  size = "md",
  ...rest
}) => {
  return (
    <button
      className={css(
        "inline-flex justify-center items-center rounded-sm",
        {
          "cursor-not-allowed opacity-40": disabled,
        },
        {
          "px-5 py-2.5": size === "lg",
        },
        {
          "px-3 py-2": size === "md",
        },
        {
          "px-2.5 py-0.5 text-xs": size === "sm",
        },
        {
          "border border-black": variant === "primary",
        },
        {
          "bg-black text-white": variant === "secondary",
        },
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {trailingIcon && <span className="mr-1">{trailingIcon}</span>}
      {isLoading ? (
        <TailSpin ariaLabel="tail-spin-loading" height={20} color="white" />
      ) : (
        children
      )}
    </button>
  );
};
