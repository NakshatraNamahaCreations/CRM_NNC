

export default function OnboardingTable() {
  const tasks = [
    ["Prepare workspace", "John Jones", "07/03/2020"],
    ["Meeting with HR manager", "Sara Lewis", "07/05/2020"],
    ["Office tour for employee", "Sara Lewis", "07/06/2020"],
  ];

  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Onboarding <span className="text-xs text-gray-400">(1/5 completed)</span>
      </h3>
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2 text-left">Task</th>
            <th className="text-left">Assigned To</th>
            <th className="text-left">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr key={i} className="border-b last:border-none">
              <td className="py-2">{t[0]}</td>
              <td>{t[1]}</td>
              <td>{t[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
