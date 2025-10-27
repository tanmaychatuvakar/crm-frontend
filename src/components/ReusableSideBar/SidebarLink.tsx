import { NavLink } from "react-router-dom";
import { SidebarLinkProps } from "./SidebarLink.props";
import { css } from "@/utils";

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  to,
  children,
  ...rest
}) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        css(
          "w-full flex items-center justify-start font-light text-sm py-2 px-1 hover:text-[#6da0b0] hover:cursor-pointer",
          {
            "bg-[#e9e9e944] text-[#6da0b0] border-[#6da0b0] border-l-[3px]":
              isActive,
          }
        )
      }
      {...rest}
    >
      <span>{icon}</span>
      <span className="flex-1 ml-3 whitespace-nowrap">{children}</span>
    </NavLink>
  );
};
