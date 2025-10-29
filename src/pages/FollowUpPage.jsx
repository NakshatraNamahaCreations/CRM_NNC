import React, { useState } from "react";
import Tabs from "../components/master/Tabs";
// import ReferenceTable from "../components/master/ReferenceTable";
import CallFollowUps from "../components/followup/CallFollowUps";
import PaymentFollowUps from "../components/followup/PaymentFollowUps";

export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState("call");
  const tabs = [
    { id: "call", label: "Call Follow Ups" },
    { id: "payment", label: "Payment Follow Ups" },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-inter">
      <div className="bg-white shadow-lg rounded-2xl px-8 py-3 border border-gray-100">
        <h1 className="text-2xl font-semibold text-[#1A2980] mb-6">
          Follow ups
        </h1>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <div className="mt-8">
          {activeTab === "call" ? <CallFollowUps /> : <PaymentFollowUps />}
        </div>
      </div>
    </div>
  );
}
