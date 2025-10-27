import { useAppSelector } from "@/hooks/useAppSelector";
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return isLoggedIn ? children : <Navigate to="/auth/sign-in" replace />;
};
