import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import './Header.css';

export default function Header({ activeTab, onMenuToggle }) {
  const pageTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <header className="header glass-panel animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search inventory..." />
        </div>

        <button className="icon-button notification-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
