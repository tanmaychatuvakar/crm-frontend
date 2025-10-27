import { AppDialog, Textarea, Button } from "../shared";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { useCreateUnpublishRequestMutation } from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type ComponentParams = {
  onClose: () => void;
  open: boolean;
  id: string | undefined;
};

const schema = z.object({
  comments: z.string().min(1),
});
export type CreateUnpublishRequestDto = z.infer<typeof schema>;

const RequestUnpublishListingDialog = ({
  onClose,
  open,
  id,
  ...rest
}: ComponentParams) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUnpublishRequestDto>({
    resolver: zodResolver(schema),
  });

  const [mutate, { isLoading }] = useCreateUnpublishRequestMutation();

  const navigate = useNavigate();

  const onSubmit = async (data: CreateUnpublishRequestDto) => {
    try {
      await mutate({ listingId: id!, comments: data.comments }).unwrap();
      onClose();
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
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
            <Button isLoading={isLoading} className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </AppDialog>
  );
};

export default RequestUnpublishListingDialog;
