"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // If it's the login page, render children without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin routes, use the admin layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[#f2ede4] py-6 px-10 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
