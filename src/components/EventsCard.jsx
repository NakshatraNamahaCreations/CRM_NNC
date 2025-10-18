export default function EventsCard() {
  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Events</h3>
      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow">
        <p className="text-xs mb-1">Design Review</p>
        <p className="text-sm font-semibold">9:00 AM - 10:00 AM</p>
        <div className="flex mt-2">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/20?img=${i}`}
              className="h-6 w-6 rounded-full border-2 border-white -ml-1"
              alt="avatar"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
