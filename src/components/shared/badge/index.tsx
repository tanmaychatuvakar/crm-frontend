import classNames from "classnames";
import { BadgeProps } from "./badge.props";

export const Badge: React.FC<BadgeProps> = ({
  children,
  bordered = false,
  pill = false,
  size = "default",
  variant = "info",
  icon,
  className,
}) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center justify-center font-medium px-2.5 py-0.5",
        {
          rounded: !pill,
        },
        {
          "rounded-full": pill,
        },
        {
          "text-xs": size === "default",
        },
        {
          "text-sm": size === "lg",
        },
        {
          "bg-blue-100 text-blue-800": variant === "info",
        },
        {
          "bg-gray-100 text-gray-800": variant === "dark",
        },
        {
          "bg-red-100 text-red-800": variant === "danger",
        },
        {
          "bg-green-100 text-green-800": variant === "success",
        },
        {
          "bg-orange-600 text-white": variant === "bright",
        },
        {
          "bg-yellow-100 text-yellow-800": variant === "warning",
        },
        {
          "border border-blue-400": variant === "info" && bordered,
        },
        {
          "border border-gray-500": variant === "dark" && bordered,
        },
        {
          "border border-red-400": variant === "danger" && bordered,
        },
        {
          "border border-green-400": variant === "success" && bordered,
        },
        {
          "border border-yellow-300": variant === "warning" && bordered,
        },
        className
      )}
    >
      {icon ? (
        <span
          className={classNames("mr-1", {
            "text-black": variant === "dark",
          })}
        >
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
};
