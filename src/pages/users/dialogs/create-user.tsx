import { AppDialog } from "@/components/shared";
import { CreateUserForm, FormValues } from "../forms/create-user";
import { useCallback } from "react";
import { useCreateUserMutation } from "@/app/services/api";

export const CreateUserDialog: React.FC<{
  open: boolean;
  onClose: () => any;
}> = ({ open, onClose }) => {
  const [mutate, { isLoading }] = useCreateUserMutation();

  const handleOnSubmit = useCallback(async (data: FormValues) => {
    try {
      await mutate({
        name: data.name,
        email: data.email,
        phoneNumberCountryCode: data.phoneNumberCountryCode || "",
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
      }).unwrap();
      onClose();
    } catch {
      console.error("Could not create user");
    }
  }, []);

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>Create User</AppDialog.Title>
      <AppDialog.Description>Create User Form</AppDialog.Description>
      <CreateUserForm loading={isLoading} onSubmit={handleOnSubmit} />
    </AppDialog>
  );
};
