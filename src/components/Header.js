import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faDumbbell, faPhone } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicking outside (but not on the toggle button)
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.mobile-menu-toggle')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <FontAwesomeIcon icon={faDumbbell} className="logo-icon" />
          <span className="logo-text">FITNESS</span>
          <span className="logo-text-red">ALIVE</span>
        </Link>

          <nav ref={mobileMenuRef} className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            
            <Link 
              to="/admin/login"
              className="nav-link btn-nav"
              onClick={() => setIsMobileMenuOpen(false)}
                  >
              Admin Login
            </Link>

            <a href="tel:+919701858786" className="nav-link phone-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={faPhone} />
              <span>+91 9701858786</span>
            </a>
          </nav>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>
    </header>
  );
};

export default Header;
