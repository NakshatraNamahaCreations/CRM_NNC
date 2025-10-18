import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddReferenceModal from "./AddReferenceModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/api";

export default function ReferenceTable() {
  const [references, setReferences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch All References
  const fetchReferences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/references/`);
      setReferences(res.data);
    } catch (err) {
      console.error("Error fetching references:", err);
      setError("Failed to load references");
      toast.error("❌ Failed to load references");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  // 🔹 Add / Update Reference
  const handleSave = async (form) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/references/${editData._id}`, {
          name: form.name,
          description: form.description,
        });
        toast.success("Reference updated successfully!");
      } else {
        await axios.post(`${API_URL}/references/`, {
          name: form.name,
          description: form.description,
        });
        toast.success("Reference added successfully!");
      }
      setShowModal(false);
      setEditData(null);
      fetchReferences();
    } catch (err) {
      console.error("Error saving reference:", err);
      toast.error(err.response?.data?.error || "❌ Failed to save reference");
    }
  };

  // 🔹 Edit Reference
  const handleEdit = (ref) => {
    const editable = {
      _id: ref._id,
      name: ref.name,
      description: ref.description,
    };
    setEditData(editable);
    setShowModal(true);
  };

  // 🔹 Delete Reference
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reference?"))
      return;
    try {
      await axios.delete(`${API_URL}/references/${id}`);
      toast.info("Reference deleted successfully!");
      fetchReferences();
    } catch (err) {
      console.error("Error deleting reference:", err);
      toast.error("❌ Failed to delete reference");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-[#1A2980]">Reference List</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add Reference
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500 italic">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : references.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#EAF3FF] to-[#F9FBFF] text-[#1A2980] font-medium uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">Reference Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {references.map((ref, i) => (
                <tr
                  key={ref._id}
                  className={`transition ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                  } hover:bg-[#EAF3FF]/60`}
                >
                  <td className="p-4 text-gray-800 font-medium">{ref.name}</td>
                  <td className="p-4 text-gray-700">{ref.description}</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(ref)}
                      className="p-1.5 rounded-md bg-blue-50 text-[#1A2980] hover:bg-blue-100 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ref._id)}
                      className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400 italic">
            No references available.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddReferenceModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          editData={editData}
        />
      )}

      {/* ✅ Toastify Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
