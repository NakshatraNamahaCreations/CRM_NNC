export default function CalendarCard() {
  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Calendar</h3>
      <div className="grid grid-cols-7 text-center gap-1 text-sm">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-gray-400">{d}</div>
        ))}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`py-1 rounded-md ${
              i === 10 ? "bg-primary text-white font-bold" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
