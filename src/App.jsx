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
import GoldRate from './pages/GoldRate';
import MakingCharges from './pages/MakingCharges';
import Invoices from './pages/Invoices';
import ReturnsExchange from './pages/ReturnsExchange';
import UserRoles from './pages/UserRoles';
import Reports from './pages/Reports';
import Login from './pages/Login';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      case 'gold-rate':
        return <GoldRate />;
      case 'making-charges':
        return <MakingCharges />;
      case 'invoices':
        return <Invoices />;
      case 'returns-exchange':
        return <ReturnsExchange />;
      case 'user-roles':
        return <UserRoles />;
      case 'reports':
        return <Reports />;
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
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

<Sidebar
  activeTab={activeTab}
  setActiveTab={(tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // ✅ CLOSE HERE
  }}
  onLogout={handleLogout}
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)} // ✅ MUST EXIST
/>
      
      <main className="main-content">
        <Header activeTab={activeTab} onMenuClick={() => setIsSidebarOpen((v) => !v)} />
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
