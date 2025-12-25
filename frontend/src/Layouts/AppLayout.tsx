import { Outlet } from "react-router-dom";
import { useState } from "react";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";

export const AppLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header (fixed height) */}
      <Header sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

      {/* Middle area */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar open={sideBarOpen} setOpen={setSideBarOpen} />

        {/* Scroll container */}
        <main className="flex-1 overflow-y-auto p-6 border border-gray-200">
          <Outlet />
        </main>
      </div>

      {/* Footer (fixed height, no scroll) */}
      <footer className="shrink-0 bg-white border-t border-gray-200 p-6 flex justify-center items-center">
        <p className="text-sm text-gray-500">
          © 2024 Blogify. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
