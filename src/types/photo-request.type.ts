import { GetListingPayload } from "./listing.type";
import { GetPhotoshootPayload } from "./photoshoot.type";
import { CombineTypes } from "./utility/combine.utility";

export type PhotoRequest = {
  id: string;
  status: string; //hmmm
  rejectionReason: string | null;
  scheduledAt: string | null;
  occupancy: string | null;
  keyLocation: string;
  buildingAccessCardLocation: string;
  parkingAccessCardLocation: string | null;
  accessCardLocation: string | null;
  comments: string | null;
  isBrokerPresent: boolean;
  listingId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Includes = {
  listing: GetListingPayload<{
    amenities: true;
    features: true;
  }>;
  photoshoot: GetPhotoshootPayload<{
    photographer: true;
    editor: true;
    editorImages: true;
    photographerImages: true;
  }> | null;
};

export type GetPhotoRequestPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = PhotoRequest & CombineTypes<Includes, T>;
