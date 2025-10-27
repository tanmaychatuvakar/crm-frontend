import { AppDialog } from "../shared";
import { CreateContactDto, CreateContactForm } from "./Form";
import { CreateContactDialogProps } from "./CreateContactDialog.props";
import { useCreateContactMutation } from "@/app/services/api";

export const CreateContactDialog: React.FC<CreateContactDialogProps> = ({
  onClose,
  open,
  ...rest
}) => {
  const [mutate, { isLoading }] = useCreateContactMutation();

  const handleSubmit = async (data: CreateContactDto) => {
    const contact = {
      title: data.title,
      name: data.name,
      mobileCountryCode: data.mobileCountryCode,
      mobileNumber: data.mobileNumber,
      phoneCountryCode: data.phoneCountryCode,
      phoneNumber: data.phoneNumber,
      email: data.email,
      nationalityId: data.nationalityId,
      dateOfBirth: data.dateOfBirth,
      emiratesId: data.emiratesId,
      passportNumber: data.passportNumber,
      spokenLanguage: data.spokenLanguage,
      contactType: data.contactType,
    };

    try {
      const response = await mutate(contact).unwrap();
      onClose(response);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <AppDialog onClose={onClose} open={open} {...rest}>
      <AppDialog.Title>Create Contact</AppDialog.Title>
      <AppDialog.Description>
        Fill in the required fields(*) to create a new contact
      </AppDialog.Description>
      <CreateContactForm
        loading={isLoading}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </AppDialog>
  );
};
