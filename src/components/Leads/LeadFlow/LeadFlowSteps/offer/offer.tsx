import React, { useCallback, useMemo, useState } from "react";

import { css, getFormattedDate, titleCase } from "@/utils";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import { Badge, Button } from "@/components/shared";
import { OfferDialog } from "../../LeadFlowDialogs/OfferDialog";
import { DealDialog } from "../../LeadFlowDialogs/deal-dialog";

import { OfferProps } from "./props";
import {
  useAcceptOfferMutation,
  useNegotiateOfferMutation,
  useRejectOfferMutation,
} from "@/app/services/api";
import { GetOfferPayload } from "@/types/offer.type";
import { BadgeVariants } from "@/components/shared/badge/badge.props";

type OfferWithUser = GetOfferPayload<{ user: true; deal: true; viewing: true }>;

const OfferItem: React.FC<{
  offer: OfferWithUser;
  onConvert: (offer: OfferWithUser) => any;
  hasAcceptedOffer: boolean;
}> = ({ offer, onConvert, hasAcceptedOffer }) => {
  const [accept, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [reject, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [negotiate, { isLoading: isNegotiating }] = useNegotiateOfferMutation();

  const handleAccept = (leadId: string, offerId: string) => async () => {
    try {
      await accept({ leadId, offerId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = (leadId: string, offerId: string) => async () => {
    try {
      await reject({ leadId, offerId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNegotiate = (leadId: string, offerId: string) => async () => {
    try {
      await negotiate({ leadId, offerId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusVariant = useCallback((status: string) => {
    const options: Record<string, BadgeVariants> = {
      NEGOTIATION: "warning",
      SUBMITTED: "info",
      REJECTED: "danger",
      ACCEPTED: "success",
    };
    return options[status];
  }, []);

  return (
    <div
      className="flex flex-col gap-y-0.5 bg-gray-50 px-5 py-2.5 rounded-sm"
      key={offer.id}
    >
      <div className="text-sm flex flex-col-reverse items-start gap-y-0.5 md:flex-row md:items-center md:gap-x-2">
        <p>
          {offer.user.name}&nbsp;@&nbsp;
          {getFormattedDate(offer.createdAt)}
        </p>
        {offer && offer.status && (
          <Badge variant={getStatusVariant(offer.status)}>
            {titleCase(offer.status)}
          </Badge>
        )}
      </div>
      <p className="font-medium">
        {offer.viewing.listing.reference},&nbsp;{offer.price} AED,&nbsp;
        {offer.viewing.listing.city?.name},&nbsp;
        {offer.viewing.listing.community?.name},&nbsp;
        {offer.viewing.listing.subcommunity?.name ?? "-"},&nbsp;
        {offer.viewing.listing.property?.name ?? "-"}
      </p>
      <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
        <div className="text-sm font-light text-gray-700 flex items-center gap-x-1">
          <span>
            <FaRegCalendarAlt size={15} />
          </span>
          <p>{getFormattedDate(offer.offeredAt)}</p>
        </div>
        <div className="flex gap-x-4 place-self-end">
          {!hasAcceptedOffer ? (
            <>
              {offer.status !== "REJECTED" && (
                <button className="text-sm font-medium rounded-sm underline underline-offset-1 hover:opacity-60 transition-all">
                  Edit
                </button>
              )}
              {["SUBMITTED", "NEGOTIATION"].includes(offer.status) && (
                <button
                  onClick={handleAccept(offer.leadId, offer.id)}
                  disabled={isAccepting}
                  className="text-sm font-medium rounded-sm underline underline-offset-1 hover:opacity-60 transition-all"
                >
                  Accept
                </button>
              )}
              {["SUBMITTED", "NEGOTIATION"].includes(offer.status) && (
                <button
                  onClick={handleReject(offer.leadId, offer.id)}
                  disabled={isRejecting}
                  className="text-sm font-medium rounded-sm underline underline-offset-1 hover:opacity-60 transition-all"
                >
                  Reject
                </button>
              )}
              {offer.status === "SUBMITTED" && (
                <button
                  onClick={handleNegotiate(offer.leadId, offer.id)}
                  disabled={isNegotiating}
                  className="text-sm font-medium rounded-sm underline underline-offset-1 hover:opacity-60 transition-all"
                >
                  Negotiation
                </button>
              )}
            </>
          ) : null}
          {offer.status === "ACCEPTED" && (
            <button
              disabled={offer.deal !== null}
              onClick={() => onConvert(offer)}
              className={css("font-medium text-sm underline", {
                "text-gray-400 cursor-not-allowed": offer.deal !== null,
              })}
            >
              Convert to deal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Offers: React.FC<OfferProps> = ({
  viewings = [],
  offers = [],
  leadId,
  disabled,
}) => {
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<OfferWithUser | null>(
    null
  );

  const hasAcceptedOffer = useMemo(
    () => offers.some((o) => o.status === "ACCEPTED"),
    [offers]
  );

  // useEffect(()=>{
  //     if(!disabled) setIsOfferOpen(true);
  //     return;
  // }, [disabled])

  return (
    <>
      <div className="bg-white border rounded-sm shadow-sm px-5 py-3 -mt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <button
              className={css({ "rotate-180": isOfferOpen })}
              onClick={() => setIsOfferOpen(!isOfferOpen)}
            >
              <IoChevronDown size={18} />
            </button>
            <p className="font-medium">Offers</p>
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => setIsOfferDialogOpen(true)}
              disabled={disabled || hasAcceptedOffer}
              className={css({ "cursor-not-allowed": disabled })}
            >
              <span>New</span>
            </Button>
          </div>
        </div>

        {isOfferOpen && (
          <div className="flex flex-col gap-y-3 mt-5">
            {!offers.length && (
              <p className="text-sm text-center text-gray-300 font-light">
                No offers have been submitted yet
              </p>
            )}
            {offers.map((offer) => (
              <OfferItem
                key={offer.id}
                offer={offer}
                onConvert={(offer) => {
                  setSelectedOffer(offer);
                  setIsDealDialogOpen(true);
                }}
                hasAcceptedOffer={hasAcceptedOffer}
              />
            ))}
          </div>
        )}
      </div>
      <OfferDialog
        key={leadId}
        leadId={leadId}
        viewings={viewings}
        open={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
      />

      <DealDialog
        leadId={leadId}
        offerId={selectedOffer?.id || ""}
        offers={offers}
        open={isDealDialogOpen}
        onClose={() => setIsDealDialogOpen(false)}
      />
    </>
  );
};
