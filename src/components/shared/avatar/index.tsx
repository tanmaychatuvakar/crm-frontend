import React from "react";
import { AvatarProps } from "./avatar.props";
import classNames from "classnames";
import { HiPencil } from "react-icons/hi2";
import { useDropzone } from "react-dropzone";
import { Spinner } from "../spinner";

export const Avatar: React.FC<AvatarProps> = ({
  fallback,
  image,
  size = "md",
  editable = false,
  uploading = false,
  onDrop,
}) => {
  const { getRootProps, getInputProps } = useDropzone({ noDrag: true, onDrop });
  return (
    <div
      className={classNames("relative", {
        "w-8 h-8": size === "sm",
        "w-11 h-11": size === "md",
        "w-20 h-20": size === "lg",
      })}
    >
      <div className="size-full rounded-full bg-gray-200 inline-flex items-center justify-center text-gray-700 font-semibold overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="profile image"
            className="size-full object-cover"
          />
        ) : (
          fallback
        )}
      </div>
      {editable ? (
        <div
          {...getRootProps({
            className:
              "absolute top-0 right-0 size-5 bg-white shadow rounded-full inline-flex items-center justify-center p-1",
          })}
          role="button"
        >
          {!uploading ? <HiPencil size="12" /> : <Spinner />}
          <input {...getInputProps()} />
        </div>
      ) : null}
    </div>
  );
};
