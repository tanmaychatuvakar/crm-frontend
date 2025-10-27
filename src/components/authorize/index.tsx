import { useAppSelector } from "@/hooks/useAppSelector";
import React, { useMemo } from "react";

type AuthorizeProps = {
  roles: string[];
  children?: React.ReactNode;
};

export const Authorize: React.FC<AuthorizeProps> = ({ roles, children }) => {
  const role = useAppSelector((state) => state.auth.user?.role);
  const valid = useMemo(() => roles.some((r) => r === role), [role]);

  return valid ? children : null;
};
