import { useGetCommonQuery } from "@/app/services/api";
import { AppSelect, Button, Checkbox, Input } from "@/components/shared";
import { Roles, RolesFullName } from "@/constants/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  phoneNumberCountryCode: z.string().optional(),
  phoneNumber: z.string(),
  role: z.string(),
  password: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const EditUserForm: React.FC<{
  values?: FormValues;
  loading?: boolean;
  onSubmit: (values: FormValues) => any;
}> = ({ loading = false, onSubmit, values }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values,
  });

  const { data, isLoading } = useGetCommonQuery();

  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-6">
          <Input
            required
            label="Name"
            placeholder="Name"
            id="name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6">
          <Input
            required
            label="Email"
            id="email"
            placeholder="Email"
            suffix={<HiOutlineEnvelope className="text-gray-600" />}
            readOnly
            {...register("email")}
          />
        </div>

        <div className="col-span-6 md:col-span-2">
          <Controller
            control={control}
            name="phoneNumberCountryCode"
            render={({ field: { onChange, value } }) => (
              <AppSelect
                label="Country Code"
                placeholder="Country Code"
                error={errors.phoneNumberCountryCode?.message}
                options={data?.countryCodes || []}
                loading={isLoading}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <Input
            label="Phone Number"
            placeholder="Phone Number"
            type="number"
            id="phoneNumber"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
        </div>

        <div className="col-span-6 mb-4">
          <Input
            label="Password"
            placeholder="Password"
            id="password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>

        <div className="col-span-6">
          <Controller
            name="role"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="col-span-6 grid grid-cols-6 gap-4">
                {Object.keys(Roles).map((role) => (
                  <div className="col-span-6 sm:col-span-3" key={role}>
                    <Checkbox
                      checked={value === role}
                      label={RolesFullName[role]}
                      onChange={() => {
                        onChange(role);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          />
          <p className="text-sm text-red-500">
            {errors.role?.message ? "It is required to choose a role" : ""}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-5">
        <Button type="submit" isLoading={loading}>
          Submit
        </Button>
        {/* <Button onClick={onClose}>Cancel</Button> */}
      </div>
    </form>
  );
};
