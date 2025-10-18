import React from "react";
import Chart from "react-apexcharts";
import ProfileHeader from "../components/ProfileHeader";

export default function DashboardContent() {
  const stats = [
    {
      label: "Possession",
      value: "65%",
      color:
        "border-purple-500 bg-gradient-to-r from-purple-500/10 to-purple-400/5",
    },
    {
      label: "Overall Price",
      value: "$690.2m",
      color: "border-pink-500 bg-gradient-to-r from-pink-500/10 to-pink-400/5",
    },
    {
      label: "Transfer Budget",
      value: "$240.6m",
      color:
        "border-orange-500 bg-gradient-to-r from-orange-500/10 to-orange-400/5",
    },
    {
      label: "Average Score",
      value: "7.2",
      color: "border-teal-500 bg-gradient-to-r from-teal-500/10 to-teal-400/5",
    },
  ];

  const revenueChart = {
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#4F46E5"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.6,
          opacityFrom: 0.5,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: { style: { colors: "#9CA3AF" } },
      },
      yaxis: { labels: { style: { colors: "#9CA3AF" } } },
      grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
    },
    series: [
      {
        name: "Monthly Revenue",
        data: [12, 15, 18, 25, 22, 30, 35, 40, 38, 42, 47, 55],
      },
    ],
  };

  const leadsPie = {
    options: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      colors: [
        "#6366F1",
        "#22C55E",
        "#F59E0B",
        "#3B82F6",
        "#EC4899",
        "#10B981",
        "#A855F7",
      ],
      legend: { position: "bottom" },
      dataLabels: { enabled: true },
    },
    series: [20, 25, 15, 18, 10, 30, 22],
  };

  const payments = [
    {
      id: "P-001",
      client: "Arc Studio",
      amount: "$12,500",
      date: "2025-01-08",
      status: "Paid",
    },
    {
      id: "P-002",
      client: "Pixel Co",
      amount: "$8,400",
      date: "2025-01-10",
      status: "Pending",
    },
    {
      id: "P-003",
      client: "Nova Agency",
      amount: "$14,100",
      date: "2025-01-14",
      status: "Paid",
    },
  ];

  const activities = [
    "Lead #1023 created for 'Sierra Systems'",
    "Quotation Q-221 sent to Arc Studio",
    "Payment received from Pixel Co.",
    "Task assigned to Edwin Adenike",
  ];

  return (
    <main className="flex-1 p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ProfileHeader />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Dashboard Overview
        </h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition">
          + Add New
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`border ${s.color} rounded-2xl p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-1`}
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📈 Monthly Payments
          </h3>
          <Chart
            options={revenueChart.options}
            series={revenueChart.series}
            type="area"
            height={260}
          />
        </div>

        {/* New Leads Pie */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧭 New Leads (Month-wise)
          </h3>
          <Chart
            options={leadsPie.options}
            series={leadsPie.series}
            type="pie"
            height={260}
          />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standings */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            🏆 Standings
          </h3>
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">#</th>
                <th className="text-left">Team</th>
                <th>MP</th>
                <th>W</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Juventus", 8, 6, 1, 19],
                ["Atalanta", 8, 5, 2, 16],
                ["Inter", 8, 5, 3, 15],
                ["Napoli", 8, 4, 3, 14],
                ["Milan", 8, 4, 4, 13],
              ].map((row, i) => (
                <tr
                  key={i}
                  className="bg-gray-50 hover:bg-indigo-50 rounded-xl transition"
                >
                  <td className="py-2 font-medium text-gray-700">{i + 1}</td>
                  <td>{row[0]}</td>
                  <td className="text-center">{row[1]}</td>
                  <td className="text-center">{row[2]}</td>
                  <td className="text-center">{row[3]}</td>
                  <td className="text-center font-semibold text-indigo-600">
                    {row[4]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            💳 Latest Payments
          </h3>
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="bg-gray-50 hover:bg-green-50 transition">
                  <td className="py-2 font-medium text-gray-700">{p.id}</td>
                  <td>{p.client}</td>
                  <td className="text-center">{p.amount}</td>
                  <td className="text-center">{p.date}</td>
                  <td
                    className={`text-center font-semibold ${
                      p.status === "Paid"
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Stats + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            ⚽ Game Statistics
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>
              Played: <span className="font-medium text-gray-900">8</span>
            </p>
            <p>
              Victories:{" "}
              <span className="text-emerald-600 font-semibold">6</span>
            </p>
            <p>
              Draws: <span className="text-yellow-600 font-semibold">1</span>
            </p>
            <p>
              Lost: <span className="text-rose-600 font-semibold">1</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            🔔 Recent Activity
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {activities.map((a, i) => (
              <li
                key={i}
                className="p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg shadow-sm transition"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
