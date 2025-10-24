// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../utils/api";

// export default function ViewQueryDetails() {
//   const { leadId, queryId } = useParams();
//   const navigate = useNavigate();
//   const [lead, setLead] = useState(null);
//   const [query, setQuery] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // const API_URL = "http://localhost:8000/api/leads";

//   /* -------------------------------------------------------------------------- */
//   /* 🔹 Fetch Query Details */
//   /* -------------------------------------------------------------------------- */
//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${API_URL}/leads/details/${leadId}?queryId=${queryId}`
//         );
//         const data = res.data.lead;

//         setLead(data);
//         setQuery(data.queries?.[0] || null);
//         setStatus(data.queries?.[0]?.status || "");
//       } catch (error) {
//         console.error("Error fetching query details:", error);
//         toast.error("Failed to fetch query details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [leadId, queryId]);

//   /* -------------------------------------------------------------------------- */
//   /* 🔹 Update Query Status */
//   /* -------------------------------------------------------------------------- */
//   const handleStatusChange = async (newStatus) => {
//     setStatus(newStatus);

//     try {
//       setUpdating(true);
//       // 🔸 You can later add a real PATCH endpoint here:
//       // await axios.patch(`${API_URL}/update-status/${leadId}/${queryId}`, { status: newStatus });

//       toast.success(`Query status updated to "${newStatus}"`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update query status");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-gray-500 italic">
//         Loading query details...
//       </div>
//     );
//   }

//   if (!lead || !query) {
//     return (
//       <div className="text-center py-20 text-gray-500 italic">
//         No details found for this query.
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto border border-gray-100">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 text-[#1A2980] font-medium mb-6 hover:underline"
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
//         <h2 className="text-2xl font-semibold text-[#1A2980]">
//           Query Details — {query.query_id}
//         </h2>

//         <div className="flex items-center gap-3 flex-wrap">
//           {/* 🔹 Edit Button */}
//           <button
//             onClick={() => navigate(`/edit-lead/${leadId}/${query.query_id}`)}
//             className="px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded shadow hover:shadow-md transition-all text-sm font-medium"
//           >
//             Edit Lead
//           </button>

//           {/* 🔹 Change Status */}
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-600 font-medium">
//               Change Status:
//             </label>
//             <select
//               value={status}
//               onChange={(e) => handleStatusChange(e.target.value)}
//               disabled={updating}
//               className="border border-gray-300 rounded px-3 py-2 text-sm text-[#1A2980] bg-gray-50"
//             >
//               {[
//                 "Created",
//                 "Not Interested",
//                 "Call Later",
//                 "Quotation",
//                 "Booked",
//               ].map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Company Details */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
//         <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
//           Company Details
//         </h3>
//         <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
//           <p>
//             <b>Company Name:</b> {lead.company_name}
//           </p>
//           <p>
//             <b>Lead Source:</b> {lead.lead_source}
//           </p>
//           <p>
//             <b>Country:</b> {lead.location.country}
//           </p>
//           <p>
//             <b>State:</b> {lead.location.state}
//           </p>
//           <p>
//             <b>City:</b> {lead.location.city}
//           </p>
//           <p>
//             <b>Zip Code:</b> {lead.location.zip_code}
//           </p>
//         </div>
//       </div>

//       {/* Persons List */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
//         <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
//           Contact Persons
//         </h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border text-sm">
//             <thead className="bg-[#EAF3FF] text-[#1A2980] font-medium">
//               <tr>
//                 <th className="p-3 text-left border">#</th>
//                 <th className="p-3 text-left border">Name</th>
//                 <th className="p-3 text-left border">Email</th>
//                 <th className="p-3 text-left border">Phone</th>
//                 <th className="p-3 text-left border">Designation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lead.persons.map((p, i) => (
//                 <tr
//                   key={i}
//                   className={`${
//                     i % 2 === 0 ? "bg-white" : "bg-[#F9FBFF]"
//                   } hover:bg-[#EAF3FF]/40 transition`}
//                 >
//                   <td className="p-3 border text-gray-700 font-medium">
//                     {i + 1}
//                   </td>
//                   <td className="p-3 border text-gray-700">{p.name}</td>
//                   <td className="p-3 border text-gray-700">{p.email}</td>
//                   <td className="p-3 border text-gray-700">{p.phone}</td>
//                   <td className="p-3 border text-gray-700">{p.designation}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Query Information */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//         <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
//           Query Information
//         </h3>
//         <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
//           <p>
//             <b>Query ID:</b> {query.query_id}
//           </p>
//           <p>
//             <b>Expected Delivery:</b>{" "}
//             {new Date(query.expected_delivery_date).toLocaleDateString()}
//           </p>

