import {
  useGetProfileQuery,
  useUpdateProfileImageMutation,
} from "@/app/services/api";
import { Avatar } from "@/components/shared/avatar";
import { formatInitials } from "@/utils";
import { useCallback } from "react";
import { BasicProfile } from "./components/basic-profile";
import { UpdatePassword } from "./components/update-password";

const Profile = () => {
  const { data: user, isFetching } = useGetProfileQuery();

  const [updateProfileImage, { isLoading: isUploading }] =
    useUpdateProfileImageMutation();

  const handleOnDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      await updateProfileImage(acceptedFiles[0]).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (isFetching || !user) {
    return;
  }

  return (
    <div className="flex flex-col gap-4 p-5 max-w-screen-xl mx-auto">
      <h3 className="font-light text-2xl">Profile</h3>

      <div className="mb-4">
        <Avatar
          fallback={formatInitials(user?.name || "")}
          image={user?.profileImage}
          editable
          onDrop={handleOnDrop}
          uploading={isUploading}
          size="lg"
        />
      </div>

      <BasicProfile user={user} />

      <UpdatePassword />
    </div>
  );
};

export default Profile;
