import { GetQualificationPayload } from "@/types/qualification.type";

export type QualifyProps = {
  disabled: boolean;
  qualification: GetQualificationPayload<{ lead: true }> | null;
};
