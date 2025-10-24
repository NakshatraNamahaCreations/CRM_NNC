// import React, { useState, useEffect } from "react";
// import { Search, Plus } from "lucide-react";
// import axios from "axios";
// import Select from "react-select";
// import { API_URL } from "../../utils/api";
// import { toast } from "react-toastify";

// export default function AddLeadPage() {
//   const [searchValue, setSearchValue] = useState("");
//   const [searchType, setSearchType] = useState("phone");
//   const [existingLead, setExistingLead] = useState(null);
//   const [persons, setPersons] = useState([
//     { name: "", email: "", phone: "", designation: "" },
//   ]);
//   const [companyName, setCompanyName] = useState("");
//   const [leadSource, setLeadSource] = useState(null);
//   const [services, setServices] = useState([]);
//   const [expectedDate, setExpectedDate] = useState("");
//   const [location, setLocation] = useState({
//     country: "",
//     state: "",
//     city: "",
//     zipCode: "",
//   });

//   // Dropdown data
//   const [serviceOptions, setServiceOptions] = useState([]);
//   const [referenceOptions, setReferenceOptions] = useState([]);

//   const [loading, setLoading] = useState(false);

//   /* -------------------------------------------------------------------------- */
//   /* 🔹 Fetch Dropdown Data */
//   /* -------------------------------------------------------------------------- */
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [serviceRes, referenceRes] = await Promise.all([
//           axios.get(`${API_URL}/services`),
//           axios.get(`${API_URL}/references`),
//         ]);

//         setServiceOptions(
//           serviceRes.data.map((s) => ({
//             value: s.serviceName,
//             label: s.serviceName,
//           }))
//         );

//         setReferenceOptions(
//           referenceRes.data.map((r) => ({
//             value: r.name,
//             label: r.name,
//           }))
//         );
//       } catch (err) {
//         console.error("Dropdown load failed:", err);
//         toast.error("Failed to load services or references");
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 🔹 Person Controls */
//   /* -------------------------------------------------------------------------- */
//   const handleAddPerson = () =>
//     setPersons([
//       ...persons,
//       { name: "", email: "", phone: "", designation: "" },
//     ]);

//   const handleRemovePerson = (index) =>
//     setPersons((prev) => prev.filter((_, i) => i !== index));

//   const handlePersonChange = (index, field, value) => {
//     const updated = [...persons];
//     updated[index][field] = value;
//     setPersons(updated);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 🔍 Search Existing Lead (by phone/email/name/company) */
//   /* -------------------------------------------------------------------------- */
//   const handleSearchLead = async () => {
//     if (!searchValue.trim()) {
//       toast.info("Please enter a search value");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${API_URL}/leads/search?query=${searchValue}`
//       );
//       const lead = res.data.lead;

//       setExistingLead(lead);
//       toast.success(`Existing lead found: ${lead.lead_id}`);

//       // Auto-fill fields
//       setPersons([
//         {
//           name: lead.personName || "",
//           email: lead.email || "",
//           phone: lead.phone_number || "",
//           designation: "",
//         },
//       ]);
//       setCompanyName(lead.company_name || "");
//       setLeadSource(
//         lead.lead_source
//           ? { value: lead.lead_source, label: lead.lead_source }
//           : null
//       );
//       setLocation({
//         country: lead.location?.country || "",
//         state: lead.location?.state || "",
//         city: lead.location?.city || "",
//         zipCode: lead.location?.zip_code || "",
//       });
//     } catch (error) {
//       if (error.response?.status === 404) {
//         toast.info("No existing lead found. You can create a new one.");
//         setExistingLead(null);
//       } else {
//         console.error("Search error:", error);
//         toast.error("Failed to search lead");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 🧾 Submit Lead (New or Existing) */
//   /* -------------------------------------------------------------------------- */
//   const handleSubmitNewLead = async (e) => {
//     e.preventDefault();

//     if (!persons[0].phone || !persons[0].email || !companyName) {
//       toast.warn("Please fill all required details!");
//       return;
//     }

//     const mainPerson = persons[0];
//     const payload = {
//       personName: mainPerson.name,
//       email: mainPerson.email,
//       phone_number: mainPerson.phone,
//       company_name: companyName,
//       lead_source: leadSource?.value || "",
//       location: {
//         country: location.country,
//         state: location.state,
//         city: location.city,
//         zip_code: location.zipCode,
//       },
//       queryData: {
//         services: services.map((s) => s.value),
//         expected_delivery_date: expectedDate,
//       },
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_URL}/leads/create`, payload);

//       if (res.data.status === "New") {
//         toast.success(`✅ New lead created: ${res.data.lead.lead_id}`);
//       } else if (res.data.status === "Old") {
//         toast.info(`📝 Added new query to ${res.data.lead.lead_id}`);
//         setExistingLead(res.data.lead);
//       } else {
//         toast.success("Lead created or updated successfully");
//       }

//       // Reset after success
//       setPersons([{ name: "", email: "", phone: "", designation: "" }]);
//       setCompanyName("");
//       setLeadSource(null);
//       setServices([]);
//       setExpectedDate("");
//       setLocation({ country: "", state: "", city: "", zipCode: "" });
//     } catch (error) {
//       console.error("Error creating lead:", error);
//       toast.error("Failed to create or update lead");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 🧱 UI */
//   /* -------------------------------------------------------------------------- */
//   return (
//     <div className="bg-white rounded-lg shadow p-8 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold text-[#1A2980] mb-6">
//         {existingLead ? "Update Existing Lead / Add Query" : "Add New Lead"}
//       </h2>

//       {/* 🔍 Search Section */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8">
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 text-sm"
//         >
//           <option value="phone">Search by Phone</option>
//           <option value="email">Search by Email</option>
//           <option value="name">Search by Name</option>
//           <option value="company">Search by Company</option>
//         </select>
//         <input
//           type="text"
//           placeholder={`Enter ${searchType}...`}
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
//         />
//         <button
//           type="button"
//           onClick={handleSearchLead}
//           disabled={loading}
//           className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded"
//         >
//           {loading ? (
//             "Searching..."
//           ) : (
//             <>
//               <Search size={16} /> Search
//             </>
//           )}
//         </button>
//       </div>

//       {/* Existing Lead Details */}
//       {existingLead && (
//         <div className="bg-gray-50 border border-[#26D0CE]/40 rounded-lg p-4 mb-6">
//           <h3 className="text-lg font-semibold text-[#1A2980] mb-2">
//             Existing Lead Details
//           </h3>
//           <p className="text-sm text-gray-700">
//             <b>Lead ID:</b> {existingLead.lead_id} <br />
//             <b>Company:</b> {existingLead.company_name} <br />
//             <b>Email:</b> {existingLead.email} <br />
//             <b>Phone:</b> {existingLead.phone_number}
//           </p>

//           <div className="mt-2">
//             <h4 className="font-medium text-gray-800">Previous Queries:</h4>
//             {existingLead.queries.length > 0 ? (
//               <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
//                 {existingLead.queries.map((q) => (
//                   <li key={q.query_id}>
//                     <b>{q.query_id}</b> — {q.services.join(", ")} (
//                     {new Date(q.expected_delivery_date).toLocaleDateString()})
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500 italic mt-1">
//                 No previous queries found.
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Lead Form */}
//       <form
//         onSubmit={handleSubmitNewLead}
//         className="space-y-6 bg-gray-50 p-4 rounded-lg"
//       >
//         {/* Person Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-[#1A2980] mb-4">
//             Person Details
//           </h3>
//           {persons.map((person, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg shadow-sm"
//             >
//               <input
//                 type="text"
//                 placeholder="Person Name"
//                 className="border border-gray-300 rounded px-3 py-2 text-sm"
//                 value={person.name}
//                 onChange={(e) =>
//                   handlePersonChange(index, "name", e.target.value)
//                 }
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="border border-gray-300 rounded px-3 py-2 text-sm"
//                 value={person.email}
//                 onChange={(e) =>
//                   handlePersonChange(index, "email", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Phone"
//                 className="border border-gray-300 rounded px-3 py-2 text-sm"
//                 value={person.phone}
//                 onChange={(e) =>
//                   handlePersonChange(index, "phone", e.target.value)
//                 }
//               />
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Designation"
//                   className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
//                   value={person.designation}
//                   onChange={(e) =>
//                     handlePersonChange(index, "designation", e.target.value)
//                   }
//                 />
//                 {persons.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemovePerson(index)}
//                     className="text-red-500 text-sm hover:underline"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleAddPerson}
//             className="text-sm text-[#1A2980] hover:underline"
//           >
//             + Add Another Person
//           </button>
//         </div>

//         {/* Company Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-600">Company Name</label>
//             <input
//               type="text"
//               required
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Lead Source</label>
//             <Select
//               options={referenceOptions}
//               value={leadSource}
//               onChange={setLeadSource}
//               placeholder="Select Lead Source"
//               className="text-sm"
//             />
//           </div>
//         </div>

//         {/* Location */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {["country", "state", "city", "zipCode"].map((field, idx) => (
//             <div key={idx}>
//               <label className="text-sm text-gray-600 capitalize">
//                 {field}
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={location[field]}
//                 onChange={(e) =>
//                   setLocation({ ...location, [field]: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Query Section */}
//         <div className="pt-4">
//           <h3 className="text-lg font-semibold text-[#1A2980] mb-3">Query</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm text-gray-600">Services</label>
//               <Select
//                 options={serviceOptions}
//                 isMulti
//                 value={services}
//                 onChange={setServices}
//                 placeholder="Select services..."
//                 className="text-sm"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">
//                 Expected Delivery Date
//               </label>
//               <input
//                 type="date"
//                 required
//                 value={expectedDate}
//                 onChange={(e) => setExpectedDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded shadow hover:shadow-md transition-all"
//           >
//             {loading ? (
//               "Saving..."
//             ) : (
//               <>
//                 <Plus size={16} />{" "}
//                 {existingLead ? "Add New Query" : "Create Lead"}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../utils/api";
import { toast } from "react-toastify";

export default function AddLeadPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("phone");
  const [existingLead, setExistingLead] = useState(null);
  const [persons, setPersons] = useState([
    { name: "", email: "", phone: "", designation: "" },
  ]);
  const [companyName, setCompanyName] = useState("");
  const [leadSource, setLeadSource] = useState(null);
  const [services, setServices] = useState([]);
  const [expectedDate, setExpectedDate] = useState("");
  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
    zip_code: "", // ✅ corrected key name
  });

  const [serviceOptions, setServiceOptions] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Fetch Dropdown Data */
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
        console.error("Dropdown load failed:", err);
        toast.error("Failed to load services or references");
      }
    };

    fetchDropdowns();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔹 Person Controls */
  /* -------------------------------------------------------------------------- */
  const handleAddPerson = () =>
    setPersons([...persons, { name: "", email: "", phone: "", designation: "" }]);

  const handleRemovePerson = (index) =>
    setPersons((prev) => prev.filter((_, i) => i !== index));

  const handlePersonChange = (index, field, value) => {
    const updated = [...persons];
    updated[index][field] = value;
    setPersons(updated);
  };

  /* -------------------------------------------------------------------------- */
  /* 🔍 Search Existing Lead */
  /* -------------------------------------------------------------------------- */
  const handleSearchLead = async () => {
    if (!searchValue.trim()) {
      toast.info("Please enter a search value");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/leads/search?query=${searchValue}`);
      const lead = res.data.lead;

      toast.success(`Existing lead found: ${lead.lead_id}`);
      setExistingLead(lead);

      // Prefill persons (non-editable existing ones)
      setPersons(
        lead.persons.map((p) => ({
          name: p.name,
          email: p.email,
          phone: p.phone,
          designation: p.designation || "",
          existing: true, // mark existing persons
        }))
      );

      setCompanyName(lead.company_name || "");
      setLeadSource(
        lead.lead_source ? { value: lead.lead_source, label: lead.lead_source } : null
      );
      setLocation({
        country: lead.location?.country || "",
        state: lead.location?.state || "",
        city: lead.location?.city || "",
        zip_code: lead.location?.zip_code || "", // ✅ consistent key
      });
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info("No existing lead found. You can create a new one.");
        setExistingLead(null);
        setPersons([{ name: "", email: "", phone: "", designation: "" }]);
      } else {
        console.error("Search error:", error);
        toast.error("Failed to search lead");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧾 Create Lead or Add Query */
  /* -------------------------------------------------------------------------- */
  const handleSubmitLead = async (e) => {
    e.preventDefault();

    if (!persons[0].email || !persons[0].phone || !companyName) {
      toast.warn("Please fill all required fields");
      return;
    }

    const payload = {
      persons: persons.map((p) => ({
        name: p.name,
        email: p.email,
        phone: p.phone,
        designation: p.designation,
      })),
      company_name: companyName,
      lead_source: leadSource?.value || "",
      location: {
        country: location.country,
        state: location.state,
        city: location.city,
        zip_code: location.zip_code, // ✅ fixed key name
      },
      queryData: {
        services: services.map((s) => s.value),
        expected_delivery_date: expectedDate,
      },
    };

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/leads/create`, payload);
      const data = res.data;

      if (data.status === "New") {
        toast.success(`✅ New lead created: ${data.lead.lead_id}`);
      } else if (data.status === "Old") {
        toast.info(`📝 Added new query to existing lead: ${data.lead.lead_id}`);
        setExistingLead(data.lead);
      }

      // Reset only query fields (keep lead if existing)
      if (!existingLead) {
        setPersons([{ name: "", email: "", phone: "", designation: "" }]);
        setCompanyName("");
        setLeadSource(null);
        setLocation({ country: "", state: "", city: "", zip_code: "" });
      }

      setServices([]);
      setExpectedDate("");
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(
        error.response?.data?.error || "Failed to create or update lead"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧱 UI */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1A2980] mb-6">
        {existingLead ? "Add New Query to Existing Lead" : "Create New Lead"}
      </h2>

      {/* 🔍 Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="phone">Search by Phone</option>
          <option value="email">Search by Email</option>
          <option value="company">Search by Company</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType}...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleSearchLead}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded"
        >
          {loading ? "Searching..." : (<><Search size={16}/> Search</>)}
        </button>
      </div>

      {/* Existing Lead Info */}
      {existingLead && (
        <div className="bg-gray-50 border border-[#26D0CE]/40 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-[#1A2980] mb-2">
            Existing Lead Details
          </h3>
          <p className="text-sm text-gray-700">
            <b>Lead ID:</b> {existingLead.lead_id} <br />
            <b>Company:</b> {existingLead.company_name}
          </p>

          <div className="mt-3">
            <h4 className="font-medium text-gray-800">Previous Queries:</h4>
            {existingLead.queries?.length ? (
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                {existingLead.queries.map((q) => (
                  <li key={q.query_id}>
                    <b>{q.query_id}</b> – {q.services.join(", ")} (
                    {new Date(q.expected_delivery_date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic mt-1">No queries yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmitLead} className="space-y-6 bg-gray-50 p-4 rounded-lg">
        {/* Persons */}
        <div>
          <h3 className="text-lg font-semibold text-[#1A2980] mb-4">Person Details</h3>
          {persons.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-white rounded shadow-sm">
              <input type="text" value={p.name} placeholder="Name"
                disabled={p.existing} onChange={(e)=>handlePersonChange(i,"name",e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"/>
              <input type="email" value={p.email} placeholder="Email"
                disabled={p.existing} onChange={(e)=>handlePersonChange(i,"email",e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"/>
              <input type="text" value={p.phone} placeholder="Phone"
                disabled={p.existing} onChange={(e)=>handlePersonChange(i,"phone",e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"/>
              <div className="flex items-center gap-2">
                <input type="text" value={p.designation} placeholder="Designation"
                  disabled={p.existing}
                  onChange={(e)=>handlePersonChange(i,"designation",e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full"/>
                {!p.existing && persons.length > 1 && (
                  <button type="button" onClick={()=>handleRemovePerson(i)} className="text-red-500 text-sm hover:underline">Remove</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddPerson}
            className="text-sm text-[#1A2980] hover:underline">+ Add Another Person</button>
        </div>

        {/* Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Company Name</label>
            <input type="text" value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={!!existingLead}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Lead Source</label>
            <Select options={referenceOptions} value={leadSource}
              onChange={setLeadSource}
              isDisabled={!!existingLead}
              placeholder="Select Lead Source" className="text-sm"/>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["country","state","city","zip_code"].map((field)=>(
            <div key={field}>
              <label className="text-sm text-gray-600 capitalize">{field === "zip_code" ? "Zip Code" : field}</label>
              <input type="text" value={location[field]}
                onChange={(e)=>setLocation({...location,[field]:e.target.value})}
                disabled={!!existingLead}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"/>
            </div>
          ))}
        </div>

        {/* Query */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-[#1A2980] mb-3">Query</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Services</label>
              <Select isMulti options={serviceOptions}
                value={services} onChange={setServices}
                placeholder="Select services..." className="text-sm"/>
            </div>
            <div>
              <label className="text-sm text-gray-600">Expected Delivery Date</label>
              <input type="date" value={expectedDate}
                onChange={(e)=>setExpectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"/>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white rounded shadow hover:shadow-md">
            {loading ? "Saving..." : (<><Plus size={16}/> {existingLead ? "Add New Query" : "Create Lead"}</>)}
          </button>
        </div>
      </form>
    </div>
  );
}
