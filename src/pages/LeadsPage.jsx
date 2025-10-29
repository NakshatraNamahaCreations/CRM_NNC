import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState("query");
  const [leads, setLeads] = useState([]);
  const [queriesList, setQueriesList] = useState([]); // ✅ flattened list of all queries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch Leads with Pagination + Search */
  /* -------------------------------------------------------------------------- */
  const fetchLeads = async (pageNum = 1, searchValue = "", type = "name") => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/leads/all?page=${pageNum}&limit=10&search=${searchValue}&type=${type}`
      );

      const leadsData = res.data.leads || [];
      setLeads(leadsData);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);

      // ✅ Flatten all queries with lead info
      const allQueries = [];
      leadsData.forEach((lead) => {
        lead.queries?.forEach((q) => {
          allQueries.push({
            ...q,
            lead_id: lead.lead_id,
            lead_status: lead.status,
            company_name: lead.company_name,
            person: lead.persons?.[0] || {},
          });
        });
      });

      // ✅ Sort by created date (latest first)
      allQueries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setQueriesList(allQueries);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1, "", searchType);
  }, [location.search]); // ✅ re-fetch when redirected after update

  /* -------------------------------------------------------------------------- */
  /* 🔍 Search Handler */
  /* -------------------------------------------------------------------------- */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.info("Enter a search term first.");
      return;
    }
    fetchLeads(1, search, searchType);
  };

  /* -------------------------------------------------------------------------- */
  /* ➕ Add New Lead */
  /* -------------------------------------------------------------------------- */
  const handleAddLead = () => {
    navigate("/add-lead");
  };

  /* -------------------------------------------------------------------------- */
  /* 🔄 Pagination */
  /* -------------------------------------------------------------------------- */
  const handleNextPage = () => {
    if (page < totalPages) fetchLeads(page + 1, search, searchType);
  };
  const handlePrevPage = () => {
    if (page > 1) fetchLeads(page - 1, search, searchType);
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 Separate Old Leads */
  /* -------------------------------------------------------------------------- */
  const existingLeads = leads.filter(
    (lead) => lead.status === "Old" || lead.status === "Booked"
  );

  /* -------------------------------------------------------------------------- */
  /* 🧱 UI */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1A2980]">
          Lead Management
        </h2>
        <button
          onClick={handleAddLead}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Search Section */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 mb-6"
      >
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="phone">Search by Phone</option>
          <option value="email">Search by Email</option>
          <option value="name">Search by Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#26D0CE] to-[#1A2980] text-white rounded shadow hover:shadow-md transition-all"
        >
          <Search size={16} /> Search
        </button>
      </form>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b">
        <button
          onClick={() => setActiveTab("query")}
          className={`pb-2 font-medium text-sm border-b-2 transition ${
            activeTab === "query"
              ? "border-[#26D0CE] text-[#1A2980]"
              : "border-transparent text-gray-500 hover:text-[#26D0CE]"
          }`}
        >
          Queries
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`pb-2 font-medium text-sm border-b-2 transition ${
            activeTab === "leads"
              ? "border-[#26D0CE] text-[#1A2980]"
              : "border-transparent text-gray-500 hover:text-[#26D0CE]"
          }`}
        >
          Leads
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 italic">
          Loading leads...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-medium">
          {error}
        </div>
      ) : activeTab === "query" ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#EAF3FF] to-[#F9FBFF] text-[#1A2980] font-medium uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Query No.</th>
                <th className="p-4 text-left">Lead Name</th>
                {/* <th className="p-4 text-left">Email</th> */}
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Service</th>
                {/* <th className="p-4 text-left">Expected Delivery</th> */}
                <th className="p-4 text-left">Lead Status</th>
                <th className="p-4 text-left">Query Status</th>
                <th className="p-4 text-left">Action</th> {/* ✅ New Column */}
              </tr>
            </thead>
            <tbody>
              {queriesList.length > 0 ? (
                queriesList.map((q, index) => (
                  <tr
                    key={`${q.query_id}-${index}`}
                    className={`transition cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                    } hover:bg-[#EAF3FF]/60`}
                  >

                    <td className="p-4 text-gray-800 font-medium">
                      {index + 1}
                    </td>
                    <td>{q.query_id}</td>
                    <td className="p-4 text-gray-800">{q.person.name}</td>
                    {/* <td className="p-4 text-gray-700">{q.person.email}</td> */}
                    <td className="p-4 text-gray-700">{q.person.phone}</td>
                    <td className="p-4 text-gray-700">
                      {q.services?.join(", ")}
                    </td>
                    {/* <td className="p-4 text-gray-700">
                      {new Date(q.expected_delivery_date).toLocaleDateString()}
                    </td> */}
                    <td className="p-4 text-[#1A2980] font-medium">
                      {q.lead_status}
                    </td>
                    <td
                      className={`p-4 font-semibold ${
                        q.status === "Created"
                          ? "text-amber-600"
                          : q.status === "Quotation"
                          ? "text-blue-600"
                          : q.status === "Booked"
                          ? "text-green-600"
                          : q.status === "Call Later"
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    >
                      {q.status}
                    </td>

                    {/* ✅ Action Buttons */}
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/view-details/${q.lead_id}/${q.query_id}`)
                        }
                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View
                      </button>

                      {q.status === "Quotation" && (
                        <button
                          onClick={() =>
                            navigate(`/create-quote/${q.lead_id}/${q.query_id}`)
                          }
                          className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Create Quote
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-4 text-gray-400 italic"
                  >
                    No Queries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#EAF3FF] to-[#F9FBFF] text-[#1A2980] font-medium uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {existingLeads.length > 0 ? (
                existingLeads.map((lead, index) => {
                  const person = lead.persons?.[0] || {};
                  return (
                    <tr
                      key={lead._id}
                      className={`transition ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                      } hover:bg-[#EAF3FF]/60`}
                    >
                      <td className="p-4 text-gray-800 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-4 text-gray-800">{person.name}</td>
                      <td className="p-4 text-gray-700">{lead.company_name}</td>
                      <td className="p-4 text-gray-700">{person.email}</td>
                      <td className="p-4 text-gray-700">{person.phone}</td>
                      <td
                        className={`p-4 font-semibold ${
                          lead.status === "Booked"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {lead.status}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-400 italic"
                  >
                    No leads available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && leads.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
}
