import { Navbar } from "@/components/Navbar";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";

export const ListingsLayout = () => {
  const { type } = useParams();

  const sections = useMemo(
    () => [
      {
        title: `${type === "sale" ? "Sale" : "Rental"} Listings`,
        links: [
          {
            label: "Company Listings",
            path: `/my/${type}/listings/company`,
          },
          {
            label: "Company Exclusive",
            path: `/my/${type}/listings/exclusive`,
          },
          {
            label: "Draft Listings",
            path: `/my/${type}/listings/draft`,
          },
          {
            label: "Unpublished Listings",
            path: `/my/${type}/listings/unpublished`,
          },
          {
            label: "Archived Listings",
            path: `/my/${type}/listings/archived`,
          },
        ],
      },
      {
        title: "Requests",
        links: [
          {
            label: "Photo Requests",
            path: `/my/${type}/photo-requests`,
          },
          {
            label: "Extension Requests",
            path: `/my/${type}/extension-requests`,
          },
          {
            label: "Unpublish Requests",
            path: `/my/${type}/unpublish-requests`,
          },
        ],
      },
    ],
    [type]
  );

  return (
    <div>
      <ReusableSidebar sections={sections} />
      <div className="ml-64 px-8 py-4">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
