import { useGetCommonQuery } from "@/app/services/api";
import { AppSelect, Input, Toggle } from "@/components/shared";
import { StepProps } from "@/types/step.props";
import { setValueAsNumber } from "@/utils";
import { Controller } from "react-hook-form";

const PublishingStep: React.FC<StepProps & { type?: string }> = ({
  register,
  control,
  errors,
  watch,
  type,
  disabled,
}) => {
  const { data, isLoading } = useGetCommonQuery();

  const { isRental, isSale } = watch();

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">
        Add to {type == "sale" ? "Rental" : "Sale"}
      </h2>

      <div className="col-span-12 justify-self-start">
        <Toggle
          {...register(type === "sale" ? "isRental" : "isSale", { disabled })}
          label={type === "sale" ? "Add to Rental" : "Add to Sale"}
        />
      </div>

      {isSale && type == "rental" ? (
        <>
          <div className="col-span-12">
            <Input
              required
              label="Sale Price"
              placeholder="Sale Price"
              {...register("salePrice", { disabled })}
              id="salePrice"
              error={errors.salePrice?.message}
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              suffix={
                <span className="text-gray-600 text-sm font-light">AED</span>
              }
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Price/sqft"
              placeholder="Price/sqft"
              {...register("pricePerSqft", { disabled })}
              id="pricePerSqft"
              type="number"
              error={errors.pricePerSqft?.message}
              suffix={
                <span className="text-gray-600 text-sm font-light">/sqft</span>
              }
            />
          </div>

          <div className="col-span-12">
            <Controller
              control={control}
              name="propertyStatus"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Property Status"
                  placeholder="Property Status"
                  name="propertyStatus"
                  disabled={disabled}
                  options={data?.propertyStatus}
                  value={value}
                  onChange={onChange}
                  loading={isLoading}
                />
              )}
            />
          </div>
        </>
      ) : null}

      {isRental && type == "sale" ? (
        <>
          <div className="col-span-12">
            <Input
              label="Rental value"
              placeholder="Rental value"
              {...register("rentalPrice", {
                setValueAs: setValueAsNumber,
                disabled,
              })}
              id="rentalPrice"
              error={errors.rentalPrice?.message}
              type="number"
              suffix={
                <span className="text-gray-600 text-sm font-light">AED</span>
              }
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Controller
              control={control}
              name="rentalCheques"
              disabled={disabled}
              render={({ field: { onChange, value, disabled } }) => (
                <AppSelect
                  label="Rental Cheques"
                  placeholder="Rental Cheques"
                  name="rentalCheques"
                  error={errors.rentalCheques?.message}
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
              defaultValue=""
              disabled={disabled}
              render={({ field: { onChange, value, disabled } }) => (
                <AppSelect
                  label="Lease Term"
                  placeholder="Lease Term"
                  name="rentalLeaseTerm"
                  error={errors.rentalLeaseTerm?.message}
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
              disabled={disabled}
              {...register("rentalAvailableFrom", { disabled })}
              type="date"
              id="rentalAvailableFrom"
              error={errors.rentalAvailableFrom?.message}
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Service Charge/sqft"
              placeholder="Service Charge"
              disabled={disabled}
              {...register("serviceCharge", {
                setValueAs: setValueAsNumber,
                disabled,
              })}
              error={errors.serviceCharge?.message}
              id="serviceCharge"
              suffix={
                <span className="text-gray-600 text-sm font-light">/sqft</span>
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PublishingStep;
