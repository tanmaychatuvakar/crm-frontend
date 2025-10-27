import { Feedback } from "./feedback.type";
import { Lead } from "./lead.type";
import { GetListingPayload } from "./listing.type";
import { CombineTypes } from "./utility/combine.utility";

export type Viewing = {
  id: string;

  listingId: string | null;
  leadId: string;

  scheduledAt: string;

  createdAt: string;
  updatedAt: string;

  cancelledAt: string | null;
  completedAt: string | null;

  //   feedback  Feedback?
  //   listingCategory   Category? @relation(fields: [listingCategoryId], references: [id])
  //   listingCity   City?   @relation(fields: [listingCityId], references: [id])
  //   listingCommunity   Community? @relation(fields: [listingCommunityId], references: [id])
  //   listingSubcommunity   Subcommunity? @relation(fields: [listingSubcommunityId], references: [id])
  //   listingProperty   Property? @relation(fields: [listingPropertyId], references: [id])
  //   offers            Offer[]
};

type Includes = {
  user: { name: string };
  feedback: Feedback;
  listing: GetListingPayload<{
    city: true;
    community: true;
    subcommunity: true;
    property: true;
    category: true;
  }>;
  lead: Lead;
};

export type GetViewingPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = Viewing & CombineTypes<Includes, T>;
