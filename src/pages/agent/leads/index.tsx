import { Navbar } from "@/components/Navbar";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Outlet } from "react-router-dom";
import Calls from "./calls";
import Offers from "./offers";
import Viewings from "./viewings";
import { ExtensionRequests } from "./extension-requests";
import { PendingApproval } from "./pending-approval";

const sections = [
  {
    title: "Leads",
    links: [
      { label: "My Leads", path: "/my/leads" },
      { label: "Leads Pool", path: "/my/leads/pool" },
      { label: "Closed", path: "/my/leads/closed" },
    ],
  },
  {
    title: "Requests",
    links: [
      { label: "Leads Pending Approval", path: "/my/leads/pending-approval" },
      { label: "Extension Requests", path: "/my/leads/extension-requests" },
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

export const Leads = {
  Layout,
  Calls,
  Offers,
  Viewings,
  ExtensionRequests,
  PendingApproval,
};