//           {/* ✅ Highlighted Services */}
//           <div className="md:col-span-2">
//             <b>Services:</b>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {query.services.map((srv, idx) => (
//                 <span
//                   key={idx}
//                   className="bg-gradient-to-r from-[#EAF3FF] to-[#D6EEFF] text-[#1A2980] font-medium px-3 py-1 rounded-full text-xs border border-[#B5D6FF] shadow-sm"
//                 >
//                   {srv}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <p>
//             <b>Created At:</b> {new Date(query.createdAt).toLocaleDateString()}{" "}
//             {new Date(query.createdAt).toLocaleTimeString()}
//           </p>
//           <p>
//             <b>Last Updated:</b>{" "}
//             {new Date(query.updatedAt).toLocaleDateString()}{" "}
//             {new Date(query.updatedAt).toLocaleTimeString()}
//           </p>
//           <p>
//             <b>Status:</b>{" "}
//             <span
//               className={`font-semibold ${
//                 status === "Created"
//                   ? "text-amber-600"
//                   : status === "Quotation"
//                   ? "text-blue-600"
//                   : status === "Booked"
//                   ? "text-green-600"
//                   : status === "Not Interested"
//                   ? "text-red-500"
//                   : "text-gray-600"
//               }`}
//             >
//               {status}
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "../../utils/api";

