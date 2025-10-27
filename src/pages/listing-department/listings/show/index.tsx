import { useMemo, useState } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";
import { useParams } from "react-router-dom";

import { useGetListingQuery } from "@/app/services/api";
import { GetListingPayload } from "@/types/listing.type";

import { formatFormValues } from "@/pages/agent/listings/edit";
import { ListingForm } from "@/components/listing-form";
import { PublishDialog } from "../dialogs/publish";

export const Show: React.FC = () => {
  const { id } = useParams();

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const { data } = useGetListingQuery({
    listingId: id as string,
    include:
      "features,amenities,photoshoot,extensionRequests,unpublishRequests",
  });

  const listing = data as
    | GetListingPayload<{
        features: true;
        amenities: true;
        photoshoot: true;
        extensionRequests: true;
        unpublishRequests: true;
      }>
    | undefined;

  const values = useMemo(() => {
    if (listing) return formatFormValues(listing);
  }, [listing]);

  const type = useMemo(() => {
    if (!listing) return undefined;
    return listing.isSale ? "sale" : "rental";
  }, [listing]);

  if (!listing) {
    return <p>Loading ...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between mb-8">
        <div>
          <PageHeading className="mb-1">Preview</PageHeading>
          <PageDescription>This is the preview page</PageDescription>
        </div>
        {listing.status === "AWAITING_PUBLISH" && (
          <Button onClick={() => setPublishDialogOpen(true)}>Publish</Button>
        )}
      </div>
      <ListingForm type={type} values={values} disabled />
      {listing && (
        <PublishDialog
          listingId={listing.id}
          open={publishDialogOpen}
          onClose={() => setPublishDialogOpen(false)}
        />
      )}
    </div>
  );
};
