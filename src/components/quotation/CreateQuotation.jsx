import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

/* ---------- Helpers ---------- */
const fmt = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? "₹" + Math.round(n).toLocaleString()
    : "-";

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/* ---------- Main Component ---------- */
export default function CreateQuotation() {
  const { leadId, queryId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceList, setServiceList] = useState([]);
  const [items, setItems] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [applyGST, setApplyGST] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [savedQuotations, setSavedQuotations] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentQuotationId, setCurrentQuotationId] = useState(null);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [quoteTitle, setQuoteTitle] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const leadRes = await axios.get(
          `${API_URL}/leads/details/${leadId}?queryId=${queryId}`
        );
        setLead(leadRes.data?.lead || null);

        const srvRes = await axios.get(`${API_URL}/services/`);
        const arr = Array.isArray(srvRes.data?.data)
          ? srvRes.data.data
          : Array.isArray(srvRes.data)
          ? srvRes.data
          : [];
        setServiceList(
          arr.map((s, i) => ({
            id: s._id || s.id || `srv_${i}`,
            name: s.serviceName || s.name || `Service ${i + 1}`,
            price: Number(s.price || 0),
            marginPrice: Number(s.marginPrice || 0),
          }))
        );

        await fetchQuotations();
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [leadId, queryId]);

  const fetchQuotations = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/quotations/by-lead/${leadId}/${queryId}`
      );
      setSavedQuotations(res.data?.quotations || []);
    } catch (err) {
      console.error("Error fetching quotations:", err);
    }
  };

  /* ---------- Totals ---------- */
  const totalBase = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price) || 0), 0),
    [items]
  );
  const totalMargin = useMemo(
    () => items.reduce((s, it) => s + (Number(it.marginPrice) || 0), 0),
    [items]
  );

  const safeDiscount = Math.max(0, Math.min(Number(discount || 0), totalBase));
  const afterDiscount = totalBase - safeDiscount;
  const gstValue = applyGST ? afterDiscount * 0.18 : 0;
  const grandTotal = afterDiscount + gstValue;

  useEffect(() => {
    if (grandTotal > 0 && installments.length === 0) {
      const defaults = [
        { id: uid(), name: "Installment 1", percentage: 50 },
        { id: uid(), name: "Installment 2", percentage: 30 },
        { id: uid(), name: "Installment 3", percentage: 20 },
      ].map((i) => ({
        ...i,
        amount: Math.round((i.percentage / 100) * grandTotal),
      }));
      setInstallments(defaults);
    }
  }, [grandTotal]);

  useEffect(() => {
    setInstallments((prev) =>
      prev.map((i) => ({
        ...i,
        amount: Math.round((Number(i.percentage || 0) / 100) * grandTotal),
      }))
    );
  }, [grandTotal]);

  /* ---------- CRUD Handlers ---------- */
  const addServiceRow = (srv) =>
    setItems((prev) => [
      ...prev,
      {
        id: uid(),
        name: srv.name,
        price: srv.price,
        marginPrice: srv.marginPrice,
        expectedDelivery: "",
      },
    ]);

  const updateRow = (id, patch) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id) => setItems((prev) => prev.filter((r) => r.id !== id));

  const addInstallment = () => {
    const usedPct = installments.reduce(
      (sum, i) => sum + Number(i.percentage || 0),
      0
    );
    const remaining = Math.max(0, 100 - usedPct);

    if (remaining <= 0) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    const newInst = {
      id: uid(),
      name: `Installment ${installments.length + 1}`,
      percentage: remaining >= 20 ? 20 : remaining,
      amount: Math.round(
        ((remaining >= 20 ? 20 : remaining) / 100) * grandTotal
      ),
    };
    setInstallments([...installments, newInst]);
  };

  const removeInstallment = (id) =>
    setInstallments((prev) => prev.filter((i) => i.id !== id));

  const updateInstallment = (id, field, value) => {
    setInstallments((prev) => {
      const updated = prev.map((i) =>
        i.id === id
          ? {
              ...i,
              [field]: value,
              amount: Math.round(
                ((field === "percentage" ? value : i.percentage) / 100) *
                  grandTotal
              ),
            }
          : i
      );
      const totalPct = updated.reduce(
        (sum, i) => sum + Number(i.percentage || 0),
        0
      );
      if (totalPct > 100) {
        toast.error("Total percentage cannot exceed 100%");
        return prev;
      }
      return updated;
    });
  };

  /* ---------- API: Create/Update ---------- */
  const handleSaveQuotation = async () => {
    if (items.length === 0) return toast.error("Add at least one service");
    setShowModal(true); // open modal for title/description
  };
  const submitQuotation = async () => {
    const payload = {
      lead_Id: lead._id,
      query_Id: lead.queries.find((q) => q.query_id === queryId)?._id,
      lead_id: leadId,
      query_id: queryId,
      quoteTitle,
      quoteDescription,
      quotationServices: items.map(({ id, ...rest }) => rest), // ✅ correct key
      discountValue: safeDiscount,
      gstApplied: applyGST,
      gstValue,
      totalAmount: grandTotal,
      marginAmount: totalMargin,
      installments: installments.map((i, index) => ({
        installmentNumber: index + 1,
        percentage: i.percentage,
        totalAmount: i.amount,
        dueAmount: i.amount,
        dueDate: new Date(),
      })),
    };

    try {
      const res = isUpdating
        ? await axios.put(
            `${API_URL}/quotations/update/${currentQuotationId}`,
            payload
          )
        : await axios.post(`${API_URL}/quotations/create`, payload);

      if (res.data.success) {
        toast.success(
          isUpdating
            ? "Quotation updated successfully!"
            : "Quotation created successfully!"
        );
        setShowModal(false);
        setQuoteTitle("");
        setQuoteDescription("");
        await fetchQuotations();
        setItems([]);
      } else toast.error(res.data.message || "Failed to save quotation");
    } catch (err) {
      console.error("Error saving quotation:", err);
      toast.error("Server error");
    }
  };

  const handleEditQuotation = (q) => {
    setIsUpdating(true);
    setCurrentQuotationId(q.quotationId);
    setItems(q.items);
    setDiscount(q.discountValue);
    setApplyGST(q.gstApplied);
    setNoteText(q.quoteDescription);
    toast.info("Edit mode enabled for " + q.quotationId);
  };

  /* ---------- UI ---------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (!lead)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Lead not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-[#eef2ff] py-10 px-6 font-[Poppins]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#23408B]">
            Create Quotation
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* ===== CUSTOMER DETAILS ===== */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-5">
            <h2 className="text-lg font-semibold text-[#23408B] flex items-center gap-2">
              Customer Details
            </h2>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <span className="px-3 py-1 bg-[#32984D]/10 text-[#32984D] text-xs font-medium rounded-full">
                Quotation
              </span>
              <button
                onClick={() =>
                  navigate(`/edit-lead/${lead.lead_id}/${queryId}`)
                }
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaEdit className="text-gray-500" /> Edit
              </button>
              <button
                onClick={() => setShowNoteModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-[#23408B] text-white rounded-md text-sm hover:bg-[#1f3677]"
              >
                <FaPlus /> Add Note
              </button>
            </div>
          </div>

          {/* Lead Info */}
          <div className="grid md:grid-cols-2 gap-y-3 text-sm text-slate-700 border-b border-gray-200 pb-4 mb-4">
            <p>
              <span className="font-medium text-gray-600">Lead ID:</span>{" "}
              <span className="text-[#23408B] font-semibold">
                {lead.lead_id}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Reference:</span>{" "}
              {lead.reference || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Query ID:</span>{" "}
              <span className="text-[#23408B] font-semibold">{queryId}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Lead Source:</span>{" "}
              {lead.lead_source || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Company:</span>{" "}
              {lead.company_name || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Lead Status:</span>{" "}
              <span
                className={`${
                  lead.status === "Old"
                    ? "text-amber-600 bg-amber-50"
                    : "text-emerald-600 bg-emerald-50"
                } px-2 py-0.5 rounded-full text-xs font-medium`}
              >
                {lead.status}
              </span>
            </p>
          </div>

          {/* Persons */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Persons</h4>

            {/* Grid layout — 1 column on mobile, up to 3 on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lead.persons?.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-gray-200 rounded-xl bg-[#f9fafb] px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#23408B] text-white flex items-center justify-center font-semibold text-base">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium leading-tight">
                        {p.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {p.designation || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#23408B] text-sm font-semibold">
                      {p.phone}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                      {p.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Query Details */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Query Details</h4>
            <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
              <thead className="bg-[#f8fafc] text-gray-700 text-xs uppercase">
                <tr>
                  <th className="p-3 text-left font-medium">
                    Category / Services
                  </th>
                  <th className="p-3 text-center font-medium">
                    Expected Delivery
                  </th>
                  <th className="p-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lead.queries
                  ?.filter((q) => q.query_id === queryId)
                  ?.map((q, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{q.services?.join(", ") || "—"}</td>
                      <td className="p-3 text-center">
                        {new Date(
                          q.expected_delivery_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            q.status === "Created"
                              ? "bg-blue-50 text-blue-600"
                              : q.status === "Quotation"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ===== SAVED QUOTATIONS ===== */}
        {savedQuotations.length > 0 && (
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="text-sm mb-3 bg-blue-50 border border-blue-200 p-2 rounded">
              <strong>Note:</strong> Only one quotation can be marked as{" "}
              <b>Finalized</b>.
            </div>
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-[#1A2980] text-white">
                <tr>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {savedQuotations.map((q) => (
                  <tr key={q._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{q.quoteTitle}</td>
                    <td className="p-2">
                      {new Date(q.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-2 text-right">{fmt(q.totalAmount)}</td>
                    <td className="p-2 text-center">
                      {q.finalized ? (
                        <span className="text-green-600 font-medium">
                          Finalized
                        </span>
                      ) : (
                        <span className="text-gray-500">Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== SERVICES ===== */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#23408B]">
              Add Services
            </h3>
            <p className="text-sm text-gray-500">
              Select and manage the services for this quotation
            </p>
          </div>

          <select
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-[#23408B] focus:outline-none"
            defaultValue=""
            onChange={(e) => {
              const srv = serviceList.find((s) => s.id === e.target.value);
              if (srv) addServiceRow(srv);
              e.target.value = "";
            }}
          >
            <option value="">Select a service...</option>
            {serviceList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#f8fafc] text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-center">Delivery</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Margin</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((it) => (
                    <tr key={it.id} className="border-t hover:bg-[#f9fbff]">
                      <td className="p-3 font-medium text-gray-800">
                        {it.name}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="date"
                          className="border rounded-md px-2 py-1 text-sm text-center focus:ring-2 focus:ring-[#23408B]"
                          value={it.expectedDelivery || ""}
                          onChange={(e) =>
                            updateRow(it.id, {
                              expectedDelivery: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="p-3 text-right text-[#23408B] font-semibold">
                        ₹{it.price}
                      </td>
                      <td className="p-3 text-right text-gray-600">
                        ₹{it.marginPrice}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeRow(it.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-400 py-4 font-medium"
                    >
                      No services added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== SUMMARY + INSTALLMENTS ===== */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#23408B] mb-3 flex items-center gap-2">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Base</span>
                  <span>{fmt(totalBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Margin</span>
                  <span>{fmt(totalMargin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount (₹)</span>
                  <input
                    type="number"
                    className="border rounded-md px-2 py-1 w-24 text-right"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value || 0))}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={applyGST}
                      onChange={(e) => setApplyGST(e.target.checked)}
                    />
                    Apply GST (18%)
                  </label>
                  <span>{fmt(gstValue)}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-[#23408B] text-base">
                  <span>Grand Total</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Installments */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#23408B] flex items-center gap-2">
                  <FaPlus /> Installments
                </h3>
                <button
                  onClick={addInstallment}
                  className="px-3 py-1.5 bg-[#23408B] text-white rounded-md text-sm hover:bg-[#1d3677]"
                >
                  Add
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-[#f8fafc] text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="p-2 text-left">Installment</th>
                      <th className="p-2 text-center">%</th>
                      <th className="p-2 text-right">Amount</th>
                      <th className="p-2 text-center">—</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst) => (
                      <tr key={inst.id} className="border-t hover:bg-[#f9fbff]">
                        <td className="p-2">{inst.name}</td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            className="border rounded-md px-2 py-1 w-20 text-center"
                            value={inst.percentage}
                            onChange={(e) =>
                              updateInstallment(
                                inst.id,
                                "percentage",
                                Number(e.target.value || 0)
                              )
                            }
                          />
                        </td>
                        <td className="p-2 text-right text-[#23408B] font-semibold">
                          {fmt(inst.amount)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeInstallment(inst.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== ACTION BUTTON ===== */}

        {items.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveQuotation}
              className="bg-gradient-to-r from-[#23408B] to-[#32984D] text-white px-6 py-2.5 rounded-md font-medium hover:opacity-90"
            >
              {isUpdating ? "Update Quotation" : "Save Quotation"}
            </button>
          </div>
        )}
      </div>

      {/* ===== Modal for Title & Description ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-[#23408B]">
              New Quotation
            </h3>
            <input
              placeholder="Quotation Title"
              value={quoteTitle}
              onChange={(e) => setQuoteTitle(e.target.value)}
              className="border w-full mb-3 px-3 py-2 rounded-md"
            />
            <textarea
              placeholder="Quotation Description"
              value={quoteDescription}
              onChange={(e) => setQuoteDescription(e.target.value)}
              className="border w-full mb-3 px-3 py-2 rounded-md"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitQuotation}
                className="px-4 py-2 bg-[#23408B] text-white rounded-md hover:bg-[#1f3677]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_URL } from "../../utils/api";
// import {
//   FaCheckCircle,
//   FaEdit,
//   FaPlus,
//   FaTrash,
//   FaArrowLeft,
// } from "react-icons/fa";

// /* ---------- Helpers ---------- */
// const fmt = (n) =>
//   typeof n === "number" && !Number.isNaN(n)
//     ? "₹" + Math.round(n).toLocaleString()
//     : "-";

// const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// const STORAGE_KEY = (queryId) => `it-quotes:${queryId}`;

// /* ---------- Main Component ---------- */
// export default function CreateQuotation() {
//   const { leadId, queryId } = useParams();
//   const navigate = useNavigate();

//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [serviceList, setServiceList] = useState([]);
//   const [items, setItems] = useState([]);
//   const [installments, setInstallments] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [applyGST, setApplyGST] = useState(true);
//   const [saved, setSaved] = useState([]);

//   // Add Note modal states
//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [noteText, setNoteText] = useState("");

//   /* ---------- Fetch Data ---------- */
//   useEffect(() => {
//     async function loadData() {
//       try {
//         setLoading(true);
//         const leadRes = await axios.get(
//           `${API_URL}/leads/details/${leadId}?queryId=${queryId}`
//         );
//         setLead(leadRes.data?.lead || leadRes.data || null);

//         const srvRes = await axios.get(`${API_URL}/services/`);
//         const arr = Array.isArray(srvRes.data?.data)
//           ? srvRes.data.data
//           : Array.isArray(srvRes.data)
//           ? srvRes.data
//           : [];
//         setServiceList(
//           arr.map((s, i) => ({
//             id: s._id || s.id || `srv_${i}`,
//             name: s.name || s.serviceName || s.title || `Service ${i + 1}`,
//             price: Number(s.price || 0),
//             marginPrice: Number(s.marginPrice || 0),
//           }))
//         );
//       } catch (err) {
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadData();
//   }, [leadId, queryId]);

//   /* ---------- Totals ---------- */
//   const totalBase = useMemo(
//     () =>
//       items.reduce(
//         (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1),
//         0
//       ),
//     [items]
//   );
//   const totalMargin = useMemo(
//     () =>
//       items.reduce(
//         (s, it) => s + (Number(it.marginPrice) || 0) * (Number(it.qty) || 1),
//         0
//       ),
//     [items]
//   );

//   const safeDiscount = Math.max(0, Math.min(Number(discount || 0), totalBase));
//   const afterDiscount = totalBase - safeDiscount;
//   const gstValue = applyGST ? afterDiscount * 0.18 : 0;
//   const grandTotal = afterDiscount + gstValue;

//   useEffect(() => {
//     if (grandTotal > 0 && installments.length === 0) {
//       const defaults = [
//         { id: uid(), name: "Installment 1", percentage: 50 },
//         { id: uid(), name: "Installment 2", percentage: 30 },
//         { id: uid(), name: "Installment 3", percentage: 20 },
//       ].map((i) => ({
//         ...i,
//         amount: Math.round((i.percentage / 100) * grandTotal),
//       }));
//       setInstallments(defaults);
//     }
//   }, [grandTotal]); //
//   // Always recalc amount when total changes
//   useEffect(() => {
//     setInstallments((prev) =>
//       prev.map((i) => ({
//         ...i,
//         amount: Math.round((Number(i.percentage || 0) / 100) * grandTotal),
//       }))
//     );
//   }, [grandTotal]);

//   // Add new installment if total < 100
//   const addInstallment = () => {
//     const usedPct = installments.reduce(
//       (sum, i) => sum + Number(i.percentage || 0),
//       0
//     );
//     const remaining = Math.max(0, 100 - usedPct);

//     if (remaining <= 0) {
//       toast.error("Total percentage cannot exceed 100%");
//       return;
//     }

//     const newInst = {
//       id: uid(),
//       name: `Installment ${installments.length + 1}`,
//       percentage: remaining >= 20 ? 20 : remaining, // default 20% or leftover
//       amount: Math.round(
//         ((remaining >= 20 ? 20 : remaining) / 100) * grandTotal
//       ),
//     };

//     setInstallments([...installments, newInst]);
//   };

//   // Update % safely (never exceed 100)
//   const updateInstallment = (id, field, value) => {
//     setInstallments((prev) => {
//       const updated = prev.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               [field]: value,
//               amount: Math.round(
//                 ((field === "percentage" ? value : i.percentage) / 100) *
//                   grandTotal
//               ),
//             }
//           : i
//       );

//       const totalPct = updated.reduce(
//         (sum, i) => sum + Number(i.percentage || 0),
//         0
//       );

//       if (totalPct > 100) {
//         toast.error("Total percentage cannot exceed 100%");
//         return prev; // discard invalid change
//       }

//       return updated;
//     });
//   };

//   /* ---------- LocalStorage ---------- */
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY(queryId));
//       setSaved(raw ? JSON.parse(raw) : []);
//     } catch {
//       setSaved([]);
//     }
//   }, [queryId]);

//   const persistSaved = (arr) =>
//     localStorage.setItem(STORAGE_KEY(queryId), JSON.stringify(arr));

//   /* ---------- CRUD Handlers ---------- */
//   const addServiceRow = (srv) =>
//     setItems((prev) => [
//       ...prev,
//       {
//         id: uid(),
//         name: srv.name,
//         qty: 1,
//         price: srv.price,
//         marginPrice: srv.marginPrice,
//         expectedDelivery: "",
//       },
//     ]);

//   const updateRow = (id, patch) =>
//     setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

//   const removeRow = (id) => setItems((prev) => prev.filter((r) => r.id !== id));

//   const removeInstallment = (id) =>
//     setInstallments((prev) => prev.filter((i) => i.id !== id));

//   useEffect(() => {
//     setInstallments((prev) =>
//       prev.map((i) => ({
//         ...i,
//         amount: Math.round((i.percentage / 100) * grandTotal),
//       }))
//     );
//   }, [grandTotal]);

//   const onSave = () => {
//     if (items.length === 0) return toast.error("Add at least one service");
//     const payload = {
//       _id: uid(),
//       leadId,
//       queryId,
//       items,
//       discount: safeDiscount,
//       applyGST,
//       totals: { totalBase, totalMargin, gstValue, grandTotal },
//       installments,
//       createdAt: new Date().toISOString(),
//       note: noteText,
//     };
//     const updated = [payload, ...saved];
//     persistSaved(updated);
//     toast.success("Quotation saved successfully!");
//     navigate(`/quotation-preview/${leadId}/${queryId}/${payload._id}`);
//   };

//   /* ---------- UI ---------- */
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading...
//       </div>
//     );

//   if (!lead)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
//         Lead not found.
//       </div>
//     );

//   const queryDetails =
//     lead?.queries?.find((q) => q.query_id === queryId) || null;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-[#eef2ff] py-10 px-6 font-[Poppins]">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-[#23408B]">
//             Create Quotation
//           </h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
//           >
//             <FaArrowLeft /> Back
//           </button>
//         </div>

// {/* ===== CUSTOMER DETAILS ===== */}
// <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//   {/* Header Row */}
//   <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-5">
//     <h2 className="text-lg font-semibold text-[#23408B] flex items-center gap-2">
//       Customer Details
//     </h2>
//     <div className="flex items-center gap-2 mt-3 md:mt-0">
//       <span className="px-3 py-1 bg-[#32984D]/10 text-[#32984D] text-xs font-medium rounded-full">
//         Quotation
//       </span>
//       <button
//         onClick={() =>
//           navigate(`/edit-lead/${lead.lead_id}/${queryId}`)
//         }
//         className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
//       >
//         <FaEdit className="text-gray-500" /> Edit
//       </button>
//       <button
//         onClick={() => setShowNoteModal(true)}
//         className="flex items-center gap-1 px-3 py-1 bg-[#23408B] text-white rounded-md text-sm hover:bg-[#1f3677]"
//       >
//         <FaPlus /> Add Note
//       </button>
//     </div>
//   </div>

//   {/* Lead Info */}
//   <div className="grid md:grid-cols-2 gap-y-3 text-sm text-slate-700 border-b border-gray-200 pb-4 mb-4">
//     <p>
//       <span className="font-medium text-gray-600">Lead ID:</span>{" "}
//       <span className="text-[#23408B] font-semibold">
//         {lead.lead_id}
//       </span>
//     </p>
//     <p>
//       <span className="font-medium text-gray-600">Reference:</span>{" "}
//       {lead.reference || "N/A"}
//     </p>
//     <p>
//       <span className="font-medium text-gray-600">Query ID:</span>{" "}
//       <span className="text-[#23408B] font-semibold">{queryId}</span>
//     </p>
//     <p>
//       <span className="font-medium text-gray-600">Lead Source:</span>{" "}
//       {lead.lead_source || "N/A"}
//     </p>
//     <p>
//       <span className="font-medium text-gray-600">Company:</span>{" "}
//       {lead.company_name || "N/A"}
//     </p>
//     <p>
//       <span className="font-medium text-gray-600">Lead Status:</span>{" "}
//       <span
//         className={`${
//           lead.status === "Old"
//             ? "text-amber-600 bg-amber-50"
//             : "text-emerald-600 bg-emerald-50"
//         } px-2 py-0.5 rounded-full text-xs font-medium`}
//       >
//         {lead.status}
//       </span>
//     </p>
//   </div>

//   {/* Persons */}
//   <div className="mb-6">
//     <h4 className="font-semibold text-gray-700 mb-3">Persons</h4>

//     {/* Grid layout — 1 column on mobile, up to 3 on large screens */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {lead.persons?.map((p, i) => (
//         <div
//           key={i}
//           className="flex items-center justify-between border border-gray-200 rounded-xl bg-[#f9fafb] px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-[#23408B] text-white flex items-center justify-center font-semibold text-base">
//               {p.name?.charAt(0)}
//             </div>
//             <div>
//               <p className="text-gray-800 font-medium leading-tight">
//                 {p.name}
//               </p>
//               <p className="text-gray-500 text-xs">
//                 {p.designation || "—"}
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-[#23408B] text-sm font-semibold">
//               {p.phone}
//             </p>
//             <p className="text-xs text-gray-500 truncate max-w-[120px]">
//               {p.email}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>

//           {/* Query Details */}
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-3">Query Details</h4>
//             <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
//               <thead className="bg-[#f8fafc] text-gray-700 text-xs uppercase">
//                 <tr>
//                   <th className="p-3 text-left font-medium">
//                     Category / Services
//                   </th>
//                   <th className="p-3 text-center font-medium">
//                     Expected Delivery
//                   </th>
//                   <th className="p-3 text-center font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lead.queries
//                   ?.filter((q) => q.query_id === queryId)
//                   ?.map((q, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="p-3">{q.services?.join(", ") || "—"}</td>
//                       <td className="p-3 text-center">
//                         {new Date(
//                           q.expected_delivery_date
//                         ).toLocaleDateString()}
//                       </td>
//                       <td className="p-3 text-center">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             q.status === "Created"
//                               ? "bg-blue-50 text-blue-600"
//                               : q.status === "Quotation"
//                               ? "bg-purple-50 text-purple-600"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           {q.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ===== SERVICES ===== */}
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//             <h3 className="text-lg font-semibold text-[#23408B]">
//               Add Services
//             </h3>
//             <p className="text-sm text-gray-500">
//               Select and manage the services for this quotation
//             </p>
//           </div>

//           <select
//             className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-[#23408B] focus:outline-none"
//             defaultValue=""
//             onChange={(e) => {
//               const srv = serviceList.find((s) => s.id === e.target.value);
//               if (srv) addServiceRow(srv);
//               e.target.value = "";
//             }}
//           >
//             <option value="">Select a service...</option>
//             {serviceList.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>

//           <div className="mt-6 overflow-x-auto">
//             <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
//               <thead className="bg-[#f8fafc] text-gray-600 uppercase text-xs">
//                 <tr>
//                   <th className="p-3 text-left">Service</th>
//                   <th className="p-3 text-center">Delivery</th>
//                   <th className="p-3 text-center">Qty</th>
//                   <th className="p-3 text-right">Price</th>
//                   <th className="p-3 text-right">Margin</th>
//                   <th className="p-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.length ? (
//                   items.map((it) => (
//                     <tr key={it.id} className="border-t hover:bg-[#f9fbff]">
//                       <td className="p-3 font-medium text-gray-800">
//                         {it.name}
//                       </td>
//                       <td className="p-3 text-center">
//                         <input
//                           type="date"
//                           className="border rounded-md px-2 py-1 text-sm text-center focus:ring-2 focus:ring-[#23408B]"
//                           value={it.expectedDelivery || ""}
//                           onChange={(e) =>
//                             updateRow(it.id, {
//                               expectedDelivery: e.target.value,
//                             })
//                           }
//                         />
//                       </td>
//                       <td className="p-3 text-center">
//                         <input
//                           type="number"
//                           min={1}
//                           value={it.qty}
//                           className="border rounded-md px-2 py-1 w-16 text-center focus:ring-2 focus:ring-[#23408B]"
//                           onChange={(e) =>
//                             updateRow(it.id, {
//                               qty: Number(e.target.value || 1),
//                             })
//                           }
//                         />
//                       </td>
//                       <td className="p-3 text-right text-[#23408B] font-semibold">
//                         ₹{it.price}
//                       </td>
//                       <td className="p-3 text-right text-gray-600">
//                         ₹{it.marginPrice}
//                       </td>
//                       <td className="p-3 text-center">
//                         <button
//                           onClick={() => removeRow(it.id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center text-gray-400 py-4 font-medium"
//                     >
//                       No services added yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ===== SUMMARY + INSTALLMENTS ===== */}
//         {items.length > 0 && (
//           <div className="grid grid-cols-1 gap-6">
//             {/* Summary */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-[#23408B] mb-3 flex items-center gap-2">
//                 Summary
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Total Base</span>
//                   <span>{fmt(totalBase)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Margin</span>
//                   <span>{fmt(totalMargin)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Discount (₹)</span>
//                   <input
//                     type="number"
//                     className="border rounded-md px-2 py-1 w-24 text-right"
//                     value={discount}
//                     onChange={(e) => setDiscount(Number(e.target.value || 0))}
//                   />
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={applyGST}
//                       onChange={(e) => setApplyGST(e.target.checked)}
//                     />
//                     Apply GST (18%)
//                   </label>
//                   <span>{fmt(gstValue)}</span>
//                 </div>
//                 <hr className="my-3" />
//                 <div className="flex justify-between font-bold text-[#23408B] text-base">
//                   <span>Grand Total</span>
//                   <span>{fmt(grandTotal)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Installments */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-[#23408B] flex items-center gap-2">
//                   <FaPlus /> Installments
//                 </h3>
//                 <button
//                   onClick={addInstallment}
//                   className="px-3 py-1.5 bg-[#23408B] text-white rounded-md text-sm hover:bg-[#1d3677]"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm border border-gray-200 rounded-lg">
//                   <thead className="bg-[#f8fafc] text-gray-700 text-xs uppercase">
//                     <tr>
//                       <th className="p-2 text-left">Installment</th>
//                       <th className="p-2 text-center">%</th>
//                       <th className="p-2 text-right">Amount</th>
//                       <th className="p-2 text-center">—</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {installments.map((inst) => (
//                       <tr key={inst.id} className="border-t hover:bg-[#f9fbff]">
//                         <td className="p-2">
//                           {/* <input
//                             className="w-full border rounded-md px-2 py-1 text-sm"
//                             value={inst.name}
//                             onChange={(e) =>
//                               updateInstallment(inst.id, "name", e.target.value)
//                             }
//                           /> */}
//                           <div>{inst.name}</div>
//                         </td>
//                         <td className="p-2 text-center">
//                           <input
//                             type="number"
//                             className="border rounded-md px-2 py-1 w-20 text-center"
//                             value={inst.percentage}
//                             onChange={(e) =>
//                               updateInstallment(
//                                 inst.id,
//                                 "percentage",
//                                 Number(e.target.value || 0)
//                               )
//                             }
//                           />
//                         </td>
//                         <td className="p-2 text-right text-[#23408B] font-semibold">
//                           {fmt(inst.amount)}
//                         </td>
//                         <td className="p-2 text-center">
//                           <button
//                             onClick={() => removeInstallment(inst.id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTrash />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ===== ACTION BUTTONS ===== */}
//         {items.length > 0 && (
//           <div className="flex justify-end mt-8">
//             <button
//               onClick={onSave}
//               className="bg-gradient-to-r from-[#23408B] to-[#32984D] text-white px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition"
//             >
//               Save Quotation
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
