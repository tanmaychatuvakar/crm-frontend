import { Stepper } from "@/components/shared";
import { LeadFormProps } from "./LeadForm.props";
import { useCallback, useEffect, useState } from "react";
import { ContactStep, ListingStep, PreferenceStep } from "../LeadSteps";

const errorsPerStep = {
  contact: [
    "title",
    "name",
    "mobileNumber",
    "phoneNumber",
    "email",
    "nationalityId",
    "language",
    "sourceId",
    "subsource",
  ],
  listing: ["listingId"],
  preference: [
    "cityId",
    "communityId",
    "subcommunityId",
    "propertyId",
    "categoryId",
    "minBedrooms",
    "maxBedrooms",
    "minPrice",
    "maxPrice",
    "minArea",
    "maxArea",
  ],
};

export const LeadForm: React.FC<LeadFormProps> = ({
  stepsProps,
  type,
  onSubmit,
}) => {
  const { errors } = stepsProps;

  const [invalidSteps, setInvalidSteps] = useState<Record<string, boolean>>({});

  const hasValidationError = useCallback(
    (key: keyof typeof errorsPerStep) => {
      return Object.keys(errors).some((item) =>
        errorsPerStep[key].includes(item)
      );
    },
    [errorsPerStep, errors]
  );

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
    <form onSubmit={onSubmit}>
      <Stepper defaultActiveKey="contact">
        <Stepper.Navigation>
          <Stepper.Navigation.Item
            eventKey="contact"
            error={invalidSteps["contact"]}
          >
            Contact
          </Stepper.Navigation.Item>

          <Stepper.Navigation.Item
            eventKey="listing"
            error={invalidSteps["listing"]}
          >
            Listing
          </Stepper.Navigation.Item>

          <Stepper.Navigation.Item
            eventKey="preference"
            error={invalidSteps["preference"]}
          >
            Preferences
          </Stepper.Navigation.Item>
        </Stepper.Navigation>
        <Stepper.Steps>
          <Stepper.Steps.Step eventKey="contact">
            <ContactStep {...stepsProps} type={type} />
          </Stepper.Steps.Step>

          <Stepper.Steps.Step eventKey="listing">
            <ListingStep {...stepsProps} type={type} />
          </Stepper.Steps.Step>

          <Stepper.Steps.Step eventKey="preference">
            <PreferenceStep {...stepsProps} type={type} />
          </Stepper.Steps.Step>
        </Stepper.Steps>
      </Stepper>
    </form>
  );
};
