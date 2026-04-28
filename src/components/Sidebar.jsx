import React, { useState } from 'react';
import { LayoutDashboard, Gem, ShoppingCart, Users, Settings, LogOut, Building2, Image, FileText, UserCircle, Ticket, MessageSquare, FolderOpen, Briefcase, Wallet, ChevronDown, ChevronRight, TrendingUp, Receipt, RefreshCw, Shield, Coins, Hammer } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'banner', label: 'Website Banner', icon: Image },
  { id: 'inventory', label: 'Inventory', icon: Gem },
  { id: 'gold-management', label: 'Gold Management', icon: Coins, starred: true, subItems: [
    { id: 'gold-rate', label: 'Gold Rate' },
    { id: 'making-charges', label: 'Making Charges' }
  ]},
  { id: 'sales', label: 'Sales', icon: Receipt, subItems: [
    { id: 'invoices', label: 'Invoices' },
    { id: 'returns-exchange', label: 'Returns / Exchange' }
  ]},
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'employees', label: 'Employees', icon: UserCircle },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
  { id: 'collections', label: 'Collections', icon: FolderOpen },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'goldplans', label: 'Gold Plans', icon: Wallet },
  { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp, starred: true },
  { id: 'settings', label: 'Settings', icon: Settings, subItems: [
    { id: 'user-roles', label: 'User Roles' }
  ]},
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <aside
      className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
     
    >
      <div className="sidebar-header animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <img src="/Logo.svg" alt="Brand logo" className="brand-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <div key={item.id} className="nav-item-wrapper animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
            <button
              className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.subItems ? 'has-subitems' : ''}`}
              onClick={() => {
  if (item.subItems) {
    toggleExpand(item.id); // ONLY expand
  } else {
    setActiveTab(item.id);
    onClose?.(); // close only for real navigation
  }
}}
            >
              <div className="nav-item-left">
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.starred && <span className="star-indicator">⭐</span>}
              </div>
              {item.subItems && (
                <span className="chevron">
                  {expandedItems[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
            </button>
            {item.subItems && expandedItems[item.id] && (
              <div className="sub-items">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`sub-item ${activeTab === subItem.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(subItem.id);
                      onClose?.();
                    }}
                  >
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <button
          className="nav-item"
          onClick={() => {
            onLogout?.();
            onClose?.();
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
