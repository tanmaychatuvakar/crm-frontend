import { Button } from "../shared";
import { AppDialog } from "../shared";

import { toast } from "react-toastify";
import { ConfirmCancelDialogProps } from "./props";
import { useCancelPhotoRequestMutation } from "@/app/services/api";

export const ConfirmCancelDialog: React.FC<ConfirmCancelDialogProps> = ({
  id,
  onClose,
  open,
  ...rest
}) => {
  const [mutate, { isLoading }] = useCancelPhotoRequestMutation();

  const handleCancel = async () => {
    try {
      await mutate(id).unwrap();
      onClose();
      toast.success("Photo request canceled successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
      <AppDialog.Title>
        Are you sure you want to cancel this photo request ?
      </AppDialog.Title>
      <div className="flex gap-x-3 mt-6 justify-end">
        <Button isLoading={isLoading} onClick={handleCancel}>
          Yes, I'm sure
        </Button>
        <Button onClick={onClose}>No, cancel</Button>
      </div>
    </AppDialog>
  );
};
