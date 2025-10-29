import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";

export default function FollowUpsByDate() {
  const [searchParams] = useSearchParams();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const dateParam = searchParams.get("date");

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!dateParam) {
        toast.error("No date provided in URL");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch follow-ups for the given date
        const res = await axios.get(
          `${API_URL}/call-history/follow-ups-by-date?date=${dateParam}`
        );

        if (res.data.success) {
          setFollowUps(res.data.followUps || []);
        } else {
          toast.warn(res.data.message || "No follow-ups found.");
          setFollowUps([]);
        }
      } catch (err) {
        console.error("Error fetching follow-ups:", err);
        toast.error("Failed to fetch follow-ups");
        setFollowUps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [dateParam]);

  if (loading)
    return (
      <p className="text-center text-gray-600 text-sm py-8 animate-pulse">
        Loading follow-ups...
      </p>
    );

  return (
    <div className="px-6 py-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h2 className="text-xl font-semibold text-[#1A2980] tracking-wide">
            Follow-Ups on{" "}
            <span className="text-[#243B8A]">
              {new Date(dateParam).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </h2>
          <button
            onClick={() => window.history.back()}
            className="bg-[#1A2980] text-white text-sm px-4 py-2 rounded-md hover:bg-[#243B8A] transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Table */}
        {followUps.length === 0 ? (
          <p className="text-gray-600 text-center text-sm py-6">
            No follow-ups found for this date.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#1A2980] text-white text-sm">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">#</th>
                  <th className="py-3 px-4 text-left font-medium">Lead ID</th>
                  <th className="py-3 px-4 text-left font-medium">Query ID</th>
                  <th className="py-3 px-4 text-left font-medium">Person Name</th>
                  <th className="py-3 px-4 text-left font-medium">Call Date</th>
                  <th className="py-3 px-4 text-left font-medium">Remarks</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Reschedule Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((f, index) => (
                  <tr
                    key={f._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } transition-all duration-200 hover:bg-[#F3F6FF] hover:shadow-md hover:scale-[1.01]`}
                  >
                    <td className="py-2.5 px-4 border-t text-gray-700 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-4 border-t text-[#1A2980] font-semibold">
                      {f.lead_id}
                    </td>
                    <td className="py-2.5 px-4 border-t text-[#243B8A] font-semibold">
                      {f.query_id}
                    </td>
                    <td className="py-2.5 px-4 border-t text-gray-700 capitalize">
                      {f.person_name}
                    </td>
                    <td className="py-2.5 px-4 border-t text-gray-700 font-medium">
                      {new Date(f.call_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-4 border-t text-gray-600">
                      {f.remarks}
                    </td>
                    <td className="py-2.5 px-4 border-t text-gray-700 font-medium">
                      {new Date(f.reschedule_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
