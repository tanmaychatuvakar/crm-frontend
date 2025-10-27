import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { AppDialog, Button, Textarea } from "@/components/shared";

import { ExtensionDialogProps } from "./props";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLeadExtensionRequestMutation } from "@/app/services/api";

const formSchema = z.object({
  reason: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export const ExtensionDialog: React.FC<ExtensionDialogProps> = ({
  open,
  onClose,
  leadId,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  console.log("=>", { leadId });

  const [mutate, { isLoading }] = useCreateLeadExtensionRequestMutation();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({ leadId, reason: data.reason }).unwrap();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    [leadId, onClose]
  );

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Extension Request</AppDialog.Title>
      <AppDialog.Description>
        Submit a lead extension request
      </AppDialog.Description>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Textarea
            {...register("reason")}
            label="Reason"
            placeholder="Reason"
            error={errors.reason?.message}
          />
        </div>
        <div className="flex justify-end mt-2.5">
          <Button variant="secondary" isLoading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </AppDialog>
  );
};
