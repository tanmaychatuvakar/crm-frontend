import { NavLinkProps } from "react-router-dom";

type Navigation = {
  title: string;
  to: string;
};

export interface NavbarLinkProps extends NavLinkProps {
  children?: React.ReactNode;
  submenu?: Navigation[];
  isActive?: boolean;
  left?: boolean;
}
