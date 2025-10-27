import { BiLogOut } from "react-icons/bi";
import { SidebarLink } from "./SidebarLink";
import { SidebarProps } from "./props";
import classNames from "classnames";
import { MdPersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { css } from "@/utils";
import { LuChevronsUpDown } from "react-icons/lu";
import { useState } from "react";
import { api, useGetProfileQuery, useLogoutMutation } from "@/app/services/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";

export const ReusableSidebar: React.FC<SidebarProps> = ({
  sections,
  classes,
}) => {
  const { data: user } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const [isProfile, setIsProfile] = useState(false);

  return (
    <aside
      className={classNames(
        css(
          "fixed top-0 md:pt-12 bg-white left-0 w-64 h-screen transition-transform border-r border-gray-200",
          classes
        )
      )}
      aria-label="Sidebar"
    >
      <div className="h-full relative overflow-y-hidden">
        {sections.map((section) => {
          const { title, links } = section;

          return (
            <div key={title}>
              <div className="px-2.5">
                <h3 className="font-bold text-xs uppercase mb-4">{title}</h3>
              </div>
              <ul className="flex flex-col gap-y-1 mb-3">
                {links.map((link) => {
                  const { path, label } = link;
                  return (
                    <li key={label}>
                      <SidebarLink to={path} icon={link?.icon}>
                        {label}
                      </SidebarLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div className="absolute w-full bottom-0">
          <div
            onClick={() => setIsProfile((prev) => !prev)}
            className="flex items-center px-5 py-4 border-t cursor-pointer"
          >
            <span className="text-sm font-light line-clamp-1 text-ellipsis">
              {user?.name ?? ""}
            </span>
            <LuChevronsUpDown className="ms-auto" />
          </div>

          <div
            className={css(
              "absolute py-4 px-3 w-full transition-all duration-200",
              {
                "-translate-y-60": isProfile,
                "translate-y-0": !isProfile,
              }
            )}
          >
            <div className="w-full pt-6 bg-white shadow-sm flex flex-col rounded">
              <span className="ps-5 text-[10px] uppercase mb-5 font-semibold noselect">
                Personal
              </span>
              <Link to="/profile">
                <div className="w-full flex items-center hover:bg-[#fafafa]">
                  <div className="ps-4 pe-2 py-3 flex items-center text-xl">
                    <MdPersonOutline />
                  </div>
                  <span className="text-[14px] font-light noselect">
                    Profile
                  </span>
                </div>
              </Link>

              <button
                onClick={async () => {
                  await logout();
                  dispatch(api.util.resetApiState());
                }}
                className="inline-flex items-center hover:bg-[#fafafa] space-x-2 px-4 py-3"
              >
                <BiLogOut className="text-xl" />
                <span className="text-[14px] font-light noselect">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
