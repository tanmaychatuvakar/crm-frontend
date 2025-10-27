import { DescriptionProps } from "./page-description.props";

export const PageDescription: React.FC<DescriptionProps> = ({
  children,
  className,
  ...rest
}) => (
  <p className={`text-xs font-light text-gray-800 ${className}`} {...rest}>
    {children}
  </p>
);
