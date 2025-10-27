export const PASSWORD_LENGTH = 8;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;

export const PHONE_NUMBER_REGEX =
  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

export const LISTING_TYPES = {
  sales: "SALE",
  rental: "RENTAL",
};

export const TITLES = [
  {
    label: "Mr.",
    value: "Mr.",
  },
  {
    label: "Mrs.",
    value: "Mrs.",
  },
];

export const DATE_FORMAT = "MMMM do yyyy, hh:mm a";
