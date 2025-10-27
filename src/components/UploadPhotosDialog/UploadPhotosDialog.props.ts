import { AppDialogProps } from "../shared/app-dialog/app-dialog.props";
export interface UploadPhotosDialogProps extends AppDialogProps {
  refetch?: any;
  data?: any;
  mode: string;
}
