import React from "react";
import { useGetCommonQuery } from "@/app/services/api";
import { AppSelect, Input, Toggle } from "@/components/shared";

import { StepProps } from "@/types/step.props";
import { Controller } from "react-hook-form";
import { setValueAsNumber } from "@/utils";

const PricingStep: React.FC<StepProps & { type?: string }> = ({
  register,
  control,
  errors,
  type,
  disabled,
  readOnly,
}) => {
  const { data, isLoading } = useGetCommonQuery();

  const isSale = type === "sale";

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">Pricing</h2>

      <div className="col-span-12">
        <Input
          required
          label="Price"
          {...register(isSale ? "salePrice" : "rentalPrice", {
            setValueAs: setValueAsNumber,
            disabled,
          })}
          placeholder="Price"
          error={(isSale ? errors.salePrice : errors.rentalPrice)?.message}
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          suffix={<span className="text-gray-600 text-sm font-light">AED</span>}
          readOnly={readOnly}
        />
      </div>

      {type == "sale" ? (
        <>
          <div className="col-span-12">
            <Input
              label="Price/sqft"
              placeholder="Price/sqft"
              {...register("pricePerSqft", {
                setValueAs: setValueAsNumber,
                disabled,
              })}
              error={errors.pricePerSqft?.message}
              type="number"
              suffix={
                <span className="text-gray-600 text-sm font-light">/sqft</span>
              }
              readOnly={readOnly}
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-span-12 md:col-span-4">
            <Controller
              control={control}
              name="rentalCheques"
              render={({
                field: { onChange, value, disabled },
                fieldState: { error },
              }) => (
                <AppSelect
                  required
                  label="Rental Cheques"
                  placeholder="Rental Cheques"
                  name="rentalCheques"
                  error={error?.message}
                  disabled={disabled}
                  options={data?.cheques}
                  value={value?.toString()}
                  onChange={(value) => {
                    onChange(typeof value === "string" ? +value : undefined);
                  }}
                  loading={isLoading}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Controller
              control={control}
              name="rentalLeaseTerm"
              render={({
                field: { onChange, value, disabled },
                fieldState: { error },
              }) => (
                <AppSelect
                  required
                  label="Lease Term"
                  placeholder="Lease Term"
                  error={error?.message}
                  disabled={disabled}
                  options={data?.leaseTerm}
                  value={value}
                  onChange={onChange}
                  loading={isLoading}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label="Available From"
              placeholder="Available From"
              {...register("rentalAvailableFrom", { disabled })}
              error={errors.rentalAvailableFrom?.message}
              type="date"
              readOnly={readOnly}
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Service Charge/sqft"
              placeholder="Service Charge/sqft"
              {...register("serviceCharge", {
                setValueAs: setValueAsNumber,
                disabled,
              })}
              error={errors.serviceCharge?.message}
              suffix={
                <span className="text-gray-600 text-sm font-light">/sqft</span>
              }
              readOnly={readOnly}
            />
          </div>
        </>
      )}
      <div className="col-span-12 justify-self-end">
        <Toggle
          {...register("askForPrice", { disabled })}
          label="Ask For Price"
        />
      </div>
    </div>
  );
};

export default PricingStep;
