import { GetOfferPayload } from "@/types/offer.type";

export interface DealDialogProps {
  onClose: () => void;
  open: boolean;
  offers: GetOfferPayload<{ viewing: true; user: true }>[];
  offerId: string;
  leadId: string;
}
