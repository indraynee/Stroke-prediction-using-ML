import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const SHAPVisualization = React.memo(({ shapValues }) => {
  // Memoize the expensive data transformation
  const shapData = useMemo(() => {
    if (!shapValues || typeof shapValues !== 'object') {
      return [];
    }

    return Object.entries(shapValues)
      .map(([feature, value]) => {
        // Clean up feature names for better display
        let cleanFeature = feature;
        
        // Remove 'cat_' prefix from categorical features
        cleanFeature = cleanFeature.replace(/^cat_/i, '');
        
        // Replace underscores with spaces
        cleanFeature = cleanFeature.replace(/_/g, ' ');
        
        // Capitalize first letter of each word
        cleanFeature = cleanFeature.replace(/\b\w/g, (l) => l.toUpperCase());
        
        // Handle specific abbreviations
        cleanFeature = cleanFeature
          .replace(/Bmi/g, 'BMI')
          .replace(/Avg/g, 'Average');
        
        // Shorten specific long names
        const shortenMap = {
          'Residence Type Urban': 'Residence: Urban',
          'Residence Type Rural': 'Residence: Rural',
          'Ever Married Yes': 'Married: Yes',
          'Ever Married No': 'Married: No',
          'Gender Female': 'Gender: Female',
          'Gender Male': 'Gender: Male',
          'Smoking Status': 'Smoking',
          'Work Type': 'Work',
          'Average Glucose Level': 'Avg Glucose'
        };
        
        cleanFeature = shortenMap[cleanFeature] || cleanFeature;
        
        // Final length check - truncate if still too long
        if (cleanFeature.length > 18) {
          cleanFeature = cleanFeature.substring(0, 15) + '...';
        }
        
        return {
          feature: cleanFeature,
          originalFeature: feature, // Keep original for tooltip
          value: typeof value === 'number' ? value : 0,
          absValue: Math.abs(typeof value === 'number' ? value : 0),
        };
      })
      .sort((a, b) => b.absValue - a.absValue)
      .slice(0, 8); // Top 8 features for better readability
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
