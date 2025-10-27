import { GetListingPayload } from "./listing.type";
import { CombineTypes } from "./utility/combine.utility";

export type ExtensionRequest = {
  id: string;
  status: string; ///hmmm
  fromDate: string | null;
  toDate: string | null;
  comments: string;
  rejectionReason: string | null;
  listingId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Includes = {
  listing: GetListingPayload<{
    features: true;
    amenities: true;
  }>;
};

export type GetExtensionRequestPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = ExtensionRequest & CombineTypes<Includes, T>;
