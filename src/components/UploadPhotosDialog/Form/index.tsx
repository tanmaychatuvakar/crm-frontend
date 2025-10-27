import { useCallback, useEffect, useState } from "react";
import { Button, AppDialog } from "../../shared";
import { FormProps } from "./Form.props";
import { BiPlus } from "react-icons/bi";
import { useDropzone } from "react-dropzone";
import { ImageUpload } from "@/components/ImageUpload";
import {
  useDeleteImageMutation,
  useUploadPhotoshootImagesMutation,
} from "@/app/services/api";

import { v4 as uuidv4 } from "uuid";

type Upload = { id: string; file: File | string; processing: boolean };

export const UploadPhotosForm: React.FC<FormProps> = ({
  onSubmit,
  mode,
  data,
  images,
  showPhotographerImages,
}) => {
  const [upload] = useUploadPhotoshootImagesMutation();
  const [destroy] = useDeleteImageMutation();

  const [files, setFiles] = useState<Upload[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((f) => ({
          id: uuidv4(),
          file: f,
          processing: true,
        })),
      ]);
    },
    [files]
  );

  const handleUpload = useCallback(
    async (pending: Upload[]) => {
      try {
        const response = await upload({
          id: data.id as string,
          files: pending.map((f) => f.file) as File[],
          identifiers: pending.map((f) => f.id),
        });

        if (response.data) {
          const newFiles = files.map((f) => ({
            ...f,
            processing: f.processing && !response.data.includes(f.id),
          }));
          setFiles(newFiles);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [files, setFiles]
  );

  useEffect(() => {
    const pending = files.filter((f) => f.processing);
    if (pending.length) {
      (async () => {
        await handleUpload(pending);
      })();
    }
  }, [files]);

  useEffect(() => {
    setFiles(
      images.map((i) => ({ id: i.id, file: i.location, processing: false }))
    );
  }, [setFiles]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <div className="mt-4">
      {mode === "submit" && (
        <p className="mb-4 bg-yellow-400 bg-opacity-40 p-4 rounded text-sm">
          Please make sure to review <strong>all the images</strong> before you
          submit
        </p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {files.map(({ file, id, processing }) => (
          <ImageUpload
            image={typeof file === "string" ? file : URL.createObjectURL(file)}
            loading={processing}
            deletable={mode === "create"}
            onDelete={async () => {
              try {
                await destroy({
                  photoshootId: data.id as string,
                  imageId: id,
                });
                setFiles((files) => files.filter((f) => f.id !== id));
              } catch (err) {
                console.error(err);
              }
            }}
            key={id}
          />
        ))}
        {mode === "create" && (
          <div
            className="min-h-40 inline-flex items-center justify-center bg-slate-100 rounded border border-dashed border-gray-200 fill-gray-300 hover:fill-gray-400 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <BiPlus size={28} className="fill-inherit" />
          </div>
        )}
      </div>

      {showPhotographerImages && (
        <div className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Photographer Images</h2>
            <p className="font-light text-sm text-gray-400">
              Download each image to be edited
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {data.photographerImages.map((i: any) => (
              <ImageUpload image={i.location} key={i.id} />
            ))}
          </div>
        </div>
      )}

      {/* <div className="grid grid-cols-4 gap-3">
        {images.map((i: any) => (
          <ImageUpload mode="preview" image={i.location} key={i.id} />
        ))}
        {files.map((f) => (
          <ImageUpload
            image={f}
            key={f.lastModified}
            mode="upload"
            onUpload={(objectKey) => {
              console.log("uploaded ...", objectKey);
            }}
          />
        ))}
        <div
          className="min-h-40 inline-flex items-center justify-center bg-slate-100 rounded border border-dashed border-gray-200 fill-gray-300 hover:fill-gray-400 cursor-pointer"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <BiPlus size={28} className="fill-inherit" />
        </div>
      </div> */}

      {mode === "submit" && (
        <div className="float-right mt-4">
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}

      <AppDialog
        open={openDeleteModal}
        onClose={(e) => {
          e.stopPropagation();
          setOpenDeleteModal(false);
        }}
      >
        <AppDialog.Title>
          Are you sure you want to delete this image?
        </AppDialog.Title>

          <div className="mt-6 text-right">
            <Button className="inline-block bg-[#6BB8F2] border-[#6BB8F2] text-white" onClick={() => false}>
              Confirm
            </Button>
          </div>

      </AppDialog>
    </div>
  );
};
