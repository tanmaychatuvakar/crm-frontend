import { useCallback } from "react";
import { ListingForm, FormValues } from "@/components/listing-form";
import { PageDescription, PageHeading } from "@/components/shared";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateListingMutation } from "@/app/services/api";

export const Create = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const [mutate] = useCreateListingMutation();

  const handleOnSubmit = useCallback(async (data: FormValues) => {
    await toast.promise(
      () =>
        mutate({
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

          brokerContractRentalDocument: data.brokerContractRentalDocument,
          brokerContractSaleDocument: data.brokerContractSaleDocument,
          titleDeedDocument: data.titleDeedDocument,
          poaDocument: data.poaDocument,
          ownerIdDocument: data.ownerIdDocument,
          otherDocument: data.otherDocument,

          isHalfBath: false,
          isPrimary: false,
        }).unwrap(),
      {
        error: "Error",
        pending: "Loading",
        success: "Success",
      }
    );
    navigate(-1);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <PageHeading className="mb-1">
          Create {type === "sale" ? "Sale" : "Rental"} Listing
        </PageHeading>
        <PageDescription>
          Fill in the required fields
          <span className="text-red-500">(*) </span>
          to create a new listing
        </PageDescription>
      </div>

      <ListingForm
        type={type as string}
        defaultValues={{
          isSale: type === "sale",
          isRental: type === "rental",
        }}
        onSubmit={handleOnSubmit}
        mode="create"
      />
    </div>
  );
};
