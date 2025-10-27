import { Controller } from "react-hook-form";

import { Button, Input, AppSelect } from "@/components/shared";
import {
  useGetCommonQuery,
  useGetCommunitiesQuery,
  useGetPropertiesQuery,
  useGetSubcommunitiesQuery,
} from "@/app/services/api";

export const PreferenceStep = ({
  register,
  control,
  errors,
  mode,
  watch,
}: any) => {
  const { data } = useGetCommonQuery();

  const { cityId, communityId, subcommunityId } = watch();

  const { data: communities } = useGetCommunitiesQuery(cityId!, {
    skip: !cityId,
  });

  const { data: subcommunities } = useGetSubcommunitiesQuery(communityId!, {
    skip: !communityId,
  });

  const { data: properties } = useGetPropertiesQuery(subcommunityId!, {
    skip: !subcommunityId,
  });

  const { categories, bedrooms, locations } = data || {};

  return (
    <div className="grid grid-cols-6 gap-3">
      <div className="col-span-6">
        <Controller
          control={control}
          name="cityId"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="City"
              placeholder="City"
              error={error?.message}
              disabled={disabled}
              options={locations}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="communityId"
          defaultValue=""
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Community"
              placeholder="Community"
              error={error?.message}
              value={value}
              options={communities}
              disabled={disabled}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="subcommunityId"
          defaultValue=""
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              label="Subcommunity"
              placeholder="Subcommunity"
              error={error?.message}
              value={value}
              options={subcommunities}
              disabled={disabled}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="propertyId"
          defaultValue=""
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              label="Property"
              placeholder="Property"
              error={error?.message}
              value={value}
              disabled={disabled}
              options={properties}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="categoryId"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Category"
              placeholder="Category"
              error={error?.message}
              disabled={disabled}
              options={categories}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="minBedrooms"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Min Beds"
              placeholder="Min Beds"
              name="minBedrooms"
              error={error?.message}
              disabled={disabled}
              options={bedrooms}
              value={value}
              onChange={(value) => {
                onChange(typeof value === "string" ? +value : undefined);
              }}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="maxBedrooms"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Max Beds"
              placeholder="Max Beds"
              name="maxBedrooms"
              error={error?.message}
              disabled={disabled}
              options={bedrooms}
              value={value}
              onChange={(value) => {
                onChange(typeof value === "string" ? +value : undefined);
              }}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Input
          required
          {...register("minPrice", { valueAsNumber: true })}
          label="Min Price"
          placeholder="Min Price"
          error={errors.minPrice?.message}
          onWheel={(e) => e.currentTarget.blur()}
          suffix={<span className="text-gray-600 text-sm font-light">AED</span>}
        />
      </div>

      <div className="col-span-3">
        <Input
          required
          {...register("maxPrice", { valueAsNumber: true })}
          label="Max Price"
          placeholder="Max Price"
          error={errors.maxPrice?.message}
          onWheel={(e) => e.currentTarget.blur()}
          suffix={<span className="text-gray-600 text-sm font-light">AED</span>}
        />
      </div>

      <div className="col-span-3">
        <Input
          required
          {...register("minArea", { valueAsNumber: true })}
          label="Min Area"
          placeholder="Min Area"
          error={errors.minArea?.message}
          suffix={
            <span className="text-gray-600 text-sm font-light">sqft</span>
          }
        />
      </div>

      <div className="col-span-3">
        <Input
          required
          {...register("maxArea", { valueAsNumber: true })}
          label="Max Area"
          placeholder="Max Area"
          error={errors.maxArea?.message}
          suffix={
            <span className="text-gray-600 text-sm font-light">sqft</span>
          }
        />
      </div>

      {mode === "create" ? (
        <Button
          type="submit"
          className="absolute bottom-0 right-0 bg-[#6BB8F2] border-[#6BB8F2] text-white"
        >
          Submit
        </Button>
      ) : null}
    </div>
  );
};
