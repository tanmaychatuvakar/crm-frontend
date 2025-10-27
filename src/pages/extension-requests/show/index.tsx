import { useCallback, useMemo, useState } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";

import { useNavigate, useParams } from "react-router-dom";

import { HiArrowLeft } from "react-icons/hi2";

import {
  useApproveExtensionRequestMutation,
  useGetExtensionRequestQuery,
} from "@/app/services/api";
import { GetExtensionRequestPayload } from "@/types/extension-request.type";
import { ListingForm } from "@/components/listing-form";
import { formatFormValues } from "@/pages/agent/listings/edit";
import { RejectDialog } from "../dialogs/reject";

type ExtensionRequest = GetExtensionRequestPayload<{
  listing: true;
}>;

export const Show = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mutate, { isLoading }] = useApproveExtensionRequestMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data } = useGetExtensionRequestQuery({
    extensionRequestId: id as string,
    include: "listing",
  });

  const extensionRequest = data as ExtensionRequest | undefined;

  const values = useMemo(
    () => formatFormValues(extensionRequest?.listing),
    [extensionRequest]
  );

  const handleOnClick = useCallback(async () => {
    try {
      await mutate(id as string).unwrap();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  if (!extensionRequest) {
    return <p>Loading ...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center justify-center mb-4 text-primary-500 hover:text-primary-400"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">
            <HiArrowLeft />
          </span>
          Back
        </button>
        {extensionRequest.status === "PENDING" ? (
          <div className="flex space-x-2">
            <Button
              onClick={handleOnClick}
              isLoading={isLoading}
              type="button"
              variant="primary"
            >
              Approve
            </Button>
            <Button onClick={() => setDialogOpen(true)} type="button">
              Reject
            </Button>
          </div>
        ) : null}
      </div>

      <div className=" mb-8">
        <PageHeading>Preview</PageHeading>
        <PageDescription>This is the preview page</PageDescription>
      </div>

      <ListingForm type="sale" values={values} disabled />

      <RejectDialog
        id={extensionRequest.id}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};
