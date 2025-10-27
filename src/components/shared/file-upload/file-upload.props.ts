import { Document } from "@/types/document.type";

export interface FileUploadProps {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  value?: Document | null;
  onChange: (value: Document) => any;
  error?: boolean;
}
