import { Controller } from "react-hook-form";
import { HiOutlineEnvelope } from "react-icons/hi2";

import { Input, AppSelect } from "@/components/shared";

import { TITLES } from "@/constants";
import { useGetCommonQuery } from "@/app/services/api";

const contactTypes = [
  { label: "Buyer", value: "BUYER" },
  { label: "Tenant", value: "TENANT" },
  { label: "Seller", value: "SELLER" },
  { label: "Landlord", value: "LANDLORD" },
];

export const ContactStep = ({ register, control, errors }: any) => {
  const { data } = useGetCommonQuery();

  const { nationalities, sources } = data || {};

  return (
    <div className="grid grid-cols-6 gap-3">
      <div className="col-span-2">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppSelect
              required
              label="Title"
              placeholder="Title"
              error={error?.message}
              options={TITLES}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-4">
        <Input
          required
          label="Name"
          placeholder="Name"
          id="contactName"
          {...register("name")}
          error={errors.name?.message}
        />
      </div>

      <div className="col-span-6">
        <Input
          required
          label="Mobile Number"
          placeholder="Number"
          {...register("mobileNumber")}
          error={errors.mobileNumber?.message}
        />
      </div>

      <div className="col-span-6">
        <Input
          label="Phone Number"
          placeholder="Number"
          {...register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
      </div>

      <div className="col-span-6">
        <Input
          required
          label="Email"
          placeholder="Email"
          suffix={<HiOutlineEnvelope />}
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="nationalityId"
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppSelect
              label="Nationality"
              placeholder="Nationality"
              error={error?.message}
              options={nationalities}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Input
          required
          label="Language"
          error={errors.language?.message}
          id="language"
          {...register("language")}
        />
      </div>

      <div className="col-span-6">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppSelect
              required
              label="Type"
              placeholder="Type"
              error={error?.message}
              options={contactTypes}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="sourceId"
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppSelect
              label="Source"
              placeholder="Source"
              error={error?.message}
              options={sources}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Input
          label="Sub Source"
          placeholder="Sub Source"
          error={errors.subsource?.message}
          {...register("subsource")}
        />
      </div>
    </div>
  );
};
