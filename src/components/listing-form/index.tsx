import { z } from "zod";
import { useForm, DefaultValues, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Base } from "./base";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

export const formSchema = z.object({
  isRental: z.boolean(),
  isSale: z.boolean(),
  isRented: z.boolean().default(false),

  cityId: z.string().optional(),
  communityId: z.string().optional(),
  subcommunityId: z.string().optional(),
  propertyId: z.string().optional(),

  sourceId: z.string().optional(),

  title: z.string().min(1, "Title is required"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  unitNumber: z.string().optional(),
  totalArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .optional(),

  plotArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .optional(),

  numberOfBedrooms: z.number().int().optional(),
  numberOfBathrooms: z.number().int().optional(),
  floor: z.number().int().optional(),
  view: z.string().optional(),
  str: z.string().optional(),
  furnished: z.string().optional(),
  features: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  amenities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),

  appliances: z.boolean().default(false),
  parking: z.number().int().max(99, "Max parkings allowed is 99").optional(),

  streetNumber: z.string().optional(),
  serviceCharge: z
    .number()
    .int()
    .max(2147483647, "Max value allowed is 2147483647")
    .optional(),

  contactId: z.string().optional(),
  fitted: z.string().optional(),

  askForPrice: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isCommercial: z.boolean().default(false),

  pricePerSqft: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .optional(), // is this for both sale and rental?

  propertyStatus: z.string().optional(),
  salePrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .optional(),

  rentedFrom: z.string().optional(),
  rentedUntil: z.string().optional(),
  rentedPrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .optional(),

  rentedCheques: z.number().int().optional(),
  tenant: z.string().optional(),

  rentalPrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .optional(),

  rentalCheques: z.number().int().optional(),
  rentalLeaseTerm: z.string().optional(),
  rentalAvailableFrom: z.string().optional(),

  brokerContractRentalDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  brokerContractSaleDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  titleDeedDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  poaDocument: z.object({ fileName: z.string(), path: z.string() }).nullable(),
  ownerIdDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  otherDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
});

export type FormValues = z.infer<typeof formSchema>;

export const ListingForm: React.FC<{
  values?: FormValues;
  defaultValues?: DefaultValues<FormValues>;
  onSubmit?: (values: FormValues) => any;
  type?: string;
  errors?: FieldErrors<FormValues>;
  disabled?: boolean;
  mode?: string;
}> = ({
  values,
  defaultValues,
  onSubmit,
  type,
  disabled,
  errors: defaultErrors,
  mode,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    resetField,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    errors: defaultErrors,
    defaultValues,
    disabled,
    values,
  });

  useEffect(() => {
    if (Object.keys(errors).includes("title")) {
      toast.warn("Please enter a Title");
    }
  }, [errors]);

  const handleOnSubmit = useMemo(() => {
    if (!onSubmit) {
      return undefined;
    }
    return handleSubmit(onSubmit);
  }, [handleSubmit, onSubmit]);

  return (
    <Base
      register={register}
      control={control}
      errors={errors}
      watch={watch}
      getValues={getValues}
      setValue={setValue}
      resetField={resetField}
      type={type}
      onSubmit={handleOnSubmit}
      mode={mode}
    />
  );
};
