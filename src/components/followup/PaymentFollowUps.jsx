import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";

export default function PaymentFollowUps() {
  const [events, setEvents] = useState([]);

  // 🔹 Temporary Sample Data
  const sampleData = [
    {
      _id: "pay001",
      lead_id: "LEAD-045",
      query_id: "QUERY-222",
      person_name: "Rohit Sharma",
      remarks: "Advance payment follow-up scheduled",
      payment_due_date: "2025-11-05T00:00:00.000Z",
      amount_due: 25000,
      createdAt: "2025-10-26T11:41:24.821Z",
    },
    {
      _id: "pay002",
      lead_id: "LEAD-101",
      query_id: "QUERY-303",
      person_name: "Priya Patel",
      remarks: "Final payment follow-up",
      payment_due_date: "2025-11-10T00:00:00.000Z",
      amount_due: 45000,
      createdAt: "2025-10-24T09:15:00.000Z",
    },
  ];

  useEffect(() => {
    const fetchPaymentFollowUps = async () => {
      try {
        // ✅ Uncomment this when backend API is ready
        // const res = await axios.get(`${API_URL}/leads/payment-followups`);
        // const data = res.data.history || [];

        const data = sampleData; // Using mock data for now

        const formatted = data.map((item) => ({
          title: `${item.person_name} - ₹${item.amount_due}`,
          date: item.payment_due_date,
          extendedProps: {
            remarks: item.remarks,
            query_id: item.query_id,
            lead_id: item.lead_id,
            amount_due: item.amount_due,
          },
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching payment follow-ups:", err);
        toast.error("Failed to load payment follow-ups");
      }
    };

    fetchPaymentFollowUps();
  }, []);

  const handleEventClick = (info) => {
    const { lead_id, query_id, remarks, amount_due } = info.event.extendedProps;
    alert(
      `💰 Payment Follow-Up\n\nLead ID: ${lead_id}\nQuery ID: ${query_id}\nAmount Due: ₹${amount_due}\nRemarks: ${remarks}`
    );
  };

  return (
    <div className="px-2">
      {/* <h2 className="text-2xl font-semibold mb-6 text-[#1A2980]">
        Payment Follow-Ups Calendar
      </h2> */}

      <div className="bg-white shadow-md rounded-lg p-2">
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
                backgroundColor: "#26D0CE",
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
