import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    gym_name: 'GYM Management',
    gym_address: '',
    gym_phone: '',
    gym_email: '',
    whatsapp_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateSettings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err) {
      alert('Error saving settings');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Gym Information</h1>
        </div>

        <div className="section-card">
          <h2>Gym Information</h2>
          <div className="modal-form">
            <div className="form-group">
              <label>Gym Name</label>
              <input
                type="text"
                name="gym_name"
                value={settings.gym_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="gym_address"
                value={settings.gym_address}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="gym_phone"
                  value={settings.gym_phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="gym_email"
                  value={settings.gym_email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input
                type="tel"
                name="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={handleChange}
                placeholder="Include country code (e.g., +91)"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
