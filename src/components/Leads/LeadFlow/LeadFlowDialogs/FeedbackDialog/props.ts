import { Feedback } from "@/types/feedback.type";

export interface FeedackDialogProps {
  onClose: () => void;
  open: boolean;
  feedback?: Feedback;
  leadId: string;
}
