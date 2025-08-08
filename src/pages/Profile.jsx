import React, { useState, useEffect } from 'react';
import { useNavStore } from '../store/navigation-store';
import { authAPI } from '../services/api';

const Profile = () => {
  const { setActive } = useNavStore();
  const [profile, setProfile] = useState({ 
    full_name: '', 
    email: '', 
    phone: '',
    alert_preferences: {
      sms: false,
      email: false,
      whatsapp: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setActive('profile');
    fetchProfile();
  }, [setActive]);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to fetch profile');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profile);
      setMessage('Profile updated successfully');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-cyan-200 mb-6">User Profile</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-600' : 'bg-red-600'}`}>
          {message}
        </div>
      )}
      
      <div className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-400 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Alert Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.alert_preferences?.email || false}
                  onChange={(e) => setProfile({
                    ...profile,
                    alert_preferences: {
                      ...profile.alert_preferences,
                      email: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                Email Alerts
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.alert_preferences?.sms || false}
                  onChange={(e) => setProfile({
                    ...profile,
                    alert_preferences: {
                      ...profile.alert_preferences,
                      sms: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                SMS Alerts
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.alert_preferences?.whatsapp || false}
                  onChange={(e) => setProfile({
                    ...profile,
                    alert_preferences: {
                      ...profile.alert_preferences,
                      whatsapp: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                WhatsApp Alerts
              </label>
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
