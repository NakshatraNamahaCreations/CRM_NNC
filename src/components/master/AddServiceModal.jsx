import React, { useState, useEffect } from "react";

export default function AddServiceModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState({ name: "", margin: "", price: "" });
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "margin" || name === "price") && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.margin || !form.price) {
      alert("⚠️ Please fill in all fields.");
      return;
    }
    onSave(form);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        className={`relative bg-white w-96 rounded-2xl shadow-2xl p-6 border border-gray-100 transform transition-all duration-300 ${
          isClosing
            ? "opacity-0 scale-90 translate-y-6"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <h2 className="text-lg font-semibold text-[#1A2980] mb-4">
          {editData ? "Edit Service" : "Add New Service"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#26D0CE] outline-none"
          />

          <input
            type="number"
            name="margin"
            placeholder="Margin Price (₹)"
            value={form.margin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#26D0CE] outline-none remove-arrows"
          />

          <input
            type="number"
            name="price"
            placeholder="Final Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#26D0CE] outline-none remove-arrows"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white hover:shadow-md transition"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>

        <style jsx>{`
          input[type="number"].remove-arrows::-webkit-inner-spin-button,
          input[type="number"].remove-arrows::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"].remove-arrows {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
    </div>
  );
}
