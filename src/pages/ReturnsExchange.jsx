import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Filter, RefreshCw, Package, User, Calendar, CheckCircle, XCircle, Clock, ArrowRightLeft, X } from 'lucide-react';
import './ReturnsExchange.css';

const initialReturns = [
  { id: 'RET-001', customerName: 'Priya Sharma', orderId: 'ORD-001', productId: 'ITM-001', productName: 'Princess Cut Diamond Ring', date: '2024-04-22', type: 'Return', reason: 'Size mismatch', status: 'Pending', amount: 125000 },
  { id: 'RET-002', customerName: 'Rahul Verma', orderId: 'ORD-002', productId: 'ITM-005', productName: 'Emerald Vintage Ring', date: '2024-04-21', type: 'Exchange', reason: 'Design preference', status: 'Approved', amount: 175000 },
  { id: 'RET-003', customerName: 'Anjali Patel', orderId: 'ORD-003', productId: 'ITM-003', productName: 'Sapphire Drop Earrings', date: '2024-04-21', type: 'Return', reason: 'Quality issue', status: 'Rejected', amount: 95000 },
  { id: 'RET-004', customerName: 'Vikram Singh', orderId: 'ORD-004', productId: 'ITM-002', productName: 'Classic Gold Chain 18k', date: '2024-04-20', type: 'Exchange', reason: 'Damaged', status: 'Pending', amount: 85000 },
  { id: 'RET-005', customerName: 'Meera Reddy', orderId: 'ORD-005', productId: 'ITM-004', productName: 'Diamond Tennis Bracelet', date: '2024-04-19', type: 'Return', reason: 'Not as described', status: 'Approved', amount: 250000 },
  { id: 'RET-006', customerName: 'Arjun Kapoor', orderId: 'ORD-006', productId: 'ITM-006', productName: 'Gold Bangles Set', date: '2024-04-19', type: 'Exchange', reason: 'Gift exchange', status: 'Pending', amount: 180000 },
];

