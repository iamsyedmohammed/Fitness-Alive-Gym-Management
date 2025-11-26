import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './WhatsAppButton.css';

const WhatsAppButton = ({ phone, message, children }) => {
  if (!phone) return null;

  const formatPhone = (phone) => {
    return phone.replace(/\D/g, '');
  };

  const formatMessage = (msg) => {
    return encodeURIComponent(msg || '');
  };

  const whatsappUrl = `https://wa.me/${formatPhone(phone)}?text=${formatMessage(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      title="Send WhatsApp message"
    >
      {children || <FontAwesomeIcon icon={faWhatsapp} />}
    </a>
  );
};

export default WhatsAppButton;

