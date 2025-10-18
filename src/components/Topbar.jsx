import { Bell, Settings, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 px-6 py-3 sticky top-0 z-30"
    >
      {/* Left Title */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
        Profile
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Box */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#26D0CE] outline-none transition-all w-44 md:w-64 shadow-sm"
          />
        </div> */}

        {/* Notification Icon */}
        <button className="relative group">
          <Bell className="h-5 w-5 text-gray-600 group-hover:text-[#1A2980] transition" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#26D0CE] rounded-full shadow-md"></span>
        </button>

        {/* Settings Icon */}
        <button className="group">
          <Settings className="h-5 w-5 text-gray-600 group-hover:text-[#1A2980] transition" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <img
          src="https://i.pravatar.cc/100?img=5"
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-[#26D0CE]/40 shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">Helen Voizchicki</p>
            <p className="text-xs text-gray-500">Head of HR Department</p>
          </div>
        </div>
      </div>
    </header>
  );
}
