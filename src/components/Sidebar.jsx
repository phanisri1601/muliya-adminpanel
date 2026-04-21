import React from 'react';
import { LayoutDashboard, Gem, ShoppingCart, Users, Settings, LogOut, Building2, Image, FileText, UserCircle, Ticket, MessageSquare, FolderOpen, Briefcase, Wallet } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'banner', label: 'Website Banner', icon: Image },
  { id: 'inventory', label: 'Inventory', icon: Gem },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'employees', label: 'Employees', icon: UserCircle },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
  { id: 'collections', label: 'Collections', icon: FolderOpen },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'goldplans', label: 'Gold Plans', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <img src="/Logo.svg" alt="Brand logo" className="brand-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            className={`nav-item animate-fade-in ${activeTab === item.id ? 'active' : ''}`}
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <button className="nav-item" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
