import { css } from "@/utils";

import { ErrorProps } from "./error.props";

export const Error: React.FC<ErrorProps> = ({ error, className }) => {
  return (
    <p className={css("text-sm font-light text-red-600", className)}>{error}</p>
  );
};
