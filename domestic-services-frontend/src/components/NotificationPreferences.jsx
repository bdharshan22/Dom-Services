import React, { useState } from 'react';
import { toast } from 'react-toastify';

const NotificationPreferences = ({ user, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    whatsapp: user?.notificationPreferences?.whatsapp ?? true,
    sms: user?.notificationPreferences?.sms ?? true,
    email: user?.notificationPreferences?.email ?? true,
    pushNotifications: user?.notificationPreferences?.pushNotifications ?? true
  });

  const handleToggle = (type) => {
    const newPreferences = {
      ...preferences,
      [type]: !preferences[type]
    };
    setPreferences(newPreferences);
    onUpdate(newPreferences);
    toast.success(`${type.toUpperCase()} notifications ${newPreferences[type] ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">🔔</span>
        Notification Preferences
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📱</span>
            <div>
              <div className="font-medium">WhatsApp Notifications</div>
              <div className="text-sm text-gray-500">Booking updates via WhatsApp</div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('whatsapp')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.whatsapp ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.whatsapp ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💬</span>
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-gray-500">Real-time SMS updates</div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('sms')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.sms ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.sms ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📧</span>
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Detailed booking confirmations</div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('email')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.email ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.email ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🔔</span>
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-gray-500">In-app notifications</div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('pushNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.pushNotifications ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start">
          <span className="text-blue-600 mr-2">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Notification Types:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Booking confirmation</li>
              <li>Worker assignment</li>
              <li>Service reminders (30 mins before)</li>
              <li>Service completion</li>
              <li>Payment confirmations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;