import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, User, Activity, AlertCircle, Heart, Droplet } from 'lucide-react';

const SharedResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedPrediction();
  }, [id]);

  const fetchSharedPrediction = async () => {
    try {
      const response = await api.get(`/share/${id}`);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching shared prediction:', err);
      setError('Failed to load prediction. The link may be invalid or expired.');
      setLoading(false);
    }
  };

  const getRiskLevel = (probability) => {
    if (probability < 0.3) return { label: 'Low', color: 'text-green-500 bg-green-100' };
    if (probability < 0.6) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'High', color: 'text-red-600 bg-red-100' };
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ebae2]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-lg text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#8ebae2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const risk = getRiskLevel(data.probability);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Hide on print */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Shared Prediction Report</h1>
              <p className="text-gray-600 mt-1">CardioNeuro AI - Stroke Risk Assessment</p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-[#8ebae2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>
        </div>

        {/* Print Header - Show only on print */}
        <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Stroke Risk Assessment Report</h1>
          <p className="text-gray-600 mt-1">CardioNeuro AI - Powered by Machine Learning</p>
          <p className="text-sm text-gray-500 mt-2">
            Generated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Main Report Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
          {/* Risk Summary */}
          <div className={`${risk.color.includes('green') ? 'bg-green-50' : risk.color.includes('yellow') ? 'bg-yellow-50' : 'bg-red-50'} p-8 border-b print:bg-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stroke Risk Assessment</p>
                <div className="flex items-center gap-4">
                  <p className="text-5xl font-bold text-gray-800">
                    {(data.probability * 100).toFixed(1)}%
                  </p>
                  <span className={`px-4 py-2 rounded-full text-lg font-semibold ${risk.color}`}>
                    {risk.label} Risk
                  </span>
                </div>
              </div>
              <Activity className={risk.color.split(' ')[0]} size={64} />
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-8 border-b">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={24} />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Assessment Date</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(data.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-semibold">{data.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-semibold">{data.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BMI</p>
                <p className="font-semibold">{data.bmi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Glucose Level</p>
                <p className="font-semibold flex items-center gap-2">
                  <Droplet size={16} />
                  {data.avg_glucose_level} mg/dL
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Smoking Status</p>
                <p className="font-semibold">{data.smoking_status}</p>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={24} />
              Medical History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border-2 ${data.hypertension ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <p className="font-semibold">Hypertension</p>
                <p className={`text-lg ${data.hypertension ? 'text-red-600' : 'text-green-600'}`}>
                  {data.hypertension ? 'Yes' : 'No'}
                </p>
              </div>
              <div className={`p-4 rounded-lg border-2 ${data.heart_disease ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <p className="font-semibold">Heart Disease</p>
                <p className={`text-lg ${data.heart_disease ? 'text-red-600' : 'text-green-600'}`}>
                  {data.heart_disease ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 print:border-gray-300">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This prediction is generated by an AI model and should not be used as a substitute for professional medical advice. 
            Please consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>

        {/* Footer - Hide on print */}
        <div className="mt-6 text-center text-gray-500 text-sm print:hidden">
          <p>Report shared from CardioNeuro AI Platform</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-[#8ebae2] hover:underline"
          >
            Visit CardioNeuro AI
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SharedResult;
