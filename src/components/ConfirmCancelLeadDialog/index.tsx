import { Button } from "../shared";
import { AppDialog } from "../shared";

import { ConfirmCancelDialogProps } from "./props";

export const ConfirmCancelLeadDialog: React.FC<ConfirmCancelDialogProps> = ({
  id,
  onClose,
  open,
  title,
  ...rest
}) => {
  const handleCancel = () => {
    console.log("canceling lead with id ", id);
  };

  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
      <AppDialog.Title>
        Are you sure you want to cancel this lead request{" "}
        <span className=" text-red-600">{title}</span> ?
      </AppDialog.Title>
      <div className="w-full flex gap-x-3 mt-6 justify-end">
        <Button onClick={handleCancel}>Yes, I'm sure</Button>
        <Button onClick={onClose}>No, cancel</Button>
      </div>
    </AppDialog>
  );
};
