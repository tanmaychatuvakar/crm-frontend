import { useCallback, useRef } from "react";
import { Button, PageDescription, PageHeading } from "@/components/shared";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  useGetListingQuery,
  useUpdateListingMutation,
} from "@/app/services/api";
import { GetListingPayload } from "@/types/listing.type";
import { Base } from "@/components/listing-form/base";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ListingWithRelations = GetListingPayload<{
  features: true;
  amenities: true;
}>;

export const formSchema = z.object({
  isRental: z.boolean(),
  isSale: z.boolean(),
  isRented: z.boolean().default(false),

  cityId: z.string().optional(),
  communityId: z.string().optional(),
  subcommunityId: z.string().optional(),
  propertyId: z.string().optional(),

  sourceId: z.string().optional(),

  title: z.string().min(1, "Title is required"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  unitNumber: z.string().optional(),
  totalArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .optional(),

  plotArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .optional(),

  numberOfBedrooms: z.number().int().optional(),
  numberOfBathrooms: z.number().int().optional(),
  floor: z.number().int().optional(),
  view: z.string().optional(),
  str: z.string().optional(),
  furnished: z.string().optional(),
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
  parking: z.number().int().max(99, "Max parkings allowed is 99").optional(),

  streetNumber: z.string().optional(),
  serviceCharge: z
    .number()
    .int()
    .max(2147483647, "Max value allowed is 2147483647")
    .optional(),

  contactId: z.string().optional(),
  fitted: z.string().optional(),

  askForPrice: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isCommercial: z.boolean().default(false),

  pricePerSqft: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .optional(), // is this for both sale and rental?

  propertyStatus: z.string().optional(),
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
  poaDocument: z.object({ fileName: z.string(), path: z.string() }).nullable(),
  ownerIdDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  otherDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
});

export const formatFormValues = (data: any) => {
  if (!data) return undefined;
  return {
    isRental: data.isRental,
    isSale: data.isSale,
    isRented: data.isRented,

    cityId: data.cityId ?? undefined,
    communityId: data.communityId ?? undefined,
    subcommunityId: data.subcommunityId ?? undefined,
    propertyId: data.propertyId ?? undefined,

    sourceId: data.sourceId ?? undefined,

    title: data.title,
    categoryId: data.categoryId ?? undefined,
    description: data.description ?? undefined,
    unitNumber: data.unitNumber ?? undefined,
    totalArea: data.totalArea ?? undefined,

    plotArea: data.plotArea ?? undefined,

    numberOfBedrooms: data.numberOfBedrooms ?? undefined,
    numberOfBathrooms: data.numberOfBathrooms ?? undefined,
    floor: data.floor ?? undefined,
    view: data.view ?? undefined,
    str: data.str ?? undefined,
    furnished: data.furnished ?? undefined,
    features: (data as ListingWithRelations).features,
    amenities: (data as ListingWithRelations).amenities,

    appliances: data.appliances ?? undefined,
    parking: data.parking ?? undefined,

    streetNumber: data.streetNumber ?? undefined,
    serviceCharge: data.serviceCharge ?? undefined,

    contactId: data.contactId ?? undefined,
    fitted: data.fitted ?? undefined,

    askForPrice: data.askForPrice,
    isExclusive: data.isExclusive,
    isCommercial: data.isCommercial,

    pricePerSqft: data.pricePerSqft ?? undefined, // is this for both sale and rental?

    propertyStatus: data.propertyStatus ?? undefined,
    salePrice: data.salePrice ?? undefined,

    rentedFrom: data.rentedFrom ?? undefined,
    rentedUntil: data.rentedUntil ?? undefined,
    rentedPrice: data.rentedPrice ?? undefined,

    rentedCheques: data.rentedCheques ?? undefined,
    tenant: data.tenant ?? undefined,

    rentalPrice: data.rentalPrice ?? undefined,

    rentalCheques: data.rentalCheques ?? undefined,
    rentalLeaseTerm: data.rentalLeaseTerm ?? undefined,
    rentalAvailableFrom: data.rentalAvailableFrom ? "2020-02-02" : undefined,

    brokerContractRentalDocument: data.brokerContractRentalDocument,
    brokerContractSaleDocument: data.brokerContractSaleDocument,
    titleDeedDocument: data.titleDeedDocument,
    poaDocument: data.poaDocument,
    ownerIdDocument: data.ownerIdDocument,
    otherDocument: data.otherDocument,
  };
};

export const Edit = () => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  const { type, id } = useParams();

  const { data } = useGetListingQuery({
    listingId: id as string,
    include: "features,amenities",
  });

  const [mutate] = useUpdateListingMutation();

  const {
    control,
    register,
    watch,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: formatFormValues(data),
  });

  const handleOnClick = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  }, [formRef]);

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      await toast.promise(
        () =>
          mutate({
            id: id!,

            isRental: data.isRental,
            isSale: data.isSale,
            isRented: data.isRented,

            cityId: data.cityId ?? null,
            communityId: data.communityId ?? null,
            subcommunityId: data.subcommunityId ?? null,
            propertyId: data.propertyId ?? null,

            sourceId: data.sourceId ?? null,

            title: data.title,
            categoryId: data.categoryId ?? null,
            description: data.description ?? null,
            unitNumber: data.unitNumber ?? null,
            totalArea: data.totalArea ?? null,

            plotArea: data.plotArea ?? null,

            numberOfBedrooms: data.numberOfBedrooms ?? null,
            numberOfBathrooms: data.numberOfBathrooms ?? null,
            floor: data.floor ?? null,
            view: data.view ?? null,
            str: data.str ?? null,
            furnished: data.furnished ?? null,
            features: data.features.map((f) => f.id),
            amenities: data.amenities.map((a) => a.id),

            appliances: data.appliances,
            parking: data.parking ?? null,

            streetNumber: data.streetNumber ?? null,
            serviceCharge: data.serviceCharge ?? null,

            contactId: data.contactId ?? null,
            fitted: data.fitted ?? null,

            askForPrice: data.askForPrice,
            isExclusive: data.isExclusive,
            isCommercial: data.isCommercial,

            pricePerSqft: data.pricePerSqft ?? null,

            propertyStatus: data.propertyStatus ?? null,
            salePrice: data.salePrice ?? null,

            rentedFrom: data.rentedFrom ?? null,
            rentedUntil: data.rentedUntil ?? null,
            rentedPrice: data.rentedPrice ?? null,

            rentedCheques: data.rentedCheques ?? null,
            tenant: data.tenant ?? null,

            rentalPrice: data.rentalPrice ?? null,

            rentalCheques: data.rentalCheques ?? null,
            rentalLeaseTerm: data.rentalLeaseTerm ?? null,
            rentalAvailableFrom: data.rentalAvailableFrom ?? null,

            isHalfBath: false,
            isPrimary: false,

            brokerContractRentalDocument: data.brokerContractRentalDocument,
            brokerContractSaleDocument: data.brokerContractSaleDocument,
            titleDeedDocument: data.titleDeedDocument,
            poaDocument: data.poaDocument,
            ownerIdDocument: data.ownerIdDocument,
            otherDocument: data.otherDocument,
          }).unwrap(),
        {
          error: "Error",
          pending: "Loading",
          success: "Success",
        }
      );
      navigate(-1);
    },
    [id]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <PageHeading className="mb-1">Edit Listing</PageHeading>
          <PageDescription>
            Fill in the required fields
            <span className="text-red-500">(*)&nbsp;</span>
            to edit the listing
          </PageDescription>
        </div>

        <div className="inline-flex gap-2">
          <Button onClick={handleOnClick}>Save</Button>
        </div>
      </div>

      <Base
        ref={formRef}
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        getValues={getValues}
        setValue={setValue}
        resetField={resetField}
        type={type as string}
        onSubmit={handleSubmit(handleOnSubmit)}
        mode="edit"
      />
    </div>
  );
};
