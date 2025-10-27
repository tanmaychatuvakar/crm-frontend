import { useLocation } from "react-router-dom";
import { NavbarProps } from "./Navbar.props";
import { NavbarLink } from "./NavbarLink";

import { Roles } from "@/constants/roles";

import { useAppSelector } from "@/hooks/useAppSelector";

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();

  const role = useAppSelector((state) => state.auth.user?.role);

  if (!role) {
    return <p>No role found</p>;
  }

  return (
    <nav className="sticky top-0 z-10 p-4 flex justify-center">
      <div>
        {[Roles.PHOTOGRAPHER, Roles.EDITOR].includes(role) && (
          <ul className="flex items-center gap-x-8">
            <li>
              <NavbarLink
                isActive={location.pathname.includes("photoshoots")}
                to="/my/photoshoots/assignments"
              >
                Photoshoots
              </NavbarLink>
            </li>
          </ul>
        )}

        {role === Roles.AGENT ? (
          <ul className="flex items-center gap-x-8">
            <li>
              <NavbarLink
                isActive={location.pathname.includes("listings")}
                onClick={(e) => {
                  e.preventDefault();
                }}
                to="#"
                submenu={[
                  {
                    title: "Sale",
                    to: "/my/sale/listings/draft",
                  },
                  {
                    title: "Rental",
                    to: "/my/rental/listings/draft",
                  },
                ]}
              >
                Listings
              </NavbarLink>
            </li>

            <li>
              <NavbarLink
                left={true}
                isActive={location.pathname.includes("leads")}
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
                submenu={[
                  {
                    title: "Leads",
                    to: "/my/leads",
                  },
                  {
                    title: "Viewings",
                    to: "/my/viewings",
                  },
                  {
                    title: "Offers",
                    to: "/my/offers",
                  },
                  {
                    title: "Calls",
                    to: "/my/calls",
                  },
                ]}
              >
                Leads
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("deals")}
                to="/deals"
              >
                Deals
              </NavbarLink>
            </li>
          </ul>
        ) : null}

        {role === Roles.LISTING_DEPARTMENT ? (
          <ul className="flex items-center gap-x-8">
            <li>
              <NavbarLink
                isActive={location.pathname.includes("listings")}
                to="/listings/company"
              >
                Listings
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("photo-requests")}
                to="/photo-requests"
              >
                Photo Requests
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("photoshoots")}
                to="/photoshoots"
              >
                Photoshoots
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("campaigns")}
                to="/campaigns"
              >
                Campaigns
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("teams")}
                to="/teams"
              >
                Teams
              </NavbarLink>
            </li>
          </ul>
        ) : null}

        {role === Roles.LINE_MANAGER && (
          <ul className="flex items-center gap-x-8">
            <li>
              <NavbarLink
                isActive={location.pathname.includes("listings")}
                to="/listings/extension-requests"
              >
                Listings
              </NavbarLink>
            </li>
            <li>
              <NavbarLink
                isActive={location.pathname.includes("leads")}
                to="/leads/pending-approval"
              >
                Leads
              </NavbarLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};
