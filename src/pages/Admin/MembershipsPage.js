import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
    fetchMembers();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getMemberships.php`);
      const data = await response.json();
      if (data.success) {
        setMemberships(data.memberships || []);
      }
    } catch (err) {
      console.error('Error fetching memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getMembers.php`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getExpiringSoon = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return memberships.filter(m => {
      if (!m.end_date) return false;
      const endDate = new Date(m.end_date);
      return endDate >= today && endDate <= nextWeek;
    });
  };

  const expiringSoon = getExpiringSoon();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Memberships Management</h1>
        </div>

        {expiringSoon.length > 0 && (
          <div className="section-card" style={{ marginBottom: '20px', background: '#fff3cd', border: '1px solid #ffc107' }}>
            <h2><FontAwesomeIcon icon={faExclamationTriangle} /> Expiring Soon (Next 7 Days)</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringSoon.map((membership) => (
                    <tr key={membership.id}>
                      <td>{getMemberName(membership.member_id)}</td>
                      <td>{membership.plan_name}</td>
                      <td>{membership.end_date}</td>
                      <td>
                        <span className={`status-badge status-${membership.payment_status}`}>
                          {membership.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="data-table">
          <div className="table-header">
            <h2>All Memberships ({memberships.length})</h2>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Payment Status</th>
                    <th>Auto Renew</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        No memberships found
                      </td>
                    </tr>
                  ) : (
                    memberships.map((membership) => (
                      <tr key={membership.id}>
                        <td>{getMemberName(membership.member_id)}</td>
                        <td>{membership.plan_name || '-'}</td>
                        <td>₹{parseFloat(membership.price || 0).toFixed(2)}</td>
                        <td>{membership.start_date || '-'}</td>
                        <td>{membership.end_date || '-'}</td>
                        <td>
                          <span className={`status-badge status-${membership.payment_status}`}>
                            {membership.payment_status}
                          </span>
                        </td>
                        <td>{membership.auto_renew ? 'Yes' : 'No'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipsPage;

