import { Button } from "../shared";
import { AppDialog } from "../shared";

import { ConfirmCancelUnpublishDialogProps } from "./props";
import { useCancelUnpublishRequestMutation } from "@/app/services/api";

export const ConfirmCancelUnpublishDialog: React.FC<
  ConfirmCancelUnpublishDialogProps
> = ({ id, onClose, open, title, onSuccess, ...rest }) => {
  const [mutate, { isLoading }] = useCancelUnpublishRequestMutation();

  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
      <AppDialog.Title>
        Are you sure you want to cancel this request ?
      </AppDialog.Title>
      <div className="w-full flex gap-x-3 mt-6 justify-end">
        <Button
          isLoading={isLoading}
          onClick={async () => {
            try {
              await mutate(id).unwrap();
              onClose();
              onSuccess();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Yes, I'm sure
        </Button>
        <Button onClick={onClose}>No, cancel</Button>
      </div>
    </AppDialog>
  );
};
