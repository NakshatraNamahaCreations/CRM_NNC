// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Navigate,
// // } from "react-router-dom";
// // import Sidebar from "./components/Sidebar";
// // import Topbar from "./components/Topbar";
// // import ProfileHeader from "./components/ProfileHeader";
// // import DashboardContent from "./pages/DashboardContent";
// // import LeadsPage from "./pages/LeadsPage";
// // import MasterPage from "./pages/MasterPage";

// // export default function App() {
// //   return (
// //     <Router>
// //       <div
// //         className="flex min-h-screen"
// //         style={{
// //           background: "linear-gradient(180deg, #EAF3FF 0%, #F9FBFF 100%)",
// //         }}
// //       >
// //         <Sidebar />
// //         <main className="flex-1 p-6 space-y-5 overflow-y-auto">
// //           <Topbar />

// //           <Routes>
// //             <Route path="/" element={<Navigate to="/dashboard" replace />} />
// //             <Route path="/dashboard" element={<DashboardContent />} />
// //             <Route path="/leads" element={<LeadsPage />} />
// //             <Route path="/master" element={<MasterPage />} />
// //           </Routes>
// //         </main>
// //       </div>
// //     </Router>
// //   );
// // }

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import DashboardContent from "./pages/DashboardContent";
// import LeadsPage from "./pages/LeadsPage";
// import MasterPage from "./pages/MasterPage";
// import AddLeadPage from "./components/lead/AddLeadPage"; // ✅ new import
// import EditLeadPage from "./components/lead/EditLeadPage"; // ✅ new import
// import Layout from "./pages/Layout";
// import "react-toastify/dist/ReactToastify.css";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect root to dashboard */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         {/* Main layout wrapper */}
//         <Route
//           path="/*"
//           element={
//             <Layout>
//               <Routes>
//                 <Route path="/dashboard" element={<DashboardContent />} />
//                 <Route path="/leads" element={<LeadsPage />} />
//                 <Route path="/master" element={<MasterPage />} />
//                 <Route path="/add-lead" element={<AddLeadPage />} />

//                 <Route
//                   path="/edit-lead/:leadId/:queryId"
//                   element={<EditLeadPage />}
//                 />
//               </Routes>
//             </Layout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardContent from "./pages/DashboardContent";
import LeadsPage from "./pages/LeadsPage";
import MasterPage from "./pages/MasterPage";
import AddLeadPage from "./components/lead/AddLeadPage";
import EditLeadPage from "./components/lead/EditLeadPage";
import ViewQueryDetails from "./components/lead/ViewQueryDetails"; // ✅ new import
import Layout from "./pages/Layout";
import "react-toastify/dist/ReactToastify.css";
import FollowUpPage from "./pages/FollowUpPage";
import FollowUpsByDate from "./components/followup/FollowUpsByDate";
import CreateQuotation from "./components/quotation/CreateQuotation";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main layout wrapper */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<DashboardContent />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/master" element={<MasterPage />} />
                <Route path="/follow-up" element={<FollowUpPage />} />
                <Route path="/add-lead" element={<AddLeadPage />} />
                <Route
                  path="/edit-lead/:leadId/:queryId"
                  element={<EditLeadPage />}
                />
                <Route
                  path="/view-details/:leadId/:queryId"
                  element={<ViewQueryDetails />}
                />
                <Route path="/followups" element={<FollowUpsByDate />} />
                <Route
                  path="/create-quote/:leadId/:queryId"
                  element={<CreateQuotation />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
