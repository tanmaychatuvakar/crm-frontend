import { AppDialog, Button } from "../shared";
import { ActionAlertDialogProps } from "./ActionAlertDialog.props";

const ActionAlertDialog: React.FC<ActionAlertDialogProps> = ({
  title,
  action,
  onClose,
  open,
  // buttonVariant = 'danger',
}) => {
  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>{title}</AppDialog.Title>
      <AppDialog.Description>
        <div className="mt-6 flex flex-row-reverse">
          <Button onClick={action}>Confirm</Button>
        </div>
      </AppDialog.Description>
    </AppDialog>
  );
};
export default ActionAlertDialog;
