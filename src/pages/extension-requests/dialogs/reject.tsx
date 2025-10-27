import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { useRejectExtensionRequestMutation } from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppDialog, Button, Input } from "@/components/shared";

const formSchema = z.object({
  rejectionReason: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const RejectDialog: React.FC<{
  id: string;
  open: boolean;
  onClose: () => any;
}> = ({ id, open, onClose }) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [mutate, { isLoading }] = useRejectExtensionRequestMutation();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({ id, rejectionReason: data.rejectionReason }).unwrap();
        navigate(-1);
      } catch (err) {
        console.error(err);
      }
    },
    [id]
  );

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Reject Extension Request</AppDialog.Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-5">
          <div className="mt-4">
            <Input
              label="Reason"
              placeholder="Reason"
              error={errors.rejectionReason?.message}
              {...register("rejectionReason")}
            />
          </div>
          <div className="text-right">
            <Button
              isLoading={isLoading}
              className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </AppDialog>
  );
};
