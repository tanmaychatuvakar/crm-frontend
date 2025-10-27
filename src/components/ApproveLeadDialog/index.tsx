import React from "react";
import { AppDialog, Button } from "../shared";
import { ApproveLeadDialogProps } from "./props";

export const ApproveLeadDialog: React.FC<ApproveLeadDialogProps> = ({
  onClose,
  open,
  id,
}) => {
  const onSubmit = () => {
    console.log("approving lead with id", id);
  };

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Approve Lead Request</AppDialog.Title>
      <AppDialog.Description>
        Are you sure you want to approve this lead request?
      </AppDialog.Description>
      <form onSubmit={onSubmit}>
        <div className="flex space-x-4 mt-6 justify-end">
          <Button variant="primary">Confirm</Button>
        </div>
      </form>
    </AppDialog>
  );
};
