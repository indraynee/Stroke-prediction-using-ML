import React from "react";
import {
  Bell,
  Menu,
  Heart,
  Brain,
  LayoutDashboard,
  TestTube,
  Settings,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const DashboardHome = () => {
  const barData = [
    { name: "Age", heart: 16500, stroke: 12000 },
    { name: "Cholesterol", heart: 10000, stroke: 5000 },
    { name: "BMI", heart: 15500, stroke: 18500 },
    { name: "BP", heart: 11000, stroke: 9000 },
    { name: "Sugar", heart: 10000, stroke: 13000 },
  ];

  return (
    <div className="flex min-h-screen bg-[#eef2f7]">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold text-purple-600">
            CardioNeuro
          </div>

          <nav className="px-4 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-purple-100 text-purple-700 rounded-lg">
              <LayoutDashboard size={18} />
              Dashboard
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
              <TestTube size={18} />
              Test
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
              <Settings size={18} />
              Settings
            </div>
          </nav>
        </div>

        <div className="p-6 text-sm text-gray-400">
          © 2026 CardioNeuro
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Rucas!
            </h1>
            <p className="text-gray-500">
              Your health insights, simplified
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Bell className="text-gray-600 cursor-pointer" />
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <Menu className="text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Heart Risk</h2>
              <Heart />
            </div>
            <div className="mt-6 text-4xl font-bold">70%</div>
            <p className="mt-2 text-sm opacity-90">Moderate Risk</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Stroke Risk</h2>
              <Brain />
            </div>
            <div className="mt-6 text-4xl font-bold">30%</div>
            <p className="mt-2 text-sm opacity-90">Low Risk</p>
          </div>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-9 space-y-8">

            {/* ✅ Feature Contribution (YOUR CODE STYLE) */}
            <div className="bg-white rounded-[35px] p-8 shadow-xl border border-gray-50">
              <h3 className="text-center font-bold text-slate-800 mb-8">
                Features Contribution to Risk
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barGap={12}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Bar
                      dataKey="heart"
                      fill="#3b82f6"
                      radius={[20, 20, 20, 20]}
                      barSize={20}
                    />
                    <Bar
                      dataKey="stroke"
                      fill="#ff9f00"
                      radius={[20, 20, 20, 20]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ Suggestions (YOUR STYLE) */}
            <div className="bg-[#ffb703] rounded-[35px] p-8 shadow-xl">
              <h3 className="font-black text-2xl mb-6 text-slate-900">
                Suggestions
              </h3>
              <div className="space-y-4">
                <SuggestionPill emoji="🥗" text="Focus on Mediterranean diet" />
                <SuggestionPill emoji="🏃" text="Aim for 150 min exercise weekly" />
                <SuggestionPill emoji="😴" text="Prioritize 7-8 hours of sleep" />
              </div>
            </div>

          </div>

          {/* ✅ RIGHT SIDEBAR (YOUR STYLE) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[35px] p-8 shadow-xl border border-gray-50 sticky top-10">
              <h3 className="font-bold text-slate-800 mb-8">
                Previous History
              </h3>

              <div className="space-y-8">
                <HistoryItem
                  month="11"
                  day="20"
                  title="Heart Rate Spike"
                  sub="Start 19s"
                />
                <HistoryItem
                  month="12"
                  day="15"
                  title="Mild Headache"
                  sub="Start Risk"
                />
                <HistoryItem
                  month="12"
                  day="28"
                  title="Annual Checkup"
                  sub="Completed"
                />
              </div>

              <button className="mt-10 w-full bg-[#1d63ff] text-white py-4 rounded-3xl font-bold shadow-lg hover:scale-[1.02] transition">
                + New Prediction
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* Helper Components */

const SuggestionPill = ({ emoji, text }) => (
  <div className="bg-white/30 backdrop-blur-md p-4 rounded-[25px] border border-white/20 flex items-center gap-4">
    <span className="text-xl">{emoji}</span>
    <span className="font-bold text-sm text-slate-900">{text}</span>
  </div>
);

const HistoryItem = ({ month, day, title, sub }) => (
  <div className="flex items-center gap-5 group cursor-pointer">
    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
      <span className="text-[10px] font-black text-blue-500 mb-0.5">
        {month}
      </span>
      <span className="text-xl font-black text-slate-800 leading-none">
        {day}
      </span>
    </div>
    <div>
      <p className="font-bold text-slate-900 text-sm leading-tight mb-1">
        {title}
      </p>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
        {sub}
      </p>
    </div>
  </div>
);

export default DashboardHome;