export default function ViewQueryDetails() {
  const { leadId, queryId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [callHistory, setCallHistory] = useState([]);

  // Call Later modal states
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [callPerson, setCallPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // For animation

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch Query Details */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/leads/details/${leadId}?queryId=${queryId}`
        );
        const data = res.data.lead;
        setLead(data);
        setQuery(data.queries?.[0] || null);
        setStatus(data.queries?.[0]?.status || "");
        fetchCallHistory();
      } catch (error) {
        console.error("Error fetching query details:", error);
        toast.error("Failed to fetch query details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [leadId, queryId]);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch Call History */
  /* -------------------------------------------------------------------------- */
  const fetchCallHistory = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/leads/call-history/${leadId}/${queryId}`
      );
      setCallHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching call history:", err);
    }
  };

  // Inside handleStatusChange
  const handleStatusChange = async (newStatus) => {
    if (newStatus === "Call Later") {
      setShowModal(true);
      setTimeout(() => setIsModalVisible(true), 10);
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(`${API_URL}/leads/update-status/${leadId}/${queryId}`, {
        status: newStatus,
      });
      toast.success(`Query status updated to "${newStatus}"`);
      setStatus(newStatus);
      navigate("/leads?refresh=true"); // ✅ trigger re-fetch
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update query status");
    } finally {
      setUpdating(false);
    }
  };

  // Inside handleCallLaterSubmit
  const handleCallLaterSubmit = async () => {
    if (!remarks || !rescheduleDate || !callPerson) {
      toast.warn("Please fill all fields!");
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(`${API_URL}/leads/update-status/${leadId}/${queryId}`, {
        status: "Call Later",
        remarks,
        reschedule_date: rescheduleDate,
        person_name: callPerson,
        created_by: "Admin",
      });
      toast.success("Call Later recorded successfully!");
      setStatus("Call Later");
      closeModal();
      fetchCallHistory();
      navigate("/leads?refresh=true"); // ✅ refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to record call later info");
    } finally {
      setUpdating(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 Modal close handler */
  /* -------------------------------------------------------------------------- */
  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setRemarks("");
      setRescheduleDate("");
      setCallPerson("");
    }, 200); // delay matches animation
  };

  /* -------------------------------------------------------------------------- */
  /* 🧱 UI Rendering */
  /* -------------------------------------------------------------------------- */
  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 italic">
        Loading query details...
      </div>
    );

  if (!lead || !query)
    return (
      <div className="text-center py-20 text-gray-500 italic">
        No details found for this query.
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto border border-gray-100 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#1A2980] font-medium mb-6 hover:underline"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-semibold text-[#1A2980]">
          Query Details — {query.query_id}
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/edit-lead/${leadId}/${query.query_id}`)}
            className="px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded shadow hover:shadow-md transition-all text-sm font-medium"
          >
            Edit Lead
          </button>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Change Status:
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              onClick={(e) => {
                // 👇 Detect click when same option is selected again
                if (e.target.value === "Call Later") {
                  handleStatusChange("Call Later");
                }
              }}
              disabled={updating}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-[#1A2980] bg-gray-50"
            >
              {[
                "Created",
                "Not Interested",
                "Call Later",
                "Quotation",
                "Booked",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
          Company Details
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <b>Company Name:</b> {lead.company_name}
          </p>
          <p>
            <b>Lead Source:</b> {lead.lead_source}
          </p>
          <p>
            <b>Country:</b> {lead.location.country}
          </p>
          <p>
            <b>State:</b> {lead.location.state}
          </p>
          <p>
            <b>City:</b> {lead.location.city}
          </p>
          <p>
            <b>Zip Code:</b> {lead.location.zip_code}
          </p>
        </div>
      </div>

      {/* Contact Persons */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
          Contact Persons
        </h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-[#EAF3FF] text-[#1A2980] font-medium">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Designation</th>
            </tr>
          </thead>
          <tbody>
            {lead.persons.map((p, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-[#F9FBFF]"}`}
              >
                <td className="p-3 border">{i + 1}</td>
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">{p.email}</td>
                <td className="p-3 border">{p.phone}</td>
                <td className="p-3 border">{p.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Query Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
          Query Information
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <b>Query ID:</b> {query.query_id}
          </p>
          <p>
            <b>Expected Delivery:</b>{" "}
            {new Date(query.expected_delivery_date).toLocaleDateString()}
          </p>

          <div className="md:col-span-2">
            <b>Services:</b>
            <div className="flex flex-wrap gap-2 mt-1">
              {query.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-[#EAF3FF] to-[#D6EEFF] text-[#1A2980] font-medium px-3 py-1 rounded-full text-xs border border-[#B5D6FF] shadow-sm"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>

          <p>
            <b>Status:</b>{" "}
            <span className="font-semibold text-[#1A2980]">{status}</span>
          </p>
        </div>
      </div>

      {/* Call History */}
      {callHistory.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[#1A2980] mb-3">
            Call History
          </h3>
          <table className="min-w-full border text-sm">
            <thead className="bg-[#EAF3FF] text-[#1A2980] font-medium">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Person</th>
                <th className="p-3 border">Remarks</th>
                <th className="p-3 border">Reschedule</th>
              </tr>
            </thead>
            <tbody>
              {callHistory.map((c, i) => (
                <tr key={i} className="hover:bg-[#EAF3FF]/40 transition">
                  <td className="p-3 border">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{c.person_name}</td>
                  <td className="p-3 border">{c.remarks}</td>
                  <td className="p-3 border">
                    {new Date(c.reschedule_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 💫 Call Later Modal with Animation */}
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 transition-opacity duration-300 ${
            isModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[420px] p-6 transform transition-all duration-300 ${
              isModalVisible
                ? "scale-100 translate-y-0 opacity-100"
                : "scale-90 -translate-y-5 opacity-0"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 text-[#1A2980] text-center">
              Reschedule Call
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Person Spoken With <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1A2980]/40 outline-none"
                  value={callPerson}
                  onChange={(e) => setCallPerson(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Reschedule Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1A2980]/40 outline-none"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1A2980]/40 outline-none"
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="text-gray-600 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCallLaterSubmit}
                className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
