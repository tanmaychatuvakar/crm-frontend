import { GetOfferPayload } from "@/types/offer.type";
import { GetViewingPayload } from "@/types/viewing.type";

export type OfferProps = {
  disabled?: boolean;
  viewings: GetViewingPayload<{ listing: true; user: true; feedback: true }>[];
  leadId: string;
  offers: GetOfferPayload<{ user: true }>[];
};
