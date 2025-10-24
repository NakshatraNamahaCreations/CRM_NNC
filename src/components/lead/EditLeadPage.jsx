import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../utils/api";
import { toast } from "react-toastify";

export default function EditLeadPage() {
  const { leadId, queryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [leadSource, setLeadSource] = useState(null);
  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });
  const [services, setServices] = useState([]);
  const [expectedDate, setExpectedDate] = useState("");

  const [serviceOptions, setServiceOptions] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState([]);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch dropdown data (services, references) */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [serviceRes, referenceRes] = await Promise.all([
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/references`),
        ]);
        setServiceOptions(
          serviceRes.data.map((s) => ({
            value: s.serviceName,
            label: s.serviceName,
          }))
        );
        setReferenceOptions(
          referenceRes.data.map((r) => ({
            value: r.name,
            label: r.name,
          }))
        );
      } catch (err) {
        toast.error("Failed to load dropdown data");
      }
    };
    fetchDropdowns();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch lead + query details */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchLeadAndQuery = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/leads/details/${leadId}?queryId=${queryId}`
        );

        const lead = res.data?.lead;
        if (!lead) {
          toast.error("Lead not found!");
          navigate("/leads");
          return;
        }

        // Find matching query
        const query = lead.queries.find((q) => q.query_id === queryId);
        if (!query) {
          toast.error("Query not found for this lead!");
          navigate("/leads");
          return;
        }

        // ✅ Populate lead & query data
        setPersons(lead.persons || []);
        setCompanyName(lead.company_name || "");
        setLeadSource(
          lead.lead_source
            ? { value: lead.lead_source, label: lead.lead_source }
            : null
        );
        setLocation({
          country: lead.location?.country || "",
          state: lead.location?.state || "",
          city: lead.location?.city || "",
          zipCode: lead.location?.zip_code || "",
        });
        setServices(
          (query.services || []).map((s) => ({
            value: s,
            label: s,
          }))
        );
        setExpectedDate(
          query.expected_delivery_date
            ? query.expected_delivery_date.slice(0, 10)
            : ""
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch lead and query details");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadAndQuery();
  }, [leadId, queryId, navigate]);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Handle persons change */
  /* -------------------------------------------------------------------------- */
  const handlePersonChange = (index, field, value) => {
    const updated = [...persons];
    updated[index][field] = value;
    setPersons(updated);
  };

  const handleAddPerson = () => {
    setPersons([...persons, { name: "", email: "", phone: "", designation: "" }]);
  };

  const handleRemovePerson = (index) => {
    setPersons(persons.filter((_, i) => i !== index));
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 Submit update */
  /* -------------------------------------------------------------------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!companyName || services.length === 0 || !expectedDate) {
      toast.warn("Please fill all required fields!");
      return;
    }

    const payload = {
      persons,
      company_name: companyName,
      lead_source: leadSource?.value || "",
      location: {
        country: location.country,
        state: location.state,
        city: location.city,
        zip_code: location.zipCode,
      },
      queryData: {
        services: services.map((s) => s.value),
        expected_delivery_date: expectedDate,
      },
    };

    try {
      setLoading(true);
      await axios.put(`${API_URL}/leads/update/${leadId}/${queryId}`, payload);
      toast.success("✅ Lead and query updated successfully!");
      navigate("/leads");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lead and query");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧱 UI */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1A2980]">
          Edit Lead & Query
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 italic">Loading details...</p>
      ) : (
        <form
          onSubmit={handleUpdate}
          className="space-y-6 bg-gray-50 p-4 rounded-lg"
        >
          {/* Persons Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A2980] mb-4">
              Contact Persons
            </h3>
            {persons.map((person, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) =>
                    handlePersonChange(index, "name", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={person.email}
                  onChange={(e) =>
                    handlePersonChange(index, "email", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={person.phone}
                  onChange={(e) =>
                    handlePersonChange(index, "phone", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Designation"
                    value={person.designation}
                    onChange={(e) =>
                      handlePersonChange(index, "designation", e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                  />
                  {persons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(index)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPerson}
              className="text-sm text-[#1A2980] hover:underline"
            >
              + Add Another Person
            </button>
          </div>

          {/* Company and Lead Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Lead Source</label>
              <Select
                options={referenceOptions}
                value={leadSource}
                onChange={setLeadSource}
                placeholder="Select lead source"
                className="text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["country", "state", "city", "zipCode"].map((field) => (
              <div key={field}>
                <label className="text-sm text-gray-600 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  value={location[field]}
                  onChange={(e) =>
                    setLocation({ ...location, [field]: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Query Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A2980] mb-3">Query</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Services</label>
                <Select
                  options={serviceOptions}
                  isMulti
                  value={services}
                  onChange={setServices}
                  placeholder="Select services..."
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded shadow hover:shadow-md transition-all"
            >
              {loading ? "Updating..." : <><Plus size={16} /> Update Query</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
