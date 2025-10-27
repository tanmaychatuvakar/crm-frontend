export interface FormProps {
  onSubmit: (data: any) => void;
  onClose: undefined | (() => void);
  setSearch: any,
  mode: string
}
