import { Image } from "./image.type";
import { Listing } from "./listing.type";
import { PhotoRequest } from "./photo-request.type";
import { User } from "./user.type";
import { CombineTypes } from "./utility/combine.utility";

export type Photoshoot = {
  id: string;
  status: string; //hmm
  rejectionReason: string | null;
  photographerId: string | null;
  editorId: string | null;
  photoRequestId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Includes = {
  listings: Listing[];
  photoRequest: PhotoRequest;
  editorImages: Image[];
  photographerImages: Image[];
  photographer?: User;
  editor?: User;
};

export type GetPhotoshootPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = Photoshoot & CombineTypes<Includes, T>;
