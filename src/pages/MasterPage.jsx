import React, { useState } from "react";
import Tabs from "../components/master/Tabs";
import ServiceTable from "../components/master/ServiceTable";
import ReferenceTable from "../components/master/ReferenceTable";

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState("service");

  return (
    <div className="min-h-screen bg-[#F7FAFF] p-6 font-inter">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold text-[#1A2980] mb-6">
          Master Management
        </h1>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-8">
          {activeTab === "service" ? <ServiceTable /> : <ReferenceTable />}
        </div>
      </div>
    </div>
  );
}
