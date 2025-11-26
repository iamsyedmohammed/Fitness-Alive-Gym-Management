import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import WhatsAppButton from '../../components/admin/WhatsAppButton';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const RemindersPage = () => {
  const [reminders, setReminders] = useState({ payment: [], renewal: [] });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getReminders.php`);
      const data = await response.json();
      if (data.success) {
        setReminders(data.reminders || { payment: [], renewal: [] });
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    if (!window.confirm(`Send reminders to ${selectedMembers.length} member(s)?`)) {
      return;
    }

    try {
      setSending(true);
      const response = await fetch(`${API_BASE_URL}/sendReminders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          member_ids: selectedMembers
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Reminders sent successfully to ${data.total_sent} member(s)!`);
        setSelectedMembers([]);
        fetchReminders();
      } else {
        alert(data.error || 'Failed to send reminders');
      }
    } catch (err) {
      alert('Error sending reminders');
    } finally {
      setSending(false);
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAll = (type) => {
    const members = type === 'payment' ? reminders.payment : reminders.renewal;
    const allIds = members.map(m => m.id);
    setSelectedMembers(allIds);
  };

  const allReminders = [...reminders.payment, ...reminders.renewal];
  const filteredReminders = selectedType === 'all' 
    ? allReminders 
    : reminders[selectedType] || [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1><FontAwesomeIcon icon={faBell} /> Automated Reminders</h1>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={selectedType} 
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedMembers([]);
              }}
              style={{ padding: '8px', fontSize: '14px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
            >
              <option value="all">All Reminders</option>
              <option value="payment">Payment Reminders</option>
              <option value="renewal">Renewal Reminders</option>
            </select>
            
            {filteredReminders.length > 0 && (
              <>
                <button 
                  onClick={() => {
                    if (selectedType === 'all') {
                      setSelectedMembers(allReminders.map(m => m.id));
                    } else {
                      selectAll(selectedType);
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  Select All
                </button>
                <button 
                  onClick={() => setSelectedMembers([])}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Clear Selection
                </button>
                <button 
                  onClick={handleSendReminders}
                  disabled={sending || selectedMembers.length === 0}
                  className="btn-primary"
                  style={{ marginLeft: 'auto', padding: '8px 16px' }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} /> 
                  {sending ? 'Sending...' : `Send to ${selectedMembers.length} Member(s)`}
                </button>
              </>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading reminders...</div>
          ) : (
            <>
              {/* Payment Reminders */}
              {(selectedType === 'all' || selectedType === 'payment') && (
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>
                    Payment Reminders ({reminders.payment.length})
                  </h2>
                  {reminders.payment.length === 0 ? (
                    <p style={{ color: '#999' }}>No payment reminders</p>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>Select</th>
                            <th>Member</th>
                            <th>Phone</th>
                            <th>Due Date</th>
                            <th>Due Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reminders.payment.map((member) => {
                            const dueAmount = parseFloat(member.due_amount || 0).toFixed(2);
                            const message = `Hi ${member.name}, your payment of ₹${dueAmount} is due on ${member.next_bill_date}. Please make the payment to continue your membership.`;
                            return (
                              <tr key={member.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    onChange={() => toggleMemberSelection(member.id)}
                                  />
                                </td>
                                <td>{member.name}</td>
                                <td>{member.phone}</td>
                                <td>{member.next_bill_date}</td>
                                <td>₹{dueAmount}</td>
                                <td>
                                  <WhatsAppButton phone={member.phone} message={message}>
                                    <FontAwesomeIcon icon={faWhatsapp} /> Send
                                  </WhatsAppButton>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Renewal Reminders */}
              {(selectedType === 'all' || selectedType === 'renewal') && (
                <div>
                  <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>
                    Renewal Reminders ({reminders.renewal.length})
                  </h2>
                  {reminders.renewal.length === 0 ? (
                    <p style={{ color: '#999' }}>No renewal reminders</p>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>Select</th>
                            <th>Member</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reminders.renewal.map((member) => {
                            const message = `Hi ${member.name}, your ${member.plan_name} membership expires on ${member.end_date}. Please renew to continue enjoying our services!`;
                            return (
                              <tr key={member.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    onChange={() => toggleMemberSelection(member.id)}
                                  />
                                </td>
                                <td>{member.name}</td>
                                <td>{member.phone}</td>
                                <td>{member.plan_name}</td>
                                <td>{member.end_date}</td>
                                <td>
                                  <WhatsAppButton phone={member.phone} message={message}>
                                    <FontAwesomeIcon icon={faWhatsapp} /> Send
                                  </WhatsAppButton>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;

