import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import WhatsAppButton from '../../components/admin/WhatsAppButton';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const WhatsAppMessagingPage = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [recipientType, setRecipientType] = useState('member');
  const [messageType, setMessageType] = useState('custom');
  const [customMessage, setCustomMessage] = useState('');
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, []);

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

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
    }
  };

  const templates = {
    welcome: (name) => `Welcome to GYM Management! Your membership starts today. We're excited to have you!`,
    renewal: (name, date) => `Hi ${name}, your membership expires on ${date}. Please renew to continue enjoying our services!`,
    payment: (name, amount) => `Hi ${name}, payment of ₹${amount} received. Thank you for your payment!`,
    session: (name, trainer, date, time) => `Reminder: Your workout session with ${trainer} is on ${date} at ${time}. See you there!`,
  };

  const getMessage = (recipient = null) => {
    if (messageType === 'custom') {
      return customMessage;
    }

    // If recipient is provided, use it; otherwise find the first selected
    if (!recipient) {
      recipient = recipientType === 'member' 
        ? members.find(m => selectedRecipients.includes(m.id))
        : trainers.find(t => selectedRecipients.includes(t.id));
    }

    if (!recipient) return '';

    switch (messageType) {
      case 'welcome':
        return templates.welcome(recipient.name);
      case 'renewal':
        return templates.renewal(recipient.name, recipient.end_date || 'soon');
      case 'payment':
        return templates.payment(recipient.name, '0');
      case 'session':
        return templates.session(recipient.name, 'Trainer', 'today', '10:00 AM');
      default:
        return customMessage;
    }
  };

  const recipients = recipientType === 'member' ? members : trainers;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>WhatsApp Messaging</h1>
        </div>

        <div className="section-card">
          <h2>Select Recipients</h2>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Recipient Type</label>
            <select
              value={recipientType}
              onChange={(e) => {
                setRecipientType(e.target.value);
                setSelectedRecipients([]);
              }}
            >
              <option value="member">Members</option>
              <option value="trainer">Trainers</option>
            </select>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
            {recipients.map((recipient) => (
              <label key={recipient.id} style={{ display: 'block', padding: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedRecipients.includes(recipient.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecipients([...selectedRecipients, recipient.id]);
                    } else {
                      setSelectedRecipients(selectedRecipients.filter(id => id !== recipient.id));
                    }
                  }}
                  style={{ marginRight: '10px' }}
                />
                {recipient.name} {recipient.phone && `(${recipient.phone})`}
              </label>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2>Compose Message</h2>
          <div className="form-group">
            <label>Message Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option value="custom">Custom Message</option>
              <option value="welcome">Welcome Message</option>
              <option value="renewal">Renewal Reminder</option>
              <option value="payment">Payment Confirmation</option>
              <option value="session">Session Reminder</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={messageType === 'custom' ? customMessage : getMessage()}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows="5"
              disabled={messageType !== 'custom'}
              placeholder="Type your message here..."
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            {selectedRecipients.length > 0 ? (
              <div>
                <p>Send to {selectedRecipients.length} recipient(s):</p>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const baseMessage = getMessage();
                      if (!baseMessage.trim()) {
                        alert('Please enter a message');
                        return;
                      }
                      
                      // Try to open all windows immediately (browsers may block some)
                      let opened = 0;
                      selectedRecipients.forEach((id, index) => {
                        const recipient = recipients.find(r => r.id === id);
                        if (recipient && recipient.phone) {
                          const message = getMessage(recipient);
                          const formattedPhone = recipient.phone.replace(/\D/g, '');
                          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                          
                          // Open with minimal delay to stay within user interaction context
                          setTimeout(() => {
                            const win = window.open(whatsappUrl, `wa_${id}_${index}`);
                            if (win) opened++;
                          }, index * 50); // Very short delay - 50ms
                        }
                      });
                      
                      // Show message about popup blocking if needed
                      setTimeout(() => {
                        if (opened < selectedRecipients.length) {
                          alert(`Opened ${opened} of ${selectedRecipients.length} windows. If some didn't open, your browser may be blocking popups. You can use "Show All Links" below to access them individually.`);
                        }
                      }, 500);
                    }}
                    className="btn-primary"
                    disabled={!getMessage().trim()}
                    style={{ padding: '10px 20px' }}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} /> Send to All Selected ({selectedRecipients.length})
                  </button>
                  
                  <button
                    onClick={() => setShowLinks(!showLinks)}
                    className="btn-secondary"
                    style={{ padding: '10px 20px' }}
                  >
                    {showLinks ? 'Hide' : 'Show'} All Links
                  </button>
                </div>
                
                {showLinks && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '15px', 
                    background: '#f8f9fa', 
                    borderRadius: '5px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Click each link to open WhatsApp:</p>
                    {selectedRecipients.map((id) => {
                      const recipient = recipients.find(r => r.id === id);
                      if (!recipient || !recipient.phone) return null;
                      const message = getMessage(recipient);
                      const formattedPhone = recipient.phone.replace(/\D/g, '');
                      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                      
                      return (
                        <div key={id} style={{ marginBottom: '8px' }}>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              padding: '8px 12px',
                              background: '#25D366',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                            onClick={(e) => {
                              // Also try window.open as backup
                              window.open(whatsappUrl, '_blank');
                            }}
                          >
                            <FontAwesomeIcon icon={faWhatsapp} /> {recipient.name} ({recipient.phone})
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedRecipients.map((id) => {
                  const recipient = recipients.find(r => r.id === id);
                  if (!recipient || !recipient.phone) return null;
                  return (
                    <div key={id} style={{ marginBottom: '10px' }}>
                      <WhatsAppButton
                        phone={recipient.phone}
                        message={getMessage(recipient)}
                      >
                        Send to {recipient.name}
                      </WhatsAppButton>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#999' }}>Please select at least one recipient</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessagingPage;

