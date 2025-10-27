export interface AvatarProps {
  fallback: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  uploading?: boolean;
  onDrop?: (acceptedFiles: File[]) => void;
}
