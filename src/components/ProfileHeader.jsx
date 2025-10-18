import React from "react";

export default function ProfileHeader() {
  return (
    <div
      className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#1A2980] to-[#26D0CE]" />

      {/* Profile Image */}
      <div className="relative">
        <img
          src="https://i.pravatar.cc/100?img=5"
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-[#26D0CE]/30 shadow-md"
        />
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
      </div>

      {/* User Info */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Helen Voizchicki
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full shadow-sm">
            Active
          </span>
        </h2>
        <p className="text-sm text-gray-600 font-medium">
          Head of HR Department
        </p>
        <div className="mt-2 text-sm text-gray-500 flex flex-col">
          <span>📧 helenvoizchicki@gmail.com</span>
          <span>📞 +1 799 843 642</span>
        </div>
      </div>

      {/* Stats / Button Area */}
      <div className="hidden md:flex flex-col items-end text-right">
        <p className="text-sm text-gray-600">Member Since</p>
        <p className="text-sm font-semibold text-[#1A2980]">
          March 2022
        </p>
        {/* <button
          className="mt-3 px-4 py-1.5 text-sm rounded-lg bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white font-medium shadow-md hover:shadow-lg transition"
        >
          View Profile
        </button> */}
      </div>
    </div>
  );
}
