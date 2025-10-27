import React from "react";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
