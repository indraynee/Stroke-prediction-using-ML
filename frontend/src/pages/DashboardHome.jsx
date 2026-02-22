import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Heart,
  Brain,
  LayoutDashboard,
  TestTube,
  Settings,
  Plus,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState("heart");

  // 🔹 Risk Data (Later fetch from backend)
  const [riskData, setRiskData] = useState({
    heart: 0.72,
    stroke: 0.31,
  });

  // 🔹 SHAP Data (Later from backend)
  const [shapData, setShapData] = useState([
    { feature: "Age", heart: 0.18, stroke: 0.07 },
    { feature: "Cholesterol", heart: 0.12, stroke: -0.05 },
    { feature: "BMI", heart: 0.22, stroke: 0.28 },
    { feature: "Blood Pressure", heart: 0.15, stroke: 0.11 },
    { feature: "Glucose", heart: -0.04, stroke: 0.16 },
  ]);

  // 🔹 History Data (Ready for backend)
  const [history, setHistory] = useState([
    { id: 1, date: "20 Nov 2025", heart: "68%", stroke: "29%" },
    { id: 2, date: "05 Dec 2025", heart: "74%", stroke: "34%" },
    { id: 3, date: "02 Jan 2026", heart: "61%", stroke: "22%" },
  ]);

  const formattedData = shapData
    .map((item) => ({
      feature: item.feature,
      value: item[selectedModel],
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="flex min-h-screen bg-[#eef2f7]">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-[#0091d5] transition-all duration-300 shadow-lg flex flex-col justify-between text-white`}
      >
        <div>
          <div className="p-6 text-xl font-bold flex items-center justify-center">
            {isCollapsed ? "CN" : "CardioNeuro AI"}
          </div>

          <nav className="px-4 space-y-4">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isCollapsed={isCollapsed}
              active
            />
            <NavItem
              icon={<TestTube size={20} />}
              label="New Test"
              isCollapsed={isCollapsed}
              onClick={() => navigate("/predict")}
            />
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              isCollapsed={isCollapsed}
            />
          </nav>
        </div>

        {!isCollapsed && (
          <div className="p-6 text-[10px] text-white/70">
            © 2026 CardioNeuro AI
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Menu
              className="text-gray-600 cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Cardiovascular Risk Dashboard
              </h1>
              <p className="text-gray-500 text-sm">
                Explainable Risk Prediction & Preventive Insights
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/predict")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow"
          >
            <Plus size={18} />
            New Prediction
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-9 space-y-8">
            {/* Risk Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskCard
                title="Heart Risk"
                value={riskData.heart}
                icon={<Heart />}
                color="from-blue-500 to-blue-400"
              />
              <RiskCard
                title="Stroke Risk"
                value={riskData.stroke}
                icon={<Brain />}
                color="from-purple-500 to-pink-400"
              />
            </div>

            {/* SHAP Chart */}
            <div className="bg-white rounded-2xl p-8 shadow border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">
                  Explainable AI – Feature Contribution
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModel("heart")}
                    className={`px-4 py-1 rounded-full text-sm ${
                      selectedModel === "heart"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Heart
                  </button>
                  <button
                    onClick={() => setSelectedModel("stroke")}
                    className={`px-4 py-1 rounded-full text-sm ${
                      selectedModel === "stroke"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Stroke
                  </button>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={formattedData}>
                    <CartesianGrid horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" barSize={18}>
                      {formattedData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.value > 0 ? "#ff4d4d" : "#2ecc71"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Suggestion Section */}
            <div className="bg-[#ffb703] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Preventive Recommendations
              </h3>

              <div className="space-y-4">
                <Suggestion text="🥗 Adopt Mediterranean diet (rich in fruits & omega-3)" />
                <Suggestion text="🏃 150 minutes moderate exercise weekly" />
                <Suggestion text="🧂 Reduce sodium & processed sugar intake" />
                <Suggestion text="😴 Maintain 7–8 hours of quality sleep" />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - HISTORY */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-800 mb-6">
                Previous Predictions
              </h3>

              <div className="space-y-5">
                {history.map((item) => (
                  <div key={item.id} className="border-b pb-3">
                    <p className="text-xs text-gray-400">{item.date}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      ❤️ {item.heart} | 🧠 {item.stroke}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Nav Item */
const NavItem = ({ icon, label, isCollapsed, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center ${
      isCollapsed ? "justify-center" : "gap-3"
    } p-3 rounded-lg cursor-pointer ${
      active ? "bg-white/20" : "hover:bg-white/10"
    }`}
  >
    {icon}
    {!isCollapsed && <span className="text-sm">{label}</span>}
  </div>
);

/* Risk Card */
const RiskCard = ({ title, value, icon, color }) => {
  const percent = Math.round(value * 100);
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-2xl p-6 shadow-md`}
    >
      <div className="flex justify-between items-center mb-4 opacity-80">
        <span className="text-sm uppercase">{title}</span>
        {icon}
      </div>
      <div className="text-4xl font-bold">{percent}%</div>
    </div>
  );
};

/* Suggestion */
const Suggestion = ({ text }) => (
  <div className="bg-white/30 backdrop-blur-md p-4 rounded-xl text-sm font-semibold text-slate-900">
    {text}
  </div>
);

export default DashboardHome;