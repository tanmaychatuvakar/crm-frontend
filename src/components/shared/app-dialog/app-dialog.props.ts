import { DialogProps } from "@radix-ui/react-dialog";

export interface AppDialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface AppDialogDescriptionProps {
  children?: React.ReactNode;
}
export interface AppDialogProps extends DialogProps {
  trigger?: React.ReactNode;
  onClose: (e?: any) => void;
}
