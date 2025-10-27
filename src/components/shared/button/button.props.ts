export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  trailingIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
