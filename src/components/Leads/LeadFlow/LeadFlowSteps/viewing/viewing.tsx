// Utilities
import { css, getFormattedDate } from "@/utils";

// React
import React, { useCallback, useState } from "react";

// Icons
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

// Components
import { ViewingDialog } from "../../LeadFlowDialogs/ViewingDialog";

import { FeedbackDialog } from "../../LeadFlowDialogs/FeedbackDialog";
//Types
import { ViewingProps } from "./props";
import { Feedback } from "@/types/feedback.type";
import { Badge, Button } from "@/components/shared";
import { useCancelViewingMutation } from "@/app/services/api";

export const Viewings: React.FC<ViewingProps> = ({
  disabled,
  viewings = [],
  leadId,
}) => {
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [isViewingDialogOpen, setIsViewingDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const [mutate, { isLoading }] = useCancelViewingMutation();

  const handleCancelViewing = useCallback(async (viewingId: string) => {
    try {
      await mutate(viewingId).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <div className={"bg-white border rounded-sm shadow-sm px-5 py-3"}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <button
              className={css({ "rotate-180": isViewingOpen })}
              onClick={() => setIsViewingOpen(!isViewingOpen)}
            >
              <IoChevronDown size={18} />
            </button>
            <p className="font-medium">Viewing/Meeting</p>
          </div>
          <div className="space-x-3">
            <Button
              disabled={disabled}
              onClick={() => setIsViewingDialogOpen(true)}
              size="sm"
              className={css({ "cursor-not-allowed": disabled })}
            >
              <span>New</span>
            </Button>
          </div>
        </div>

        {isViewingOpen && (
          <div className="flex flex-col gap-y-3 mt-5">
            {!viewings.length && (
              <p className="text-sm text-center text-gray-300 font-light">
                No viewings have been conducted yet
              </p>
            )}
            {viewings.map((viewing) => (
              <div
                className="flex flex-col gap-y-0.5 bg-gray-50 px-5 py-2.5 rounded-sm"
                key={viewing.id}
              >
                <div className="text-sm flex flex-col-reverse items-start gap-y-0.5 md:flex-row md:items-center md:gap-x-2">
                  <p>
                    {viewing.user.name}&nbsp;@&nbsp;
                    {getFormattedDate(viewing.createdAt)}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2.5">
                  <p className="font-medium">
                    {viewing.listing.city?.name},&nbsp;
                    {viewing.listing.community?.name},&nbsp;
                    {viewing.listing.subcommunity?.name ?? "-"},&nbsp;
                    {viewing.listing.property?.name ?? "-"}
                  </p>
                  {viewing.completedAt && (
                    <Badge variant="success">Completed</Badge>
                  )}
                  {!viewing.completedAt && !viewing.cancelledAt && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading}
                      onClick={() => handleCancelViewing(viewing.id)}
                    >
                      Cancel
                    </Button>
                  )}
                  {!viewing.completedAt && viewing.cancelledAt && (
                    <small className="text-gray-400 font-light">
                      Cancelled
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
                  <div className="text-sm font-light text-gray-700 flex items-center gap-x-1">
                    <span>
                      <FaRegCalendarAlt size={15} />
                    </span>
                    <p>{getFormattedDate(viewing.scheduledAt)}</p>
                  </div>
                  <button
                    disabled={viewing.completedAt === null}
                    onClick={() => {
                      setSelectedFeedback(viewing.feedback);
                      setIsFeedbackDialogOpen(true);
                    }}
                    className={css("font-medium text-sm underline", {
                      "text-gray-400 cursor-not-allowed":
                        viewing.completedAt === null,
                    })}
                  >
                    Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ViewingDialog
        open={isViewingDialogOpen}
        leadId={leadId}
        onClose={() => setIsViewingDialogOpen(false)}
      />
      <FeedbackDialog
        feedback={selectedFeedback ?? undefined}
        open={isFeedbackDialogOpen}
        leadId={leadId}
        onClose={() => setIsFeedbackDialogOpen(false)}
      />
    </>
  );
};
