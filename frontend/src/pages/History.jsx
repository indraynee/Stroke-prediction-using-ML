import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deletePrediction } from '../services/api';
import { ArrowLeft, Calendar, Activity, Search, Download, Trash2, Filter, Share2 } from 'lucide-react';
import ShareModal from '../components/ShareModal';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [history, searchTerm, filterRisk]);

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data);
      setFilteredHistory(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load prediction history. Please try again.');
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = [...history];

    // Filter by risk level
    if (filterRisk !== 'all') {
      filtered = filtered.filter((record) => {
        const risk = getRiskLevel(record.probability);
        return risk.label.toLowerCase() === filterRisk;
      });
    }

    // Search by age, BMI, or date
    if (searchTerm) {
      filtered = filtered.filter((record) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          record.age?.toString().includes(searchLower) ||
          record.bmi?.toString().includes(searchLower) ||
          record.gender?.toLowerCase().includes(searchLower) ||
          formatDate(record.created_at).toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredHistory(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deletePrediction(id);
      setHistory(history.filter((record) => record._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting prediction:', err);
      alert('Failed to delete prediction. Please try again.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Age', 'Gender', 'BMI', 'Glucose', 'Hypertension', 'Heart Disease', 'Smoking', 'Risk %', 'Risk Level'];
    const rows = filteredHistory.map((record) => [
      formatDate(record.created_at),
      record.age,
      record.gender,
      record.bmi,
      record.avg_glucose_level,
      record.hypertension ? 'Yes' : 'No',
      record.heart_disease ? 'Yes' : 'No',
      record.smoking_status,
      (record.probability * 100).toFixed(1),
      getRiskLevel(record.probability).label,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.
createElement('a');
    a.href = url;
    a.download = `stroke-prediction-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskLevel = (probability) => {
    if (probability < 0.3) return { label: 'Low', color: 'text-green-600 bg-green-100' };
    if (probability < 0.6) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'High', color: 'text-red-600 bg-red-100' };
  };

  if (!localStorage.getItem('isLoggedIn')) {
    navigate('/login');
    return null;
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
              <h1 className="text-2xl font-bold font-serif">Prediction History</h1>
            </div>
            <Activity className="text-[#8ebae2]" size={32} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search and Filter Bar */}
        {!loading && !error && history.length > 0 && (
          <div className="bg-[#0f1432] rounded-lg p-4 mb-6 border border-[#1a1f47]">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by age, BMI, gender, date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              {/* Export */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-[#8ebae2] text-[#030616] px-4 py-2 rounded-lg font-medium hover:bg-[#a5c9eb] transition whitespace-nowrap"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-400">
              Showing {filteredHistory.length} of {history.length} predictions
            </div>
</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ebae2]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-[#0f1432] rounded-lg p-12 text-center">
            <Activity className="mx-auto mb-4 text-gray-500" size={48} />
            <h2 className="text-xl font-semibold mb-2">No predictions yet</h2>
            <p className="text-gray-400 mb-6">Start by making your first stroke risk prediction</p>
            <button
              onClick={() => navigate('/predict')}
              className="bg-[#8ebae2] text-[#050a1e] px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
            >
              Make a Prediction
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((record, index) => {
              const risk = getRiskLevel(record.probability);
              return (
                <div
                  key={record._id || index}
                  className="bg-[#0f1432] rounded-lg p-6 hover:bg-[#1a1f47] transition border border-[#1a1f47] relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPredictionId(record._id);
                        setShareModalOpen(true);
                      }}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition text-gray-400 hover:text-blue-400"
                      title="Share prediction"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(record._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400"
                      title="Delete prediction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pr-12">
                    {/* Left Section - Date & Risk */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar size={16} />
                        <span className="text-sm">{formatDate(record.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Stroke Risk</p>
                          <p className="text-3xl font-bold">
                            {(record.probability * 100).toFixed(1)}%
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color}`}
                        >
                          {risk.label} Risk
                        </span>
                      </div>
                    </div>

                    {/* Middle Section - Patient Details */}
                    <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Age</p>
                        <p className="font-medium">{record.age} years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gender</p>
                        <p className="font-medium">{record.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">BMI</p>
                        <p className="font-medium">{record.bmi}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Glucose</p>
                        <p className="font-medium">{record.avg_glucose_level} mg/dL</p>
                      </div>
                    </div>

                    {/* Right Section - Medical Conditions */}
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-2">Medical History</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              record.hypertension ? 'bg-red-500' : 'bg-gray-600'
                            }`}
                          ></span>
                          <span>
                            Hypertension: {record.hypertension ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              record.heart_disease ? 'bg-red-500' : 'bg-gray-600'
                            }`}
                          ></span>
                          <span>
                            Heart Disease: {record.heart_disease ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                          <span>Smoking: {record.smoking_status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1432] rounded-lg p-8 max-w-md w-full border border-[#1a1f47]">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this prediction? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {selectedPredictionId && (
        <ShareModal
          predictionId={selectedPredictionId}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedPredictionId(null);
          }}
        />
      )}
    </div>
  );
};

export default History;
