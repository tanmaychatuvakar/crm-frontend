import { CombineTypes } from "./utility/combine.utility";

import { Offer } from "./offer.type";

export type Deal = {
  id: string;
  offerId: string;
  createdAt: string;
  updatedAt: string;
};

type Includes = {
  offer: Offer;
};

export type GetDealPayload<T extends Partial<Record<keyof Includes, boolean>>> =
  Deal & CombineTypes<Includes, T>;
