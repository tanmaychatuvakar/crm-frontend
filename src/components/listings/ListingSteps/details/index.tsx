import { Controller } from "react-hook-form";
import { Input, AppSelect } from "@/components/shared";
import { useGetCommonQuery } from "@/app/services/api";
import React from "react";
import { StepProps } from "@/types/step.props";
import { setValueAsNumber } from "@/utils";

const DetailsStep: React.FC<StepProps & { type?: string }> = ({
  register,
  control,
  errors,
  watch,
  disabled,
  readOnly,
}) => {
  const { data, isLoading } = useGetCommonQuery();

  const title = watch("title", "");

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">
        Property Details
      </h2>

      <div className="col-span-12">
        <Input
          label="Title"
          placeholder="Title"
          {...register("title", { disabled })}
          required
          type="text"
          error={errors.title?.message}
          suffix={
            <span className="text-gray-600 text-sm font-light">{`${title.length}/40`}</span>
          }
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-12">
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
              name="categoryId"
              options={data?.categories}
              value={value}
              onChange={onChange}
              loading={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Input
          required
          {...register("totalArea", { setValueAs: setValueAsNumber, disabled })}
          label="Total Area"
          placeholder="Total Area"
          type="number"
          suffix="sqft"
          error={errors.totalArea?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-6">
        <Input
          {...register("plotArea", { setValueAs: setValueAsNumber, disabled })}
          label="Plot Area"
          placeholder="Plot Area"
          type="number"
          suffix="sqft"
          error={errors.plotArea?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="numberOfBedrooms"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Bedrooms"
              placeholder="Bedrooms"
              error={error?.message}
              disabled={disabled}
              options={data?.bedrooms}
              value={value?.toString()}
              onChange={(value) => {
                onChange(typeof value === "string" ? +value : undefined);
              }}
              loading={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="numberOfBathrooms"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Bathrooms"
              placeholder="Bathrooms"
              error={error?.message}
              disabled={disabled}
              options={data?.bedrooms}
              value={value?.toString()}
              onChange={(value) => {
                onChange(typeof value === "string" ? +value : undefined);
              }}
              loading={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="furnished"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Furnished"
              placeholder="Furnished"
              name="furnished"
              error={error?.message}
              disabled={disabled}
              options={data?.furnished}
              value={value}
              onChange={onChange}
              loading={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="appliances"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              label="Appliances"
              placeholder="Appliances"
              error={error?.message}
              name="appliances"
              disabled={disabled}
              options={data?.appliances}
              value={value ? "true" : "false"}
              onChange={(value) => {
                onChange(Boolean(value));
              }}
              loading={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Input
          required
          {...register("parking", { setValueAs: setValueAsNumber, disabled })}
          label="Parking"
          placeholder="Parking"
          type="number"
          suffix="NOS"
          onWheel={(e) => e.currentTarget.blur()}
          error={errors.parking?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-12">
        <Controller
          control={control}
          name="propertyStatus"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Property Status"
              placeholder="Property Status"
              error={error?.message}
              disabled={disabled}
              name="propertyStatus"
              options={data?.propertyStatus}
              value={value}
              onChange={onChange}
              loading={isLoading}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DetailsStep;
