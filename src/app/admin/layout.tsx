import React from "react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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