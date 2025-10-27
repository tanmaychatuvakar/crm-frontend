export type DropdownFormProps = {
  isOpen: boolean;
  label: string;
  close: () => void;
  children: React.ReactNode;
  reset: () => void;
  error?: boolean | null;
};
