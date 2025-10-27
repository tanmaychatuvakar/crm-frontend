import { GetViewingPayload } from "@/types/viewing.type";

export type ViewingProps = {
  disabled?: boolean;
  viewings: GetViewingPayload<{
    user: true;
    feedback: true;
    listing: true;
  }>[];
  leadId: string;
};
