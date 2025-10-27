import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  AmenitiesStep,
  DescriptionStep,
  DetailsStep,
  DocumentsStep,
  FeaturesStep,
  GeneralStep,
  LocationStep,
  PricingStep,
  PublishingStep,
  RentingStep,
} from "../listings/ListingSteps";
import { Stepper } from "../shared";

import { FormValues } from "@/components/listing-form";
import { forwardRef, useCallback, useEffect, useState } from "react";

export const Base = forwardRef<
  HTMLFormElement,
  {
    onSubmit?: (e: any) => any;
    type?: string;
    register: UseFormRegister<FormValues>;
    control: Control<FormValues, any>;
    errors: FieldErrors<FormValues>;
    watch: UseFormWatch<FormValues>;
    getValues: UseFormGetValues<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    disabled?: boolean;
    resetField: UseFormResetField<FormValues>;
    mode?: string;
    readOnly?: boolean;
  }
>(({ onSubmit, type, errors, mode, ...rest }, ref) => {
  const errorsPerStep = {
    details: [
      "title",
      "categoryId",
      "totalArea",
      "plotArea",
      "numberOfBedrooms",
      "numberOfBathrooms",
      "furnished",
      "appliances",
      "parking",
      type === "sale" ? "propertyStatus" : undefined,
    ],
    location: [
      "cityId",
      "communityId",
      "subcommunityId",
      "propertyId",
      "unitNumber",
      "streetNumber",
      "floor",
      "view",
    ],
    pricing:
      type == "sale"
        ? ["salePrice", "pricePerSqft"]
        : [
            "rentalPrice",
            "rentalCheques",
            "rentalLeaseTerm",
            "rentalAvailableFrom",
            "serviceCharge",
          ],
    renting: [
      "rentedFrom",
      "rentedUntil",
      "rentedPrice",
      "rentedCheques",
      "tenant",
    ],
    general: ["contactId", "sourceId", "fitted", "str"],
    documents: ["titleDeedDocument", "ownerIdDocument"],
    publishing:
      type == "sale"
        ? [
            "rentalPrice",
            "rentalCheques",
            "rentalLeaseTerm",
            "rentalAvailableFrom",
            "serviceCharge",
          ]
        : ["salePrice", "pricePerSqft", "propertyStatus"],
    description: ["description"],
  };

  //Fix Typescript syntax
  const [invalidSteps, setInvalidSteps] = useState<Record<string, boolean>>({});

  //This function takes a key which is a "step name" & finds if there is an error in this step
  const hasValidationError = useCallback(
    (key: keyof typeof errorsPerStep) => {
      return Object.keys(errors).some((item) =>
        errorsPerStep[key].includes(item)
      );
    },
    [errorsPerStep, errors]
  );

  //Fix Typescript syntax
  //The use of this useEffect if to listen to errors triggered and create an object of step name as key and boolean value if step has validation errors
  useEffect(() => {
    if (errors) {
      const invalid = {};
      Object.assign(
        invalid,
        ...Object.keys(errorsPerStep).map((k: any) => ({
          [k]: hasValidationError(k),
        }))
      );
      setInvalidSteps(invalid);
    }
  }, [errors]);

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <Stepper defaultActiveKey="details">
        <Stepper.Navigation>
          <Stepper.Navigation.Item
            eventKey="details"
            error={invalidSteps["details"]}
          >
            Details
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="location"
            error={invalidSteps["location"]}
          >
            Location
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="pricing"
            error={invalidSteps["pricing"]}
          >
            Pricing
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item eventKey="features">
            Features
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item eventKey="amenities">
            Amenities
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="renting"
            error={invalidSteps["renting"]}
          >
            Rented
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="general"
            error={invalidSteps["general"]}
          >
            General
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="documents"
            error={invalidSteps["documents"]}
          >
            Documents
          </Stepper.Navigation.Item>
          <Stepper.Navigation.Item
            eventKey="publishing"
            error={invalidSteps["publishing"]}
          >
            {type == "sale" ? "Rental" : "Sale"}
          </Stepper.Navigation.Item>

          <Stepper.Navigation.Item
            eventKey="description"
            error={invalidSteps["description"]}
          >
            Description
          </Stepper.Navigation.Item>
        </Stepper.Navigation>
        <Stepper.Steps>
          <Stepper.Steps.Step eventKey="details">
            <DetailsStep errors={errors} type={type} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="location">
            <LocationStep errors={errors} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="pricing">
            <PricingStep errors={errors} type={type} {...rest} />
          </Stepper.Steps.Step>

          <Stepper.Steps.Step eventKey="features">
            <FeaturesStep errors={errors} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="amenities">
            <AmenitiesStep errors={errors} {...rest} />
          </Stepper.Steps.Step>

          <Stepper.Steps.Step eventKey="renting">
            <RentingStep errors={errors} {...rest} />
          </Stepper.Steps.Step>

          <Stepper.Steps.Step eventKey="general">
            <GeneralStep errors={errors} mode={mode} type={type} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="documents">
            <DocumentsStep errors={errors} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="publishing">
            <PublishingStep errors={errors} type={type} {...rest} />
          </Stepper.Steps.Step>
          <Stepper.Steps.Step eventKey="description">
            <DescriptionStep errors={errors} mode={mode} {...rest} />
          </Stepper.Steps.Step>
        </Stepper.Steps>
      </Stepper>
    </form>
  );
});
