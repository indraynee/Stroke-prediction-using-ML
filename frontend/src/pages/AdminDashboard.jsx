import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, Activity, TrendingUp, AlertCircle, 
  Search, Trash2, Shield, CheckCircle, XCircle,
  BarChart3, ArrowLeft 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchSystemStats();
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchSystemStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err.response?.status === 403) {
        setError('Admin access required. You do not have permission to view this page.');
      } else {
        setError('Failed to load system statistics');
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: { page: currentPage, per_page: 10, search: searchTerm }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (email, currentStatus) => {
    try {
      await api.put(`/admin/users/${email}`, { is_active: !currentStatus });
      setUpdateMessage(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      setTimeout(() => setUpdateMessage(''), 3000);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${email}`);
      setUpdateMessage('User deleted successfully');
      setTimeout(() => setUpdateMessage(''), 3000);
      fetchUsers();
      fetchSystemStats();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handlePromoteToAdmin = async (email) => {
    if (!window.confirm(`Promote ${email} to admin role?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${email}`, { role: 'admin' });
      setUpdateMessage('User promoted to admin successfully');
      setTimeout(() => setUpdateMessage(''), 3000);
      fetchUsers();
    } catch (err) {
      console.error('Error promoting user:', err);
      setError('Failed to promote user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a1e] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ebae2]"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-[#050a1e] text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#8ebae2] text-[#050a1e] px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a1e] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-[#8ebae2]/20 p-3 rounded-lg">
              <Shield className="text-[#8ebae2]" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">System management and user monitoring</p>
            </div>
          </div>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span>{updateMessage}</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-[#8ebae2]" size={24} />
                <span className="text-2xl font-bold">{stats.total_users}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-green-500 text-xs mt-1">{stats.active_users} active</p>
            </div>

            <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-[#8ebae2]" size={24} />
                <span className="text-2xl font-bold">{stats.total_predictions}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Predictions</p>
              <p className="text-blue-500 text-xs mt-1">{stats.recent_predictions} this month</p>
            </div>

            <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-[#8ebae2]" size={24} />
                <span className="text-2xl font-bold">{stats.avg_predictions_per_user}</span>
              </div>
              <p className="text-gray-400 text-sm">Avg Per User</p>
            </div>

            <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="text-red-500" size={24} />
                <span className="text-2xl font-bold">{stats.high_risk_percentage}%</span>
              </div>
              <p className="text-gray-400 text-sm">High Risk Cases</p>
            </div>
          </div>
        )}

        {/* Activity Chart */}
        {stats && stats.activity_data && (
          <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47] mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 size={24} />
              Prediction Activity (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.activity_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f47" />
                <XAxis dataKey="date" stroke="#8ebae2" />
                <YAxis stroke="#8ebae2" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1432', border: '1px solid #8ebae2' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="predictions" stroke="#8ebae2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* User Management */}
        <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
          <h3 className="text-xl font-bold mb-4">User Management</h3>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#050a1e] border border-[#1a1f47] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#8ebae2] transition"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1f47]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Predictions</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Active</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-[#1a1f47] hover:bg-[#1a1f47]/30 transition">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.prediction_count}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {user.last_prediction 
                        ? new Date(user.last_prediction).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-500 text-sm">
                          <CheckCircle size={16} />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-sm">
                          <XCircle size={16} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handlePromoteToAdmin(user.email)}
                            className="p-2 hover:bg-purple-500/20 rounded transition text-purple-400"
                            title="Promote to Admin"
                          >
                            <Shield size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleUserStatus(user.email, user.is_active)}
                          className={`p-2 rounded transition ${
                            user.is_active 
                              ? 'hover:bg-yellow-500/20 text-yellow-400'
                              : 'hover:bg-green-500/20 text-green-400'
                          }`}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#8ebae2]/20 rounded-lg disabled:opacity-50 hover:bg-[#8ebae2]/30 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#8ebae2]/20 rounded-lg disabled:opacity-50 hover:bg-[#8ebae2]/30 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
