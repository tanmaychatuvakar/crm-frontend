import { AppDialog } from "@/components/shared";
import { EditUserForm, FormValues } from "../forms/edit-user";
import { useCallback, useMemo } from "react";
import { useUpdateUserMutation } from "@/app/services/api";

type User = {
  id: string;
  email: string;
  name: string;
  phoneNumberCountryCode: string | null;
  phoneNumber: string | null;
  role: string;
};

export const EditUserDialog: React.FC<{
  open: boolean;
  user: User;
  onClose: () => any;
}> = ({ user, open, onClose }) => {
  const [mutate, { isLoading }] = useUpdateUserMutation();

  const handleOnSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutate({
          id: user.id,
          name: data.name,
          phoneNumberCountryCode: data.phoneNumberCountryCode || "",
          phoneNumber: data.phoneNumber,
          role: data.role,
          password: data.password,
        }).unwrap();
        onClose();
      } catch {
        console.error("Could not edit user");
      }
    },
    [user]
  );

  const transformedUser = useMemo(
    () => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumberCountryCode: user.phoneNumberCountryCode ?? undefined,
      phoneNumber: user.phoneNumber ?? "",
      role: user.role,
    }),
    [user]
  );

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Create User</AppDialog.Title>
      <AppDialog.Description>Create User Form</AppDialog.Description>
      <EditUserForm
        values={transformedUser}
        loading={isLoading}
        onSubmit={handleOnSubmit}
      />
    </AppDialog>
  );
};
