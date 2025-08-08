import React, { useState, useEffect } from 'react';
import { useNavStore } from '../store/navigation-store';
import Header from '../Header';
import LogoLoader from '../LogoLoader';
import useLoadingStore from '../store/loading-store';
import { settingsAPI } from '../services/api';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setActive('settings');
    fetchSettings();
  }, [setActive]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getNotificationSettings();
      setNotificationSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Failed to fetch settings');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsAPI.updateNotificationSettings(notificationSettings);
      setMessage('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setLoading(false);
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

        {message && (
          <div className={`p-3 rounded ${message.includes('successfully') ? 'bg-green-600' : 'bg-red-600'}`}>
            {message}
          </div>
        )}

        {/* Notification Settings */}
        <section className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 backdrop-blur-sm shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">🔔 Notification Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({...notificationSettings, email: e.target.checked})}
                  className="mr-3 w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-gray-300">Email Notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({...notificationSettings, sms: e.target.checked})}
                  className="mr-3 w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-gray-300">SMS Notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsapp}
                  onChange={(e) => setNotificationSettings({...notificationSettings, whatsapp: e.target.checked})}
                  className="mr-3 w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-gray-300">WhatsApp Notifications</span>
              </label>
            </div>
          </div>
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

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Settings;
