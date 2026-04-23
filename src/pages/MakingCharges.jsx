import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Hammer, Percent, IndianRupee, X } from 'lucide-react';
import './MakingCharges.css';

const initialCharges = [
  { id: 1, category: 'Ring', baseCharge: 500, chargeType: 'fixed', percentage: 0, stoneCharges: 200, gstPercent: 3, minCharge: 300, maxCharge: 2000, finalPrice: 725 },
  { id: 2, category: 'Necklace', baseCharge: 800, chargeType: 'percentage', percentage: 8, stoneCharges: 500, gstPercent: 3, minCharge: 500, maxCharge: 5000, finalPrice: 1342 },
  { id: 3, category: 'Earrings', baseCharge: 300, chargeType: 'fixed', percentage: 0, stoneCharges: 150, gstPercent: 3, minCharge: 200, maxCharge: 1500, finalPrice: 465 },
  { id: 4, category: 'Bracelet', baseCharge: 600, chargeType: 'percentage', percentage: 6, stoneCharges: 400, gstPercent: 3, minCharge: 400, maxCharge: 3000, finalPrice: 1062 },
  { id: 5, category: 'Pendant', baseCharge: 250, chargeType: 'fixed', percentage: 0, stoneCharges: 100, gstPercent: 3, minCharge: 150, maxCharge: 1000, finalPrice: 362 },
  { id: 6, category: 'Bangles', baseCharge: 700, chargeType: 'percentage', percentage: 7, stoneCharges: 450, gstPercent: 3, minCharge: 450, maxCharge: 4000, finalPrice: 1200 },
  { id: 7, category: 'Chain', baseCharge: 400, chargeType: 'percentage', percentage: 5, stoneCharges: 300, gstPercent: 3, minCharge: 300, maxCharge: 2500, finalPrice: 728 },
  { id: 8, category: 'Anklet', baseCharge: 550, chargeType: 'fixed', percentage: 0, stoneCharges: 250, gstPercent: 3, minCharge: 350, maxCharge: 2000, finalPrice: 825 },
];

