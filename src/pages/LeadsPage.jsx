import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState("query");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name"); // ✅ Added
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // ✅ Fetch leads with pagination + search
  const fetchLeads = async (pageNum = 1, searchValue = "", type = "name") => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/leads/all?page=${pageNum}&limit=10&search=${searchValue}`
      );

      let filteredLeads = res.data.leads || [];

      // ✅ Apply search type filter on frontend too (optional redundancy)
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        if (type === "phone")
          filteredLeads = filteredLeads.filter((l) =>
            l.phone_number?.toLowerCase().includes(q)
          );
        if (type === "email")
          filteredLeads = filteredLeads.filter((l) =>
            l.email?.toLowerCase().includes(q)
          );
        if (type === "name")
          filteredLeads = filteredLeads.filter((l) =>
            l.personName?.toLowerCase().includes(q)
          );
      }

      setLeads(filteredLeads);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1, "", searchType);
  }, []);

  // ✅ Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.info("Enter a search term first.");
      return;
    }
    fetchLeads(1, search, searchType);
  };

  // ✅ Add new lead
  const handleAddLead = () => {
    navigate("/add-lead");
  };

  // ✅ Pagination handlers
  const handleNextPage = () => {
    if (page < totalPages) fetchLeads(page + 1, search, searchType);
  };
  const handlePrevPage = () => {
    if (page > 1) fetchLeads(page - 1, search, searchType);
  };

  // ✅ Split data by type
  const newQueries = leads.filter((lead) =>
    lead.queries?.some(
      (q) => q.status === "Created" || q.status === "Quotation"
    )
  );

  const existingLeads = leads.filter(
    (lead) => lead.status === "Old" || lead.status === "Booked"
  );

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
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          {activeTab === "query" ? (
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-[#EAF3FF] to-[#F9FBFF] text-[#1A2980] font-medium uppercase text-xs tracking-wide">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Lead Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Expected Delivery</th>
                  <th className="p-4 text-left">Lead Status</th>
                  <th className="p-4 text-left">Query Status</th>
                </tr>
              </thead>
              <tbody>
                {newQueries.length > 0 ? (
                  newQueries.map((lead, index) =>
                    lead.queries.map((query, qIndex) => (
                      <tr
                        key={`${lead._id}-${qIndex}`}
                        className={`transition ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                        } hover:bg-[#EAF3FF]/60`}
                      >
                        <td className="p-4 text-gray-800 font-medium">
                          {index + 1}
                        </td>
                        <td className="p-4 text-gray-800">{lead.personName}</td>
                        <td className="p-4 text-gray-700">{lead.email}</td>
                        <td className="p-4 text-gray-700">
                          {lead.phone_number}
                        </td>
                        <td className="p-4 text-gray-700">
                          {query.services.join(", ")}
                        </td>
                        <td className="p-4 text-gray-700">
                          {new Date(
                            query.expected_delivery_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-[#1A2980] font-medium">
                          {lead.status}
                        </td>
                        <td
                          className={`p-4 font-semibold ${
                            query.status === "Created"
                              ? "text-amber-600"
                              : query.status === "Quotation"
                              ? "text-blue-600"
                              : query.status === "Booked"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {query.status}
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-4 text-gray-400 italic"
                    >
                      No Queries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
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
                  existingLeads.map((lead, index) => (
                    <tr
                      key={lead._id}
                      className={`transition ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                      } hover:bg-[#EAF3FF]/60`}
                    >
                      <td className="p-4 text-gray-800 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-4 text-gray-800">{lead.personName}</td>
                      <td className="p-4 text-gray-700">{lead.company_name}</td>
                      <td className="p-4 text-gray-700">{lead.email}</td>
                      <td className="p-4 text-gray-700">{lead.phone_number}</td>
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
                  ))
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
          )}
        </div>
      )}

      {/* ✅ Pagination Component */}
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
