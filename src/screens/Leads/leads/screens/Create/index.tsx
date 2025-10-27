import { useCallback, useMemo } from "react";
import { PageDescription, PageHeading } from "@/components/shared";
import { useForm } from "react-hook-form";

import { LeadForm } from "@/components/Leads/LeadForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLeadMutation } from "@/app/services/api";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  //-- Contact
  title: z.string().min(1, "Title is required"),
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  phoneNumber: z.string(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  nationalityId: z.string(),
  language: z.string().min(1, "Language is required"),
  type: z.string().min(1, "Type is required"),
  sourceId: z.string(),
  subsource: z.string(),

  //-- Listing
  listingId: z.string().min(1, "Listing is required"),

  //--- Preference
  cityId: z.string().min(1, "City is required"),
  communityId: z.string().min(1, "Community is required"),
  subcommunityId: z.string(),
  propertyId: z.string(),
  categoryId: z.string().min(1, "Category is required"),

  minBedrooms: z.number({ message: "Minumum bedrooms is required" }),
  maxBedrooms: z.number({ message: "Maximum bedrooms is required" }),
  minPrice: z.number({ message: "Minimum price is required" }),
  maxPrice: z.number({ message: "Maximum price is required" }),
  minArea: z.number({ message: "Minimum area is required" }),
  maxArea: z.number({ message: "Maximum area is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export const Create = () => {
  const navigate = useNavigate();
  const [createLead] = useCreateLeadMutation();

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
  });

  const stepsProps = useMemo(() => {
    return {
      register,
      control,
      errors,
      watch,
      getValues,
      setValue,
      mode: "create",
      disabled: false,
      resetField,
    };
  }, [register, control, errors, watch, getValues, resetField, setValue]);

  const handleOnSubmit = useCallback(async (data: FormValues) => {
    try {
      await createLead(data).unwrap();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div>
      <div className="mb-8">
        <PageHeading>Create Lead</PageHeading>
        <PageDescription>
          Fill in the required fields
          <span className="text-red-500">(*) </span>
          to create a new lead
        </PageDescription>
      </div>

      <LeadForm
        stepsProps={stepsProps}
        onSubmit={handleSubmit(handleOnSubmit)}
      />
    </div>
  );
};
