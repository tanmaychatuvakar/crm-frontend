import { useController } from "react-hook-form";
import { Button } from "@/components/shared/button";
import { useGetCommonQuery } from "@/app/services/api";
import { StepProps } from "@/types/step.props";

import Editor from "react-simple-wysiwyg";

const DescriptionStep: React.FC<StepProps & { mode?: string }> = ({
  control,
  getValues,
  disabled,
  mode,
}) => {
  const {
    field: { value, onChange, ...field },
  } = useController({ control, name: "description", defaultValue: "" });

  const { data } = useGetCommonQuery();

  const setTemplate = () => {
    const {
      cityId,
      unitNumber,
      streetNumber,
      floor,
      view,
      numberOfBedrooms,
      numberOfBathrooms,
      parking,
      furnished,
      features,
      amenities,
    } = getValues();

    const template = `
      <strong>Description:</strong>
      <br />
      <ul>
        <li>
          <strong>Location:</strong>
          <span>${
            data?.locations.find((l) => l.value === cityId)?.label || "-"
          }</span>
        </li>
        <li>
          <strong>Unit Details:</strong>
          <ul>
            <li>Unit Number: ${unitNumber ?? "-"}</li>
            <li>Street Number: ${streetNumber ?? "-"}</li>
            <li>Floor: ${floor ?? "-"}</li>
            <li>View: ${view ?? "-"}</li>
            <li>Bedrooms: ${numberOfBedrooms ?? "-"}</li>
            <li>Bathrooms: ${numberOfBathrooms ?? "-"}</li>
            <li>No. of Parking: ${parking ?? "-"}</li>
            <li>Furnished: ${
              data?.furnished.find((f) => f.value === furnished)?.label || "-"
            }</li>
          </ul>
        </li>
        <li>
          <strong>Features:</strong>
          <ol>
            ${features.map((f) => `<li>${f.name}</li>`).join("\n")}
          </ol>
        </li>
        <li>
          <strong>Amenities:</strong>
          <ol>
            ${amenities.map((a) => `<li>${a.name}</li>`).join("\n")}
          </ol>
        </li>
      </ul>
      `;

    onChange(template);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <h2 className="col-span-12 font-light text-2xl text-gray-500">
          Description
        </h2>

        <div className="col-span-12 justify-self-end">
          <Button
            className="bg-transparent shadow-none border border-black text-black"
            disabled={disabled}
            onClick={setTemplate}
            type="button"
          >
            Template
          </Button>
        </div>
        <div className="col-span-12">
          <Editor {...field} value={value ?? ""} onChange={onChange} />
        </div>
      </div>
      {mode === "create" ? (
        <Button
          type="submit"
          className="absolute bottom-0 right-0 bg-[#6BB8F2] border-[#6BB8F2] text-white"
        >
          Submit
        </Button>
      ) : null}
    </>
  );
};

export default DescriptionStep;
