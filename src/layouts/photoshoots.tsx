import { Navbar } from "@/components/Navbar";
import { ReusableSidebar } from "@/components/ReusableSideBar";

import { Outlet } from "react-router-dom";

const sections = [
  {
    title: "Photoshoots",
    links: [
      {
        label: "Assignments",
        path: "/my/photoshoots/assignments",
      },
      {
        label: "Uploaded",
        path: "/my/photoshoots/uploaded",
      },
    ],
  },
];

export const PhotoshootsLayout = () => {
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
