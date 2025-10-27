import { ApproveLeadDialog } from "@/components/ApproveLeadDialog";
import { RejectLeadDialog } from "@/components/RejectLeadDialog";
import { Button } from "@/components/shared";
import { useState } from "react";

export const LMLeadPending: React.FC<{ id: string }> = ({ id }) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowApproveDialog(true)}>Approve</Button>
      <Button onClick={() => setShowRejectDialog(true)}>
        Reject
      </Button>
      
      <RejectLeadDialog
        id={id}
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
      />
      <ApproveLeadDialog
        id={id}
        open={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
      />
    </>
  );
};
