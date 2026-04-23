import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, TrendingUp, TrendingDown, Calendar, X } from 'lucide-react';
import './GoldRate.css';

const initialGoldRates = [
  { id: 1, date: '2024-04-22', gold24k: 7250, gold22k: 6650, gold18k: 5438, silver: 850 },
  { id: 2, date: '2024-04-21', gold24k: 7200, gold22k: 6600, gold18k: 5400, silver: 845 },
  { id: 3, date: '2024-04-20', gold24k: 7180, gold22k: 6580, gold18k: 5380, silver: 840 },
  { id: 4, date: '2024-04-19', gold24k: 7150, gold22k: 6550, gold18k: 5362, silver: 835 },
  { id: 5, date: '2024-04-18', gold24k: 7100, gold22k: 6500, gold18k: 5333, silver: 830 },
];

export default function GoldRate() {
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('goldRates');
    return saved ? JSON.parse(saved) : initialGoldRates;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    gold24k: 0,
    gold22k: 0,
    gold18k: 0,
    silver: 0
  });

  useEffect(() => {
    localStorage.setItem('goldRates', JSON.stringify(rates));
  }, [rates]);

  const handleOpenModal = (rate = null) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        date: rate.date,
        gold24k: rate.gold24k,
        gold22k: rate.gold22k,
        gold18k: rate.gold18k,
        silver: rate.silver
      });
    } else {
      setEditingRate(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        gold24k: 0,
        gold22k: 0,
        gold18k: 0,
        silver: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRate(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRate) {
      setRates(rates.map(rate => rate.id === editingRate.id ? { ...formData, id: rate.id } : rate));
    } else {
      setRates([{ ...formData, id: Date.now() }, ...rates]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setRates(rates.filter(rate => rate.id !== id));
  };

  const getChangeIndicator = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    if (change > 0) return <TrendingUp size={16} className="trend-up" />;
    if (change < 0) return <TrendingDown size={16} className="trend-down" />;
    return null;
  };

  const getChangeClass = (current, previous) => {
    if (!previous) return '';
    const change = current - previous;
    if (change > 0) return 'trend-up';
    if (change < 0) return 'trend-down';
    return '';
  };

  return (
    <div className="gold-rate-container animate-fade-in">
      <div className="gold-rate-header">
        <div>
          <h2>Gold Rate Management</h2>
          <p>Manage daily gold and silver rates</p>
        </div>
        <button className="button" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Today's Rate
        </button>
      </div>

      <div className="rate-cards">
        <div className="rate-card gold-24k">
          <div className="rate-card-header">
            <span className="rate-label">24K Gold</span>
            <span className="rate-icon">🥇</span>
          </div>
          <div className="rate-value">₹ {rates[0]?.gold24k?.toLocaleString('en-IN') || 0}</div>
          <div className="rate-unit">per gram</div>
        </div>

        <div className="rate-card gold-22k">
          <div className="rate-card-header">
            <span className="rate-label">22K Gold</span>
            <span className="rate-icon">🥈</span>
          </div>
          <div className="rate-value">₹ {rates[0]?.gold22k?.toLocaleString('en-IN') || 0}</div>
          <div className="rate-unit">per gram</div>
        </div>

        <div className="rate-card gold-18k">
          <div className="rate-card-header">
            <span className="rate-label">18K Gold</span>
            <span className="rate-icon">🥉</span>
          </div>
          <div className="rate-value">₹ {rates[0]?.gold18k?.toLocaleString('en-IN') || 0}</div>
          <div className="rate-unit">per gram</div>
        </div>

        <div className="rate-card silver">
          <div className="rate-card-header">
            <span className="rate-label">Silver</span>
            <span className="rate-icon">⚪</span>
          </div>
          <div className="rate-value">₹ {rates[0]?.silver?.toLocaleString('en-IN') || 0}</div>
          <div className="rate-unit">per gram</div>
        </div>
      </div>

      <div className="glass-panel rate-table-container">
        <div className="table-header">
          <h3>Rate History</h3>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search by date..." />
          </div>
        </div>

        <table className="rate-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>24K Gold</th>
              <th>22K Gold</th>
              <th>18K Gold</th>
              <th>Silver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => {
              const prevRate = rates[index + 1];
              return (
                <tr key={rate.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                  <td>
                    <div className="date-cell">
                      <Calendar size={16} />
                      {rate.date}
                    </div>
                  </td>
                  <td>
                    <div className={`rate-cell ${getChangeClass(rate.gold24k, prevRate?.gold24k)}`}>
                      ₹ {rate.gold24k.toLocaleString('en-IN')}
                      {getChangeIndicator(rate.gold24k, prevRate?.gold24k)}
                    </div>
                  </td>
                  <td>
                    <div className={`rate-cell ${getChangeClass(rate.gold22k, prevRate?.gold22k)}`}>
                      ₹ {rate.gold22k.toLocaleString('en-IN')}
                      {getChangeIndicator(rate.gold22k, prevRate?.gold22k)}
                    </div>
                  </td>
                  <td>
                    <div className={`rate-cell ${getChangeClass(rate.gold18k, prevRate?.gold18k)}`}>
                      ₹ {rate.gold18k.toLocaleString('en-IN')}
                      {getChangeIndicator(rate.gold18k, prevRate?.gold18k)}
                    </div>
                  </td>
                  <td>
                    <div className={`rate-cell ${getChangeClass(rate.silver, prevRate?.silver)}`}>
                      ₹ {rate.silver.toLocaleString('en-IN')}
                      {getChangeIndicator(rate.silver, prevRate?.silver)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button small" onClick={() => handleOpenModal(rate)}>
                        <Edit size={16} />
                      </button>
                      <button className="icon-button small danger" onClick={() => handleDelete(rate.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRate ? 'Edit Rate' : 'Add New Rate'}</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form className="rate-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>24K Gold (₹/g)</label>
                  <input type="number" name="gold24k" value={formData.gold24k} onChange={(e) => setFormData({ ...formData, gold24k: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>

                <div className="form-group">
                  <label>22K Gold (₹/g)</label>
                  <input type="number" name="gold22k" value={formData.gold22k} onChange={(e) => setFormData({ ...formData, gold22k: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>

                <div className="form-group">
                  <label>18K Gold (₹/g)</label>
                  <input type="number" name="gold18k" value={formData.gold18k} onChange={(e) => setFormData({ ...formData, gold18k: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>
              </div>

              <div className="form-group">
                <label>Silver (₹/g)</label>
                <input type="number" name="silver" value={formData.silver} onChange={(e) => setFormData({ ...formData, silver: parseFloat(e.target.value) || 0 })} placeholder="0" required />
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">{editingRate ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
