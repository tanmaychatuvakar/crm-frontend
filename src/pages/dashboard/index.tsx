import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const routes: Record<string, string> = {
  ADMINISTRATOR: "users",
  PHOTOGRAPHER: "my/photoshoots/assignments",
  EDITOR: "my/photoshoots/assignments",
  AGENT: "my/sale/listings/draft",
  LISTING_DEPARTMENT: "listings/company",
  LINE_MANAGER: "/listings/extension-requests",
};

const Dashboard = () => {
  const role = useAppSelector((state) => state.auth.user!.role);
  const navigate = useNavigate();

  useEffect(() => {
    const route = routes[role];
    if (route) {
      navigate(route);
    }
  }, [role]);

  return <div>Dashboard</div>;
};

export default Dashboard;
