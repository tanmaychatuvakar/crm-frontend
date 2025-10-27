import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Outlet, useParams } from "react-router-dom";
import { Index } from "./index/index";
import { Create } from "./create";
import { Edit } from "./edit";
import { Show } from "./show";
import { PhotoRequests } from "./photo-requests";
import { ExtensionRequests } from "./extension-requests";
import { UnpublishRequests } from "./unpublish-requests";
import { useMemo } from "react";
import { Navbar } from "@/components/Navbar";

const Layout = () => {
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

export const Listings = {
  Layout,
  Index,
  Create,
  Edit,
  Show,

  PhotoRequests,
  ExtensionRequests,
  UnpublishRequests,
};
