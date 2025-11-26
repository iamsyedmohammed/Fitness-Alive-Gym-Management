import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersDetailsPage.css';

const EmployeeDetailsPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleView = async () => {
    if (!employeeId && !phoneNumber) {
      setError('Please enter either Employee ID or Phone Number');
      return;
    }

    setLoading(true);
    setError('');
    setEmployeeData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      
      if (data.success) {
        const employees = data.trainers || [];
        let foundEmployee = null;

        if (employeeId) {
          foundEmployee = employees.find(e => 
            e.trainer_code?.toLowerCase() === employeeId.toLowerCase() ||
            e.id?.toString() === employeeId
          );
        } else if (phoneNumber) {
          foundEmployee = employees.find(e => 
            e.phone?.replace(/\D/g, '') === phoneNumber.replace(/\D/g, '') ||
            e.phone === phoneNumber
          );
        }

        if (foundEmployee) {
          setEmployeeData(foundEmployee);
        } else {
          setError('Employee not found. Please check the Employee ID or Phone Number.');
        }
      } else {
        setError('Failed to fetch employees data');
      }
    } catch (err) {
      setError('Error fetching employee details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleView();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content members-details-content">
        {/* Title */}
        <div className="members-details-header">
          <h1 className="members-details-title">
            <span className="title-main">EMPLOYEES</span>
            <span className="title-sub">DETAILS</span>
          </h1>
        </div>

        {/* Search Form */}
        <div className="members-details-form-container">
          <div className="members-details-form">
            <input
              type="text"
              className="members-details-input"
              placeholder="Employee ID*"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="text"
              className="members-details-input members-details-input-active"
              placeholder="Phone Number*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="members-details-view-btn"
              onClick={handleView}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'VIEW'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="members-details-error">
            {error}
          </div>
        )}

        {/* Employee Details Display */}
        {employeeData && (
          <div className="members-details-result">
            <h2>EMPLOYEE INFORMATION</h2>
            <div className="member-details-grid">
              <div className="member-detail-item">
                <label>EMPLOYEE ID:</label>
                <span>{employeeData.id || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>EMPLOYEE CODE:</label>
                <span>{employeeData.trainer_code || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>NAME:</label>
                <span>{employeeData.name || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>PHONE:</label>
                <span>{employeeData.phone || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>EMAIL:</label>
                <span>{employeeData.email || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>GENDER:</label>
                <span>{employeeData.gender || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>DATE OF BIRTH:</label>
                <span>{formatDate(employeeData.date_of_birth)}</span>
              </div>
              <div className="member-detail-item">
                <label>ADDRESS:</label>
                <span>{employeeData.address || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>SHIFT:</label>
                <span>{employeeData.shift || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>SPECIALIZATION:</label>
                <span>{employeeData.specialization || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>EXPERIENCE:</label>
                <span>{employeeData.experience ? `${employeeData.experience} years` : '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>STATUS:</label>
                <span className={`status-badge status-${employeeData.is_active ? 'active' : 'inactive'}`}>
                  {employeeData.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;

