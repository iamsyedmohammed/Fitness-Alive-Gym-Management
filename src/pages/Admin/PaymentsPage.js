import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import PaymentForm from '../../components/admin/PaymentForm';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getPayments.php`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
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

  const handleAddPayment = (memberId = null) => {
    setSelectedMemberId(memberId);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recordPayment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setSelectedMemberId(null);
        fetchPayments();
      } else {
        alert(data.error || 'Payment recording failed');
      }
    } catch (err) {
      alert('Error recording payment');
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const filteredPayments = payments.filter((payment) => {
    const memberName = getMemberName(payment.member_id).toLowerCase();
    const matchesSearch = memberName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Payments Management</h1>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h2>All Payments ({filteredPayments.length}) - Total: ₹{totalAmount.toFixed(2)}</h2>
            <div className="table-actions">
              <button onClick={() => handleAddPayment()} className="btn-primary">
                <FontAwesomeIcon icon={faCreditCard} /> Record Payment
              </button>
            </div>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          {getMemberName(payment.member_id)}
                          <button
                            onClick={() => handleAddPayment(payment.member_id)}
                            className="btn-small btn-edit"
                            style={{ marginLeft: '10px' }}
                          >
                            Add Payment
                          </button>
                        </td>
                        <td>₹{parseFloat(payment.amount || 0).toFixed(2)}</td>
                        <td>{payment.payment_date || '-'}</td>
                        <td>{payment.payment_method || '-'}</td>
                        <td>
                          <span className={`status-badge status-${payment.status}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.description || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <PaymentForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMemberId(null);
          }}
          onSave={handleSave}
          memberId={selectedMemberId}
          memberName={selectedMemberId ? getMemberName(selectedMemberId) : null}
          members={members}
        />
      </div>
    </div>
  );
};

export default PaymentsPage;

