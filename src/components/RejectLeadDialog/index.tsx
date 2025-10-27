import React from "react";
import { AppDialog, Label, Textarea, Button } from "../shared";
import { useForm } from "react-hook-form";

import { RejectLeadDialogProps } from "./props";

export const RejectLeadDialog: React.FC<RejectLeadDialogProps> = ({
  onClose,
  open,
}) => {
  const {
    handleSubmit,
    register,
    // formState: { errors },
  } = useForm();

  const onSubmit = () => {};

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Reject Lead Request</AppDialog.Title>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="reason" required>
            Reason
          </Label>
          <Textarea
            {...register("reason")}
            label="Reason"
            placeholder="Reason"
            // error={errors.reason?.message}
          />
        </div>
        <div className="flex gap-x-3 mt-6 justify-end">
          <Button>Confirm</Button>
        </div>
      </form>
    </AppDialog>
  );
};
