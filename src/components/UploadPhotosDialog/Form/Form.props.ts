export interface FormProps {
  onSubmit: (data: any) => void;
  onClose: undefined | (() => void);
  data?: any;
  mode: "submit" | "create" | "preview";

  images: { id: string; location: string }[];
  showPhotographerImages?: boolean;
}
