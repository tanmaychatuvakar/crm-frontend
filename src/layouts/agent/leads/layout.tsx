import { Navbar } from "@/components/Navbar";
import { ReusableSidebar } from "@/components/ReusableSideBar";

import { Outlet } from "react-router-dom";

const sections = [
  {
    title: "Leads",
    links: [
      { label: "My Leads", path: "/my/leads" },
      { label: "Leads Pool", path: "/my/leads/pool" },
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

export const LeadsLayout = () => {
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
