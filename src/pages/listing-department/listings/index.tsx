import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Outlet } from "react-router-dom";
import { Index } from "./index/index";
import { Show } from "./show";
import { Navbar } from "@/components/Navbar";

const sections = [
  {
    title: "Listings",
    links: [
      {
        label: "Company Listings",
        path: "/listings/company",
      },
    ],
  },
  {
    title: "Requests",
    links: [
      {
        label: "Publish Requests",
        path: "/listings/publish-requests",
      },
      {
        label: "Unpublish Requests",
        path: "/unpublish-requests",
      },
    ],
  },
];

const Layout = () => {
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
  Show,
};
