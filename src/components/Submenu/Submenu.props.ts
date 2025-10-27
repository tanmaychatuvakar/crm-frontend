export interface SubmenuProps {
  onClose?: () => void;
  open: boolean;
  children?: React.ReactNode;
  right?: boolean;
  relaxed?: boolean;
  className?: string
}
