import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SettingsTab = () => {
  const { currentUser } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showPets: true,
    allowMessages: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPrivacySettings(userData.privacy || {
              showPhone: true,
              showEmail: true,
              showLocation: true,
              showPets: true,
              allowMessages: true,
            });
          }
        } catch (error) {
          console.error('Error fetching privacy settings:', error);
        }
      }
    };
    fetchPrivacySettings();
  }, [currentUser]);

  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveSettings = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        privacy: privacySettings
      });
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage("Error saving settings. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl dark:text-white font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg dark:text-white font-semibold mb-3">
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive order updates and promotions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  SMS Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive order status updates via SMS
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Marketing Communications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive offers and promotions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-500 pt-6">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">
            Privacy Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Show Phone Number
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow other users to see your phone number
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.showPhone}
                  onChange={() => handlePrivacyChange('showPhone')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Show Email Address
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow other users to see your email address
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.showEmail}
                  onChange={() => handlePrivacyChange('showEmail')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Show Location
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow other users to see your address/location
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.showLocation}
                  onChange={() => handlePrivacyChange('showLocation')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Show Pets
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow other users to see your pets information
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.showPets}
                  onChange={() => handlePrivacyChange('showPets')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-gray-300">
                  Allow Messages
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow other users to send you messages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.allowMessages}
                  onChange={() => handlePrivacyChange('allowMessages')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary_app/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary_app"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">
            Account
          </h3>
          <div className="space-y-4">
            <button className="text-primary_app hover:underline">
              Download My Data
            </button>
            <div>
              <button className="text-red-500 hover:underline">
                Delete My Account
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={saveSettings}
            disabled={loading}
            className="px-6 py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
