import { Controller } from "react-hook-form";
import { Input, AppSelect } from "@/components/shared";
import {
  useGetCommunitiesQuery,
  useGetSubcommunitiesQuery,
  useGetCitiesQuery,
  useGetPropertiesQuery,
} from "@/app/services/api";

import { StepProps } from "@/types/step.props";
import { setValueAsNumber } from "@/utils";

const LocationStep: React.FC<StepProps> = ({
  register,
  control,
  errors,
  watch,
  disabled,
  setValue,
  readOnly,
}) => {
  const cityId = watch("cityId");
  const communityId = watch("communityId");
  const subcommunityId = watch("subcommunityId");

  const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();

  const { data: communities = [], isLoading: isCommunitiesLoading } =
    useGetCommunitiesQuery(cityId!, {
      skip: !cityId,
    });

  const { data: subcommunities = [], isLoading: isSubcommunitiesLoading } =
    useGetSubcommunitiesQuery(communityId!, {
      skip: !communityId,
    });

  const { data: properties = [], isLoading: isPropertiesLoading } =
    useGetPropertiesQuery(subcommunityId!, {
      skip: !subcommunityId,
    });

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">
        Location
      </h2>

      <div className="col-span-12">
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
              name="cityId"
              error={error?.message}
              disabled={disabled}
              options={cities}
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue("communityId", "");
                setValue("subcommunityId", "");
                setValue("propertyId", "");
              }}
              loading={isCitiesLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          control={control}
          name="communityId"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              required
              label="Community"
              placeholder="Community"
              name="communityId"
              error={error?.message}
              disabled={disabled}
              options={communities}
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue("subcommunityId", "");
                setValue("propertyId", "");
              }}
              loading={isCommunitiesLoading}
            />
          )}
        />
      </div>
      <div className="col-span-12">
        <Controller
          control={control}
          name="subcommunityId"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              label="Subcommunity"
              placeholder="Subcommunity"
              name="subcommunityId"
              error={error?.message}
              disabled={disabled}
              options={subcommunities}
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue("propertyId", "");
              }}
              loading={isSubcommunitiesLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          control={control}
          name="propertyId"
          render={({
            field: { onChange, value, disabled },
            fieldState: { error },
          }) => (
            <AppSelect
              label="Property"
              placeholder="Property"
              name="propertyId"
              error={error?.message}
              disabled={disabled}
              options={properties}
              value={value}
              onChange={onChange}
              loading={isPropertiesLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Input
          required
          label="Unit No"
          placeholder="Unit No"
          {...register("unitNumber", { disabled })}
          error={errors.unitNumber?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-12">
        <Input
          label="Street No"
          placeholder="Street No"
          {...register("streetNumber", { disabled })}
          error={errors.streetNumber?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-12">
        <Input
          label="Floor"
          placeholder="Floor"
          {...register("floor", { setValueAs: setValueAsNumber, disabled })}
          error={errors.floor?.message}
          readOnly={readOnly}
        />
      </div>

      <div className="col-span-12">
        <Input
          required
          label="View"
          placeholder="View"
          {...register("view", { disabled })}
          error={errors.view?.message}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default LocationStep;
