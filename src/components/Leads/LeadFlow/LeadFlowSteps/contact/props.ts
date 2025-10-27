import { LeadContact } from "@/types/lead-contact.type";

export type ContactProps = {
  leadId: string;
  contact: LeadContact;
  disabled: boolean;
};
