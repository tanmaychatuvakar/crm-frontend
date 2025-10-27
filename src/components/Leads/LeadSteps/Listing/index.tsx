import { Controller } from "react-hook-form";

import { Input, AppSelect } from "@/components/shared";
import { useGetCommonQuery, useGetListingsQuery } from "@/app/services/api";
import { useEffect, useState } from "react";
import { GetListingPayload } from "@/types/listing.type";

type Listing = GetListingPayload<{
  agent: true;
  city: true;
  community: true;
  subcommunity: true;
  property: true;
}>;

export const ListingStep = ({ watch, control }: any) => {
  const listingId = watch("listingId");

  const { data: common } = useGetCommonQuery();
  const { data: listings } = useGetListingsQuery({
    include: "agent,city,community,subcommunity,building",
    status: ["PUBLISHED"],
  });

  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const listing = listings?.data.find((l) => l.id === listingId);
    if (!listing) {
      setListing(null);
      return;
    }
    setListing(listing as Listing);
  }, [listingId, listings]);

  return (
    <div className="grid grid-cols-6 gap-3">
      <div className="col-span-6">
        <Controller
          name="listingId"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppSelect
              required
              label="Listing"
              options={listings?.data.map((l) => ({
                label: l.title,
                value: l.id,
              }))}
              error={error?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="col-span-3">
        <AppSelect
          label="Category"
          value={listing?.categoryId}
          options={common?.categories}
          disabled
        />
      </div>
      <div className="col-span-3">
        <Input
          label="Type"
          value={listing ? (listing.isSale ? "Sale" : "Rental") : ""}
          readOnly
        />
      </div>

      <div className="col-span-6">
        <Input label="City" value={listing?.city?.name} readOnly />
      </div>
      <div className="col-span-3">
        <Input label="Community" value={listing?.community?.name} readOnly />
      </div>
      <div className="col-span-3">
        <Input
          label="Subcommunity"
          value={listing?.subcommunity?.name}
          readOnly
        />
      </div>
      <div className="col-span-3">
        <AppSelect
          label="Bedrooms"
          options={common?.bedrooms}
          value={listing?.numberOfBedrooms?.toString()}
          disabled
        />
      </div>

      <div className="col-span-3">
        <AppSelect
          label="Bathrooms"
          options={common?.bathrooms}
          value={listing?.numberOfBathrooms?.toString()}
          disabled
        />
      </div>

      <div className="col-span-3">
        <Input label="Property" value={listing?.property?.name} readOnly />
      </div>

      <div className="col-span-3">
        <Input
          label="Price"
          value={listing ? listing.salePrice ?? listing.rentalPrice! : ""}
          readOnly
        />
      </div>

      <div className="col-span-3">
        <Input label="Plot" value={listing?.plotArea!} readOnly />
      </div>
      <div className="col-span-3">
        <Input label="Total Area" value={listing?.totalArea!} readOnly />
      </div>
      <div className="col-span-6">
        <AppSelect
          label="Furnished"
          options={common?.furnished}
          value={listing?.furnished}
          disabled
        />
      </div>
      <div className="col-span-3">
        <Input label="Parking" value={listing?.parking!} readOnly />
      </div>
      <div className="col-span-3">
        <Input label="View" value={listing?.view!} readOnly />
      </div>
      <div className="col-span-6">
        <Input label="Agent" value={listing?.agent?.name!} readOnly />
      </div>
    </div>
  );
};
