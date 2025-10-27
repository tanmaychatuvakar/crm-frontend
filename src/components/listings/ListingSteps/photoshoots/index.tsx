// import { NativeFancybox as FancyBox } from "@/App";
import { ImageUpload } from "@/components/ImageUpload";

const PhotoshootsStep: React.FC<{
  photographerImages: { location: string; id: string }[];
  editorImages: { location: string; id: string }[];
}> = ({ photographerImages, editorImages }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <h2 className="col-span-12">Editor Images:</h2>
        {editorImages.map((image) => (
          <div className="relative col-span-3">
            <ImageUpload image={image.location} key={image.id} />
          </div>
        ))}
        <h2 className="col-span-12">Photographer Images:</h2>
        {photographerImages.map((image) => (
          <div className="relative col-span-3">
            <ImageUpload image={image.location} key={image.id} />
          </div>
        ))}
      </div>
    </>
  );
};
export default PhotoshootsStep;
