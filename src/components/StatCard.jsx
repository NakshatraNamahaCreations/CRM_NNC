export default function StatCard({ label, value, color }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-4 border-l-4 ${color} hover:shadow-lg transition`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h2>
    </div>
  );
}
