import React, { useState, useEffect } from "react";
import axios from "axios";
import AddServiceModal from "./AddServiceModal";
import { Pencil, Trash2, Plus } from "lucide-react";
import { API_URL } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify"; // ✅ import
import "react-toastify/dist/ReactToastify.css"; // ✅ styles

export default function ServiceTable() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch All Services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/services/`);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services.");
      toast.error("Failed to load services ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Add or Update Service
  const handleSave = async (form) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/services/${editData._id}`, {
          serviceName: form.name,
          price: form.price,
          marginPrice: form.margin,
        });
        toast.success("Service updated successfully!");
      } else {
        await axios.post(`${API_URL}/services/`, {
          serviceName: form.name,
          price: form.price,
          marginPrice: form.margin,
        });
        toast.success("Service added successfully!");
      }

      setShowModal(false);
      setEditData(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error(
        err.response?.data?.error ||
          "Something went wrong while saving service ❌"
      );
    }
  };

  // 🔹 Edit service
  const handleEdit = (service) => {
    const editable = {
      _id: service._id,
      name: service.serviceName,
      price: service.price,
      margin: service.marginPrice,
    };
    setEditData(editable);
    setShowModal(true);
  };

  // 🔹 Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      toast.info("Service deleted successfully!");
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service ❌");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-[#1A2980]">Service List</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500 italic">
            Loading services...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : services.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#EAF3FF] to-[#F9FBFF] text-[#1A2980] font-medium uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">Service Name</th>
                <th className="p-4 text-left">Margin (₹)</th>
                <th className="p-4 text-left">Price (₹)</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr
                  key={service._id}
                  className={`transition ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F7FAFF]"
                  } hover:bg-[#EAF3FF]/60`}
                >
                  <td className="p-4 text-gray-800 font-medium">
                    {service.serviceName}
                  </td>
                  <td className="p-4 text-gray-700">
                    ₹{service.marginPrice?.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    ₹{service.price?.toLocaleString()}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1.5 rounded-md bg-blue-50 text-[#1A2980] hover:bg-blue-100 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
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
            No services available.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddServiceModal
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
