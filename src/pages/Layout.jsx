import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-gradient-to-b from-[#EAF3FF] to-[#F9FBFF] min-h-screen overflow-hidden transition-all duration-500">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Right Side (Main Content) */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-500 ${
          isCollapsed ? "pl-[5rem]" : "pl-[16rem]"
        }`}
      >
        {/* Topbar */}
        <div className="p-6 pb-0">
          <Topbar />
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">{children}</div>
      </div>
    </div>
  );
}
