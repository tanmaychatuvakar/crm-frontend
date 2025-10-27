import React from "react";
import { AppDialog, Button, Input } from "../shared";
import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";
import { RejectPhotoRequestDialogProps } from "./Props";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRejectPhotoRequestMutation } from "@/app/services/api";


const schema = z.object({
  rejectionReason: z.string().min(1),
});
export type RejectPhotoshootDto = z.infer<typeof schema>;

const RejectPhotoshootDialog: React.FC<RejectPhotoRequestDialogProps> = ({
  onClose,
  open,
}) => {
  const navigate = useNavigate();
  const [reject, { isLoading }] = useRejectPhotoRequestMutation();
  const { photoRequestId } = useParams();

  const { handleSubmit, register, formState: {errors} } = useForm<RejectPhotoshootDto>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RejectPhotoshootDto) => {
    try {
      await reject({
        id: photoRequestId!,
        rejectionReason: data.rejectionReason,
      }).unwrap();
      onClose();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Reject Photo Request</AppDialog.Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-5 mt-4">
          <Input label="Reason" placeholder="Reason" error={errors.rejectionReason?.message} {...register("rejectionReason")} />
        <div className="text-right">
          <Button isLoading={isLoading} className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white">
              Confirm
          </Button>
        </div>
        </div>
      </form>
    </AppDialog>
  );
};

export default RejectPhotoshootDialog;
