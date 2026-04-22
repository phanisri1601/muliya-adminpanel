import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Eye, Filter, Calendar, User, Package, CheckCircle, Clock, XCircle, IndianRupee } from 'lucide-react';
import './Invoices.css';

const initialInvoices = [
  { id: 'INV-001', customerName: 'Priya Sharma', orderId: 'ORD-001', date: '2024-04-22', amount: 125000, status: 'Paid', items: 5 },
  { id: 'INV-002', customerName: 'Rahul Verma', orderId: 'ORD-002', date: '2024-04-21', amount: 85000, status: 'Paid', items: 3 },
  { id: 'INV-003', customerName: 'Anjali Patel', orderId: 'ORD-003', date: '2024-04-21', amount: 175000, status: 'Pending', items: 7 },
  { id: 'INV-004', customerName: 'Vikram Singh', orderId: 'ORD-004', date: '2024-04-20', amount: 250000, status: 'Paid', items: 4 },
  { id: 'INV-005', customerName: 'Meera Reddy', orderId: 'ORD-005', date: '2024-04-20', amount: 95000, status: 'Overdue', items: 2 },
  { id: 'INV-006', customerName: 'Arjun Kapoor', orderId: 'ORD-006', date: '2024-04-19', amount: 180000, status: 'Paid', items: 6 },
  { id: 'INV-007', customerName: 'Kavita Nair', orderId: 'ORD-007', date: '2024-04-19', amount: 65000, status: 'Pending', items: 3 },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    orderId: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'Pending',
    items: 1
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleOpenModal = () => {
    setFormData({
      customerName: '',
      orderId: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: 'Pending',
      items: 1
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInvoices([{ ...formData, id: `INV-${String(invoices.length + 1).padStart(3, '0')}` }, ...invoices]);
    handleCloseModal();
  };

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    alert(`Downloading invoice ${invoice.id}...`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { icon: CheckCircle, color: 'paid' },
      'Pending': { icon: Clock, color: 'pending' },
      'Overdue': { icon: XCircle, color: 'overdue' }
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

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="invoices-container animate-fade-in">
      <div className="invoices-header">
        <div>
          <h2>Invoices</h2>
          <p>Manage and track all invoices</p>
        </div>
        <button className="button" onClick={handleOpenModal}>
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon revenue">
            <IndianRupee size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total Revenue</div>
            <div className="stat-card-value">₹ {totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-card-sub">{invoices.filter(i => i.status === 'Paid').length} paid invoices</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon pending">
            <Clock size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Pending Amount</div>
            <div className="stat-card-value">₹ {pendingAmount.toLocaleString('en-IN')}</div>
            <div className="stat-card-sub">{invoices.filter(i => i.status === 'Pending').length} pending invoices</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon overdue">
            <XCircle size={28} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Overdue Amount</div>
            <div className="stat-card-value">₹ {overdueAmount.toLocaleString('en-IN')}</div>
            <div className="stat-card-sub">{invoices.filter(i => i.status === 'Overdue').length} overdue invoices</div>
          </div>
        </div>
      </div>

      <div className="glass-panel invoices-table-container">
        <div className="table-header">
          <h3>All Invoices</h3>
          <div className="table-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search invoices..." />
            </div>
            <button className="button outline">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <td>
                  <div className="invoice-id">{invoice.id}</div>
                </td>
                <td>
                  <div className="customer-cell">
                    <User size={16} />
                    {invoice.customerName}
                  </div>
                </td>
                <td>{invoice.orderId}</td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} />
                    {invoice.date}
                  </div>
                </td>
                <td>
                  <div className="items-cell">
                    <Package size={16} />
                    {invoice.items}
                  </div>
                </td>
                <td className="amount-cell">
                  ₹ {invoice.amount.toLocaleString('en-IN')}
                </td>
                <td>
                  {getStatusBadge(invoice.status)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small" onClick={() => handleViewInvoice(invoice)} title="View">
                      <Eye size={16} />
                    </button>
                    <button className="icon-button small" onClick={() => handleDownloadInvoice(invoice)} title="Download">
                      <Download size={16} />
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
              <h3>Create New Invoice</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <XCircle size={20} />
              </button>
            </div>

            <form className="invoice-form" onSubmit={handleSubmit}>
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
                  <label>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} placeholder="0" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Items *</label>
                  <input type="number" name="items" value={formData.items} onChange={(e) => setFormData({ ...formData, items: parseInt(e.target.value) || 1 })} placeholder="1" min="1" required />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingInvoice && (
        <div className="modal-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="modal-content glass-panel invoice-view" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details - {viewingInvoice.id}</h3>
              <button className="icon-button" onClick={() => setViewingInvoice(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="invoice-view-content">
              <div className="invoice-view-section">
                <h4>Customer Information</h4>
                <div className="invoice-detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{viewingInvoice.customerName}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{viewingInvoice.orderId}</span>
                </div>
              </div>

              <div className="invoice-view-section">
                <h4>Invoice Details</h4>
                <div className="invoice-detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{viewingInvoice.date}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="label">Items:</span>
                  <span className="value">{viewingInvoice.items}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹ {viewingInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{getStatusBadge(viewingInvoice.status)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="button outline" onClick={() => handleDownloadInvoice(viewingInvoice)}>
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
