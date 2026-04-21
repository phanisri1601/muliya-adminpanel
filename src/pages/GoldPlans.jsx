import React, { useEffect, useState } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, Wallet, Gift, TrendingUp, CheckCircle, Clock, X, Download, Eye, Trash2, Edit2, DollarSign, Award } from 'lucide-react';
import './GoldPlans.css';

const STORAGE_KEY = 'gold_plans_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const PLAN_TYPES = {
  JSAP: {
    name: 'Jewel SAP (JSAP)',
    description: 'Monthly Installment Plan',
    minContribution: 1000,
    duration: 12,
    benefit: '50% bonus on one installment',
    redemption: 'Jewellery purchase',
    idealFor: 'Planned buyers & families',
    icon: Calendar
  },
  PIP: {
    name: 'PIP (Partner in Progress)',
    description: 'One-Time Investment Plan',
    minContribution: 100000,
    durationOptions: [6, 12],
    benefit: '6 months: 25% off VA | 12 months: 50% off VA',
    redemption: 'Gold or purchase discount',
    idealFor: 'Bulk buyers & investors',
    icon: TrendingUp
  }
};

const STATUS_OPTIONS = ['Active', 'Matured', 'Redeemed', 'Cancelled'];

const initialPlans = [
  {
    id: 'GP-001',
    customerFirstName: 'Rahul',
    customerLastName: 'Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    planType: 'JSAP',
    monthlyContribution: 5000,
    startDate: '2024-01-15',
    duration: 12,
    totalPaid: 25000,
    installmentsPaid: 5,
    maturityDate: '2025-01-15',
    maturityBenefit: 2500,
    status: 'Active',
    redemptionDate: null,
    redemptionAmount: null,
    notes: 'Regular payer, prefers gold jewelry'
  },
  {
    id: 'GP-002',
    customerFirstName: 'Priya',
    customerLastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    planType: 'PIP',
    investmentAmount: 100000,
    startDate: '2024-02-01',
    duration: 12,
    totalPaid: 100000,
    maturityDate: '2025-02-01',
    discountOnVA: 50,
    status: 'Active',
    redemptionDate: null,
    redemptionAmount: null,
    notes: 'Investor looking for gold discount'
  },
  {
    id: 'GP-003',
    customerFirstName: 'Suresh',
    customerLastName: 'Kumar',
    email: 'suresh.kumar@email.com',
    phone: '+91 9876543212',
    planType: 'JSAP',
    monthlyContribution: 10000,
    startDate: '2023-06-01',
    duration: 12,
    totalPaid: 120000,
    installmentsPaid: 12,
    maturityDate: '2024-06-01',
    maturityBenefit: 5000,
    status: 'Matured',
    redemptionDate: '2024-06-15',
    redemptionAmount: 125000,
    notes: 'Matured, planning to buy bridal jewelry'
  },
  {
    id: 'GP-004',
    customerFirstName: 'Lakshmi',
    customerLastName: 'Devi',
    email: 'lakshmi.devi@email.com',
    phone: '+91 9876543213',
    planType: 'PIP',
    investmentAmount: 100000,
    startDate: '2023-08-01',
    duration: 6,
    totalPaid: 100000,
    maturityDate: '2024-02-01',
    discountOnVA: 25,
    status: 'Redeemed',
    redemptionDate: '2024-02-10',
    redemptionAmount: 115000,
    notes: 'Redeemed for wedding jewelry purchase'
  },
  {
    id: 'GP-005',
    customerFirstName: 'Amit',
    customerLastName: 'Rao',
    email: 'amit.rao@email.com',
    phone: '+91 9876543214',
    planType: 'JSAP',
    monthlyContribution: 2000,
    startDate: '2024-03-01',
    duration: 12,
    totalPaid: 4000,
    installmentsPaid: 2,
    maturityDate: '2025-03-01',
    maturityBenefit: 1000,
    status: 'Active',
    redemptionDate: null,
    redemptionAmount: null,
    notes: 'New customer, small monthly contribution'
  }
];

