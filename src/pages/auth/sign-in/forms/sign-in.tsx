import { useForm } from "react-hook-form";

import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/shared";

const formSchema = z.object({
  email: z.string().min(1, "Required").email(),
  password: z.string().min(1, "Required"),
});

export type FormValues = z.infer<typeof formSchema>;

export const SignInForm: React.FC<{
  loading: boolean;
  onSubmit: (values: FormValues) => any;
}> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 mb-8">
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          {...register("password")}
          suffix={
            <span
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <HiEye /> : <HiEyeOff />}
            </span>
          }
        />
      </div>
      <Button variant="secondary" className="w-full" isLoading={loading}>
        Submit
      </Button>
    </form>
  );
};
