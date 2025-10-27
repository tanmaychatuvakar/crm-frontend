import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { useCreateUnpublishRequestMutation } from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useCallback } from "react";
import { AppDialog, Button, Textarea } from "@/components/shared";

const formSchema = z.object({
  comments: z.string().min(1),
});
export type FormValues = z.infer<typeof formSchema>;

export const UnpublishDialog: React.FC<{
  open: boolean;
  onClose: () => any;
  id: string;
}> = ({ onClose, open, id }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [mutate, { isLoading }] = useCreateUnpublishRequestMutation();

  const navigate = useNavigate();

  const onSubmit = useCallback(async (data: FormValues) => {
    try {
      await mutate({ listingId: id!, comments: data.comments }).unwrap();
      onClose();
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Request Unpublish Listing</AppDialog.Title>
      <AppDialog.Description>
        Send a request to unpublish listing
      </AppDialog.Description>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-5 mt-4">
          <div>
            <Textarea
              label="Comments"
              placeholder="Comments"
              {...register("comments")}
              error={errors.comments?.message}
            />
          </div>
          <div className="text-right">
            <Button
              isLoading={isLoading}
              className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </AppDialog>
  );
};
