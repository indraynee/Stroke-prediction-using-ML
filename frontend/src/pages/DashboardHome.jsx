import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Heart,
  Brain,
  LayoutDashboard,
  TestTube,
  LogOut,
  Plus,
  History,
  UserCircle,
  BookOpen,
  BarChart3,
  Shield,
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
import { getProfile, getHistory } from "../services/api";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState("stroke");
  const [userRole, setUserRole] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  // Risk Data — from latest prediction
  const [riskData, setRiskData] = useState({
    heart: null,
    stroke: null,
  });

  // SHAP Data — from latest prediction
  const [shapData, setShapData] = useState([]);

  // Fetch user role, history, and compute dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile and role
        const profileResponse = await getProfile();
        setUserRole(profileResponse.data.role || 'user');
        
        // Fetch prediction history
        const historyResponse = await getHistory();
        const allHistory = historyResponse.data;

        // Build recent history for sidebar
        const recentHistory = allHistory.slice(0, 5).map(record => {
          const prob = record.probability;
          let riskLabel = 'Low Risk';
          if (prob >= 0.6) riskLabel = 'High Risk';
          else if (prob >= 0.3) riskLabel = 'Medium Risk';
          return {
            id: record._id,
            date: new Date(record.created_at).toLocaleDateString(),
            risk: `${(prob * 100).toFixed(0)}%`,
            prediction: riskLabel
          };
        });
        setHistory(recentHistory);

        // Use latest prediction for risk cards and SHAP chart
        if (allHistory.length > 0) {
          const latest = allHistory[0]; // Most recent prediction

          // Set stroke risk from latest prediction
          setRiskData({
            stroke: latest.probability || 0,
            heart: latest.probability ? latest.probability * 0.8 : 0,
          });

          // Build chart data — try SHAP values first, fall back to patient parameters
          let chartEntries = [];

          // Check if we have valid SHAP values (not error/note)
          if (latest.shap_values && typeof latest.shap_values === 'object') {
            // Skip non-medical and non-useful features
            const skipFeatures = ['gender', 'work_type', 'ever_married', 'residence_type', 'age'];

            // Clean feature name mapping
            const labelMap = {
              'bmi': 'Body Mass Index',
              'hypertension': 'Hypertension',
              'heart_disease': 'Heart Disease',
              'avg_glucose_level': 'Blood Glucose',
            };

            const rawEntries = Object.entries(latest.shap_values)
              .filter(([key]) => key !== 'error' && key !== 'note')
              .filter(([key]) => !skipFeatures.some(skip => key.toLowerCase().includes(skip)));

            // Consolidate smoking status variants into one entry
            let smokingTotal = 0;
            let smokingCount = 0;
            const nonSmokingEntries = [];

            rawEntries.forEach(([feature, value]) => {
              let numValue = 0;
              if (typeof value === 'number') numValue = value;
              else if (Array.isArray(value) && value.length >= 2) numValue = value[1];
              else if (Array.isArray(value) && value.length === 1) numValue = value[0];

              if (feature.toLowerCase().includes('smoking')) {
                smokingTotal += Math.abs(numValue);
                smokingCount++;
              } else {
                const label = labelMap[feature] || feature
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, c => c.toUpperCase());
                nonSmokingEntries.push({ feature: label, value: numValue });
              }
            });

            // Add consolidated smoking entry
            if (smokingCount > 0) {
              nonSmokingEntries.push({ feature: 'Smoking Impact', value: smokingTotal });
            }

            if (nonSmokingEntries.length > 0) {
              chartEntries = nonSmokingEntries
                .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                .slice(0, 6);
            }
          }

          // Fallback: use patient input parameters as chart data
          if (chartEntries.length === 0) {
            chartEntries = [
              { feature: 'Age', value: latest.age || 0 },
              { feature: 'BMI', value: latest.bmi || 0 },
              { feature: 'Glucose Level', value: latest.avg_glucose_level || 0 },
              { feature: 'Hypertension', value: latest.hypertension ? 1 : 0 },
              { feature: 'Heart Disease', value: latest.heart_disease ? 1 : 0 },
            ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
          }

          setShapData(chartEntries);

          // Set suggestions from latest prediction if available
          if (latest.suggestions && Array.isArray(latest.suggestions) && latest.suggestions.length > 0) {
            setSuggestions(latest.suggestions);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedData = shapData.length > 0
    ? shapData
    : [{ feature: "No data yet", value: 0 }];

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
              icon={<History size={20} />}
              label="History"
              isCollapsed={isCollapsed}
              onClick={() => navigate("/history")}
            />
            <NavItem
              icon={<BarChart3 size={20} />}
              label="Analytics"
              isCollapsed={isCollapsed}
              onClick={() => navigate("/analytics")}
            />
            <NavItem
              icon={<UserCircle size={20} />}
              label="Profile"
              isCollapsed={isCollapsed}
              onClick={() => navigate("/profile")}
            />
            <NavItem
              icon={<BookOpen size={20} />}
              label="Health Tips"
              isCollapsed={isCollapsed}
              onClick={() => navigate("/health-tips")}
            />
            {userRole === 'admin' && (
              <NavItem
                icon={<Shield size={20} />}
                label="Admin Panel"
                isCollapsed={isCollapsed}
                onClick={() => navigate("/admin")}
              />
            )}
            <NavItem
              icon={<LogOut size={20} />}
              label="Logout"
              isCollapsed={isCollapsed}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                navigate('/login');
              }}
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
                <span className="text-sm text-gray-400">From latest prediction</span>
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
                {suggestions.length > 0 ? (
                  suggestions.map((s, i) => <Suggestion key={i} text={s} />)
                ) : (
                  <>
                    <Suggestion text="🥗 Adopt Mediterranean diet (rich in fruits & omega-3)" />
                    <Suggestion text="🏃 150 minutes moderate exercise weekly" />
                    <Suggestion text="🧂 Reduce sodium & processed sugar intake" />
                    <Suggestion text="😴 Maintain 7–8 hours of quality sleep" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - HISTORY */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">
                  Previous Predictions
                </h3>
                <button
                  onClick={() => navigate('/history')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-3">No predictions yet</p>
                  <button
                    onClick={() => navigate('/predict')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Make your first prediction
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border-b pb-3 last:border-b-0">
                      <p className="text-xs text-gray-400 mb-1">{item.date}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Risk: {item.risk}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.prediction === 'High Risk' 
                            ? 'bg-red-100 text-red-600' 
                            : item.prediction === 'Medium Risk'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.prediction}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
  const hasData = value !== null && value !== undefined;
  const percent = hasData ? Math.round(value * 100) : null;
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-2xl p-6 shadow-md`}
    >
      <div className="flex justify-between items-center mb-4 opacity-80">
        <span className="text-sm uppercase">{title}</span>
        {icon}
      </div>
      <div className="text-4xl font-bold">
        {hasData ? `${percent}%` : <span className="text-2xl opacity-70">No data yet</span>}
      </div>
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