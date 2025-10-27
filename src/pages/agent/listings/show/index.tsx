import { useCallback, useMemo, useState } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";
import { useNavigate, useParams } from "react-router-dom";

import {
  useArchiveListingMutation,
  useGetListingQuery,
} from "@/app/services/api";
import { GetListingPayload, Listing } from "@/types/listing.type";
import { z } from "zod";

import { UnpublishDialog } from "../dialogs/unpublish";
import { ExtendDialog } from "../dialogs/extend";
import { CreateDialog } from "@/pages/photo-requests/dialogs/create";
import { ListingForm } from "@/components/listing-form";
import { formatFormValues } from "../edit";
import { useAppSelector } from "@/hooks/useAppSelector";
import { HiDownload } from "react-icons/hi";

type ListingWithRelations = GetListingPayload<{
  features: true;
  amenities: true;
  extensionRequests: true;
  unpublishRequests: true;
  photoshoot: true;
}>;

export const formSchema = z
  .object({
    isRental: z.boolean(),
    isSale: z.boolean(),
    isRented: z.boolean().default(false),

    cityId: z.string(),
    communityId: z.string(),
    subcommunityId: z.string().optional(),
    propertyId: z.string().optional(),

    sourceId: z.string().optional(),

    title: z.string().min(1, "Title is required"),
    categoryId: z.string(),
    description: z.string(),
    unitNumber: z.string().min(1),
    totalArea: z
      .number()
      .int()
      .max(2147483647, "Max area allowed is 2147483647"),
    plotArea: z
      .number()
      .int()
      .max(2147483647, "Max area allowed is 2147483647")
      .optional(),

    numberOfBedrooms: z.number().int(),
    numberOfBathrooms: z.number().int(),
    floor: z.number().int().optional(),
    view: z.string().min(1),
    str: z.string().optional(),
    furnished: z.string(),
    features: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    amenities: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    appliances: z.boolean().default(false),
    parking: z.number().int().max(99, "Max parkings allowed is 99"),

    streetNumber: z.string().optional(),
    serviceCharge: z
      .number()
      .int()
      .max(2147483647, "Max value allowed is 2147483647")
      .optional(),

    contactId: z.string(),
    fitted: z.string().optional(),

    askForPrice: z.boolean().default(false),
    isExclusive: z.boolean().default(false),
    isCommercial: z.boolean().default(false),

    pricePerSqft: z
      .number()
      .int()
      .max(2147483647, "Max price allowed is 2147483647")
      .optional(), // is this for both sale and rental?

    propertyStatus: z.string(),
    salePrice: z
      .number()
      .int()
      .max(2147483647, "Max price allowed is 2147483647")
      .optional(),

    rentedFrom: z.string().optional(),
    rentedUntil: z.string().optional(),
    rentedPrice: z
      .number()
      .int()
      .max(2147483647, "Max price allowed is 2147483647")
      .optional(),

    rentedCheques: z.number().int().optional(),
    tenant: z.string().optional(),

    rentalPrice: z
      .number()
      .int()
      .max(2147483647, "Max price allowed is 2147483647")
      .optional(),

    rentalCheques: z.number().int().optional(),
    rentalLeaseTerm: z.string().optional(),
    rentalAvailableFrom: z.string().optional(),
    brokerContractRentalDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
    brokerContractSaleDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
    titleDeedDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
    poaDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
    ownerIdDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
    otherDocument: z
      .object({ fileName: z.string(), path: z.string() })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.isSale && !data.salePrice) {
      ctx.addIssue({
        path: ["salePrice"],
        message: "Price is required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.isRental && !data.rentalPrice) {
      ctx.addIssue({
        path: ["salePrice"],
        message: "Price is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const downloadFile = (href: string) => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = href;
  anchor.click();
};

export const Show = () => {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);

  const [archive] = useArchiveListingMutation();

  const { type, id } = useParams();

  const { data } = useGetListingQuery({
    listingId: id as string,
    include:
      "features,amenities,extensionRequests,unpublishRequests,photoshoot",
  });

  const listing = data as ListingWithRelations | undefined;

  const values = useMemo(() => formatFormValues(listing), [listing]);

  const handleArchive = useCallback(async (listingId: string) => {
    try {
      await archive(listingId).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleDownloadImages = useCallback(() => {
    listing?.photoshoot?.editorImages.forEach((image) => {
      downloadFile(image.location);
    });
  }, [listing]);

  const handleDownloadDocuments = useCallback(() => {
    if (!listing) return;
    const keys: (keyof Listing)[] = [
      "poaDocument",
      "otherDocument",
      "ownerIdDocument",
      "titleDeedDocument",
      "brokerContractSaleDocument",
      "brokerContractRentalDocument",
    ];

    keys.forEach((key) => {
      const document = listing[key] as { path: string } | null;
      if (document !== null) downloadFile(document.path);
    });
  }, [listing]);

  const handleOnClick = useCallback(async () => {
    const parsed = await formSchema.safeParseAsync(values);

    if (parsed.success) return setDialogOpen(true);

    const errors = parsed.error.flatten().fieldErrors;
    const result = Object.keys(errors).reduce((prev, curr) => {
      Object.assign(prev, {
        [curr]: { message: errors[curr as keyof typeof errors]?.[0] },
      });
      return prev;
    }, {});
    setErrors(result);
  }, [setErrors, values]);

  if (!listing) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <PageHeading className="mb-1">Show Listing</PageHeading>
            <PageDescription>
              Fill in the required fields
              <span className="text-red-500">(*)&nbsp;</span>
              to edit the listing
            </PageDescription>
          </div>

          <div className="inline-flex gap-2">
            {listing.status === "DRAFT" && (
              <Button
                onClick={() => navigate(`/my/${type}/listings/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            {listing.status === "DRAFT" && (
              <Button onClick={handleOnClick}>Photo Request</Button>
            )}
            {listing.status === "PUBLISHED" &&
              listing.assigneeId === userId && (
                <Button
                  variant="secondary"
                  onClick={() => setExtendDialogOpen(true)}
                  disabled={listing.extensionRequests.length !== 0}
                >
                  Extend Expiration
                </Button>
              )}
            {listing.status === "UNPUBLISHED" &&
              listing.assigneeId === userId && (
                <Button
                  variant="secondary"
                  onClick={() => handleArchive(listing.id)}
                >
                  ARCHIVE
                </Button>
              )}
            {listing.photoshoot?.editorImages && (
              <Button
                variant="secondary"
                trailingIcon={<HiDownload />}
                onClick={handleDownloadImages}
              >
                Images
              </Button>
            )}

            <Button
              variant="secondary"
              trailingIcon={<HiDownload />}
              onClick={handleDownloadDocuments}
            >
              Documents
            </Button>

            {listing.status === "PUBLISHED" &&
              listing.assigneeId === userId && (
                <Button
                  variant="secondary"
                  onClick={() => setUnpublishDialogOpen(true)}
                  disabled={listing.unpublishRequests.length !== 0}
                >
                  Unpublish Listing
                </Button>
              )}
          </div>
        </div>

        <ListingForm
          values={values}
          type={type as string}
          errors={errors}
          disabled
        />

        <CreateDialog
          id={listing.id}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />

        <UnpublishDialog
          id={listing.id}
          open={unpublishDialogOpen}
          onClose={() => setUnpublishDialogOpen(false)}
        />

        <ExtendDialog
          id={listing.id}
          open={extendDialogOpen}
          onClose={() => setExtendDialogOpen(false)}
        />
      </div>
    </>
  );
};
