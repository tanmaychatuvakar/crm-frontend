import { useCallback } from "react";
import { useUpdateProfilePasswordMutation } from "@/app/services/api";
import { FormValues, UpdatePasswordForm } from "../forms/update-password";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UpdatePassword = () => {
  const [update, { isLoading }] = useUpdateProfilePasswordMutation();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(async (values: FormValues) => {
    try {
      await update({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      navigate(-1);
    } catch {
      toast.error("Invalid credentials, please try again");
    }
  }, []);

  return (
    <div className="border rounded-sm shadow-sm p-5">
      <h3 className="mb-4">Change Password</h3>
      <UpdatePasswordForm loading={isLoading} onSubmit={handleOnSubmit} />
    </div>
  );
};
