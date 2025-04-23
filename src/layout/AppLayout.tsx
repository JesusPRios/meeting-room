import React from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
        <footer className="text-center text-sm text-gray-500 mt-8 mb-4">
          © {new Date().getFullYear()} Miguel Primera Ríos. Todos los derechos
          reservados. <br />
          Programa: Análisis y Desarrollo de Software (ADSO) · Ficha: 2671900{" "}
          · 
          <a
            href="https://github.com/JesusPRios"
            className="text-blue-500 hover:underline"
          >
            {" "}GitHub: @JesusPRios
          </a>
        </footer>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