export default function ReturnsExchange() {
  const [returns, setReturns] = useState(() => {
    const saved = localStorage.getItem('returns');
    return saved ? JSON.parse(saved) : initialReturns;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReturn, setViewingReturn] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    orderId: '',
    productId: '',
    productName: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Return',
    reason: '',
    status: 'Pending',
    amount: 0
  });

  useEffect(() => {
    localStorage.setItem('returns', JSON.stringify(returns));
  }, [returns]);

  const handleOpenModal = () => {
    setFormData({
      customerName: '',
      orderId: '',
      productId: '',
      productName: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Return',
      reason: '',
      status: 'Pending',
      amount: 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReturns([{ ...formData, id: `RET-${String(returns.length + 1).padStart(3, '0')}` }, ...returns]);
    handleCloseModal();
  };

  const handleViewReturn = (returnItem) => {
    setViewingReturn(returnItem);
  };

  const handleStatusChange = (id, newStatus) => {
    setReturns(returns.map(ret => ret.id === id ? { ...ret, status: newStatus } : ret));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { icon: Clock, color: 'pending' },
      'Approved': { icon: CheckCircle, color: 'approved' },
      'Rejected': { icon: XCircle, color: 'rejected' },
      'Completed': { icon: CheckCircle, color: 'completed' }
    };
    const config = statusConfig[status] || { icon: Clock, color: 'pending' };
    const Icon = config.icon;
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`type-badge ${type.toLowerCase()}`}>
        <ArrowRightLeft size={14} />
        {type}
      </span>
    );
  };

  const pendingReturns = returns.filter(r => r.status === 'Pending').length;
  const approvedReturns = returns.filter(r => r.status === 'Approved').length;
  const totalAmount = returns.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="returns-container animate-fade-in">
      <div className="returns-header">
        <div>
          <h2>Returns & Exchange</h2>
          <p>Manage product returns and exchange requests</p>
        </div>
        <button className="button" onClick={handleOpenModal}>
          <Plus size={18} />
          New Request
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon pending">
            <Clock size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Pending Requests</div>
            <div className="stat-card-value">{pendingReturns}</div>
            <div className="stat-card-sub">Awaiting action</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon approved">
            <CheckCircle size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Approved</div>
            <div className="stat-card-value">{approvedReturns}</div>
            <div className="stat-card-sub">Ready for processing</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon total">
            <RefreshCw size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total Value</div>
            <div className="stat-card-value">₹ {totalAmount.toLocaleString('en-IN')}</div>
            <div className="stat-card-sub">{returns.length} total requests</div>
          </div>
        </div>
      </div>

      <div className="glass-panel returns-table-container">
        <div className="table-header">
          <h3>All Requests</h3>
          <div className="table-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search requests..." />
            </div>
            <button className="button outline">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <table className="returns-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((returnItem, index) => (
              <tr key={returnItem.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <td>
                  <div className="request-id">{returnItem.id}</div>
                </td>
                <td>
                  <div className="customer-cell">
                    <User size={16} />
                    {returnItem.customerName}
                  </div>
                </td>
                <td>
                  <div className="product-cell">
                    <Package size={16} />
                    <div>
                      <div className="product-name">{returnItem.productName}</div>
                      <div className="order-id">{returnItem.orderId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {getTypeBadge(returnItem.type)}
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} />
                    {returnItem.date}
                  </div>
                </td>
                <td className="reason-cell">{returnItem.reason}</td>
                <td className="amount-cell">
                  ₹ {returnItem.amount.toLocaleString('en-IN')}
                </td>
                <td>
                  {getStatusBadge(returnItem.status)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small" onClick={() => handleViewReturn(returnItem)} title="View">
                      <Eye size={16} />
                    </button>
                    {returnItem.status === 'Pending' && (
                      <>
                        <button className="icon-button small success" onClick={() => handleStatusChange(returnItem.id, 'Approved')} title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button className="icon-button small danger" onClick={() => handleStatusChange(returnItem.id, 'Rejected')} title="Reject">
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
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
              <h3>New Return/Exchange Request</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form className="return-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} placeholder="Enter customer name" required />
                </div>

                <div className="form-group">
                  <label>Order ID *</label>
                  <input type="text" name="orderId" value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} placeholder="e.g. ORD-001" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product ID *</label>
                  <input type="text" name="productId" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} placeholder="e.g. ITM-001" required />
                </div>

                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} placeholder="Enter product name" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                    <option value="Return">Return</option>
                    <option value="Exchange">Exchange</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Reason *</label>
                <select name="reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required>
                  <option value="">Select reason</option>
                  <option value="Size mismatch">Size mismatch</option>
                  <option value="Quality issue">Quality issue</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Not as described">Not as described</option>
                  <option value="Design preference">Design preference</option>
                  <option value="Gift exchange">Gift exchange</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount (₹) *</label>
                <input type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} placeholder="0" required />
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">Create Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingReturn && (
        <div className="modal-overlay" onClick={() => setViewingReturn(null)}>
          <div className="modal-content glass-panel return-view" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Details - {viewingReturn.id}</h3>
              <button className="icon-button" onClick={() => setViewingReturn(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="return-view-content">
              <div className="return-view-section">
                <h4>Customer Information</h4>
                <div className="return-detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{viewingReturn.customerName}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{viewingReturn.orderId}</span>
                </div>
              </div>

              <div className="return-view-section">
                <h4>Product Information</h4>
                <div className="return-detail-row">
                  <span className="label">Product ID:</span>
                  <span className="value">{viewingReturn.productId}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Product Name:</span>
                  <span className="value">{viewingReturn.productName}</span>
                </div>
              </div>

              <div className="return-view-section">
                <h4>Request Details</h4>
                <div className="return-detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{getTypeBadge(viewingReturn.type)}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{viewingReturn.date}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Reason:</span>
                  <span className="value">{viewingReturn.reason}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹ {viewingReturn.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="return-detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{getStatusBadge(viewingReturn.status)}</span>
                </div>
              </div>

              {viewingReturn.status === 'Pending' && (
                <div className="return-actions">
                  <button className="button success" onClick={() => { handleStatusChange(viewingReturn.id, 'Approved'); setViewingReturn(null); }}>
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button className="button danger" onClick={() => { handleStatusChange(viewingReturn.id, 'Rejected'); setViewingReturn(null); }}>
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
