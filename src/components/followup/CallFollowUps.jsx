import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";

export default function CallFollowUps() {
  const [events, setEvents] = useState([]);

  // Sample data fallback
  const sampleData = [
    {
      _id: "68fb65e496f645542df6812b",
      lead_id: "LEAD-001",
      query_id: "QUERY-001",
      person_name: "Sonali",
      remarks: "Call has been rescheduled for 25 Oct",
      reschedule_date: "2025-10-25T00:00:00.000Z",
      createdAt: "2025-10-24T11:41:24.821Z",
    },
  ];

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        // 🔹 Replace with your real API when ready
        // const res = await axios.get(`${API_URL}/leads/call-followups`);
        // const data = res.data.history;

        const data = sampleData; // sample for now

        const formatted = data.map((item) => ({
          title: `${item.person_name} (${item.lead_id})`,
          date: item.reschedule_date,
          extendedProps: {
            remarks: item.remarks,
            query_id: item.query_id,
            lead_id: item.lead_id,
          },
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching follow-ups:", err);
        toast.error("Failed to load call follow-ups");
      }
    };

    fetchFollowUps();
  }, []);

  const handleEventClick = (info) => {
    const { lead_id, query_id, remarks } = info.event.extendedProps;
    alert(
      `Lead ID: ${lead_id}\nQuery ID: ${query_id}\nRemarks: ${remarks}`
    );
  };

  return (
    <div className="px-6">
      {/* <h2 className="text-2xl font-semibold mb-6 text-[#1A2980]">
        Call Follow-Ups Calendar
      </h2> */}

      <div className="bg-white shadow-md rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="75vh"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          eventDisplay="block"
          eventContent={(arg) => (
            <div
              style={{
                backgroundColor: "#1A2980",
                color: "white",
                borderRadius: "4px",
                padding: "3px 5px",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {arg.event.title}
            </div>
          )}
        />
      </div>
    </div>
  );
}
