import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import classNames from "classnames";

import { FileUploadProps } from "./file-upload.props";
import { useUploadListingDocumentMutation } from "@/app/services/api";

export const FileUpload: React.FC<FileUploadProps> = ({
  children,
  disabled,
  className,
  onChange,
  error = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [generate] = useUploadListingDocumentMutation();

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setLoading(true);

    try {
      const { data } = await generate(file);
      data !== undefined && onChange(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Dropzone maxFiles={1} onDrop={handleDrop} disabled={loading || disabled}>
      {({ getRootProps, getInputProps, isDragAccept }) => (
        <div
          {...getRootProps()}
          className={classNames(
            "relative border  border-gray-300 border-dashed text-center text-sm text-gray-400 p-6 hover:cursor-pointer flex flex-col justify-center",
            {
              "border-gray-400": isDragAccept,
              "border-red-600": error,
            },
            { "bg-slate-300": disabled, "bg-slate-100": !disabled },
            className
          )}
        >
          <input {...getInputProps()} />
          <div className="mt-1">
            {children ?? (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
};
