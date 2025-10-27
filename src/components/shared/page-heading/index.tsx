import { HeadingProps } from "./page-heading.props";

export const PageHeading: React.FC<HeadingProps> = ({
  children,
  className,
  ...rest
}) => (
  <h1
    className={`text-2xl font-bold ${className}`}
    {...rest}
  >
    {children}
  </h1>
);
