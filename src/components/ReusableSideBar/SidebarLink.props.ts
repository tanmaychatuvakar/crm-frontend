import { NavLinkProps } from "react-router-dom";

export interface SidebarLinkProps extends NavLinkProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}
