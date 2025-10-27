import { Amenity } from "./amenity.type";
import { Category } from "./category.type";
import { City } from "./city.type";
import { Community } from "./community.type";
import { ExtensionRequest } from "./extension-request.type";
import { Feature } from "./feature.type";
import { GetPhotoshootPayload } from "./photoshoot.type";
import { Property } from "./property.type";
import { Subcommunity } from "./subcommunity.type";
import { UnpublishRequest } from "./unpublish-request.type";
import { User } from "./user.type";
import { CombineTypes } from "./utility/combine.utility";
import { Document } from "./document.type";

export type Listing = {
  id: string;
  referenceId: number;
  isSale: boolean;
  isRental: boolean;
  cityId: string | null;
  communityId: string | null;
  subcommunityId: string | null;
  propertyId: string | null;
  title: string;
  description: string | null;
  unitNumber: string | null;
  totalArea: number | null;
  plotArea: number | null;
  numberOfBedrooms: number | null;
  numberOfBathrooms: number | null;
  floor: number | null;
  view: string | null;
  furnished: string | null; //Hmm
  appliances: boolean;
  parking: number | null;
  streetNumber: string | null;
  salePrice: number | null;
  sourceId: string | null;
  isHalfBath: boolean;
  isPrimary: boolean;
  askForPrice: boolean;
  reference: string;
  isExclusive: boolean;
  isCommercial: boolean;
  isRented: boolean;
  fitted: string | null; //hmm
  contactId: string | null;
  agentId: string | null;
  assigneeId: string | null;
  publisherId: string | null;
  trakheesi: number | null;
  propertyStatus: string | null; //hmmm
  serviceCharge: number | null;
  pricePerSqft: number | null;
  rentalPrice: number | null;
  rentedFrom: string | null;
  rentedUntil: string | null;
  rentedPrice: number | null;
  rentedCheques: number | null;
  tenant: string | null;
  status: string; //hmmm
  categoryId: string | null;
  rentalCheques: number | null;
  rentalLeaseTerm: string | null; //hmmm
  rentalAvailableFrom: string | null;
  //contractEndDate: string | null;
  str: string | null;
  photoshootId: string | null;
  expiresAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  brokerContractRentalDocument: Document | null;
  brokerContractSaleDocument: Document | null;
  titleDeedDocument: Document | null;
  poaDocument: Document | null;
  ownerIdDocument: Document | null;
  otherDocument: Document | null;
};

type Includes = {
  amenities: Pick<Amenity, "id" | "name">[];
  features: Pick<Feature, "id" | "name">[];

  photoshoot: GetPhotoshootPayload<{ editorImages: true }>;
  extensionRequests: ExtensionRequest[];
  unpublishRequests: UnpublishRequest[];
  category: Category | null;
  city: City | null;
  community: Community | null;
  subcommunity: Subcommunity | null;
  property: Property | null;
  agent: Pick<User, "name"> | null;
  assignee: Pick<User, "name"> | null;
};

export type GetListingPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = Listing & CombineTypes<Includes, T>;
