import React from "react";

export const Actions: React.FC<{ lead: unknown }> = () => {
  return (
    <div className="flex space-x-2 self-start">
      {/* {lead.status === "PENDING" &&
        user?.roles.includes(Roles.LINE_MANAGER) && (
          <LMLeadPending id={lead.id} />
        )} */}
    </div>
  );
};
