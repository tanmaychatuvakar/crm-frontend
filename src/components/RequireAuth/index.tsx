import { useAppSelector } from "@/hooks/useAppSelector";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth: React.FC<{ allowedRoles: string[] }> = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoggedIn) {
    return <Outlet />;
  }
  <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
};

export default RequireAuth;
