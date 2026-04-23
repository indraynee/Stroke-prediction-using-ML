import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../services/api';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit2, Save, X, Lock, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedProfile(profile);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile(editedProfile);
      setProfile(response.data.user);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setShowPasswordModal(false);
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.msg || 'Failed to change password. Please try again.' 
      });
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

  return (
    <div className="min-h-screen bg-[#030616] text-white">
      {/* Header */}
      <div className="bg-[#0f1432] sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-[#1a1f47] rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold font-serif">My Profile</h1>
            </div>
            <User className="text-[#8ebae2]" size={32} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Message Banner */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-[#0f1432] rounded-lg p-8 border border-[#1a1f47]">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#8ebae2] rounded-full flex items-center justify-center text-[#030616] text-3xl font-bold">
                {profile?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name || profile?.username}</h2>
                <p className="text-gray-400">@{profile?.username}</p>
              </div>
            </div>
            
            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-[#8ebae2] text-[#030616] px-6 py-2 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Mail size={16} />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={editedProfile.email || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                    placeholder="your.email@example.com"
                  />
                ) : (
                  <p className="text-white text-lg">{profile?.email || 'Not provided'}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User size={16} />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editedProfile.full_name || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                    placeholder="John Doe"
                  />
                ) : (
                  <p className="text-white text-lg">{profile?.full_name || 'Not provided'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Phone size={16} />
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <p className="text-white text-lg">{profile?.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User size={16} />
                  Age
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={editedProfile.age || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                    className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                    placeholder="25"
                  />
                ) : (
                  <p className="text-white text-lg">{profile?.age || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <MapPin size={16} />
                Address
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editedProfile.address || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                  placeholder="123 Main St, City, Country"
                />
              ) : (
                <p className="text-white text-lg">{profile?.address || 'Not provided'}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">About Me</label>
              {editing ? (
                <textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none h-24"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-white text-lg">{profile?.bio || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-8 pt-8 border-t border-[#2a2f57]">
            <h3 className="text-xl font-semibold mb-4">Security</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 bg-[#1a1f47] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2a2f57] transition border border-[#2a2f57]"
              >
                <Lock size={18} />
                Change Password
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('isLoggedIn');
                  navigate('/login');
                }}
                className="flex items-center gap-2 bg-red-500/10 text-red-400 px-6 py-2 rounded-lg font-medium hover:bg-red-500/20 transition border border-red-500/30"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1432] rounded-lg p-8 max-w-md w-full border border-[#1a1f47]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-2 text-white focus:border-[#8ebae2] outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#8ebae2] text-[#030616] px-6 py-2 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
