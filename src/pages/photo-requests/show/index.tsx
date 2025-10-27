import { useMemo, useState } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";

import { useParams } from "react-router-dom";

import { useGetPhotoRequestQuery } from "@/app/services/api";
import { GetPhotoRequestPayload } from "@/types/photo-request.type";
import { ListingForm } from "@/components/listing-form";
import { formatFormValues } from "@/pages/agent/listings/edit";
import { PreviewDialog } from "../dialogs/preview";

import { PreviewDialog as PhotoshootPreviewDialog } from "../../photoshoots/dialogs/preview";

type PhotoRequest = GetPhotoRequestPayload<{ listing: true; photoshoot: true }>;

export const Show = () => {
  const { id } = useParams();

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [photoshootDialogOpen, setPhotoshootDialogOpen] = useState(false);

  const { data } = useGetPhotoRequestQuery({
    id: id as string,
    include: "listing,photoshoot",
  });

  const photoRequest = data as PhotoRequest | undefined;

  const values = useMemo(() => {
    if (photoRequest) return formatFormValues(photoRequest.listing);
  }, [photoRequest]);

  if (!photoRequest) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <PageHeading className="mb-1">Preview</PageHeading>
          <PageDescription>Preview the Listing</PageDescription>
        </div>

        <div className="flex gap-2 items-center">
          {photoRequest.photoshoot?.status === "PHOTOS_EDITED" ? (
            <Button onClick={() => setPhotoshootDialogOpen(true)}>
              View Photoshoot
            </Button>
          ) : null}

          <Button onClick={() => setPreviewDialogOpen(true)}>
            View Photo Request
          </Button>

          <PreviewDialog
            open={previewDialogOpen}
            onClose={() => setPreviewDialogOpen(false)}
          />
          {photoRequest.photoshoot && (
            <PhotoshootPreviewDialog
              open={photoshootDialogOpen}
              onClose={() => setPhotoshootDialogOpen(false)}
              photoshoot={photoRequest.photoshoot}
            />
          )}
        </div>
      </div>

      <ListingForm values={values} disabled />
    </div>
  );
};
