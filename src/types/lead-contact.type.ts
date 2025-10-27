import { Lead } from "./lead.type";
import { Nationality } from "./nationality.type";
import { CombineTypes } from "./utility/combine.utility";

export type LeadContact = {
  id: string;

  title: string;
  name: string;
  mobileNumber: string;
  phoneNumber: string | null;
  email: string | null;

  nationalityId: string | null;

  type: string;

  language: string;

  sourceId: string | null;

  subsource: string | null;

  leadId: string | null;

  channel: string | null;
  response: string | null;

  prettyResponse: string | null;
  prettyChannel: string | null;
  prettyType: string | null;

  reference: string;

  notes: string | null;

  contactable: boolean;

  contactedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Includes = {
  lead: Lead;
  nationality: Nationality;
};

export type GetLeadContactPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = LeadContact & CombineTypes<Includes, T>;
