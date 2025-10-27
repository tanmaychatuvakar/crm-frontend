export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options?: Option[];
  label?: string;
  placeholder?: string;
  error?: any;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  value?: string | null | undefined;
  onChange?: (value: string | undefined) => any;
  loading?: boolean;
}

export default SelectProps;
