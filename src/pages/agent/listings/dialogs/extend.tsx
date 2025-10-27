import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateExtensionRequestMutation } from "@/app/services/api";
import { AppDialog, Button, Textarea } from "@/components/shared";

const formSchema = z.object({
  comments: z.string().min(1),
});
export type FormValues = z.infer<typeof formSchema>;

export const ExtendDialog: React.FC<{
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

  const [mutate, { isLoading }] = useCreateExtensionRequestMutation();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({ listingId: id, comments: data.comments }).unwrap();
        onClose();
        navigate(-1);
      } catch (err) {
        console.error(err);
      }
    },
    [id]
  );

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Extend Expiration </AppDialog.Title>
      <AppDialog.Description>
        Send a request to extend listing expiration date{" "}
      </AppDialog.Description>

      <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Textarea
            label="Comments"
            placeholder="Comments"
            error={errors.comments?.message}
            {...register("comments")}
          />
        </div>
        <div className="text-right mt-6">
          <Button
            isLoading={isLoading}
            className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
          >
            Save
          </Button>
        </div>
      </form>
    </AppDialog>
  );
};
