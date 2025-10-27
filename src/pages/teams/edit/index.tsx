import {
  useGetTeamQuery,
  useGetUsersQuery,
  useUpdateTeamMutation,
} from "@/app/services/api";
import { MultiSelect } from "@/components/multi-select";
import { Button, Error, Input } from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  users: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const Edit = () => {
  const { id } = useParams();

  const { data: team } = useGetTeamQuery({ id: id!, include: "users" });

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: team?.name || "",
      users: team?.users.map((user) => user.id) || [],
    },
  });

  const { data } = useGetUsersQuery({
    flat: true,
  });
  const [mutate, { isLoading }] = useUpdateTeamMutation();

  const items = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.data.map((user) => ({
      id: user.id,
      value: user.name,
    }));
  }, [data]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({ id: id!, ...data }).unwrap();
        navigate("/teams");
      } catch {
        toast.error("Could not update team");
      }
    },
    [id]
  );

  return (
    <div>
      <p className="mb-12 text-xl">Create Team</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Name" label="Name" {...register("name")} />
          {errors.name && <Error error={errors.name.message} />}
        </div>
        <div>
          <Controller
            control={control}
            name="users"
            render={({ field: { onChange, value } }) => (
              <MultiSelect items={items} values={value} onChange={onChange} />
            )}
          />
        </div>
        <div className="text-right mt-4">
          <Button className="inline-block" type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
