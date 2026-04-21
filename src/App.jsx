import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Branches from './pages/Branches';
import Inventory from './pages/Inventory';
import Banner from './pages/Banner';
import Blog from './pages/Blog';
import Employees from './pages/Employees';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Orders from './pages/Orders';
import Collections from './pages/Collections';
import Careers from './pages/Careers';
import GoldPlans from './pages/GoldPlans';
import Login from './pages/Login';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'branches':
        return <Branches />;
      case 'inventory':
        return <Inventory />;
      case 'banner':
        return <Banner />;
      case 'blog':
        return <Blog />;
      case 'employees':
        return <Employees />;
      case 'coupons':
        return <Coupons />;
      case 'reviews':
        return <Reviews />;
      case 'orders':
        return <Orders />;
      case 'collections':
        return <Collections />;
      case 'careers':
        return <Careers />;
      case 'goldplans':
        return <GoldPlans />;
      default:
        return (
          <div className="glass-panel animate-fade-in placeholder-page" style={{ animationDelay: '0.4s' }}>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p>This module is currently under construction.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="main-content">
        <Header activeTab={activeTab} />
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
