import React, { useEffect, useState, useMemo } from 'react';
import { Search, ShoppingBag, Calendar, User, CreditCard, CheckCircle, Clock, XCircle, Eye, Download, Filter, ArrowLeft, Package, MapPin, Building2, Phone, Mail, Printer, Image as ImageIcon, Hash, Tag } from 'lucide-react';
import { api, endpoints } from '../api';
import './Orders.css';

const STORAGE_KEY = 'orders_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const defaultBranches = [
  'Muliya Gold & Diamonds Puttur',
  'Muliya Gold & Diamonds Belthangady',
  'Muliya Gold & Diamonds Bengaluru',
  'Muliya Gold & Diamonds Madikeri',
  'Muliya Gold & Diamonds Gonikoppal',
  'Muliya Gold & Diamonds Madikeri (Somwarpet)',
  'Shyama Jewels Sourcing LLP',
  'Shyama Jewels Puttur LLP (NDY)',
];



export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 10;

  // Helper functions moved up to fix ReferenceError
  const getCustomerName = (order) => {
    if (order.firstName || order.lastName) {
      return `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim();
    }
    return order.customer_name ?? order.user_name ?? order.name ?? 'Guest Customer';
  };

  const getFirstProduct = (order) => {
    if (order.items?.[0]?.productName) return order.items[0].productName;
    return order.product_name ?? order.item_name ?? order.product ?? '-';
  };

  const getItemCount = (order) => {
    if (Array.isArray(order.items)) return order.items.length;
    return order.total_items ?? order.quantity ?? 1;
  };

  const getOrderId = (order) => {
    const rawId = order.id ?? order.order_id ?? order.id_order ?? order._id;
    if (typeof rawId === 'object' && rawId !== null) {
      return rawId._id ?? rawId.id ?? JSON.stringify(rawId);
    }
    return String(rawId ?? 'ORD-000');
  };

  const getOrderDate = (order) => order.orderDate ?? order.order_date ?? order.created_at;
  const getTotalAmount = (order) => Number(order.totalAmount ?? order.total_amount ?? order.total ?? 0);
  const getAmountPaid = (order) => Number(order.amountPaid ?? order.amount_paid ?? order.paid_amount ?? 0);
  const getPaymentStatus = (order) => order.paymentStatus ?? order.payment_status ?? 'Pending';
  const getOrderStatus = (order) => order.status ?? order.order_status ?? 'Pending';
  
  const getPaymentId = (order) => {
    const rawPid = order.paymentId ?? order.payment_id ?? order.transaction_id ?? '-';
    if (typeof rawPid === 'object' && rawPid !== null) {
      return rawPid.id ?? rawPid.transaction_id ?? JSON.stringify(rawPid);
    }
    return String(rawPid);
  };

  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return value.name ?? value.title ?? value.label ?? value._id ?? JSON.stringify(value);
    }
    return String(value);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get(endpoints.orders)
      .then((res) => {
        console.log(res,"res");
        
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.orders ?? res;
        const orderList = Array.isArray(normalized) ? normalized : (normalized?.orders || []);
        if (isMounted) {
          setOrders(orderList);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrders([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

 

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const fullName = getCustomerName(order).toLowerCase();
      const orderId = String(getOrderId(order)).toLowerCase();
      const paymentId = String(getPaymentId(order)).toLowerCase();
      
      const matchesSearch = 
        orderId.includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase()) ||
        (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.phone && String(order.phone).includes(searchTerm)) ||
        paymentId.includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || getOrderStatus(order) === statusFilter;
      const matchesPayment = paymentFilter === 'All' || getPaymentStatus(order) === paymentFilter;
      const matchesBranch = branchFilter === 'All' || order.branch === branchFilter;
      
      return matchesSearch && matchesStatus && matchesPayment && matchesBranch;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, branchFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      default: return <ShoppingBag size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4caf50';
      case 'Shipped': return '#9c27b0';
      case 'Processing': return '#2196f3';
      case 'Pending': return '#ff9800';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const handleDownloadInvoice = (order) => {
    alert(`Downloading invoice for Order ${order.id}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Order List View
  const OrderListView = () => (
    <>
      <div className="orders-header">
        <h2 className="orders-title">Orders</h2>
        <div className="orders-filters">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Building2 size={16} />
            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="All">All Branches</option>
              {defaultBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              {ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <CreditCard size={16} />
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="All">All Payment</option>
              {PAYMENT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <span className="stat-value">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{orders.filter(o => getOrderStatus(o) === 'Pending' || getOrderStatus(o) === 'Pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{orders.filter(o => getOrderStatus(o) === 'Delivered').length}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatCurrency(orders.reduce((sum, o) => sum + getAmountPaid(o), 0))}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="glass-panel orders-panel">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Payment ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="loading-spinner">Loading orders...</div>
                </td>
              </tr>
                ) : paginatedOrders.map((order, index) => {
                  const orderId = getOrderId(order);
                  const displayProduct = getFirstProduct(order);
                  const productName = (displayProduct && typeof displayProduct === 'object') 
                    ? (displayProduct.name ?? displayProduct.product_name ?? 'Product') 
                    : displayProduct;

                  return (
                    <tr key={`${orderId}-${index}`} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                      <td>
                        <div className="order-id-cell">
                          <ShoppingBag size={16} />
                          <span className="order-id">{safeRender(orderId)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="order-date">
                          <Calendar size={14} />
                          <span>{formatDate(getOrderDate(order))}</span>
                        </div>
                      </td>
                      <td>
                        <div className="order-customer">
                          <div className="customer-avatar-small">
                            <User size={14} />
                          </div>
                          <span>{safeRender(getCustomerName(order))}</span>
                        </div>
                      </td>
                      <td>
                        <span className="order-product">{safeRender(productName)}</span>
                        <span className="order-items">{getItemCount(order)} item(s)</span>
                      </td>
                      <td>
                        <span className="order-amount">{formatCurrency(getTotalAmount(order))}</span>
                      </td>
                      <td>
                        <span className={`amount-paid ${getAmountPaid(order) === 0 ? 'pending' : 'paid'}`}>
                          {formatCurrency(getAmountPaid(order))}
                        </span>
                      </td>
                      <td>
                        <span className={`payment-status-badge ${safeRender(getPaymentStatus(order)).toLowerCase()}`}>
                          {safeRender(getPaymentStatus(order))}
                        </span>
                      </td>
                      <td>
                        <span className={`order-status-badge ${safeRender(getOrderStatus(order)).toLowerCase()}`}>
                          {getStatusIcon(getOrderStatus(order))}
                          {safeRender(getOrderStatus(order))}
                        </span>
                      </td>
                      <td>
                        <span className="payment-id">{safeRender(getPaymentId(order))}</span>
                      </td>
                      <td>
                        <div className="order-actions">
                          <button className="action-btn view" onClick={() => setSelectedOrder(order)} title="View Order">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn download" onClick={() => handleDownloadInvoice(order)} title="Download Invoice">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        {paginatedOrders.length === 0 && (
          <div className="orders-empty">
            <ShoppingBag size={48} />
            <h3>No orders found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="orders-pagination">
            <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <span>‹</span>
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={`pagination-number ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              ))}
            </div>
            <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <span>›</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Order Detail View
  const OrderDetailView = () => {
    if (!selectedOrder) return null;
    
    return (
      <div className="order-detail-view animate-fade-in">
        <div className="detail-view-header">
          <button className="back-btn" onClick={() => setSelectedOrder(null)}>
            <ArrowLeft size={18} />
            Back to Orders
          </button>
          <div className="detail-view-actions">
            <button className="action-btn-outline" onClick={handlePrint}>
              <Printer size={16} />
              Print
            </button>
            <button className="action-btn-outline" onClick={() => handleDownloadInvoice(selectedOrder)}>
              <Download size={16} />
              Invoice
            </button>
          </div>
        </div>

        <div className="order-detail-content">
          {/* Order Header */}
          <div className="detail-section order-info-header">
            <div className="order-info-id">
              <Package size={24} />
              <div>
                <h3>{safeRender(getOrderId(selectedOrder))}</h3>
                <span className="order-date">{formatDate(getOrderDate(selectedOrder))}</span>
              </div>
            </div>
            <div className="order-info-status">
              <span className="status-badge-large" style={{ backgroundColor: `${getStatusColor(getOrderStatus(selectedOrder))}20`, color: getStatusColor(getOrderStatus(selectedOrder)) }}>
                {safeRender(getOrderStatus(selectedOrder))}
              </span>
              <span className="payment-badge-large" style={{ backgroundColor: getPaymentStatus(selectedOrder) === 'Paid' ? '#4caf5020' : '#ff980020', color: getPaymentStatus(selectedOrder) === 'Paid' ? '#4caf50' : '#ff9800' }}>
                {getPaymentStatus(selectedOrder) === 'Paid' && <CheckCircle size={14} />}
                {safeRender(getPaymentStatus(selectedOrder))}
              </span>
            </div>
          </div>

          <div className="detail-grid">
            {/* Customer Details */}
            <div className="detail-section">
              <h4><User size={18} /> Customer Details</h4>
              <div className="customer-info">
                <div className="info-row"><span className="info-label">Customer Name</span><span className="info-value">{safeRender(getCustomerName(selectedOrder))}</span></div>
                <div className="info-row"><span className="info-label">Email</span><span className="info-value">{safeRender(selectedOrder.email ?? '-')}</span></div>
                <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{safeRender(selectedOrder.phone ?? '-')}</span></div>
              </div>
            </div>

            {/* Purchase Branch */}
            <div className="detail-section">
              <h4><Building2 size={18} /> Purchase Branch</h4>
              <div className="branch-info">
                <div className="info-row"><span className="info-label">Branch Name</span><span className="info-value highlight">{safeRender(selectedOrder.branch ?? '-')}</span></div>
                <div className="info-row"><span className="info-label">Order Date</span><span className="info-value">{formatDate(getOrderDate(selectedOrder))}</span></div>
                <div className="info-row"><span className="info-label">Payment Method</span><span className="info-value">{safeRender(selectedOrder.paymentMethod ?? '-')}</span></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="detail-section">
              <h4><MapPin size={18} /> Shipping Address</h4>
              <div className="address-info">
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="detail-section">
              <h4><CreditCard size={18} /> Billing Address</h4>
              <div className="address-info">
                <p>{selectedOrder.billingAddress.address}</p>
                <p>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state}</p>
                <p>{selectedOrder.billingAddress.zipCode}</p>
                <p>{selectedOrder.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="detail-section items-section">
            <h4><Package size={18} /> Ordered Items ({selectedOrder.items?.length || 0})</h4>
            <div className="items-list">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-image">
                    <div className="item-image-placeholder">
                      <ImageIcon size={32} />
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                      <h5>{item.productName}</h5>
                      <span className="item-category">{item.category}</span>
                    </div>
                    <p className="item-description">{item.description}</p>
                    <div className="item-specs">
                      <span className="spec"><strong>Weight:</strong> {item.weight}</span>
                      <span className="spec"><strong>Purity:</strong> {item.purity}</span>
                      {item.diamondWeight && <span className="spec"><strong>Diamond:</strong> {item.diamondWeight}</span>}
                      <span className="spec"><strong>Qty:</strong> {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-pricing">
                    <div className="price-breakdown">
                      <div className="price-row"><span>Gold Value:</span><span>{formatCurrency(item.price)}</span></div>
                      <div className="price-row"><span>Making Charges:</span><span>{formatCurrency(item.makingCharges)}</span></div>
                      <div className="price-row total"><span>Total:</span><span>{formatCurrency(item.totalPrice)}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="detail-section payment-section">
            <h4><CreditCard size={18} /> Payment Summary</h4>
            <div className="payment-summary">
              <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(selectedOrder.items?.reduce((sum, item) => sum + item.price, 0) || 0)}</span></div>
              <div className="summary-row"><span>Making Charges</span><span>{formatCurrency(selectedOrder.items?.reduce((sum, item) => sum + item.makingCharges, 0) || 0)}</span></div>
              <div className="summary-divider"></div>
              <div className="summary-row total"><span>Total Amount</span><span>{formatCurrency(selectedOrder.totalAmount)}</span></div>
              <div className="summary-row paid"><span>Amount Paid</span><span>{formatCurrency(selectedOrder.amountPaid)}</span></div>
              {selectedOrder.totalAmount - selectedOrder.amountPaid > 0 && (
                <div className="summary-row pending"><span>Amount Pending</span><span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.amountPaid)}</span></div>
              )}
              <div className="payment-method">
                <span className="method-label">Payment Method:</span>
                <span className="method-value">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="payment-id">
                <span className="id-label">Payment ID:</span>
                <span className="id-value">{selectedOrder.paymentId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="orders-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      {selectedOrder ? <OrderDetailView /> : <OrderListView />}
    </div>
  );
}
