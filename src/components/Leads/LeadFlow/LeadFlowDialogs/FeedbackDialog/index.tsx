import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

import { AppDialog, Button } from "@/components/shared";

import { FeedackDialogProps } from "./props";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { css } from "@/utils";
import { useUpdateFeedbackMutation } from "@/app/services/api";

const requiredFeedbacks = [
  { label: "Community", name: "community" },
  { label: "Location", name: "location" },
  { label: "Floor", name: "floor" },
  { label: "View", name: "view" },
  {
    label: "Floor Plan Layout",
    name: "floorPlanLayout",
  },
  { label: "Area (sqft)", name: "area" },
  { label: "Quality/Condition", name: "condition" },
  { label: "Price", name: "price" },
  {
    label: "Amenities/Facilities",
    name: "amenities",
  },
  { label: "Parking", name: "parking" },
  { label: "AC Type", name: "acType" },
];

const optionalFeedbacks = [
  { label: "Service Charge", name: "serviceCharge" },
  { label: "Furniture Condition", name: "furnitureCondition" },
  { label: "Appliances Condition", name: "appliancesCondition" },
];

const getRatingFeedback = (rating: number): string => {
  let feedback = "";
  switch (rating) {
    case 1:
      feedback = "Poor";
      break;
    case 2:
      feedback = "Below Average";
      break;
    case 3:
      feedback = "Average";
      break;
    case 4:
      feedback = "Above Average";
      break;
    case 5:
      feedback = "Excellent";
      break;
    default:
      feedback = "Please Select";
  }
  return feedback;
};

const FeedbackItem: React.FC<{
  value?: number | null;
  label: string;
  required: boolean;
  onChange: (value: number) => any;
  error: any;
}> = ({ value, label, onChange, error, required }) => {
  return (
    <div className="flex flex-col md:flex-row gap-y-1 md:gap-y-0 col-span-12">
      <div className="flex-1">
        <p className="font-light">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </p>
      </div>
      <div className="flex flex-1 items-center">
        <div
          className={`flex justify-between w-3/5 border border-opacity-60 py-2.5 px-5 rounded-sm cursor-pointer ${
            error ? "border-red-500" : "border-black"
          }`}
        >
          <button type="button" onClick={() => onChange(1)}>
            {value && value >= 1 ? (
              <FaStar size={20} fill="#FDE047" />
            ) : (
              <FaRegStar size={20} fill="#FDE047" />
            )}
          </button>
          <button type="button" onClick={() => onChange(2)}>
            {value && value >= 2 ? (
              <FaStar size={20} fill="#FDE047" />
            ) : (
              <FaRegStar size={20} fill="#FDE047" />
            )}
          </button>
          <button type="button" onClick={() => onChange(3)}>
            {value && value >= 3 ? (
              <FaStar size={20} fill="#FDE047" />
            ) : (
              <FaRegStar size={20} fill="#FDE047" />
            )}
          </button>
          <button type="button" onClick={() => onChange(4)}>
            {value && value >= 4 ? (
              <FaStar size={20} fill="#FDE047" />
            ) : (
              <FaRegStar size={20} fill="#FDE047" />
            )}
          </button>
          <button type="button" onClick={() => onChange(5)}>
            {value && value >= 5 ? (
              <FaStar size={20} fill="#FDE047" />
            ) : (
              <FaRegStar size={20} fill="#FDE047" />
            )}
          </button>
        </div>
        <p
          className={css(
            "text-sm text-center text-gray-800 cursor-default border-r border-t border-b border-opacity-60 w-32 py-2.5",
            { "border-red-500": error },
            { "border-black": !error }
          )}
        >
          {getRatingFeedback(value ?? 0)}
        </p>
      </div>
    </div>
  );
};

const formSchema = z.object({
  community: z.number().int().min(1).max(5),
  location: z.number().int().min(1).max(5),
  floor: z.number().int().min(1).max(5),
  view: z.number().int().min(1).max(5),
  floorPlanLayout: z.number().int().min(1).max(5),
  area: z.number().int().min(1).max(5),
  condition: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
  amenities: z.number().int().min(1).max(5),
  parking: z.number().int().min(1).max(5),
  acType: z.number().int().min(1).max(5),

  serviceCharge: z.number().int().min(1).max(5).nullable(),
  furnitureCondition: z.number().int().min(1).max(5).nullable(),
  appliancesCondition: z.number().int().min(1).max(5).nullable(),
});

export const FeedbackDialog: React.FC<FeedackDialogProps> = ({
  open,
  onClose,
  feedback,
  leadId,
}) => {
  const [mutate, { isLoading }] = useUpdateFeedbackMutation();
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: feedback,
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      console.log(data, feedback);
      if (!feedback) return;
      try {
        await mutate({
          ...data,
          viewingId: feedback.viewingId,
          leadId,
        }).unwrap();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    [feedback]
  );

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Feedback</AppDialog.Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-y-3 mt-8">
          {requiredFeedbacks.map((feedback) => (
            <Controller
              key={feedback.label}
              name={feedback.name as keyof z.infer<typeof formSchema>}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FeedbackItem
                  required
                  label={feedback.label}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          ))}
        </div>
        <h3>If Applicable</h3>
        <div className="grid grid-cols-12 gap-y-3 mt-8">
          {optionalFeedbacks.map((feedback) => (
            <Controller
              key={feedback.label}
              name={feedback.name as keyof z.infer<typeof formSchema>}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FeedbackItem
                  required={false}
                  label={feedback.label}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          ))}
        </div>
        <div className="flex justify-end gap-x-3 mt-5">
          <Button type="submit" isLoading={isLoading}>
            Update
          </Button>
          <Button onClick={onClose} type="button">
            Cancel
          </Button>
        </div>
      </form>
    </AppDialog>
  );
};
