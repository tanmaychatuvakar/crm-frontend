//Validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

//Components
import { Button, Input, AppSelect } from "../../shared";

//Constants
import { TITLES } from "@/constants";

//Hooks
import { useGetCommonQuery } from "@/app/services/api";

//Icons
import { HiOutlineEnvelope } from "react-icons/hi2";

//Typescript
import { FormProps } from "./Form.props";

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    name: z.string().min(1, "Name is required"),
    mobileCountryCode: z.string().min(1, "Mobile country code is required"),
    mobileNumber: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\d+$/, "Mobile Number should contain only numbers"),
    phoneCountryCode: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    nationalityId: z.string().min(1, "Nationality is required").uuid(),
    dateOfBirth: z.string().min(1, "Birth date is required").date(),
    emiratesId: z.string().nullable(),
    passportNumber: z.string().min(1, "Passport Number is required"),
    spokenLanguage: z.string().nullable(),
    contactType: z.string().min(1, "Contact type is required"),
  })
  .superRefine((data, ctx) => {
    if (data.phoneCountryCode !== "") {
      if (data.phoneNumber === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: ["phoneNumber"],
        });
      }
    }
  });

export type CreateContactDto = z.infer<typeof schema>;

export const CreateContactForm: React.FC<FormProps> = ({
  onSubmit,
  onClose,
  loading,
}) => {
  const { data } = useGetCommonQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateContactDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      name: "",
      mobileCountryCode: "",
      mobileNumber: "",
      phoneCountryCode: "",
      phoneNumber: "",
      email: "",
      nationalityId: "",
      dateOfBirth: "",
      emiratesId: "",
      passportNumber: "",
      spokenLanguage: "",
      contactType: "",
    },
  });

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3 md:col-span-2">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <>
                <AppSelect
                  required
                  label="Title"
                  placeholder="Title"
                  error={errors.title?.message}
                  options={TITLES}
                  onChange={onChange}
                  value={
                    TITLES.find((title) => title.value === value)?.value ?? ""
                  }
                />
              </>
            )}
          />
        </div>

        <div className="col-span-3 md:col-span-4">
          <Input
            required
            label="Name"
            placeholder="Name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6">
          <Input
            required
            label="Date of Birth"
            placeholder="Date of Birth"
            type="date"
            {...register("dateOfBirth")}
            error={errors.dateOfBirth?.message}
          />
        </div>

        <div className="col-span-6 md:col-span-2">
          <Controller
            control={control}
            name="mobileCountryCode"
            render={({ field: { onChange, value } }) => (
              <>
                <AppSelect
                  required
                  label="Country Code"
                  placeholder="Country Code"
                  error={errors.mobileCountryCode?.message}
                  options={data?.countryCodes || []}
                  onChange={onChange}
                  value={
                    data?.countryCodes.find(
                      (countryCode) => countryCode.value === value
                    )?.value ?? ""
                  }
                />
              </>
            )}
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <Input
            required
            label="Mobile Number"
            placeholder="Mobile Number"
            type="number"
            error={errors.mobileNumber?.message}
            {...register("mobileNumber")}
          />
        </div>

        <div className="col-span-6 md:col-span-2">
          <Controller
            control={control}
            name="phoneCountryCode"
            render={({ field: { onChange, value } }) => (
              <>
                <AppSelect
                  error={errors.phoneCountryCode?.message}
                  label="Country Code"
                  placeholder="Country Code"
                  options={data?.countryCodes || []}
                  onChange={onChange}
                  value={
                    data?.countryCodes.find(
                      (countryCode) => countryCode.value === value
                    )?.value ?? ""
                  }
                />
              </>
            )}
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <Input
            error={errors.phoneNumber?.message}
            type="number"
            label="Phone Number"
            placeholder="Phone Number"
            id="phoneNumber"
            {...register("phoneNumber")}
          />
        </div>

        <div className="col-span-6">
          <Input
            required
            label="Email"
            placeholder="Email"
            error={errors.email?.message}
            suffix={<HiOutlineEnvelope className="text-gray-600" />}
            {...register("email")}
          />
        </div>

        <div className="col-span-6 md:col-span-3">
          <Input
            label="Emirates ID"
            placeholder="Emirates ID"
            {...register("emiratesId")}
            error={errors.emiratesId?.message}
          />
        </div>

        <div className="col-span-6 md:col-span-3">
          <Input
            required
            label="Passport No"
            placeholder="Passport No"
            error={errors.passportNumber?.message}
            id="passportNumber"
            {...register("passportNumber")}
          />
        </div>

        <div className="col-span-3">
          <Controller
            control={control}
            name="nationalityId"
            render={({ field: { onChange, value } }) => (
              <>
                <AppSelect
                  required
                  label="Nationality"
                  placeholder="Nationality"
                  error={errors.nationalityId?.message}
                  options={data?.nationalities || []}
                  onChange={onChange}
                  value={
                    data?.nationalities.find(
                      (nationality) => nationality.value === value
                    )?.value ?? ""
                  }
                />
              </>
            )}
          />
        </div>

        <div className="col-span-3">
          <Input
            label="Language"
            placeholder="Language"
            error={errors.spokenLanguage?.message}
            {...register("spokenLanguage")}
          />
        </div>

        <div className="col-span-6">
          <Controller
            control={control}
            name="contactType"
            render={({ field: { onChange, value } }) => (
              <>
                <AppSelect
                  required
                  label="Contact Type"
                  placeholder="Contact Type"
                  error={errors.contactType?.message}
                  options={data?.contactTypes || []}
                  onChange={onChange}
                  value={
                    data?.contactTypes.find(
                      (contactType) => contactType.value === value
                    )?.value ?? ""
                  }
                />
              </>
            )}
          />
        </div>
      </div>

      <div className="flex w-full justify-end gap-x-3 mt-6">
        <Button
          isLoading={loading}
          type="button"
          onClick={(e) => handleSubmit(onSubmit)(e)}
        >
          Add
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};
