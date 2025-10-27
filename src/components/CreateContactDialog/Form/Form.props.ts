export interface FormProps {
  onSubmit: (data: any) => void;
  onClose: undefined | (() => void);
  loading: boolean;
}
