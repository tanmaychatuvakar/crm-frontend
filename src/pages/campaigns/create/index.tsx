import {
  useCreateCampaignMutation,
  useGetCommonQuery,
  useGetTeamsQuery,
} from "@/app/services/api";
import {
  AppSelect,
  Button,
  Error,
  Input,
  Label,
  PageDescription,
  PageHeading,
} from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  sourceId: z.string(),
  teamId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const Create = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [create, { isLoading: isCreating }] = useCreateCampaignMutation();

  const { data: common, isLoading: isCommonLoading } = useGetCommonQuery();
  const { data, isLoading: isTeamsLoading } = useGetTeamsQuery({
    flat: true,
  });

  const onSubmit = async (data: FormValues) => {
    await toast.promise(create(data), {
      pending: "Loading",
      success: "Campaign created",
      error: "Error occured while creating the campaign",
    });
    navigate("/campaigns");
  };

  const teams = useMemo(() => {
    if (data) {
      return data.data.map((team) => ({
        label: team.name,
        value: team.id,
      }));
    }
    return [];
  }, [data]);

  return (
    <div>
      <div className="my-4">
        <PageHeading>Campaigns</PageHeading>
        <PageDescription>Create a new Campaign</PageDescription>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input placeholder="Name" label="Name" {...register("name")} />
          {errors.name && <Error error={errors.name.message} />}
        </div>
        <div>
          <Label htmlFor="sourceId" required>
            Source
          </Label>
          <Controller
            control={control}
            name="sourceId"
            render={({ field: { value, onChange } }) => (
              <AppSelect
                options={common?.sources}
                loading={isCommonLoading}
                value={value}
                onChange={onChange}
              />
            )}
          />
          {errors.sourceId && <Error error={errors.sourceId.message} />}
        </div>
        <div>
          <Label htmlFor="teamId" required>
            Team
          </Label>
          <Controller
            control={control}
            name="teamId"
            render={({ field: { value, onChange } }) => (
              <AppSelect
                options={teams}
                loading={isTeamsLoading}
                value={value}
                onChange={onChange}
              />
            )}
          />
          {errors.teamId && <Error error={errors.teamId.message} />}
        </div>
        <Button type="submit" className="float-right" isLoading={isCreating}>
          Create
        </Button>
      </form>
    </div>
  );
};
