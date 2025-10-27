import { useGetCommonQuery } from "@/app/services/api";
import { AppSelect, Button, Checkbox, Input } from "@/components/shared";
import { Roles, RolesFullName } from "@/constants/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiEyeOff } from "react-icons/hi";
import { HiEye, HiOutlineEnvelope } from "react-icons/hi2";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().min(1).email(),
    phoneNumberCountryCode: z.string().optional(),
    phoneNumber: z.string(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
    role: z.string(),
  })
  .refine((arg) => arg.password === arg.confirmPassword, {
    message: "Password mismatch",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;

export const CreateUserForm: React.FC<{
  loading?: boolean;
  onSubmit: (values: FormValues) => any;
}> = ({ loading = false, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { data, isLoading } = useGetCommonQuery();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
            {...register("email")}
            error={errors.email?.message}
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

        <div className="col-span-6">
          <Input
            required
            label="Password"
            placeholder="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            suffix={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <HiEye /> : <HiEyeOff />}
              </span>
            }
            {...register("password")}
            error={errors.password?.message}
          />
        </div>

        <div className="col-span-6">
          <Input
            required
            label="Confirm Password"
            placeholder="Confirm Password"
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            suffix={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(!showConfirm);
                }}
              >
                {showConfirm ? <HiEye /> : <HiEyeOff />}
              </span>
            }
            {...register("confirmPassword")}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
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
