export type LeadPreference = {
  id: string;

  cityId: string;

  communityId: string | null;

  subcommunityId: string | null;
  propertyId: string | null;

  categoryId: string | null;

  minBedrooms: number | null;
  maxBedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;

  leadId: string;

  createdAt: string | null;
  updatedAt: string | null;

  // not always
  city: { name: string };
  category: { name: string };
};
