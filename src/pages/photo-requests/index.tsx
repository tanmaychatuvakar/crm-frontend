import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Index } from "./index/index";
import { Show } from "./show";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const sections = [
  {
    title: "Photo Requests",
    links: [
      {
        label: "Photo Requests",
        path: "/photo-requests",
      },
    ],
  },
];

const Layout: React.FC = () => {
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

export const PhotoRequests = {
  Layout,
  Index,
  Show,
};
