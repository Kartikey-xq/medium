import { Outlet } from "react-router-dom";
import { useState } from "react";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";

export const AppLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Integrated Header */}
      <Header sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

      <div className="flex flex-1 h-screen ">
        <SideBar open={sideBarOpen} setOpen={setSideBarOpen} />
        <main className="flex-1 p-6 border-2 border-gray-200 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <footer className="w-full bg-white border-t border-gray-200 p-6 flex justify-center items-center">
        <p className="text-sm text-gray-500">
          © 2024 Blogify. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
