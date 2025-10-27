import { useDeleteUserMutation } from "@/app/services/api";
import { AppDialog, Button } from "@/components/shared";
import { useCallback } from "react";

export const DeleteUserDialog: React.FC<{
  open: boolean;
  user: { id: string };
  onClose: () => any;
}> = ({ user, open, onClose }) => {
  const [mutate, { isLoading }] = useDeleteUserMutation();

  const handleOnClick = useCallback(async () => {
    try {
      await mutate(user.id).unwrap();
      onClose();
    } catch {
      console.error("could not delete user");
    }
  }, [user]);

  return (
    <AppDialog open={open} onClose={onClose}>
      <AppDialog.Title>
        Are you sure you want to delete this user ?
      </AppDialog.Title>
      <div className="flex justify-end space-x-3 mt-5">
        <Button isLoading={isLoading} onClick={handleOnClick}>
          Yes, I'm sure
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </AppDialog>
  );
};
