import { AppDialog, AppSelect, Button, Input } from "@/components/shared";

import { Controller, useForm } from "react-hook-form";

import { useCallback, useEffect, useMemo, useState } from "react";

import { css, setValueAsNumber } from "@/utils";

import Datetime from "react-datetime";

import { ViewingDialogProps } from "./props";
import {
  useCreateViewingMutation,
  useGetCommonQuery,
  useGetCommunitiesQuery,
  useGetListingsQuery,
  useGetPropertiesQuery,
  useGetSubcommunitiesQuery,
} from "@/app/services/api";

type FormValues = {
  scheduledAt: string;
  listingId?: string;
  listing?: {
    type: string;
    numberOfBedrooms: string;
    numberOfBathrooms: string;
    furnished: string;
    price: string;
    categoryId: string;
    cityId: string;
    communityId: string;
    subcommunityId: string;
    propertyId: string;
    view: string;
    parking: string;
    plotArea: string;
    totalArea: string;
  };
};

export const ViewingDialog: React.FC<ViewingDialogProps> = ({
  leadId,
  open,
  onClose,
  ...rest
}) => {
  const { data: common } = useGetCommonQuery();
  const { data: listings } = useGetListingsQuery({
    status: ["PUBLISHED"],
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>();

  const [isListing, setIsListing] = useState(true);

  const { listingId } = watch();

  const { listing: { cityId, communityId, subcommunityId } = {} } = watch();

  const { data: communities } = useGetCommunitiesQuery(cityId!, {
    skip: !cityId,
  });

  const { data: subcommunities } = useGetSubcommunitiesQuery(communityId!, {
    skip: !communityId,
  });

  const { data: properties } = useGetPropertiesQuery(subcommunityId!, {
    skip: !subcommunityId,
  });

  const closeDialog = useCallback(() => {
    onClose();
    setIsListing(true);
    reset();
  }, [onClose]);

  const [createViewing, { isLoading }] = useCreateViewingMutation();

  useEffect(() => {
    const listing = listings?.data.find((l) => l.id === listingId);
    if (listing) {
      setValue("listing", {
        type: listing.isSale ? "SALE" : "RENTAL",
        categoryId: listing.categoryId ?? "",
        cityId: listing.cityId ?? "",
        communityId: listing.communityId ?? "",
        subcommunityId: listing.subcommunityId ?? "",
        propertyId: listing.propertyId ?? "",
        furnished: listing.furnished ?? "",
        view: listing.view ?? "",
        price: `${listing.isSale ? listing.salePrice : listing.rentalPrice}`,
        totalArea: `${listing.totalArea}`,
        plotArea: `${listing.plotArea}`,
        parking: `${listing.parking}`,
        numberOfBathrooms: `${listing.numberOfBathrooms}`,
        numberOfBedrooms: `${listing.numberOfBedrooms}`,
      });
    }
  }, [listingId, isListing, listings]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const { scheduledAt, listing, listingId } = data;
      try {
        await createViewing({
          leadId,
          scheduledAt,
          listingId,
          listing: !listingId ? listing : undefined,
        }).unwrap();
        closeDialog();
      } catch (err) {
        console.error(err);
      }
    },
    [leadId]
  );

  const options = useMemo(() => {
    return listings?.data.map(({ id, title }) => ({
      label: title,
      value: id,
    }));
  }, [listings]);

  return (
    <AppDialog open={open} onClose={closeDialog} {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AppDialog.Title>Viewing</AppDialog.Title>

        <div className="mt-5">
          <Controller
            name="scheduledAt"
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Datetime
                value={value}
                onChange={onChange}
                ref={ref}
                inputProps={{
                  className: "w-full",
                  placeholder: "Schedule Date & Time",
                }}
              />
            )}
          />
        </div>

        <div className="mt-7">
          <div className="flex gap-x-3 mb-2 border-b">
            <button
              type="button"
              className={css({
                "text-gray-500": !isListing,
              })}
              onClick={() => {
                setIsListing(true);
                reset();
              }}
            >
              Listing
            </button>
            <button
              type="button"
              className={css({
                "text-gray-500": isListing,
              })}
              onClick={() => {
                setIsListing(false);
                reset();
              }}
            >
              No Listing
            </button>
          </div>
        </div>

        {isListing && (
          <div className="grid grid-cols-12 gap-3 mt-5">
            <div className={css("col-span-12")}>
              <Controller
                name="listingId"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Listing"
                    placeholder="Listing"
                    onChange={onChange}
                    value={value}
                    options={options}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.type"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Type"
                    placeholder="Type"
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                    options={[
                      { label: "Sale", value: "SALE" },
                      { label: "Rental", value: "RENTAL" },
                    ]}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.categoryId"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Category"
                    disabled={disabled}
                    placeholder="Category"
                    onChange={onChange}
                    value={value}
                    options={common?.categories}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="listing.cityId"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="City"
                    placeholder="City"
                    onChange={onChange}
                    value={value}
                    options={common?.locations}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.communityId"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Community"
                    placeholder="Community"
                    onChange={onChange}
                    value={value}
                    options={communities}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.subcommunityId"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Subcommunity"
                    placeholder="Subcommunity"
                    onChange={onChange}
                    value={value}
                    options={subcommunities}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.propertyId"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Property"
                    placeholder="Property"
                    onChange={onChange}
                    value={value}
                    options={properties}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.numberOfBedrooms"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Bedrooms"
                    placeholder="Bedrooms"
                    onChange={onChange}
                    value={value?.toString()}
                    options={common?.bedrooms}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.numberOfBathrooms"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Bathrooms"
                    placeholder="Bathrooms"
                    onChange={onChange}
                    value={value?.toString()}
                    options={common?.bathrooms}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.furnished"
                control={control}
                disabled
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Furnished"
                    placeholder="Furnished"
                    onChange={onChange}
                    value={value}
                    options={common?.furnished}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Input
                label="View"
                {...register("listing.view", {
                  disabled: true,
                })}
                error={errors.listing?.view?.message}
              />
            </div>

            <div className="col-span-6">
              <Input
                error={errors.listing?.parking?.message}
                label="Parking"
                placeholder="Parking"
                type="number"
                {...register("listing.parking", {
                  setValueAs: setValueAsNumber,
                  disabled: true,
                })}
              />
            </div>

            <div className="col-span-6">
              <Input
                type="number"
                error={errors.listing?.plotArea?.message}
                label="Plot"
                placeholder="Plot"
                {...register("listing.plotArea", {
                  setValueAs: setValueAsNumber,
                  disabled: true,
                })}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Input
                error={errors.listing?.totalArea?.message}
                type="number"
                label="Total area"
                placeholder="Total area"
                {...register("listing.totalArea", {
                  setValueAs: setValueAsNumber,
                  disabled: true,
                })}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Input
                error={errors.listing?.price?.message}
                type="number"
                label="Price"
                placeholder="Price"
                {...register("listing.price", {
                  setValueAs: setValueAsNumber,
                  disabled: true,
                })}
              />
            </div>
          </div>
        )}

        {!isListing && (
          <div className="grid grid-cols-12 gap-3 mt-5">
            <div className="col-span-6">
              <Controller
                name="listing.type"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Type"
                    placeholder="Type"
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                    options={[
                      { label: "Sale", value: "SALE" },
                      { label: "Rental", value: "RENTAL" },
                    ]}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.categoryId"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Category"
                    disabled={disabled}
                    placeholder="Category"
                    onChange={onChange}
                    value={value}
                    options={common?.categories}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="listing.cityId"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="City"
                    placeholder="City"
                    onChange={onChange}
                    value={value}
                    options={common?.locations}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.communityId"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Community"
                    placeholder="Community"
                    onChange={onChange}
                    value={value}
                    options={communities}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.subcommunityId"
                control={control}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Subcommunity"
                    placeholder="Subcommunity"
                    onChange={onChange}
                    value={value}
                    options={subcommunities}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="listing.propertyId"
                control={control}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Property"
                    placeholder="Property"
                    onChange={onChange}
                    value={value}
                    options={properties}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.numberOfBedrooms"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Bedrooms"
                    placeholder="Bedrooms"
                    onChange={onChange}
                    value={value?.toString()}
                    options={common?.bedrooms}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.numberOfBathrooms"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Bathrooms"
                    placeholder="Bathrooms"
                    onChange={onChange}
                    value={value?.toString()}
                    options={common?.bathrooms}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                name="listing.furnished"
                control={control}
                rules={{ required: "Required" }}
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Furnished"
                    placeholder="Furnished"
                    onChange={onChange}
                    value={value}
                    options={common?.furnished}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Input
                label="View"
                {...register("listing.view", {
                  required: "Required",
                })}
                error={
                  errors.listing?.view?.type === "required"
                    ? "Required"
                    : undefined
                }
              />
            </div>

            <div className="col-span-6">
              <Input
                error={errors.listing?.parking?.message}
                label="Parking"
                placeholder="Parking"
                type="number"
                {...register("listing.parking", {
                  setValueAs: setValueAsNumber,
                  required: "Required",
                })}
              />
            </div>

            <div className="col-span-6">
              <Input
                type="number"
                error={errors.listing?.plotArea?.message}
                label="Plot"
                placeholder="Plot"
                {...register("listing.plotArea", {
                  setValueAs: setValueAsNumber,
                  required: "Required",
                })}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Input
                error={errors.listing?.totalArea?.message}
                type="number"
                label="Total area"
                placeholder="Total area"
                {...register("listing.totalArea", {
                  setValueAs: setValueAsNumber,
                  required: "Required",
                })}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Input
                error={errors.listing?.price?.message}
                type="number"
                label="Price"
                placeholder="Price"
                {...register("listing.price", {
                  setValueAs: setValueAsNumber,
                  required: "Required",
                })}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-x-3 mt-5">
          <Button variant="secondary" isLoading={isLoading}>
            Submit Viewing
          </Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </div>
      </form>
    </AppDialog>
  );
};
