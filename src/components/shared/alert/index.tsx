import { AlertProps } from "./alert.props";
import classNames from "classnames";

export const Alert: React.FC<AlertProps> = ({
  className,
  children,
  variant = "info",
  reason,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        "p-4",
        "text-sm",
        "rounded-lg",
        {
          "text-blue-800 bg-blue-50": variant === "info",
        },
        {
          "text-red-800 bg-red-50": variant === "danger",
        },
        {
          "text-green-800 bg-green-50": variant === "success",
        },
        {
          "text-yellow-800 bg-yellow-50": variant === "warning",
        },
        {
          "text-gray-800 bg-gray-50": variant === "dark",
        },
        className
      )}
      role="alert"
      {...rest}
    >
      {reason ? <span className="font-medium">{reason}!&nbsp;</span> : null}
      {children}
    </div>
  );
};
