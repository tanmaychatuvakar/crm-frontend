import { AppDialogProps } from "../shared/app-dialog/app-dialog.props";
export interface ActionAlertDialogProps extends AppDialogProps {
  title: string;
  action: () => void;
  // buttonVariant: ButtonVariants;
}
