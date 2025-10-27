import { Spinner } from "../shared";
import { Fancybox } from "@fancyapps/ui";
import { HiOutlineXMark, HiOutlineArrowsPointingOut } from "react-icons/hi2";

type Props = {
  image: string;
  loading?: boolean;
  onDelete?: () => void;
  deletable?: boolean;
};

export const ImageUpload: React.FC<Props> = ({
  image,
  loading = false,
  deletable = false,
  onDelete,
}) => {
  const handlePreview = () => {
    Fancybox.show([
      {
        src: image,
        width: "auto",
        height: "auto",
      },
    ]);
  };

  return (
    <div className="relative">
      {!loading && deletable && (
        <button
          onClick={onDelete}
          className="absolute top-0 right-0 bg-white p-0.5 rounded-full z-10 translate-x-1.5 -translate-y-1.5 shadow"
        >
          <HiOutlineXMark />
        </button>
      )}
      <div className="relative overflow-hidden rounded w-full h-full shadow-sm">
        <img src={image} className="min-w-full min-h-full object-cover" />
        {loading && (
          <>
            <div className="bg-black/50 absolute top-0 right-0 h-full w-full z-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-2 -translate-y-2 text-white">
              <Spinner />
            </div>
          </>
        )}
        {!loading ? (
          <div
            className="transition-all absolute opacity-0 hover:opacity-100 bg-black/50 top-0 left-0 w-full h-full inline-flex items-center justify-center"
            role="button"
            onClick={handlePreview}
          >
            <HiOutlineArrowsPointingOut className="text-white" size={36} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
