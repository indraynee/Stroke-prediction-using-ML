import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../services/api';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Activity, BarChart3, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Please try again.');
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Increasing':
        return <TrendingUp className="text-red-500" size={24} />;
      case 'Decreasing':
        return <TrendingDown className="text-green-500" size={24} />;
      default:
        return <Minus className="text-gray-500" size={24} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Increasing':
        return 'text-red-500';
      case 'Decreasing':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!localStorage.getItem('isLoggedIn')) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030616] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ebae2]"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-[#030616] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (analytics.total_predictions === 0) {
    return (
      <div className="min-h-screen bg-[#030616] text-white">
        <div className="bg-[#0f1432] sticky top-0 z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-[#1a1f47] rounded-lg transition"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold font-serif">Health Analytics</h1>
              </div>
              <BarChart3 className="text-[#8ebae2]" size={32} />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-[#0f1432] rounded-lg p-12 text-center">
            <Activity className="mx-auto mb-4 text-gray-500" size={48} />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-gray-400 mb-6">Make your first prediction to see analytics and insights</p>
            <button
              onClick={() => navigate('/predict')}
              className="bg-[#8ebae2] text-[#030616] px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
            >
              Make a Prediction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030616] text-white">
      {/* Header */}
      <div className="bg-[#0f1432] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-[#1a1f47] rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold font-serif">Health Analytics & Insights</h1>
            </div>
            <BarChart3 className="text-[#8ebae2]" size={32} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Predictions */}
          <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Predictions</span>
              <Activity className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold">{analytics.total_predictions}</p>
          </div>

          {/* Average Risk */}
          <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average Risk</span>
              <AlertCircle className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-bold">{analytics.average_risk}%</p>
          </div>

          {/* Risk Trend */}
          <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Risk Trend</span>
              {getTrendIcon(analytics.risk_trend)}
            </div>
            <p className={`text-3xl font-bold ${getTrendColor(analytics.risk_trend)}`}>
              {analytics.risk_trend}
            </p>
          </div>

          {/* Highest Risk */}
          <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Highest Risk</span>
              <TrendingUp className="text-red-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-400">{analytics.highest_risk?.probability}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(analytics.highest_risk?.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Risk Over Time Chart */}
        <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47] mb-8">
          <h3 className="text-xl font-bold mb-4">Risk Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.risk_over_time}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f57" />
              <XAxis 
                dataKey="date" 
                stroke="#8ebae2"
                tick={{ fill: '#8ebae2', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#8ebae2"
                tick={{ fill: '#8ebae2' }}
                label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: '#8ebae2' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1432', border: '1px solid #8ebae2', borderRadius: '8px' }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Risk']}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#8ebae2" 
                strokeWidth={3}
                dot={{ fill: '#8ebae2', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Factors Analysis */}
        <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
          <h3 className="text-xl font-bold mb-6">Risk Factors Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Age */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average Age</p>
              <p className="text-2xl font-bold">{analytics.risk_factors.avg_age.toFixed(1)} years</p>
            </div>

            {/* BMI */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average BMI</p>
              <p className="text-2xl font-bold">{analytics.risk_factors.avg_bmi.toFixed(1)}</p>
            </div>

            {/* Glucose */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average Glucose</p>
              <p className="text-2xl font-bold">{analytics.risk_factors.avg_glucose.toFixed(1)} mg/dL</p>
            </div>

            {/* Hypertension */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Hypertension Rate</p>
              <p className="text-2xl font-bold text-yellow-400">{analytics.risk_factors.hypertension_rate.toFixed(1)}%</p>
            </div>

            {/* Heart Disease */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Heart Disease Rate</p>
              <p className="text-2xl font-bold text-red-400">{analytics.risk_factors.heart_disease_rate.toFixed(1)}%</p>
            </div>

            {/* Smoking */}
            <div className="p-4 bg-[#1a1f47] rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Smoking Rate</p>
              <p className="text-2xl font-bold text-orange-400">{analytics.risk_factors.smoking_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
