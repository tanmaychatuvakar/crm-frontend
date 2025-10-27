import { useMemo } from "react";
import { AppDialog } from "../shared";
import { UploadPhotosDialogProps } from "./UploadPhotosDialog.props";

import { UploadPhotosForm } from "./Form";

import { useSubmitPhotoshootMutation } from "@/app/services/api";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Roles } from "@/constants/roles";

export const UploadPhotosDialog: React.FC<UploadPhotosDialogProps> = ({
  onClose,
  data,
  mode = "create",
  ...rest
}: any) => {
  const role = useAppSelector((state) => state.auth.user?.role);

  const [submitPhotoshoot] = useSubmitPhotoshootMutation();

  const photoshootId = data?.id || "";

  const createMode = useMemo(() => mode == "create", [mode]);

  const handleSubmit = async () => {
    try {
      await submitPhotoshoot(photoshootId).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} {...rest}>
      <AppDialog.Title>
        {createMode ? "Upload Images" : "Uploaded Images"}
      </AppDialog.Title>
      <AppDialog.Description>
        {createMode
          ? "Upload images to be able to submit"
          : "Preview uploaded images"}
      </AppDialog.Description>
      <UploadPhotosForm
        onSubmit={handleSubmit}
        onClose={onClose}
        images={
          role === Roles.PHOTOGRAPHER
            ? data?.photographerImages
            : data?.editorImages
        }
        showPhotographerImages={role === Roles.EDITOR && mode === "create"}
        data={data}
        mode={mode}
      />
    </AppDialog>
  );
};
