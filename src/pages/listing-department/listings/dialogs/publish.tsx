import { usePublishListingMutation } from "@/app/services/api";
import { AppDialog, Button, Input } from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  trakheesi: z
    .string()
    .regex(/^\d{10,11}$/, "Trakheesi number should consist of 10 or 11 digits"),
});
type FormValues = z.infer<typeof formSchema>;

export const PublishDialog: React.FC<{
  listingId: string;
  open: boolean;
  onClose: () => any;
}> = ({ listingId, open, onClose }) => {
  const navigate = useNavigate();
  const [mutate, { isLoading }] = usePublishListingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleOnSubmit = useCallback(
    async (values: FormValues) => {
      try {
        await mutate({ id: listingId as string, trakheesi: values.trakheesi });
        navigate(-1);
      } catch (err) {
        console.error(err);
      }
    },
    [listingId, navigate]
  );

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Publish</AppDialog.Title>
      <AppDialog.Description>
        Set a permit number and proceed with publishing
      </AppDialog.Description>
      <form className="mt-6" onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          label="Trakheesi"
          error={errors.trakheesi?.message}
          placeholder="Trakheesi"
          type="number"
          {...register("trakheesi", { required: true })}
        />
        <div className="text-right mt-6">
          <Button
            className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            isLoading={isLoading}
            type="submit"
          >
            Publish
          </Button>
        </div>
      </form>
    </AppDialog>
  );
};
