import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input, AppSelect, Toggle } from "@/components/shared";
import { useGetCommonQuery } from "@/app/services/api";
import { StepProps } from "@/types/step.props";
import { setValueAsNumber } from "@/utils";

const RentingStep: React.FC<StepProps> = ({
  register,
  control,
  errors,
  watch,
  resetField,
  disabled,
  readOnly,
}) => {
  const { data, isLoading } = useGetCommonQuery();
  const { isRented, rentedFrom } = watch();

  useEffect(() => {
    resetField("rentedUntil");
  }, [rentedFrom]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">Rented</h2>

      <div className="col-span-12">
        <Toggle label="Rented" {...register("isRented", { disabled })} />
      </div>

      {isRented && (
        <>
          <div className="col-span-12">
            <Input
              required
              label="Rented From"
              placeholder="Rented From"
              error={errors.rentedFrom?.message}
              {...register("rentedFrom", { disabled })}
              type="date"
              readOnly={readOnly}
            />
          </div>

          <div className="col-span-12">
            <Input
              required
              label="Rented Until"
              placeholder="Rented Until"
              error={errors.rentedUntil?.message}
              {...register("rentedUntil", { disabled })}
              type="date"
              min={rentedFrom ?? ""}
              readOnly={readOnly}
            />
          </div>

          <div className="col-span-12">
            <Input
              required
              label="Rented Price"
              placeholder="Rented Price"
              error={errors.rentedPrice?.message}
              {...register("rentedPrice", {
                setValueAs: setValueAsNumber,
                disabled,
              })}
              type="number"
              suffix={
                <span className="text-gray-600 text-sm font-light">AED</span>
              }
              readOnly={readOnly}
            />
          </div>

          <div className="col-span-12">
            <Controller
              control={control}
              name="rentedCheques"
              render={({
                field: { onChange, value, disabled },
                fieldState: { error },
              }) => (
                <AppSelect
                  required
                  label="Rented Cheques"
                  placeholder="Rented Cheques"
                  name="rentedCheques"
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

          <div className="col-span-12">
            <Input
              label="Tenant"
              placeholder="Tenant"
              error={errors.tenant?.message}
              {...register("tenant", { disabled })}
              type="text"
              readOnly={readOnly}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RentingStep;
