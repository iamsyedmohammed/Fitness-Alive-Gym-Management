import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersDetailsPage.css';

const MembersDetailsPage = () => {
  const [membershipId, setMembershipId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleView = async () => {
    if (!membershipId && !phoneNumber) {
      setError('Please enter either Membership ID or Phone Number');
      return;
    }

    setLoading(true);
    setError('');
    setMemberData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/getMembers.php`);
      const data = await response.json();
      
      if (data.success) {
        const members = data.members || [];
        let foundMember = null;

        if (membershipId) {
          foundMember = members.find(m => 
            m.member_code?.toLowerCase() === membershipId.toLowerCase() ||
            m.id?.toString() === membershipId
          );
        } else if (phoneNumber) {
          foundMember = members.find(m => 
            m.phone?.replace(/\D/g, '') === phoneNumber.replace(/\D/g, '') ||
            m.phone === phoneNumber
          );
        }

        if (foundMember) {
          setMemberData(foundMember);
        } else {
          setError('Member not found. Please check the Membership ID or Phone Number.');
        }
      } else {
        setError('Failed to fetch members data');
      }
    } catch (err) {
      setError('Error fetching member details');
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

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content members-details-content">
        {/* Title */}
        <div className="members-details-header">
          <h1 className="members-details-title">
            <span className="title-main">MEMBERS</span>
            <span className="title-sub">DETAILS</span>
          </h1>
        </div>

        {/* Search Form */}
        <div className="members-details-form-container">
          <div className="members-details-form">
            <input
              type="text"
              className="members-details-input"
              placeholder="Membership ID*"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
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

        {/* Member Details Display */}
        {memberData && (
          <div className="members-details-result">
            <h2>MEMBER INFORMATION</h2>
            <div className="member-details-grid">
              <div className="member-detail-item">
                <label>MEMBER CODE:</label>
                <span>{memberData.member_code || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>NAME:</label>
                <span>{memberData.name || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>PHONE:</label>
                <span>{memberData.phone || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>EMAIL:</label>
                <span>{memberData.email || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>TRAINING TYPE:</label>
                <span>{memberData.training_type || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>MEMBERSHIP TYPE:</label>
                <span>{memberData.membership_type || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>PRICE:</label>
                <span>{memberData.price ? `₹${parseFloat(memberData.price).toLocaleString('en-IN')}` : '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>STATUS:</label>
                <span className={`status-badge status-${memberData.status?.toLowerCase()}`}>
                  {memberData.status ? memberData.status.toUpperCase() : '-'}
                </span>
              </div>
              <div className="member-detail-item">
                <label>START DATE:</label>
                <span>{memberData.start_date || '-'}</span>
              </div>
              <div className="member-detail-item">
                <label>END DATE:</label>
                <span>{memberData.end_date || '-'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersDetailsPage;

