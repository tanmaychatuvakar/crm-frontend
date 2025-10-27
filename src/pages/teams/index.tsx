import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Index } from "./index/index";
import { Outlet } from "react-router-dom";
import { Create } from "./create";
import { Edit } from "./edit";
import { Navbar } from "@/components/Navbar";

const sections = [
  {
    title: "Teams",
    links: [
      {
        label: "Teams",
        path: "/teams",
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

export const Teams = {
  Layout,
  Index,
  Create,
  Edit,
};
