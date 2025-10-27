export type AlertVariants = "info" | "danger" | "success" | "warning" | "dark";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  reason?: string;
  variant?: AlertVariants;
}
