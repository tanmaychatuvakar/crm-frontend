import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useRejectUnpublishRequestMutation } from "@/app/services/api";
import { AppDialog, Button, Input } from "@/components/shared";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  rejectionReason: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const RejectDialog: React.FC<{
  id: string;
  open: boolean;
  onClose: () => any;
}> = ({ id, onClose, open }) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [mutate, { isLoading }] = useRejectUnpublishRequestMutation();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({ id, rejectionReason: data.rejectionReason });
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
        <div className="flex flex-col gap-y-5 mt-4">
          <Input
            label="Reason"
            placeholder="Reason"
            error={errors.rejectionReason?.message}
            {...register("rejectionReason")}
          />

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
