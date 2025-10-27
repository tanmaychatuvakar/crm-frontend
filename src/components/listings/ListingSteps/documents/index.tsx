import { useState } from "react";
import { AppDialog, Button } from "@/components/shared";
import { Controller } from "react-hook-form";
import { FileUpload } from "@/components/shared/file-upload";
import { StepProps } from "@/types/step.props";

type FieldName =
  | "brokerContractRentalDocument"
  | "brokerContractSaleDocument"
  | "titleDeedDocument"
  | "poaDocument"
  | "ownerIdDocument"
  | "otherDocument";

const fields: {
  name: FieldName;
  label: string;
  required: boolean;
}[] = [
  {
    name: "brokerContractRentalDocument",
    label: "BROKER'S CONTRACT RENTAL(FORM A/NOC)",
    required: false,
  },
  {
    name: "brokerContractSaleDocument",
    label: "BROKER'S CONTRACT SALE (FORM A / NOC)",
    required: false,
  },
  {
    name: "titleDeedDocument",
    label: "TITLE DEED (SPA / OQOOD AFFECTION PLAN)",
    required: true,
  },
  {
    name: "poaDocument",
    label: "POA",
    required: false,
  },
  {
    name: "ownerIdDocument",
    label: "OWNERS'S ID (PASSPORT / EMIRATES ID)",
    required: true,
  },
  {
    name: "otherDocument",
    label: "Others",
    required: false,
  },
];

const DocumentsStep: React.FC<StepProps> = ({ control }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <h2 className="font-light text-2xl text-gray-500 mb-4">Documents</h2>
      <div className="grid grid-cols-3 gap-2">
        {fields.map((field) => (
          <Controller
            control={control}
            name={field.name}
            defaultValue={null}
            render={({
              field: { value, onChange },
              formState: { disabled },
              fieldState: { error },
            }) => (
              <FileUpload
                error={error !== undefined}
                disabled={disabled}
                value={value}
                onChange={onChange}
              >
                <span>{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
              </FileUpload>
            )}
          />
        ))}
      </div>

      <AppDialog
        open={openDeleteModal}
        onClose={(e) => {
          e.stopPropagation();
          setOpenDeleteModal(false);
        }}
      >
        <AppDialog.Title>
          Are you sure you want to delete this document?
        </AppDialog.Title>
        <AppDialog.Description>
          <div className="mt-7 flex flex-row-reverse">
            <Button onClick={() => false}>Confirm</Button>
          </div>
        </AppDialog.Description>
      </AppDialog>
    </>
  );
};

export default DocumentsStep;
