import { NavLink } from "react-router-dom";
import { css } from "@/utils";
import { NavbarLinkProps } from "./NavbarLink.props";

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  to,
  children,
  submenu,
  isActive = false,
  left = false,
  ...rest
}) => {
  return (
    <div className="relative nav-group">
      <NavLink
        to={to}
        className={css(
          "nav-link gap-x-1",
          {
            "text-black": !isActive,
          },
          {
            "text-[#6da0b0]": isActive,
          }
        )}
        {...rest}
      >
        <span className="whitespace-nowrap">{children}</span>
        {submenu ? (
          <span className="arrow-container">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="presentation"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
              />
            </svg>
          </span>
        ) : null}
      </NavLink>
      {submenu && (
        <div
          className={css(
            "nav-submenu border rounded-md shadow-sm justify-start items-start p-5 overflow-clip top-[100%] w-52 space-y-2",
            {
              "right-0": left,
            }
          )}
        >
          {submenu.map((option) => (
            <NavLink
              key={option.title}
              to={option.to}
              className={({ isActive }) =>
                css(
                  "whitespace-nowrap inline-flex items-center justify-between sub-group w-full",
                  {
                    "text-[#6da0b0]": isActive,
                  }
                )
              }
            >
              <span>{option.title}</span>
              <span className="sub-arrow-container">
                <svg
                  className="-rotate-90"
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                </svg>
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
