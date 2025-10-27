import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { FormValues } from "@/components/listing-form";

type Listing = FormValues;

export type StepProps = {
  register: UseFormRegister<Listing>;
  control: Control<Listing, any>;
  errors: FieldErrors<Listing>;
  watch: UseFormWatch<Listing>;
  getValues: UseFormGetValues<Listing>;
  setValue: UseFormSetValue<Listing>;
  disabled?: boolean;
  resetField: UseFormResetField<Listing>;
  readOnly?: boolean;
};
