import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const ChangePasswordPage = () => {
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('New password and confirm password do not match');
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/changePassword.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': adminToken ? `Bearer ${adminToken}` : ''
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          token: adminToken, // Also send token in body as fallback
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Password changed successfully!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (err) {
      alert('Error changing password');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Change Password</h1>
        </div>

        <div className="section-card">
          <h2>Change Password</h2>
          <div className="modal-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleChangePassword} className="btn-primary">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

