// import React, { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../utils/api";

// export default function CallFollowUps() {
//   const [events, setEvents] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFollowUps = async () => {
//       try {
//         // 🔹 Fetch from your real API
//         const res = await axios.get(`${API_URL}/call-history/all-followups`);
//         const data = res.data.history || [];

//         if (data.length === 0) {
//           toast.info("No call follow-ups found");
//           return;
//         }

//         // 🔹 Group by date (count how many follow-ups per date)
//         const grouped = data.reduce((acc, item) => {
//           const date = new Date(item.reschedule_date)
//             .toISOString()
//             .split("T")[0];
//           if (!acc[date]) acc[date] = [];
//           acc[date].push(item);
//           return acc;
//         }, {});

//         // 🔹 Create events for FullCalendar
//         const formatted = Object.entries(grouped).map(([date, items]) => ({
//           title: `${items.length} follow-up${items.length > 1 ? "s" : ""}`,
//           date,
//           extendedProps: { date }, // store date for navigation
//         }));

//         setEvents(formatted);
//       } catch (err) {
//         console.error("Error fetching follow-ups:", err);
//         toast.error("Failed to load call follow-ups");
//       }
//     };

//     fetchFollowUps();
//   }, []);

//   // 🔹 When user clicks an event — redirect to details page
//   const handleEventClick = (info) => {
//     const { date } = info.event.extendedProps;
//     if (!date) return;
//     navigate(`/followups?date=${date}`);
//   };

//   return (
//     <div className="px-2">
//       <div className="bg-white shadow-md rounded-lg p-2">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           height="80vh"
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,dayGridWeek,dayGridDay",
//           }}
//           events={events}
//           eventClick={handleEventClick}
//           eventDisplay="block"
//           eventContent={(arg) => (
//             <div
//               style={{
//                 backgroundColor: "#1A2980",
//                 color: "white",
//                 borderRadius: "4px",
//                 padding: "3px 5px",
//                 fontSize: "13px",
//                 cursor: "pointer",
//                 textAlign: "center",
//               }}
//             >
//               {arg.event.title}
//             </div>
//           )}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";

export default function CallFollowUps() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        // ✅ Correct API call (matches backend)
        const res = await axios.get(`${API_URL}/call-history/follow-ups`);
        const data = res.data.followUps || [];

        if (data.length === 0) {
          toast.info("No call follow-ups found");
          return;
        }

        // ✅ Group by date
        const grouped = data.reduce((acc, item) => {
          const date = new Date(item.reschedule_date)
            .toISOString()
            .split("T")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {});

        // ✅ Format events for FullCalendar
        const formatted = Object.entries(grouped).map(([date, items]) => ({
          title: `${items.length} follow-up${items.length > 1 ? "s" : ""}`,
          date,
          extendedProps: { date, items }, // store items for easy access
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("❌ Error fetching follow-ups:", err);
        toast.error("Failed to load call follow-ups");
      }
    };

    fetchFollowUps();
  }, []);

  // 🔹 When user clicks an event — navigate to follow-up list by date
  const handleEventClick = (info) => {
    const { date } = info.event.extendedProps;
    if (!date) return;
    navigate(`/followups?date=${date}`);
  };

  return (
    <div className="px-2">
      <div className="bg-white shadow-md rounded-lg p-2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="80vh"
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