export default function GoldPlans() {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [planTypeFilter, setPlanTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerLastName: '',
    email: '',
    phone: '',
    planType: 'JSAP',
    monthlyContribution: 1000,
    investmentAmount: 100000,
    duration: 12,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setPlans(stored);
    } else {
      setPlans(initialPlans);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlans));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const filteredPlans = plans.filter(plan => {
    const fullName = `${plan.customerFirstName} ${plan.customerLastName}`.toLowerCase();
    const matchesSearch = 
      plan.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      plan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.phone?.includes(searchTerm);
    
    const matchesPlanType = planTypeFilter === 'All' || plan.planType === planTypeFilter;
    const matchesStatus = statusFilter === 'All' || plan.status === statusFilter;
    
    return matchesSearch && matchesPlanType && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
  };

  const calculateMaturityDetails = (data) => {
    const start = new Date(data.startDate);
    const duration = parseInt(data.duration);
    const maturityDate = new Date(start);
    maturityDate.setMonth(maturityDate.getMonth() + duration);

    if (data.planType === 'JSAP') {
      const monthlyContribution = parseInt(data.monthlyContribution) || 1000;
      const totalContribution = monthlyContribution * duration;
      const maturityBenefit = monthlyContribution * 0.5; // 50% bonus on one installment
      return {
        maturityDate: maturityDate.toISOString().split('T')[0],
        totalContribution,
        maturityBenefit,
        finalAmount: totalContribution + maturityBenefit
      };
    } else {
      const investment = parseInt(data.investmentAmount) || 100000;
      const discountOnVA = duration === 12 ? 50 : 25;
      return {
        maturityDate: maturityDate.toISOString().split('T')[0],
        totalContribution: investment,
        discountOnVA,
        finalAmount: investment
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const maturityDetails = calculateMaturityDetails(formData);

    if (editingPlan) {
      setPlans(prev =>
        prev.map(plan =>
          plan.id === editingPlan.id
            ? {
                ...plan,
                ...formData,
                maturityDate: maturityDetails.maturityDate,
                totalPaid: formData.planType === 'JSAP' ? 0 : formData.investmentAmount,
                installmentsPaid: formData.planType === 'JSAP' ? 0 : null,
                maturityBenefit: maturityDetails.maturityBenefit || null,
                discountOnVA: maturityDetails.discountOnVA || null
              }
            : plan
        )
      );
    } else {
      const newPlan = {
        id: `GP-${String(plans.length + 1).padStart(3, '0')}`,
        ...formData,
        maturityDate: maturityDetails.maturityDate,
        totalPaid: formData.planType === 'JSAP' ? 0 : formData.investmentAmount,
        installmentsPaid: formData.planType === 'JSAP' ? 0 : null,
        maturityBenefit: maturityDetails.maturityBenefit || null,
        discountOnVA: maturityDetails.discountOnVA || null,
        redemptionDate: null,
        redemptionAmount: null
      };

      setPlans(prev => [newPlan, ...prev]);
    }

    closeModal();
  };

  const handleStatusChange = (id, newStatus) => {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, status: newStatus } : plan
      )
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      setPlans(prev => prev.filter(plan => plan.id !== id));
    }
  };

  const handleRecordPayment = (plan) => {
    if (plan.planType !== 'JSAP' || plan.status !== 'Active') return;

    const newInstallments = plan.installmentsPaid + 1;
    const newTotalPaid = plan.totalPaid + plan.monthlyContribution;
    const isMatured = newInstallments >= plan.duration;

    setPlans(prev =>
      prev.map(p =>
        p.id === plan.id
          ? {
              ...p,
              installmentsPaid: newInstallments,
              totalPaid: newTotalPaid,
              status: isMatured ? 'Matured' : p.status
            }
          : p
      )
    );
  };

  const handleRedeem = (plan) => {
    const redemptionAmount = plan.planType === 'JSAP'
      ? plan.totalPaid + plan.maturityBenefit
      : plan.totalPaid;

    setPlans(prev =>
      prev.map(p =>
        p.id === plan.id
          ? {
              ...p,
              status: 'Redeemed',
              redemptionDate: new Date().toISOString().split('T')[0],
              redemptionAmount
            }
          : p
      )
    );
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        customerFirstName: plan.customerFirstName,
        customerLastName: plan.customerLastName,
        email: plan.email,
        phone: plan.phone,
        planType: plan.planType,
        monthlyContribution: plan.monthlyContribution || 1000,
        investmentAmount: plan.investmentAmount || 100000,
        duration: plan.duration,
        startDate: plan.startDate,
        status: plan.status,
        notes: plan.notes || ''
      });
    } else {
      setEditingPlan(null);
      setFormData({
        customerFirstName: '',
        customerLastName: '',
        email: '',
        phone: '',
        planType: 'JSAP',
        monthlyContribution: 1000,
        investmentAmount: 100000,
        duration: 12,
        startDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const viewPlan = (plan) => {
    setSelectedPlan(plan);
    setViewMode('detail');
  };

  const backToList = () => {
    setViewMode('list');
    setSelectedPlan(null);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#2196f3';
      case 'Matured': return '#9c27b0';
      case 'Redeemed': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const getProgressPercentage = (plan) => {
    if (plan.planType === 'JSAP') {
      return (plan.installmentsPaid / plan.duration) * 100;
    }
    const start = new Date(plan.startDate);
    const maturity = new Date(plan.maturityDate);
    const today = new Date();
    const totalDays = (maturity - start) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - start) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  };

  const ListView = () => (
    <>
      <div className="gold-plans-header">
        <h2 className="gold-plans-title">Gold Plans</h2>
        <div className="gold-plans-filters">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={planTypeFilter} onChange={(e) => setPlanTypeFilter(e.target.value)}>
            <option value="All">All Plans</option>
            <option value="JSAP">Jewel SAP (JSAP)</option>
            <option value="PIP">PIP (Partner in Progress)</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="button" onClick={() => openModal()}>
            <Plus size={18} />
            Add Plan
          </button>
        </div>
      </div>

      {/* Plan Type Cards */}
      <div className="plan-type-cards">
        {Object.entries(PLAN_TYPES).map(([key, plan]) => {
          const Icon = plan.icon;
          return (
            <div key={key} className="plan-type-card">
              <div className="plan-type-header">
                <div className="plan-type-icon">
                  <Icon size={24} />
                </div>
                <span className="plan-type-badge">{key}</span>
              </div>
              <h4>{plan.name}</h4>
              <p className="plan-type-desc">{plan.description}</p>
              <div className="plan-type-details">
                <div className="plan-detail-item">
                  <span className="label">Min Contribution:</span>
                  <span className="value">₹{plan.minContribution.toLocaleString()}{key === 'JSAP' ? '/month' : ''}</span>
                </div>
                <div className="plan-detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{key === 'PIP' ? '6 or 12 months' : `${plan.duration} months`}</span>
                </div>
                <div className="plan-detail-item">
                  <span className="label">Benefit:</span>
                  <span className="value benefit">{plan.benefit}</span>
                </div>
                <div className="plan-detail-item">
                  <span className="label">Ideal For:</span>
                  <span className="value">{plan.idealFor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="gold-plans-stats">
        <div className="stat-card">
          <span className="stat-value">{plans.length}</span>
          <span className="stat-label">Total Plans</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{plans.filter(p => p.planType === 'JSAP').length}</span>
          <span className="stat-label">JSAP Plans</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{plans.filter(p => p.planType === 'PIP').length}</span>
          <span className="stat-label">PIP Plans</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {formatCurrency(plans.reduce((sum, p) => sum + (p.totalPaid || 0), 0))}
          </span>
          <span className="stat-label">Total Invested</span>
        </div>
      </div>

      {/* Plans Table */}
      <div className="glass-panel gold-plans-panel">
        <table className="gold-plans-table">
          <thead>
            <tr>
              <th>Plan ID</th>
              <th>Customer</th>
              <th>Plan Type</th>
              <th>Contribution</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Maturity Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan, index) => (
              <tr key={plan.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <td>
                  <span className="plan-id">{plan.id}</span>
                </td>
                <td>
                  <div className="plan-customer">
                    <div className="customer-avatar-small">
                      <User size={14} />
                    </div>
                    <div>
                      <span className="customer-name">{plan.customerFirstName} {plan.customerLastName}</span>
                      <span className="customer-phone">{plan.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`plan-type-badge ${plan.planType.toLowerCase()}`}>
                    {plan.planType}
                  </span>
                </td>
                <td>
                  <div className="plan-contribution">
                    <span className="contribution-amount">
                      {plan.planType === 'JSAP'
                        ? `${formatCurrency(plan.monthlyContribution)}/mo`
                        : formatCurrency(plan.investmentAmount)}
                    </span>
                    {plan.planType === 'JSAP' && (
                      <span className="paid-status">
                        Paid: {plan.installmentsPaid}/{plan.duration}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage(plan)}%` }}
                    />
                  </div>
                  <span className="progress-text">{Math.round(getProgressPercentage(plan))}%</span>
                </td>
                <td>
                  <select 
                    className="status-select"
                    value={plan.status}
                    onChange={(e) => handleStatusChange(plan.id, e.target.value)}
                    style={{ color: getStatusColor(plan.status), borderColor: getStatusColor(plan.status) }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div className="plan-date">
                    <Calendar size={14} />
                    <span>{formatDate(plan.maturityDate)}</span>
                  </div>
                </td>
                <td>
                  <div className="plan-actions">
                    <button className="action-btn view" onClick={() => viewPlan(plan)} title="View Details">
                      <Eye size={16} />
                    </button>
                    {plan.planType === 'JSAP' && plan.status === 'Active' && (
                      <button 
                        className="action-btn payment" 
                        onClick={() => handleRecordPayment(plan)} 
                        title="Record Payment"
                      >
                        <DollarSign size={16} />
                      </button>
                    )}
                    {plan.status === 'Matured' && (
                      <button 
                        className="action-btn redeem" 
                        onClick={() => handleRedeem(plan)} 
                        title="Redeem"
                      >
                        <Gift size={16} />
                      </button>
                    )}
                    <button className="action-btn edit" onClick={() => openModal(plan)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(plan.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPlans.length === 0 && (
          <div className="gold-plans-empty">
            <Wallet size={48} />
            <h3>No plans found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );

  const DetailView = () => {
    if (!selectedPlan) return null;

    const planTypeInfo = PLAN_TYPES[selectedPlan.planType];

    return (
      <div className="gold-plan-detail-view animate-fade-in">
        <div className="detail-view-header">
          <button className="back-btn" onClick={backToList}>
            <X size={18} />
            Back to List
          </button>
          <div className="detail-view-actions">
            {selectedPlan.planType === 'JSAP' && selectedPlan.status === 'Active' && (
              <button className="action-btn-outline" onClick={() => handleRecordPayment(selectedPlan)}>
                <DollarSign size={16} />
                Record Payment
              </button>
            )}
            {selectedPlan.status === 'Matured' && (
              <button className="action-btn-outline redeem" onClick={() => handleRedeem(selectedPlan)}>
                <Gift size={16} />
                Redeem Plan
              </button>
            )}
            <button className="action-btn-outline" onClick={() => openModal(selectedPlan)}>
              <Edit2 size={16} />
              Edit
            </button>
          </div>
        </div>

        <div className="gold-plan-detail-content">
          {/* Header */}
          <div className="detail-section plan-detail-header">
            <div className="plan-info-main">
              <div className="plan-icon-large">
                {React.createElement(planTypeInfo.icon, { size: 32 })}
              </div>
              <div>
                <h3>{planTypeInfo.name}</h3>
                <span className="plan-id-large">{selectedPlan.id}</span>
              </div>
            </div>
            <span 
              className="status-badge-large"
              style={{ backgroundColor: `${getStatusColor(selectedPlan.status)}20`, color: getStatusColor(selectedPlan.status) }}
            >
              {selectedPlan.status}
            </span>
          </div>

          {/* Progress */}
          <div className="detail-section progress-section">
            <h4><Clock size={18} /> Plan Progress</h4>
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large" 
                style={{ width: `${getProgressPercentage(selectedPlan)}%` }}
              />
            </div>
            <div className="progress-stats">
              <span>{Math.round(getProgressPercentage(selectedPlan))}% Complete</span>
              {selectedPlan.planType === 'JSAP' && (
                <span>{selectedPlan.installmentsPaid} of {selectedPlan.duration} installments paid</span>
              )}
            </div>
          </div>

          <div className="detail-grid">
            {/* Customer Info */}
            <div className="detail-section">
              <h4><User size={18} /> Customer Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{selectedPlan.customerFirstName} {selectedPlan.customerLastName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedPlan.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{selectedPlan.phone}</span>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="detail-section">
              <h4><Award size={18} /> Plan Details</h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Plan Type</span>
                  <span className="info-value highlight">{selectedPlan.planType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{selectedPlan.duration} months</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start Date</span>
                  <span className="info-value">{formatDate(selectedPlan.startDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Maturity Date</span>
                  <span className="info-value highlight">{formatDate(selectedPlan.maturityDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="detail-section financial-section">
            <h4><Wallet size={18} /> Financial Summary</h4>
            <div className="financial-grid">
              <div className="financial-card">
                <span className="financial-label">Total Contribution</span>
                <span className="financial-value">{formatCurrency(selectedPlan.totalPaid)}</span>
              </div>
              
              {selectedPlan.planType === 'JSAP' && (
                <>
                  <div className="financial-card">
                    <span className="financial-label">Monthly Contribution</span>
                    <span className="financial-value">{formatCurrency(selectedPlan.monthlyContribution)}</span>
                  </div>
                  <div className="financial-card benefit">
                    <span className="financial-label">Maturity Benefit</span>
                    <span className="financial-value">+{formatCurrency(selectedPlan.maturityBenefit)}</span>
                  </div>
                  <div className="financial-card total">
                    <span className="financial-label">Final Maturity Value</span>
                    <span className="financial-value">{formatCurrency(selectedPlan.totalPaid + selectedPlan.maturityBenefit)}</span>
                  </div>
                </>
              )}

              {selectedPlan.planType === 'PIP' && (
                <>
                  <div className="financial-card">
                    <span className="financial-label">Investment Amount</span>
                    <span className="financial-value">{formatCurrency(selectedPlan.investmentAmount)}</span>
                  </div>
                  <div className="financial-card benefit">
                    <span className="financial-label">Discount on VA</span>
                    <span className="financial-value">{selectedPlan.discountOnVA}% OFF</span>
                  </div>
                </>
              )}

              {selectedPlan.status === 'Redeemed' && (
                <div className="financial-card redeemed">
                  <span className="financial-label">Redeemed Amount</span>
                  <span className="financial-value">{formatCurrency(selectedPlan.redemptionAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {selectedPlan.notes && (
            <div className="detail-section">
              <h4><CheckCircle size={18} /> Notes</h4>
              <p className="notes-text">{selectedPlan.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="gold-plans-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      {viewMode === 'detail' ? <DetailView /> : <ListView />}

      {isModalOpen && (
        <div className="plan-modal-overlay" onClick={closeModal}>
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h3>{editingPlan ? 'Edit Plan' : 'Add New Gold Plan'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="plan-form">
              <div className="plan-form-content">
                <div className="form-section">
                  <h4>Customer Information</h4>
                  <div className="form-row">
                    <div className="form-group required">
                      <label>First Name</label>
                      <input type="text" name="customerFirstName" value={formData.customerFirstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group required">
                      <label>Last Name</label>
                      <input type="text" name="customerLastName" value={formData.customerLastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group required">
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group required">
                      <label>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Plan Configuration</h4>
                  <div className="form-row">
                    <div className="form-group required">
                      <label>Plan Type</label>
                      <select name="planType" value={formData.planType} onChange={handleInputChange} required>
                        <option value="JSAP">Jewel SAP (JSAP) - Monthly</option>
                        <option value="PIP">PIP (Partner in Progress) - One-time</option>
                      </select>
                    </div>
                    <div className="form-group required">
                      <label>Duration (Months)</label>
                      <select name="duration" value={formData.duration} onChange={handleInputChange} required>
                        {formData.planType === 'PIP' && <option value={6}>6 Months (25% off VA)</option>}
                        <option value={12}>12 Months {formData.planType === 'PIP' ? '(50% off VA)' : '(50% bonus)'}</option>
                      </select>
                    </div>
                  </div>

                  {formData.planType === 'JSAP' ? (
                    <div className="form-row">
                      <div className="form-group required">
                        <label>Monthly Contribution (₹)</label>
                        <input 
                          type="number" 
                          name="monthlyContribution" 
                          value={formData.monthlyContribution} 
                          onChange={handleInputChange}
                          min="1000"
                          required 
                        />
                        <small>Minimum ₹1,000/month</small>
                      </div>
                      <div className="form-group">
                        <label>Expected Maturity Benefit</label>
                        <input 
                          type="text" 
                          value={`₹${Math.round(formData.monthlyContribution * 0.5).toLocaleString()}`}
                          disabled
                          className="calculated-field"
                        />
                        <small>50% bonus on one installment</small>
                      </div>
                    </div>
                  ) : (
                    <div className="form-row">
                      <div className="form-group required">
                        <label>Investment Amount (₹)</label>
                        <input 
                          type="number" 
                          name="investmentAmount" 
                          value={formData.investmentAmount} 
                          onChange={handleInputChange}
                          min="100000"
                          required 
                        />
                        <small>Minimum ₹1,00,000</small>
                      </div>
                      <div className="form-group">
                        <label>Discount on VA</label>
                        <input 
                          type="text" 
                          value={`${formData.duration === 12 ? 50 : 25}% OFF`}
                          disabled
                          className="calculated-field"
                        />
                        <small>Making charges discount</small>
                      </div>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group required">
                      <label>Start Date</label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Additional notes about this plan..." />
                </div>
              </div>

              <div className="plan-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="button">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
