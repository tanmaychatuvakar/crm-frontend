import React, { useCallback, useMemo, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { AppSelect, Button, Input } from "@/components/shared";

import { css, getBudgetDropdownOptions } from "@/utils";

import { IoChevronDown } from "react-icons/io5";

import { QualifyProps } from "./props";
import { z } from "zod";
import {
  useGetCommonQuery,
  useUpdateQualificationMutation,
} from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  budget: z.string(),
  customerType: z.string(),
  nationalityId: z.string(),
  levelOfInterest: z.string(),
  timeline: z.string(),
  spokenLanguage: z.string().min(1, "Language is required"),
  finance: z.string().optional(),
  buyerType: z.string().optional(),
});

const options = {
  timeline: [
    { label: "5 Months+", value: "1" },
    { label: "4 Months", value: "2" },
    { label: "3 Months", value: "3" },
    { label: "2 Months", value: "4" },
    { label: "1 Month", value: "5" },
  ],
  levelOfInterest: [
    { label: "Not Interested", value: "1" },
    { label: "Shopping", value: "2" },
    { label: "Interested", value: "3" },
    { label: "Serious", value: "4" },
    { label: "Very Serious", value: "5" },
  ],
  customerType: [{ label: "Tenant", value: "TENANT" }],
};

type FormValues = z.infer<typeof formSchema>;

export const Qualify: React.FC<QualifyProps> = ({
  qualification,
  disabled,
}) => {
  const { data } = useGetCommonQuery();
  const [updateQualification, { isLoading: isUpdating }] =
    useUpdateQualificationMutation();

  const values = useMemo(() => {
    if (qualification && qualification.qualifiedAt) {
      return {
        buyerType: qualification.buyerType ?? "",
        finance: qualification.finance ?? "",
        budget: qualification.budget.toString(),
        customerType: qualification.customerType,
        levelOfInterest: qualification.levelOfInterest.toString(),
        nationalityId: qualification.nationalityId,
        spokenLanguage: qualification.spokenLanguage,
        timeline: qualification.timeline.toString(),
      };
    }
    return;
  }, [qualification]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values,
    disabled,
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await updateQualification({
          leadId: qualification?.leadId as string,
          budget: +data.budget,
          customerType: data.customerType,
          nationalityId: data.nationalityId,
          levelOfInterest: +data.levelOfInterest,
          timeline: +data.timeline,
          spokenLanguage: data.spokenLanguage,
          finance: data.finance ?? "",
          buyerType: data.buyerType ?? "",
        }).unwrap();
      } catch (err) {
        console.error(err);
      }
    },
    [qualification]
  );

  const [isQualifyOpen, setIsQualifyOpen] = useState(false);

  const budgets = useMemo(() => {
    const listing = qualification?.lead.listing;
    if (!qualification || !listing) return [];
    return getBudgetDropdownOptions(
      listing.isSale ? listing.salePrice! : listing.rentalPrice!
    );
  }, [qualification]);

  if (!data) {
    return;
  }

  return (
    <div className="bg-white border rounded-sm shadow-sm px-5 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <button
            className={css({ "rotate-180": isQualifyOpen })}
            onClick={() => setIsQualifyOpen(!isQualifyOpen)}
          >
            <IoChevronDown size={18} />
          </button>
          <p className="font-medium">Qualify</p>
        </div>

        <div className="space-x-1.5">
          <Button
            size="sm"
            className={css({
              "cursor-not-allowed": disabled,
            })}
            onClick={handleSubmit(onSubmit)}
            disabled={isUpdating || disabled}
          >
            <span>Save</span>
          </Button>
          <Button size="sm" onClick={() => setIsQualifyOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>

      {isQualifyOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6">
              <Controller
                control={control}
                name="budget"
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Budget"
                    placeholder="Budget"
                    options={budgets}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Controller
                control={control}
                name="customerType"
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Customer Type"
                    placeholder="Customer Type"
                    options={options.customerType}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                control={control}
                name="levelOfInterest"
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Interest Level"
                    placeholder="Interest Level"
                    error={error?.message}
                    options={options.levelOfInterest}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                control={control}
                name="timeline"
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Timeline"
                    placeholder="Timeline"
                    error={error?.message}
                    options={options.timeline}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Controller
                control={control}
                name="nationalityId"
                render={({
                  field: { onChange, value, disabled },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Nationality"
                    placeholder="Nationality"
                    options={data.nationalities}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="col-span-6">
              <Input
                label="Language"
                placeholder="Spoken Language"
                error={errors.spokenLanguage?.message}
                {...register("spokenLanguage", { disabled })}
              />
            </div>

            {/* <div className="col-span-12">
              <Controller
                control={control}
                name="agentId"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Agent"
                    placeholder="Agent"
                    // error={errors.interestLevel?.message}
                    options={[]}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div> */}
          </div>
        </form>
      )}
    </div>
  );
};
