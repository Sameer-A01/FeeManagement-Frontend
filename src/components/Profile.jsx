import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Lock, Edit3, Save, X, Check, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/api';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [originalPassword, setOriginalPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        if (response.data.success) {
          const userInfo = {
            name: response.data.user.name,
            email: response.data.user.email,
            address: response.data.user.address,
            password: ''
          };
          setUserData(userInfo);
          setOriginalPassword(response.data.user.password);
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setSaveSuccess(false);
    
    const updateData = { ...userData };
    if (updateData.password === '' || updateData.password === originalPassword) {
      delete updateData.password;
    }

    try {
      const response = await axiosInstance.put(`/users/${user.userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`
        }
      });
      
      if (response.data.success) {
        setUserData({ 
          name: response.data.user.name,
          email: response.data.user.email,
          address: response.data.user.address,
          password: ''
        });
        setOriginalPassword(response.data.user.password);
        setIsEditing(false);
        setError(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to update user information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  User Profile
                </h1>
                <p className="text-sm text-gray-600">Manage your account information</p>
              </div>
            </div>
            
            {/* Success notification */}
            {saveSuccess && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full animate-fade-in">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Profile updated successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {userData.name || 'Loading...'}
                    </h2>
                    <p className="text-indigo-100">{userData.email}</p>
                  </div>
                </div>
                
                {!isEditing ? (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
                    disabled={loading}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-indigo-600 font-medium">Loading...</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all duration-200"
                  placeholder="Enter your address"
                />
              </div>

              {/* Password Field - Only show when editing */}
              {isEditing && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>New Password</span>
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:bg-gray-50"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

{/* Footer */}
<footer className="bg-white/70 backdrop-blur-sm border-t border-white/20 mt-12">
  <div className="container mx-auto px-6 py-8">
    <div className="flex flex-col items-center space-y-6">
      {/* Logo */}
      <img
        src="/WebAziz_logo.jpg"
        alt="WebAziz Logo"
        className="w-40 h-40 object-contain" // Large but balanced
      />

      {/* Footer Text */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Designed & Developed by{' '}
          <a
            href="https://webaziz.in"
            className="text-indigo-600 hover:text-purple-600 font-medium transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            webaziz.in
          </a>
        </p>
        <p className="text-gray-400 text-xs mt-1">
          © 2025 WebAziz. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
};

export default Profile;