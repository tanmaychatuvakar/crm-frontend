import { LabelProps } from "./label.props";

export const Label: React.FC<LabelProps> = ({
  children,
  className,
  required,
  ...rest
}) => (
  <label
    className={`text-sm font-light text-gray-800 inline-block mb-1 ${className}`}
    {...rest}
  >
    {children}
    {required && <span style={{ color: "red" }}> *</span>}
  </label>
);
