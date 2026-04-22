import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, Calendar, Download, Filter } from 'lucide-react';
import './Reports.css';

export default function Reports() {
  const stats = [
    { label: 'Total Revenue', value: '₹ 12,45,000', change: '+15.3%', trend: 'up', icon: DollarSign, color: 'revenue' },
    { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: ShoppingCart, color: 'orders' },
    { label: 'Total Customers', value: '856', change: '+12.5%', trend: 'up', icon: Users, color: 'customers' },
    { label: 'Products Sold', value: '2,567', change: '-3.2%', trend: 'down', icon: Package, color: 'products' },
  ];

  const salesData = [
    { month: 'Jan', sales: 85000, orders: 120 },
    { month: 'Feb', sales: 92000, orders: 135 },
    { month: 'Mar', sales: 78000, orders: 110 },
    { month: 'Apr', sales: 105000, orders: 150 },
    { month: 'May', sales: 118000, orders: 165 },
    { month: 'Jun', sales: 125000, orders: 180 },
  ];

  const topProducts = [
    { name: 'Princess Cut Diamond Ring', sales: 45, revenue: 5400000, category: 'Ring' },
    { name: 'Classic Gold Chain 18k', sales: 38, revenue: 3230000, category: 'Necklace' },
    { name: 'Sapphire Drop Earrings', sales: 32, revenue: 3040000, category: 'Earrings' },
    { name: 'Diamond Tennis Bracelet', sales: 28, revenue: 7000000, category: 'Bracelet' },
    { name: 'Emerald Vintage Ring', sales: 25, revenue: 4375000, category: 'Ring' },
  ];

  const recentTransactions = [
    { id: 'TXN-001', customer: 'Priya Sharma', amount: 125000, date: '2024-04-22', status: 'Completed' },
    { id: 'TXN-002', customer: 'Rahul Verma', amount: 85000, date: '2024-04-22', status: 'Completed' },
    { id: 'TXN-003', customer: 'Anjali Patel', amount: 175000, date: '2024-04-21', status: 'Pending' },
    { id: 'TXN-004', customer: 'Vikram Singh', amount: 250000, date: '2024-04-21', status: 'Completed' },
    { id: 'TXN-005', customer: 'Meera Reddy', amount: 95000, date: '2024-04-20', status: 'Completed' },
  ];

  return (
    <div className="reports-container animate-fade-in">
      <div className="reports-header">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Track your business performance and insights</p>
        </div>
        <div className="reports-actions">
          <div className="date-filter">
            <Calendar size={18} />
            <select defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <button className="button outline">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <stat.icon size={24} />
              </div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="reports-grid">
        <div className="glass-panel sales-chart-card">
          <div className="card-header">
            <h3>Sales Overview</h3>
            <button className="icon-button small">
              <Filter size={16} />
            </button>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {salesData.map((data, index) => {
                const maxSales = Math.max(...salesData.map(d => d.sales));
                const height = (data.sales / maxSales) * 100;
                return (
                  <div key={index} className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: `${height}%` }}></div>
                    <div className="chart-label">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <span>Sales (₹)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel top-products-card">
          <div className="card-header">
            <h3>Top Products</h3>
            <button className="button outline small">View All</button>
          </div>
          <div className="top-products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">{index + 1}</div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-category">{product.category}</div>
                </div>
                <div className="product-stats">
                  <div className="product-sales">{product.sales} sold</div>
                  <div className="product-revenue">₹ {(product.revenue / 100000).toFixed(1)}L</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel transactions-card">
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <button className="button outline small">View All</button>
        </div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((txn, index) => (
              <tr key={index}>
                <td className="txn-id">{txn.id}</td>
                <td>{txn.customer}</td>
                <td>{txn.date}</td>
                <td className="txn-amount">₹ {txn.amount.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-badge ${txn.status.toLowerCase()}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
