import { AppDialogProps } from "@/components/shared/app-dialog/app-dialog.props";
import { Column } from "@/types/column.type";

export interface ColumnsFilterDialogProps extends AppDialogProps {
  initialColumns: Column[];
  visible: string[];
  setVisible: any;
}
