import {
  Input,
  Textarea,
  Checkbox,
  Button,
  AppDialog,
} from "@/components/shared";

import { Controller, useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePhotoRequestMutation } from "@/app/services/api";
import { z } from "zod";
import { useCallback, useState } from "react";

import Datetime from "react-datetime";
import moment from "moment";

const formSchema = z.object({
  scheduledAt: z
    .any()
    .refine((arg) => moment.isMoment(arg), "Invalid datetime")
    .transform((arg) => arg.toISOString()),
  occupancy: z.string(),
  keyLocation: z.string().min(1, "Location of Key is required"),
  buildingAccessCardLocation: z
    .string()
    .min(1, "Building Access Card Location is required"),
  parkingAccessCardLocation: z.string(),
  comments: z.string(),
  isBrokerPresent: z.boolean(),
});
export type FormValues = z.infer<typeof formSchema>;

export const CreateDialog: React.FC<{
  id: string;
  open: boolean;
  onClose: () => any;
}> = ({ id, open, onClose }) => {
  const navigate = useNavigate();

  const [mutate, { isLoading }] = useCreatePhotoRequestMutation();
  const [unitReady, setUnitReady] = useState(false);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({
          ...data,
          listingId: id,
        }).unwrap();
        toast.success("Photo request is submitted successfully");
        navigate(-1);
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    [id]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledAt: "",
      comments: "",
      occupancy: "",
      keyLocation: "",
      buildingAccessCardLocation: "",
      parkingAccessCardLocation: "",
      isBrokerPresent: false,
    },
  });

  console.log(errors);

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Photo Request</AppDialog.Title>
      <AppDialog.Description>
        Fill in the required fields<span className="text-red-500">(*)</span> to
        create a new photo request
      </AppDialog.Description>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-6">
            <Controller
              name="scheduledAt"
              control={control}
              render={({ field: { value, onChange, ref } }) => (
                <Datetime
                  value={value}
                  onChange={onChange}
                  inputProps={{
                    className: "w-full",
                    placeholder: "Schedule",
                  }}
                  ref={ref}
                />
              )}
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Occupancy"
              placeholder="occupancy"
              {...register("occupancy")}
              error={errors.occupancy?.message}
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Key Location"
              placeholder="Key Location"
              {...register("keyLocation")}
              error={errors.keyLocation?.message}
              required
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Building Access Card"
              placeholder="Building Access Card"
              {...register("buildingAccessCardLocation")}
              error={errors.buildingAccessCardLocation?.message}
              required
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Parking Access Card"
              placeholder="Parking Access Card"
              {...register("parkingAccessCardLocation")}
              error={errors.parkingAccessCardLocation?.message}
            />
          </div>

          <div className="col-span-6">
            <Textarea
              label="Comments"
              placeholder="Comments"
              {...register("comments")}
              error={errors.comments?.message}
            />
          </div>

          <div className="col-span-6">
            <Checkbox
              label="Broker will be present"
              {...register("isBrokerPresent")}
            />
          </div>

          <div className="col-span-6">
            <Checkbox
              label="I confirm the unit is clean and dressed for this photoshoot"
              onClick={() => setUnitReady(!unitReady)}
            />
          </div>

          <div className="col-span-6">
            <div className="flex gap-x-3 justify-end">
              <Button isLoading={isLoading} disabled={!unitReady}>
                Submit
              </Button>

              <Button onClick={onClose} type="button">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </AppDialog>
  );
};
