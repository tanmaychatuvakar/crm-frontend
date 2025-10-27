import { useForm } from "react-hook-form";
import { HiOutlineEnvelope } from "react-icons/hi2";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/shared";

const formSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string(),
  email: z.string().email(),
});

export type FormValues = z.infer<typeof formSchema>;

export const ProfileForm: React.FC<{
  values: { name: string; email: string; phoneNumber: string };
  onSubmit: (values: FormValues) => any;
  loading: boolean;
}> = ({ values, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-3">
        <div>
          <Input
            label="Name"
            placeholder="Name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div>
          <Input
            label="Email"
            placeholder="Email"
            disabled
            suffix={<HiOutlineEnvelope className="text-gray-600" />}
            value={values.email}
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            placeholder="Phone Number"
            type="number"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
        </div>

        <div className="text-right">
          <Button
            className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            isLoading={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
