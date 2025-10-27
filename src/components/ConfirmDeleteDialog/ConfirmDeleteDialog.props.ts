export interface ConfirmDeleteDialogProps {
  item?: {};
  onDelete?: () => void;
  onClose: () => void;
  loading?: boolean;
  open: boolean;
}
