import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import './Login.css';

const API_BASE_URL =  'https://muliya.ourapi.co.in';

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }

      // Only allow admins (UserType "2") or super-admins ("1") into the panel
      if (data.UserType !== '1' && data.UserType !== '2') {
        setError('Access denied. Admin accounts only.');
        return;
      }

      // Pass userId and UserType up to the parent
      onLogin(data.userId, data.UserType);

    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-brand">
          <img src="/Logo.svg" alt="Brand logo" className="login-logo" />
          <h1>Admin Panel</h1>
          <p>Sign in to access the dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-input-group">
            <span>Email</span>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="login-input-group">
            <span>Password</span>
            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="button login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}