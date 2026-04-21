import React from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Emma Watson', item: 'Diamond Solitaire Ring', total: '₹ 1,50,000', status: 'Processing' },
  { id: '#ORD-002', customer: 'John Doe', item: 'Gold Tennis Bracelet', total: '₹ 85,000', status: 'Shipped' },
  { id: '#ORD-003', customer: 'Sarah Smith', item: 'Sapphire Necklace', total: '₹ 2,10,000', status: 'Delivered' },
  { id: '#ORD-004', customer: 'Priya Patel', item: 'Platinum Wedding Band', total: '₹ 65,000', status: 'Processing' },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <MetricCard title="Total Revenue" value="₹ 4.2M" change={12.5} icon={IndianRupee} delay="0.1s" />
        <MetricCard title="Active Orders" value="142" change={8.2} icon={ShoppingBag} delay="0.2s" />
        <MetricCard title="Total Customers" value="1,429" change={5.1} icon={Users} delay="0.3s" />
        <MetricCard title="Conversion Rate" value="3.4%" change={-1.2} icon={TrendingUp} delay="0.4s" />
      </div>

      <div className="dashboard-charts">
        <div className="glass-panel chart-panel animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="chart-title">Revenue Overview</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E92247" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E92247" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#868e96" tickLine={false} axisLine={false} />
                <YAxis stroke="#868e96" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} width={50} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(233, 34, 71, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#212529' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E92247" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel chart-panel animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="chart-title">Recent Orders</h3>
          <div className="recent-orders">
            {recentOrders.map((order, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.item}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.customer} &middot; {order.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-main)' }}>{order.total}</div>
                  <div style={{ fontSize: '0.75rem', color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Processing' ? 'var(--accent-main-light)' : 'var(--text-muted)' }}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