export default function MakingCharges() {
  const [charges, setCharges] = useState(() => {
    const saved = localStorage.getItem('makingCharges');
    return saved ? JSON.parse(saved) : initialCharges;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    baseCharge: 0,
    chargeType: 'fixed',
    percentage: 0,
    stoneCharges: 0,
    gstPercent: 3,
    minCharge: 0,
    maxCharge: 0,
    finalPrice: 0
  });

  useEffect(() => {
    localStorage.setItem('makingCharges', JSON.stringify(charges));
  }, [charges]);

  useEffect(() => {
    const calculateFinalPrice = () => {
      let makingCharge = formData.chargeType === 'percentage'
        ? (formData.baseCharge * formData.percentage) / 100
        : formData.baseCharge;

      const subtotal = makingCharge + formData.stoneCharges;
      const gstAmount = (subtotal * formData.gstPercent) / 100;
      const finalPrice = subtotal + gstAmount;

      setFormData(prev => ({ ...prev, finalPrice: Math.round(finalPrice) }));
    };

    calculateFinalPrice();
  }, [formData.baseCharge, formData.chargeType, formData.percentage, formData.stoneCharges, formData.gstPercent]);

  const handleOpenModal = (charge = null) => {
    if (charge) {
      setEditingCharge(charge);
      setFormData({
        category: charge.category,
        baseCharge: charge.baseCharge,
        chargeType: charge.chargeType,
        percentage: charge.percentage,
        stoneCharges: charge.stoneCharges,
        gstPercent: charge.gstPercent,
        minCharge: charge.minCharge,
        maxCharge: charge.maxCharge,
        finalPrice: charge.finalPrice
      });
    } else {
      setEditingCharge(null);
      setFormData({
        category: '',
        baseCharge: 0,
        chargeType: 'fixed',
        percentage: 0,
        stoneCharges: 0,
        gstPercent: 3,
        minCharge: 0,
        maxCharge: 0,
        finalPrice: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCharge(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCharge) {
      setCharges(charges.map(charge => charge.id === editingCharge.id ? { ...formData, id: charge.id } : charge));
    } else {
      setCharges([...charges, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setCharges(charges.filter(charge => charge.id !== id));
  };

  const getChargeDisplay = (charge) => {
    if (charge.chargeType === 'percentage') {
      return `${charge.percentage}% of gold value`;
    }
    return `₹ ${charge.baseCharge.toLocaleString('en-IN')}`;
  };

  return (
    <div className="making-charges-container animate-fade-in">
      <div className="making-charges-header">
        <div>
          <h2>Making Charges</h2>
          <p>Configure making charges for different product categories</p>
        </div>
        <button className="button" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Charge
        </button>
      </div>

      <div className="charges-cards">
        <div className="charge-card">
          <div className="charge-card-icon">
            <Hammer size={32} />
          </div>
          <div className="charge-card-content">
            <div className="charge-card-label">Total Categories</div>
            <div className="charge-card-value">{charges.length}</div>
          </div>
        </div>

        <div className="charge-card">
          <div className="charge-card-icon">
            <Percent size={32} />
          </div>
          <div className="charge-card-content">
            <div className="charge-card-label">Percentage Based</div>
            <div className="charge-card-value">{charges.filter(c => c.chargeType === 'percentage').length}</div>
          </div>
        </div>

        <div className="charge-card">
          <div className="charge-card-icon">
            <IndianRupee size={32} />
          </div>
          <div className="charge-card-content">
            <div className="charge-card-label">Fixed Charges</div>
            <div className="charge-card-value">{charges.filter(c => c.chargeType === 'fixed').length}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel charges-table-container">
        <div className="table-header">
          <h3>Making Charges List</h3>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search category..." />
          </div>
        </div>

        <table className="charges-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Charge Type</th>
              <th>Charge</th>
              <th>Stone Charges</th>
              <th>GST %</th>
              <th>Final Price</th>
              <th>Min Charge</th>
              <th>Max Charge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge, index) => (
              <tr key={charge.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <td>
                  <div className="category-cell">
                    <Hammer size={16} />
                    {charge.category}
                  </div>
                </td>
                <td>
                  <span className={`charge-type-badge ${charge.chargeType}`}>
                    {charge.chargeType === 'percentage' ? <Percent size={14} /> : <IndianRupee size={14} />}
                    {charge.chargeType}
                  </span>
                </td>
                <td className="charge-value">
                  {getChargeDisplay(charge)}
                </td>
                <td>₹ {charge.stoneCharges?.toLocaleString('en-IN') || 0}</td>
                <td>{charge.gstPercent}%</td>
                <td className="final-price-cell">₹ {charge.finalPrice?.toLocaleString('en-IN') || 0}</td>
                <td>₹ {charge.minCharge.toLocaleString('en-IN')}</td>
                <td>₹ {charge.maxCharge.toLocaleString('en-IN')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small" onClick={() => handleOpenModal(charge)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-button small danger" onClick={() => handleDelete(charge.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCharge ? 'Edit Charge' : 'Add New Charge'}</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form className="charge-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Bangles">Bangles</option>
                  <option value="Chain">Chain</option>
                  <option value="Anklet">Anklet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Charge Type *</label>
                <div className="charge-type-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="chargeType"
                      value="fixed"
                      checked={formData.chargeType === 'fixed'}
                      onChange={(e) => setFormData({ ...formData, chargeType: e.target.value })}
                    />
                    <span><IndianRupee size={14} /> Fixed Amount</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="chargeType"
                      value="percentage"
                      checked={formData.chargeType === 'percentage'}
                      onChange={(e) => setFormData({ ...formData, chargeType: e.target.value })}
                    />
                    <span><Percent size={14} /> Percentage</span>
                  </label>
                </div>
              </div>

              {formData.chargeType === 'fixed' ? (
                <div className="form-group">
                  <label>Base Charge (₹) *</label>
                  <input type="number" name="baseCharge" value={formData.baseCharge} onChange={(e) => setFormData({ ...formData, baseCharge: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>
              ) : (
                <div className="form-group">
                  <label>Percentage (%) *</label>
                  <input type="number" name="percentage" value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || 0 })} placeholder="0" step="0.1" required />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Stone Charges (₹) *</label>
                  <input type="number" name="stoneCharges" value={formData.stoneCharges} onChange={(e) => setFormData({ ...formData, stoneCharges: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>

                <div className="form-group">
                  <label>GST % *</label>
                  <input type="number" name="gstPercent" value={formData.gstPercent} onChange={(e) => setFormData({ ...formData, gstPercent: parseFloat(e.target.value) || 0 })} placeholder="3" step="0.1" required />
                </div>
              </div>

              <div className="form-group">
                <label>Final Price (Auto Calculate) ✅</label>
                <input type="number" name="finalPrice" value={formData.finalPrice} readOnly className="readonly-input" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Min Charge (₹) *</label>
                  <input type="number" name="minCharge" value={formData.minCharge} onChange={(e) => setFormData({ ...formData, minCharge: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>

                <div className="form-group">
                  <label>Max Charge (₹) *</label>
                  <input type="number" name="maxCharge" value={formData.maxCharge} onChange={(e) => setFormData({ ...formData, maxCharge: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">{editingCharge ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
