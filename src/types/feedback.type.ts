export type Feedback = {
  id: string;

  viewingId: string;

  community: number;
  location: number;
  floor: number;
  view: number;
  floorPlanLayout: number;
  area: number;
  condition: number;
  price: number;
  amenities: number;
  parking: number;
  acType: number;

  serviceCharge: number | null;
  furnitureCondition: number | null;
  appliancesCondition: number | null;

  createdAt: string;
  updatedAt: string;
};
