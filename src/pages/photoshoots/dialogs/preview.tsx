import { useApprovePhotoshootMutation } from "@/app/services/api";
import PhotoshootsStep from "@/components/listings/ListingSteps/photoshoots";
import { ReAssignDialog } from "@/components/Re-assignDialog";
import { AppDialog, Button } from "@/components/shared";
import { Image } from "@/types/image.type";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

type Photoshoot = {
  id: string;
  status: string;
  editorImages: Image[];
  photographerImages: Image[];
};

export const PreviewDialog: React.FC<{
  open: boolean;
  onClose: () => any;
  photoshoot: Photoshoot;
}> = ({ open, onClose, photoshoot }) => {
  const [mutate, { isLoading }] = useApprovePhotoshootMutation();

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOnClick = useCallback(async () => {
    try {
      await mutate(photoshoot.id).unwrap();
      onClose();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  }, [photoshoot, onClose]);

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Photoshoots</AppDialog.Title>
      <AppDialog.Description>
        Review the photoshoots before approving
      </AppDialog.Description>
      <div className="flex flex-col justify-center items-start gap-4">
        <PhotoshootsStep
          photographerImages={photoshoot.photographerImages}
          editorImages={photoshoot.editorImages}
        />
        {photoshoot.status === "PHOTOS_EDITED" && (
          <div className="flex gap-2 w-full justify-end">
            <Button
              onClick={handleOnClick}
              isLoading={isLoading}
              disabled={
                !photoshoot.photographerImages.length ||
                !photoshoot.editorImages.length
              }
            >
              Approve
            </Button>
            {photoshoot.status === "PHOTOS_EDITED" && (
              <Button
                onClick={() => setDialogOpen(true)}
                disabled={
                  !photoshoot.photographerImages.length ||
                  !photoshoot.editorImages.length
                }
              >
                Re-assign
              </Button>
            )}
          </div>
        )}
      </div>
      <ReAssignDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        photoshootId={photoshoot.id}
      />
    </AppDialog>
  );
};
