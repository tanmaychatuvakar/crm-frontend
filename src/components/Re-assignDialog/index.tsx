import { AppDialog, Button, Textarea } from "../shared";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AppSelect } from "../shared";
import React from "react";
import { AssignDialogProps } from "./Props";
import { Roles } from "@/constants/roles";
import { useReAssignPhotoshootMutation } from "@/app/services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const options = [
  { label: "Photographer", value: Roles.PHOTOGRAPHER },
  { label: "Editor", value: Roles.EDITOR },
];

const schema = z.object({
  rejectionReason: z.string().min(1),
  assignTo: z.string(),
});
export type ReAssignDto = z.infer<typeof schema>;

export const ReAssignDialog: React.FC<AssignDialogProps> = ({
  onClose,
  photoshootId,
  open,
}) => {
  const [reassign, { isLoading }] = useReAssignPhotoshootMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ReAssignDto>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ReAssignDto) => {
    const { assignTo, rejectionReason } = values;
    try {
      await reassign({
        id: photoshootId,
        assignTo,
        rejectionReason,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Photoshoot</AppDialog.Title>
      <AppDialog.Description>
        Assign photoshoot to a photographer and an editor
      </AppDialog.Description>

      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-4">
          <Textarea
            label="Reason"
            placeholder="Reason"
            error={errors.rejectionReason?.message}
            {...register("rejectionReason")}
          />
        </div>

        <div className="mt-4">
          <Controller
            control={control}
            name="assignTo"
            render={({ field: { onChange, value } }) => (
              <AppSelect
                label="Re-Assign To"
                placeholder="Re-Assign To"
                error={errors.assignTo?.message}
                options={options}
                value={
                  options.find((option) => option.value === value)?.value ?? ""
                }
                onChange={onChange}
              />
            )}
          />
        </div>

        <Button isLoading={isLoading}>Submit</Button>
      </form>
    </AppDialog>
  );
};
