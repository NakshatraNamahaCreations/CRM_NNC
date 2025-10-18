import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "service", label: "Service" },
    { id: "reference", label: "Reference" },
  ];

  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative pb-2 text-sm font-semibold transition-all ${
            activeTab === tab.id
              ? "text-[#1A2980]"
              : "text-gray-500 hover:text-[#26D0CE]"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute left-0 bottom-0 w-full h-[3px] rounded-full bg-gradient-to-r from-[#1A2980] to-[#26D0CE]" />
          )}
        </button>
      ))}
    </div>
  );
}
