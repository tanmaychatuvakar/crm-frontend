import { GetViewingPayload } from "@/types/viewing.type";

export interface OfferDialogProps {
  onClose: () => void;
  open: boolean;
  viewings: GetViewingPayload<{ listing: true; feedback: true; user: true }>[];
  leadId: string;
}
