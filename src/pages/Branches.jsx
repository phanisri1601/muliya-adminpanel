import React from 'react';
import { Clock3, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import './Branches.css';

const branches = [
  'Muliya Gold & Diamonds Puttur',
  'Muliya Gold & Diamonds Belthangady',
  'Muliya Gold & Diamonds Bengaluru',
  'Muliya Gold & Diamonds Madikeri',
  'Muliya Gold & Diamonds Gonikoppal',
  'Muliya Gold & Diamonds Madikeri (Somwarpet)',
  'Shyama Jewels Sourcing LLP',
  'Shyama Jewels Puttur LLP (NDY)',
];

const orderRateCards = [
  { label: 'Yesterday', value: '128', icon: Clock3 },
  { label: 'Today', value: '154', icon: CalendarDays },
  { label: 'Monthly', value: '4,120', icon: CalendarRange },
  { label: 'Yearly', value: '49,550', icon: CalendarClock },
];

export default function Branches() {
  return (
    <section className="branches-section">
      <h3 className="branches-title">Branches</h3>

      <div className="branches-list">
        {branches.map((branch, branchIndex) => (
          <div
            className="glass-panel branch-block animate-fade-in"
            style={{ animationDelay: `${0.15 + branchIndex * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            key={branch}
          >
            <h4 className="branch-name">{branch}</h4>

            <div className="branch-metrics-grid">
              {orderRateCards.map((rateCard) => (
                <div className="metric-card branch-metric-card" key={`${branch}-${rateCard.label}`}>
                  <div className="metric-header">
                    <h5 className="metric-title">Order Rate - {rateCard.label}</h5>
                    <div className="metric-icon">
                      <rateCard.icon size={18} />
                    </div>
                  </div>

                  <div className="metric-content">
                    <div className="metric-value">{rateCard.value}</div>
                    <div className="metric-change positive">Updated live</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
