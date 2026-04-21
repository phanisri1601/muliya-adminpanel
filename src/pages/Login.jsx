import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import './Login.css';

const DEMO_EMAIL = 'admin@muliya.com';
const DEMO_PASSWORD = 'admin123';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setError('');
      onLogin();
      return;
    }

    setError('Invalid credentials. Use the demo email and password shown below.');
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="button login-submit">
            Sign In
          </button>
        </form>

        <p className="login-hint">
          Demo credentials: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}
