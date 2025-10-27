//Types
import { LeadFlowDialogProps } from "./props";
//Components
import { Contact } from "./LeadFlowSteps/contact/contact";
import { Qualify } from "./LeadFlowSteps/qualify/qualify";
import { Viewings } from "./LeadFlowSteps/viewing/viewing";
import { AppDialog, Badge, Button } from "../../shared";
import { useState } from "react";
import { ExtensionDialog } from "./LeadFlowDialogs/ExtensionDialog";
import { Offers } from "./LeadFlowSteps/offer/offer";
import { useGetLeadQuery } from "@/app/services/api";
import { GetLeadPayload } from "@/types/lead.type";

import { getFormattedDate, titleCase } from "@/utils";

const LeadFlowDialog: React.FC<LeadFlowDialogProps> = ({
  leadId,
  onClose,
  open,
  ...rest
}) => {
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);

  const { data } = useGetLeadQuery({
    leadId,
    include: "qualification,viewings,offers,contact,source,listing",
  });

  const lead = data as
    | GetLeadPayload<{
        qualification: true;
        viewings: true;
        offers: true;
        source: true;
        listing: true;
      }>
    | undefined;

  if (!lead) {
    return;
  }
  console.log("===>", lead);

  return (
    <>
      <AppDialog onClose={onClose} open={open} {...rest}>
        <AppDialog.Title>Lead</AppDialog.Title>
        <div className="text-right mb-4">
          {lead.expiresAt !== null && (
            <Button
              size="md"
              disabled={["REJECTED", "PENDING"].includes(lead.status)}
              onClick={() => setIsExtensionDialogOpen(true)}
            >
              Request Extension
            </Button>
          )}
        </div>

        <div className="text-sm grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          <div>
            <p className="font-medium mb-0.5">Status</p>
            {lead && lead.status && <Badge>{titleCase(lead.status)}</Badge>}
          </div>
          <div>
            <p className="font-medium">Expires</p>
            <p className="text-xs">
              {lead?.expiresAt ? getFormattedDate(lead.expiresAt) : "-"}
            </p>
          </div>
          <div>
            <p className="font-medium">Source</p>
            <p className="text-xs">{lead.source?.name || "-"}</p>
          </div>
          <div>
            <p className="font-medium">Subsource</p>
            <p className="text-xs">{lead.subsource ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">Reference</p>
            <p className="text-xs">{lead.listing?.reference || "-"}</p>
          </div>
          <div>
            <p className="font-medium mb-0.5">Type</p>
            <Badge>{titleCase(lead.type)}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {lead.contact && (
            <Contact
              leadId={lead.id}
              disabled={!["NEW", "CALLED"].includes(lead.status)}
              contact={lead.contact}
            />
          )}

          <Qualify
            disabled={lead.status !== "CONTACTED"}
            qualification={lead.qualification}
          />

          <Viewings
            disabled={lead.status !== "QUALIFIED"}
            viewings={lead.viewings}
            leadId={lead.id}
          />

          <Offers
            offers={lead.offers}
            viewings={lead.viewings}
            leadId={lead.id}
            disabled={!lead.viewings?.length}
          />
        </div>
      </AppDialog>
      <ExtensionDialog
        open={isExtensionDialogOpen}
        onClose={() => setIsExtensionDialogOpen(false)}
        leadId={lead.id}
      />
    </>
  );
};

export default LeadFlowDialog;
