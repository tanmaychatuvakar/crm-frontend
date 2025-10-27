import React, { useCallback, useMemo } from "react";
import { FormValues, ProfileForm } from "../forms/profile";
import { useUpdateProfileMutation } from "@/app/services/api";

type User = {
  email: string;
  phoneNumber: string | null;
  name: string;
};

export const BasicProfile: React.FC<{ user: User }> = ({ user }) => {
  const [update, { isLoading }] = useUpdateProfileMutation();

  const transformedUser = useMemo(
    () => ({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber ?? "",
    }),
    [user]
  );

  const handleOnSubmit = useCallback(async (values: FormValues) => {
    try {
      await update({
        name: values.name,
        phoneNumber: values.phoneNumber,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="border rounded-sm shadow-sm  p-5">
      <h3 className="mb-4">General</h3>
      <ProfileForm
        values={transformedUser}
        onSubmit={handleOnSubmit}
        loading={isLoading}
      />
    </div>
  );
};
