import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faDumbbell } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config/api';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const location = 'yakutpura';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/adminLogin.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, location }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse JSON
      let data;
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(text);
      } catch (jsonErr) {
        // If JSON parsing fails, show the raw response
        const text = await response.text();
        setError(`Server error: ${text.substring(0, 200)}`);
        return;
      }

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        navigate('/admin');
      } else {
        setError(data.error || data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      // More specific error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please check:\n1. PHP server is running (XAMPP/WAMP)\n2. API path is correct\n3. No browser extensions blocking requests');
      } else if (err.message.includes('HTTP error')) {
        setError(`Server error: ${err.message}`);
      } else {
        setError(err.message || 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <FontAwesomeIcon icon={faDumbbell} className="login-logo-icon" />
          <h1>GYM Management</h1>
          <p>Admin Login</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@gym.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>Default: admin@gym.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

