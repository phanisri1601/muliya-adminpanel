import React, { useEffect, useState } from 'react';
import { Search, Plus, Ticket, Edit, Trash2, X, Save, Tag, Percent, Hash, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import './Coupons.css';

const STORAGE_KEY = 'coupons_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const COUPON_TYPES = [
  { value: 'percentage', label: 'Percentage Discount' },
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'gold_rate', label: 'Gold Rate Discount' },
  { value: 'making_charge', label: 'Making Charge Discount' },
];

const APPLICABLE_CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'gold_jewellery', label: 'Gold Jewellery' },
  { value: 'diamond_jewellery', label: 'Diamond Jewellery' },
  { value: 'silver_jewellery', label: 'Silver Jewellery' },
  { value: 'platinum_jewellery', label: 'Platinum Jewellery' },
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'chains', label: 'Chains' },
  { value: 'bangles', label: 'Bangles' },
];

const initialFormData = {
  code: '',
  description: '',
  couponType: 'percentage',
  discount: '',
  maxLimit: '',
  minPurchase: '',
  isActive: true,
  isShowDisplay: true,
  applicableTo: 'all',
  startDate: '',
  endDate: '',
  usageLimit: '',
  usageCount: 0,
  appliesToGoldRate: false,
  appliesToMakingCharge: false,
  appliesToWastage: false,
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), []);
    setCoupons(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    COUPON_TYPES.find(t => t.value === coupon.couponType)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCoupon) {
      setCoupons(prev =>
        prev.map(coupon =>
          coupon.id === editingCoupon.id
            ? { ...coupon, ...formData, updatedAt: Date.now() }
            : coupon
        )
      );
    } else {
      const newCoupon = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCoupons(prev => [newCoupon, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      couponType: coupon.couponType || 'percentage',
      discount: coupon.discount || '',
      maxLimit: coupon.maxLimit || '',
      minPurchase: coupon.minPurchase || '',
      isActive: coupon.isActive ?? true,
      isShowDisplay: coupon.isShowDisplay ?? true,
      applicableTo: coupon.applicableTo || 'all',
      startDate: coupon.startDate || '',
      endDate: coupon.endDate || '',
      usageLimit: coupon.usageLimit || '',
      usageCount: coupon.usageCount || 0,
      appliesToGoldRate: coupon.appliesToGoldRate || false,
      appliesToMakingCharge: coupon.appliesToMakingCharge || false,
      appliesToWastage: coupon.appliesToWastage || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
    }
  };

  const toggleActive = (id) => {
    setCoupons(prev =>
      prev.map(coupon =>
        coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
      )
    );
  };

  const openModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const generateCode = () => {
    const prefix = formData.applicableTo === 'gold_jewellery' ? 'GOLD' :
                   formData.applicableTo === 'diamond_jewellery' ? 'DIAMOND' :
                   formData.applicableTo === 'all' ? 'WELCOME' : 'SAVE';
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormData(prev => ({ ...prev, code: `${prefix}${random}` }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (coupon) => {
    if (!coupon.endDate) return false;
    return new Date(coupon.endDate) < new Date();
  };

  const isGoldRelated = (applicableTo) => {
    return applicableTo === 'gold_jewellery' ||
           applicableTo === 'all' ||
           ['rings', 'necklaces', 'earrings', 'bracelets', 'chains', 'bangles'].includes(applicableTo);
  };

  return (
    <div className="coupons-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="coupons-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button className="button" onClick={openModal}>
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="glass-panel coupons-empty">
          <Ticket size={48} />
          <h3>No coupons yet</h3>
          <p>Create your first coupon to start offering discounts</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Coupon
          </button>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="glass-panel coupons-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="glass-panel table-container">
          <table className="coupons-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Type & Description</th>
                <th>Discount</th>
                <th>Max Limit</th>
                <th>Applicable To</th>
                <th>Validity</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon, index) => (
                <tr key={coupon.id} className={`animate-fade-in ${isExpired(coupon) ? 'expired' : ''}`} style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <td>
                    <div className="coupon-code-cell">
                      <Tag size={16} />
                      <span className="coupon-code">{coupon.code}</span>
                      {coupon.isShowDisplay && <span className="display-badge"><Eye size={12} /></span>}
                    </div>
                  </td>
                  <td>
                    <div className="coupon-type-desc">
                      <span className="coupon-type">
                        {COUPON_TYPES.find(t => t.value === coupon.couponType)?.label}
                      </span>
                      <span className="coupon-desc">{coupon.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="coupon-discount">
                      {coupon.couponType === 'percentage' ? (
                        <><Percent size={14} /> {coupon.discount}%</>
                      ) : coupon.couponType === 'fixed' ? (
                        <>₹ {coupon.discount}</>
                      ) : (
                        <>₹ {coupon.discount}</>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="coupon-limit">₹ {coupon.maxLimit || '-'}</span>
                  </td>
                  <td>
                    <span className={`applicable-badge ${isGoldRelated(coupon.applicableTo) ? 'gold' : ''}`}>
                      {APPLICABLE_CATEGORIES.find(c => c.value === coupon.applicableTo)?.label}
                    </span>
                  </td>
                  <td>
                    <div className="coupon-validity">
                      <span>{coupon.startDate ? formatDate(coupon.startDate) : 'No start'}</span>
                      <span className="validity-separator">→</span>
                      <span>{coupon.endDate ? formatDate(coupon.endDate) : 'No end'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="coupon-usage">
                      <span>{coupon.usageCount || 0}</span>
                      <span className="usage-separator">/</span>
                      <span>{coupon.usageLimit || '∞'}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${coupon.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleActive(coupon.id)}
                      title={coupon.isActive ? 'Active' : 'Inactive'}
                    >
                      {coupon.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button small" onClick={() => handleEdit(coupon)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="icon-button small danger" onClick={() => handleDelete(coupon.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="coupon-modal-overlay" onClick={closeModal}>
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-header">
              <h3>{editingCoupon ? 'Edit Coupon' : 'Add Coupons'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form">
              <div className="coupon-form-content">
                <div className="form-row">
                  <div className="form-group required">
                    <label>Code</label>
                    <div className="code-input-group">
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="WELCOME90"
                        required
                      />
                      <button type="button" className="generate-btn" onClick={generateCode}>
                        Generate
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Coupon description"
                    />
                  </div>
                  <div className="form-group required">
                    <label>Coupon_type</label>
                    <select name="couponType" value={formData.couponType} onChange={handleInputChange} required>
                      {COUPON_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>Discount</label>
                    <div className="input-with-icon">
                      {formData.couponType === 'percentage' ? <Percent size={16} /> : <span className="currency">₹</span>}
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        placeholder="100"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Maxlimit</label>
                    <div className="input-with-icon">
                      <span className="currency">₹</span>
                      <input
                        type="number"
                        name="maxLimit"
                        value={formData.maxLimit}
                        onChange={handleInputChange}
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Min Purchase</label>
                    <div className="input-with-icon">
                      <span className="currency">₹</span>
                      <input
                        type="number"
                        name="minPurchase"
                        value={formData.minPurchase}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>Applicable To</label>
                    <select name="applicableTo" value={formData.applicableTo} onChange={handleInputChange} required>
                      {APPLICABLE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Usage Limit</label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleInputChange}
                      placeholder="Unlimited"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>IsActive</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>IsShow_display</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isShowDisplay"
                        checked={formData.isShowDisplay}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {isGoldRelated(formData.applicableTo) && (
                  <div className="gold-options">
                    <h4>Gold Jewellery Options</h4>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="appliesToGoldRate"
                          checked={formData.appliesToGoldRate}
                          onChange={handleInputChange}
                        />
                        <span>Applies to Gold Rate</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="appliesToMakingCharge"
                          checked={formData.appliesToMakingCharge}
                          onChange={handleInputChange}
                        />
                        <span>Applies to Making Charges</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="appliesToWastage"
                          checked={formData.appliesToWastage}
                          onChange={handleInputChange}
                        />
                        <span>Applies to Wastage Charges</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="coupon-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={18} />
                  {editingCoupon ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
