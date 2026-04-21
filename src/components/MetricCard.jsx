import React from 'react';

export default function MetricCard({ title, value, change, icon: Icon, delay }) {
  const isPositive = change >= 0;
  
  return (
    <div className="glass-panel metric-card animate-fade-in" style={{ animationDelay: delay, opacity: 0, animationFillMode: 'forwards' }}>
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-icon">
          <Icon size={20} />
        </div>
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{change}% from last month
        </div>
      </div>
    </div>
  );
}
