import React, { useState, useEffect } from 'react';
import { useNavStore } from '../store/navigation-store';
import Header from '../Header';
import LogoLoader from '../LogoLoader';
import useLoadingStore from '../store/loading-store';
const Settings = () => {

  //LOAD BEFORE IT SHOWS SETTINGS PAGE
  const [showSettings, setShowSettings] = useState(false)

  const {showLoading, hideLoading} = useLoadingStore();
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
      handleShowSettings()
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function handleShowSettings () {
    setShowSettings(!showSettings)
  }




  const { setActive } = useNavStore();
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });

  useEffect(() => {
    setActive('settings');
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/notifications/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setNotificationSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [setActive]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(notificationSettings),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <>
    <Header />
    <LogoLoader />
    {showSettings &&<div className="min-h-screen bg-[#1A2332] text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400">⚙️ Settings</h1>
        </div>

        {/* Notification Preferences */}
        <section className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 backdrop-blur-sm shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">📩 Notification Preferences</h2>
          <div className="space-y-5">
            {[
              { key: 'email', label: 'Email Notifications' },
              { key: 'sms', label: 'SMS Notifications' },
              { key: 'whatsapp', label: 'WhatsApp Notifications' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-gray-300">{label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notificationSettings[key]}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-cyan-500 transition-all duration-300"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-full transition-transform duration-300"></div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition duration-200"
          >
            💾 Save Settings
          </button>
        </section>

        {/* Account Settings */}
        <section className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 backdrop-blur-sm shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">👤 Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                type="text"
                defaultValue="AdminUser"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-xs text-gray-400 italic mt-1">Leave blank to retain existing password</p>
            </div>
          </div>
        </section>
      </div>
    </div>}
    </>
  );
};

export default Settings;
