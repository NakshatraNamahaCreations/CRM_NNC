// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Users,
//   PhoneCall,
//   FileText,
//   CreditCard,
//   ClipboardList,
//   CheckSquare,
//   Calendar,
//   Bell,
//   BarChart3,
//   Settings,
//   Database, // 👈 added icon for Master
// } from "lucide-react";

// const menu = [
//   { icon: Home, label: "Dashboard", route: "/dashboard" },
//   { icon: Database, label: "Master", route: "/master" }, // 👈 new tab with Database icon
//   { icon: Users, label: "Leads", route: "/leads" },
//   { icon: PhoneCall, label: "Follow-Ups" },
//   { icon: FileText, label: "Quotations" },
//   { icon: CreditCard, label: "Payments & Bookings" },
//   { icon: ClipboardList, label: "Projects" },
//   { icon: CheckSquare, label: "Tasks & Work Tracking" },
//   { icon: Calendar, label: "Calendar" },
//   { icon: Bell, label: "Notifications" },
//   { icon: BarChart3, label: "Reports & Analytics" },
//   { icon: Settings, label: "Settings" },
// ];

// export default function Sidebar() {
//   const location = useLocation();

//   return (
//     <aside
//       className="w-64 min-h-screen flex flex-col justify-between text-white p-5 rounded-r-3xl shadow-2xl"
//       style={{
//         background: "linear-gradient(180deg, #1A2980 0%, #26D0CE 100%)",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       {/* Logo Section */}
//       <div>
//         <div className="flex items-center gap-3 mb-8">
//           <img src="/nnclogo.png" alt="CRM Logo" className="w-12 h-14" />
//           <h1 className="text-xl font-bold tracking-wide">NNC</h1>
//         </div>

//         {/* Navigation */}
//         <ul className="space-y-2">
//           {menu.map((item, i) => {
//             const isActive = location.pathname === item.route;
//             return (
//               <li key={i}>
//                 {item.route ? (
//                   <Link
//                     to={item.route}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
//                       isActive
//                         ? "bg-white text-[#1A2980] shadow-md font-semibold"
//                         : "hover:bg-white/10 text-white"
//                     }`}
//                   >
//                     <item.icon
//                       className={`h-5 w-5 ${
//                         isActive ? "text-[#1A2980]" : "text-white"
//                       }`}
//                     />
//                     <span className="text-sm font-medium">{item.label}</span>
//                   </Link>
//                 ) : (
//                   <div className="flex items-center gap-3 px-4 py-2 opacity-70">
//                     <item.icon className="h-5 w-5 text-white" />
//                     <span className="text-sm font-medium">{item.label}</span>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       {/* Bottom Info */}
//       <div
//         className="rounded-2xl p-4 text-center mt-6 shadow-lg"
//         style={{
//           background: "linear-gradient(135deg, #26D0CE 0%, #1A2980 100%)",
//         }}
//       >
//         <p className="text-sm font-semibold mb-2 text-white">
//           Smart CRM for IT Agencies
//         </p>
//         <button className="bg-white/20 hover:bg-white/30 transition px-3 py-2 rounded-lg text-sm text-white">
//           Learn More
//         </button>
//       </div>
//     </aside>
//   );
// }

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  PhoneCall,
  FileText,
  CreditCard,
  ClipboardList,
  CheckSquare,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menu = [
  { icon: Home, label: "Dashboard", route: "/dashboard" },
  { icon: Database, label: "Master", route: "/master" },
  { icon: Users, label: "Leads", route: "/leads" },
  { icon: PhoneCall, label: "Follow-Ups" },
  { icon: FileText, label: "Quotations" },
  { icon: CreditCard, label: "Payments & Bookings" },
  { icon: ClipboardList, label: "Projects" },
  { icon: CheckSquare, label: "Tasks & Work Tracking" },
  { icon: Calendar, label: "Calendar" },
  { icon: Bell, label: "Notifications" },
  { icon: BarChart3, label: "Reports & Analytics" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col justify-between text-white p-4 shadow-2xl z-50 transition-all duration-500 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{
        background: "linear-gradient(180deg, #1A2980 0%, #26D0CE 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo and toggle */}
      <div>
        <div
          className={`flex items-center justify-between mb-8 ${
            isCollapsed ? "flex-col gap-2" : "gap-3"
          }`}
        >
          <div className="flex items-center gap-3">
            <img src="/nnclogo.png" alt="CRM Logo" className="w-10 h-12" />
            {!isCollapsed && (
              <h1 className="text-lg font-bold tracking-wide">NNC</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="bg-white/20 hover:bg-white/30 p-1 rounded-lg transition"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-white" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menu.map((item, i) => {
            const isActive = location.pathname === item.route;
            return (
              <li key={i}>
                <Link
                  to={item.route}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#1A2980] shadow-md font-semibold"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? "text-[#1A2980]" : "text-white"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer (optional) */}
      {!isCollapsed && (
        <div
          className="rounded-2xl p-4 text-center mt-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #26D0CE 0%, #1A2980 100%)",
          }}
        >
          <p className="text-sm font-semibold mb-2 text-white">
            Smart CRM for IT Agencies
          </p>
          <button className="bg-white/20 hover:bg-white/30 transition px-3 py-2 rounded-lg text-sm text-white">
            Learn More
          </button>
        </div>
      )}
    </aside>
  );
}
