import { GetListingPayload } from "./listing.type";
import { CombineTypes } from "./utility/combine.utility";

export type UnpublishRequest = {
  id: string;
  status: string; //hmmm
  comments: string | null;
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

export type GetUnpublishRequestPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = UnpublishRequest & CombineTypes<Includes, T>;
