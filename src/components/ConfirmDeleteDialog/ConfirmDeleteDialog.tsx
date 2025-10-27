import { Button } from "../shared";
import { ConfirmDeleteDialogProps } from "./ConfirmDeleteDialog.props";
import { AppDialog } from "../shared";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteListingMutation } from "@/app/services/api";

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  onClose,
  open,
  ...rest
}) => {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [mutate, { isLoading }] = useDeleteListingMutation();

  const handleDelete = async () => {
    try {
      await mutate(listingId!).unwrap();
      onClose();
      navigate(-1);
      toast.success("Listing is deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
      <AppDialog.Title>
        Are you sure you want to delete this listing ?
      </AppDialog.Title>
      <div className="flex gap-x-3 mt-6 justify-end">
        <Button isLoading={isLoading} onClick={handleDelete}>
          Yes, I'm sure
        </Button>
        <Button onClick={onClose}>No, cancel</Button>
      </div>
    </AppDialog>
  );
};

export default ConfirmDeleteDialog;
