import moment from "moment";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { Types, Statuses } from "./constants/leads";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone } from "date-fns-tz";
import { DATE_FORMAT } from "./constants";

export const expirationDate = (date: string) => moment(date).fromNow(true);

export const getFormattedDate = (date: string) =>
  formatInTimeZone(
    date,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    DATE_FORMAT
  );

export const titleCase = (value: string) =>
  value[0].toUpperCase() + value.slice(1).toLowerCase();

//Leads
export const useLeadStatusVariant = (status: string): BadgeVariants => {
  let statusVariant: BadgeVariants = "info";
  switch (status) {
    case Statuses.new:
      statusVariant = "info";
      break;
    case Statuses.called:
      statusVariant = "bright";
      break;
    case Statuses.rejected:
    case Statuses.canceled:
      statusVariant = "danger";
      break;
    case Statuses.contacted:
      statusVariant = "bright";
      break;
    case Statuses.pending:
      statusVariant = "warning";
      break;
    case Statuses.qualified:
      statusVariant = "success";
      break;
    default:
      statusVariant = "info";
  }
  return statusVariant;
};

export const useLeadTypeVariant = (type: string): BadgeVariants => {
  let typeVariant: BadgeVariants = "info";
  switch (type) {
    case Types.general:
      typeVariant = "info";
      break;
    case Types.listing:
      typeVariant = "success";
      break;
    case Types.campaign:
      typeVariant = "danger";
      break;
    default:
      typeVariant = "info";
  }
  return typeVariant;
};

export const useLeadScoreVariant = (score: number): BadgeVariants => {
  let scoreVariant: BadgeVariants = "info";
  if (score === 100) {
    scoreVariant = "success";
  } else if (score >= 50 && score < 100) {
    scoreVariant = "bright";
  } else if (score < 50 && score >= 0) {
    scoreVariant = "warning";
  } else {
    scoreVariant = "dark";
  }
  return scoreVariant;
};

export const formatInitials = (name: string) => {
  const parts = name.split(" ").map((p) => p.trim());
  const initials = parts.map((p) => p[0]);
  return initials.join("");
};

export function css(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setValueAsNumber(value: string) {
  return value === "" ? undefined : +value;
}

export const getBudgetDropdownOptions = (initialPrice: number) => {
  const prices: number[] = [];
  let price = initialPrice;

  for (let i = 5; i >= 1; i--) {
    price = Math.floor(price * 0.88);
    prices.push(price);
  }

  return prices
    .map((price, index) => {
      if (index === 0) return `More than ${price}`;
      if (index === prices.length - 1) return `Up to ${price}`;
      return `Between ${price} and ${prices[index - 1]}`;
    })
    .reverse()
    .map((label, index) => ({
      label: `(${index + 1}) ${label}`,
      value: `${index + 1}`,
    }));
};

export const getCookieByName = (name: string) => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
