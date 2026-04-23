import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const SHAPVisualization = React.memo(({ shapValues }) => {
  // Memoize the expensive data transformation
  const shapData = useMemo(() => {
    if (!shapValues || typeof shapValues !== 'object') {
      return [];
    }

    // Skip non-medical features
    const skipFeatures = ['gender', 'work_type', 'ever_married', 'residence_type', 'age'];

    // Clean label mapping
    const labelMap = {
      'bmi': 'Body Mass Index',
      'hypertension': 'Hypertension',
      'heart_disease': 'Heart Disease',
      'avg_glucose_level': 'Blood Glucose',
    };

    let smokingTotal = 0;
    let smokingCount = 0;
    const entries = [];

    Object.entries(shapValues).forEach(([feature, value]) => {
      // Skip error/note/non-medical
      if (feature === 'error' || feature === 'note') return;
      if (skipFeatures.some(skip => feature.toLowerCase().includes(skip))) return;

      // Extract numeric value (handle arrays)
      let numValue = 0;
      if (typeof value === 'number') {
        numValue = value;
      } else if (Array.isArray(value) && value.length >= 2) {
        numValue = value[1]; // Class 1 (risk class)
      } else if (Array.isArray(value) && value.length === 1) {
        numValue = value[0];
      }

      // Consolidate smoking variants
      if (feature.toLowerCase().includes('smoking')) {
        smokingTotal += Math.abs(numValue);
        smokingCount++;
      } else {
        const cleanFeature = labelMap[feature] || feature
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        entries.push({
          feature: cleanFeature,
          originalFeature: feature,
          value: numValue,
          absValue: Math.abs(numValue),
        });
      }
    });

    // Add consolidated smoking
    if (smokingCount > 0) {
      entries.push({
        feature: 'Smoking Impact',
        originalFeature: 'smoking_status',
        value: smokingTotal,
        absValue: smokingTotal,
      });
    }

    return entries
      .sort((a, b) => b.absValue - a.absValue)
      .slice(0, 6);
  }, [shapValues]);

  if (!shapValues || typeof shapValues !== 'object') {
    return (
      <div className="text-gray-500 text-sm">
        No SHAP values available for visualization
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-xl max-w-xs">
          <p className="text-gray-800 font-semibold text-sm mb-1">
            {data.originalFeature ? data.originalFeature.replace(/_/g, ' ').replace(/cat /gi, '').replace(/\b\w/g, l => l.toUpperCase()) : data.feature}
          </p>
          <p className="text-gray-700 text-sm">
            Impact: <span className="font-bold">{data.value > 0 ? '+' : ''}{data.value.toFixed(4)}</span>
          </p>
          <p className={`text-xs mt-1 font-medium ${data.value > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {data.value > 0 ? '↑ Increases risk' : '↓ Decreases risk'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
          Feature Importance (SHAP Values)
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          This chart shows which factors had the strongest impact on your prediction.
          Red bars increase risk, green bars decrease risk.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={shapData} 
          layout="vertical" 
          margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            type="category" 
            dataKey="feature" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            width={130}
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {shapData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value > 0 ? '#ef4444' : '#10b981'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-6 justify-center text-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">Increases Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Decreases Risk</span>
        </div>
      </div>
    </div>
  );
});

export default SHAPVisualization;
