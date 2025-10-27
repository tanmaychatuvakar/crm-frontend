import { LeadContact } from "./lead-contact.type";
import { LeadPreference } from "./lead-preference.type";
import { GetListingPayload } from "./listing.type";
import { GetOfferPayload } from "./offer.type";
import { GetQualificationPayload } from "./qualification.type";
import { Source } from "./source.type";
import { CombineTypes } from "./utility/combine.utility";
import { GetViewingPayload } from "./viewing.type";

export type Lead = {
  id: string;
  type: string;
  status: string;
  expiresAt: string;
  rejectionReason: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  listingId: string | null;
  sourceId: string | null;
  subsource: string | null;
  reference: string;
  // offerAcceptedAt: string | null;
};

type Includes = {
  contact: LeadContact;
  preference: LeadPreference;
  listing: GetListingPayload<{
    city: true;
    community: true;
    subcommunity: true;
    property: true;
  }> | null;
  qualification: GetQualificationPayload<{ lead: true }> | null;
  viewings: GetViewingPayload<{ user: true; listing: true; feedback: true }>[];
  offers: GetOfferPayload<{ user: true }>[];
  source: Source | null;

  _count: {
    offers: number;
    viewings: number;
  };
};

export type GetLeadPayload<T extends Partial<Record<keyof Includes, boolean>>> =
  Lead & CombineTypes<Includes, T>;
