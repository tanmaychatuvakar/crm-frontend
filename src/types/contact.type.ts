export type Contact = {
  id: string;
  title: string;
  name: string;
  mobileCountryCode: string;
  mobileNumber: string;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  email: string;
  nationalityId: string | null;
  dateOfBirth: string;
  emiratesId: string | null;
  passportNumber: string;
  spokenLanguage: string | null;
  contactType: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
