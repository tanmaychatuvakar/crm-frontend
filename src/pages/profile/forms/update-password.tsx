import { Button, Input } from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(1),
    confirmPassword: z.string().min(1),
  })

  .refine((args) => args.confirmPassword === args.newPassword, {
    message: "Passwords mismatch",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;

export const UpdatePasswordForm: React.FC<{
  onSubmit: (values: FormValues) => any;
  loading: boolean;
}> = ({ loading, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-3">
        <div>
          <Input
            label="Current Password"
            type="password"
            placeholder="Current Password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
        </div>

        <div>
          <Input
            label="New Password"
            placeholder="New Password"
            type="password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
        </div>

        <div>
          <Input
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="text-right">
          <Button
            className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            isLoading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
};
