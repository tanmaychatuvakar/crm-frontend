import { useCallback, useMemo, useState } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";

import { useNavigate, useParams } from "react-router-dom";

import { HiArrowLeft } from "react-icons/hi2";

import {
  useApproveUnpublishRequestMutation,
  useGetUnpublishRequestQuery,
} from "@/app/services/api";
import { GetUnpublishRequestPayload } from "@/types/unpublish-request.type";
import { ListingForm } from "@/components/listing-form";
import { formatFormValues } from "@/pages/agent/listings/edit";
import { RejectDialog } from "../dialog/reject";

type UnpublishRequest = GetUnpublishRequestPayload<{
  listing: true;
}>;

export const Show = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [isReject, setIsReject] = useState(false);

  const [mutate, { isLoading }] = useApproveUnpublishRequestMutation();
  const { data } = useGetUnpublishRequestQuery({
    id: id as string,
    include: "listing",
  });

  const unpublishRequest = data as UnpublishRequest | undefined;

  const values = useMemo(
    () => formatFormValues(unpublishRequest?.listing),
    [unpublishRequest]
  );

  const handleAcceptUnpublish = useCallback(async () => {
    try {
      await mutate(id as string).unwrap();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  if (!unpublishRequest) {
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
        {unpublishRequest.status === "PENDING" ? (
          <div className="flex space-x-2">
            <Button
              onClick={handleAcceptUnpublish}
              isLoading={isLoading}
              type="button"
              variant="primary"
            >
              Accept
            </Button>
            <Button onClick={() => setIsReject(true)} type="button">
              Reject
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mb-8">
        <PageHeading>Preview</PageHeading>
        <PageDescription>This is the preview page</PageDescription>
      </div>

      <ListingForm type="sale" values={values} disabled />

      <RejectDialog
        id={unpublishRequest.id}
        open={isReject}
        onClose={() => setIsReject(false)}
      />
    </div>
  );
};
