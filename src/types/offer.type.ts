import { GetLeadPayload } from "./lead.type";
import { CombineTypes } from "./utility/combine.utility";
import { GetViewingPayload } from "./viewing.type";

export type Offer = {
  id: string;

  status: string;
  price: number;
  offeredAt: string;
  cheques: number | null;
  viewingId: string;

  reference: string;

  createdAt: string;
  updatedAt: string;

  leadId: string;
};

type Includes = {
  user: { name: string };
  deal: { id: string } | null;
  viewing: GetViewingPayload<{ listing: true }>;
  lead: GetLeadPayload<{ listing: true }>;
};

export type GetOfferPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = Offer & CombineTypes<Includes, T>;
