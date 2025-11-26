import React, { useState, useEffect } from 'react';
import './Modal.css';

const PaymentForm = ({ isOpen, onClose, onSave, memberId, memberName, members = [] }) => {
  const [formData, setFormData] = useState({
    member_id: memberId || '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    description: '',
    status: 'completed',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        member_id: memberId || '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        description: '',
        status: 'completed',
      });
    }
  }, [isOpen, memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      member_id: memberId || '',
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      description: '',
      status: 'completed',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Payment {memberName && `- ${memberName}`}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {!memberId && (
            <div className="form-group">
              <label>Member *</label>
              <select
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.member_code || member.id})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Date</label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Payment for membership renewal, etc."
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

