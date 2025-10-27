import React from "react";

import { AppDialog, Button } from "../shared";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { AppSelect } from "../shared";
import { AssignDialogProps } from "./Props";
import {
  useAssignPhotoshootMutation,
  useGetPhotoEditorsQuery,
  useGetPhotographersQuery,
} from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  editorId: z.string().uuid(),
  photographerId: z.string().uuid(),
});
export type AssignDto = z.infer<typeof schema>;

export const AssignDialog: React.FC<AssignDialogProps> = ({
  onClose,
  open,
  photoRequest,
}) => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignDto>({
    resolver: zodResolver(schema),
  });

  const { data: photoEditors } = useGetPhotoEditorsQuery();
  const { data: photographers } = useGetPhotographersQuery();

  const [mutate, { isLoading }] = useAssignPhotoshootMutation();

  const onSubmit = async (data: AssignDto) => {
    try {
      await mutate({
        id: photoRequest?.photoshoot?.id,
        editorId: data.editorId,
        photographerId: data.photographerId,
      }).unwrap();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Photoshoot</AppDialog.Title>
      <AppDialog.Description>
        Assign photoshoot to a photographer and an editor
      </AppDialog.Description>

      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Controller
            control={control}
            name="photographerId"
            render={({ field: { onChange, value } }) => (
              <AppSelect
                label="Photographer"
                placeholder="Photographer"
                error={errors.photographerId?.message}
                options={photographers || []}
                value={photographers?.find((photographer) => photographer.value === value)?.value ?? ''}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="editorId"
            render={({ field: { onChange,  value } }) => (
              <AppSelect
                label="Editor"
                placeholder="Editor"
                error={errors.editorId?.message}
                options={photoEditors || []}
                value={photoEditors?.find((photoEditor) => photoEditor.value === value)?.value ?? ''}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="text-right mt-6">
          <Button
            className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white"
            isLoading={isLoading}
          >
            Assign
          </Button>
        </div>


      </form>
    </AppDialog>
  );
};
