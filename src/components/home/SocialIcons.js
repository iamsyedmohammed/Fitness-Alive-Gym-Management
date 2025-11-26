import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faInstagram, 
  faTwitter,
  faYoutube,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import './SocialIcons.css';

const SocialIcons = () => {
  const socialPlatforms = [
    {
      id: 'facebook',
      icon: faFacebook,
      url: 'https://facebook.com',
      label: 'Facebook'
    },
    {
      id: 'instagram',
      icon: faInstagram,
      url: 'https://instagram.com',
      label: 'Instagram'
    },
    {
      id: 'twitter',
      icon: faTwitter,
      url: 'https://twitter.com',
      label: 'Twitter'
    },
    {
      id: 'youtube',
      icon: faYoutube,
      url: 'https://youtube.com',
      label: 'YouTube'
    },
    {
      id: 'linkedin',
      icon: faLinkedin,
      url: 'https://linkedin.com',
      label: 'LinkedIn'
    }
  ];

  return (
    <div className="social-icons-container">
      {socialPlatforms.map((platform) => (
        <a
          key={platform.id}
          href={platform.url}
          className="social-icon-link"
          aria-label={`Follow us on ${platform.label}`}
          target="_blank"
          rel="noopener noreferrer"
          title={platform.label}
        >
          <FontAwesomeIcon 
            icon={platform.icon} 
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
