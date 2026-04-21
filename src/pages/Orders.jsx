import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Calendar, User, CreditCard, CheckCircle, Clock, XCircle, Eye, Download, Filter, ArrowLeft, Package, MapPin, Building2, Phone, Mail, Printer, Image as ImageIcon, Hash, Tag } from 'lucide-react';
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

const initialOrders = [
  {
    id: 'ORD-1001',
    orderDate: '2024-01-15',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    branch: 'Muliya Gold & Diamonds Puttur',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paymentId: 'PAY-782341',
    totalAmount: 125000,
    amountPaid: 125000,
    items: [
      { id: 'ITEM-001', productName: '22K Gold Ring', category: 'Ring', quantity: 1, weight: '8.5g', purity: '22K', makingCharges: 3500, price: 45000, totalPrice: 48500, description: 'Traditional 22K gold ring with intricate design' },
      { id: 'ITEM-002', productName: '18K Gold Chain', category: 'Chain', quantity: 1, weight: '12g', purity: '18K', makingCharges: 2500, price: 76500, totalPrice: 79000, description: 'Elegant 18K gold chain for daily wear' }
    ],
    shippingAddress: { address: '123 MG Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' },
    billingAddress: { address: '123 MG Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' }
  },
  {
    id: 'ORD-1002',
    orderDate: '2024-01-16',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    branch: 'Muliya Gold & Diamonds Bengaluru',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    paymentId: 'PAY-782342',
    totalAmount: 85000,
    amountPaid: 85000,
    items: [
      { id: 'ITEM-003', productName: '18K Gold Chain', category: 'Chain', quantity: 1, weight: '10g', purity: '18K', makingCharges: 2000, price: 83000, totalPrice: 85000, description: 'Premium quality 18K gold chain' }
    ],
    shippingAddress: { address: '456 Koramangala', city: 'Bengaluru', state: 'Karnataka', zipCode: '560034', country: 'India' },
    billingAddress: { address: '456 Koramangala', city: 'Bengaluru', state: 'Karnataka', zipCode: '560034', country: 'India' }
  },
  {
    id: 'ORD-1003',
    orderDate: '2024-01-17',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 9876543212',
    branch: 'Muliya Gold & Diamonds Madikeri',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    paymentId: 'PAY-PENDING',
    totalAmount: 210000,
    amountPaid: 0,
    items: [
      { id: 'ITEM-004', productName: 'Diamond Earrings', category: 'Earrings', quantity: 1, weight: '5g', purity: '18K', diamondWeight: '0.5ct', makingCharges: 8000, price: 202000, totalPrice: 210000, description: 'Brilliant cut diamond stud earrings' }
    ],
    shippingAddress: { address: '789 Coorg Hills', city: 'Madikeri', state: 'Karnataka', zipCode: '571201', country: 'India' },
    billingAddress: { address: '789 Coorg Hills', city: 'Madikeri', state: 'Karnataka', zipCode: '571201', country: 'India' }
  },
  {
    id: 'ORD-1004',
    orderDate: '2024-01-18',
    firstName: 'Sunita',
    lastName: 'Devi',
    email: 'sunita.devi@email.com',
    phone: '+91 9876543213',
    branch: 'Shyama Jewels Sourcing LLP',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    paymentId: 'PAY-782344',
    totalAmount: 45000,
    amountPaid: 45000,
    items: [
      { id: 'ITEM-005', productName: '22K Gold Bangle', category: 'Bangle', quantity: 1, weight: '6g', purity: '22K', makingCharges: 1500, price: 43500, totalPrice: 45000, description: 'Traditional South Indian style bangle' }
    ],
    shippingAddress: { address: '321 Temple Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' },
    billingAddress: { address: '321 Temple Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' }
  },
  {
    id: 'ORD-1005',
    orderDate: '2024-01-19',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 9876543214',
    branch: 'Muliya Gold & Diamonds Belthangady',
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paymentId: 'PAY-782345',
    totalAmount: 178000,
    amountPaid: 178000,
    items: [
      { id: 'ITEM-006', productName: 'Platinum Ring', category: 'Ring', quantity: 1, weight: '6g', purity: 'Pt950', makingCharges: 5000, price: 173000, totalPrice: 178000, description: 'Premium platinum ring with diamond accent' }
    ],
    shippingAddress: { address: '55 Main Street', city: 'Belthangady', state: 'Karnataka', zipCode: '574214', country: 'India' },
    billingAddress: { address: '55 Main Street', city: 'Belthangady', state: 'Karnataka', zipCode: '574214', country: 'India' }
  },
  {
    id: 'ORD-1006',
    orderDate: '2024-01-20',
    firstName: 'Neha',
    lastName: 'Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91 9876543215',
    branch: 'Muliya Gold & Diamonds Bengaluru',
    status: 'Cancelled',
    paymentStatus: 'Failed',
    paymentMethod: 'Credit Card',
    paymentId: 'PAY-FAILED',
    totalAmount: 95000,
    amountPaid: 0,
    items: [
      { id: 'ITEM-007', productName: 'Gold Necklace', category: 'Necklace', quantity: 1, weight: '15g', purity: '22K', makingCharges: 4500, price: 90500, totalPrice: 95000, description: 'Traditional gold necklace with antique finish' }
    ],
    shippingAddress: { address: '88 JP Nagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560078', country: 'India' },
    billingAddress: { address: '88 JP Nagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560078', country: 'India' }
  },
  {
    id: 'ORD-1007',
    orderDate: '2024-01-21',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543216',
    branch: 'Muliya Gold & Diamonds Puttur',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paymentId: 'PAY-782347',
    totalAmount: 145000,
    amountPaid: 145000,
    items: [
      { id: 'ITEM-008', productName: 'Gold Bracelet', category: 'Bracelet', quantity: 1, weight: '11g', purity: '22K', makingCharges: 3200, price: 141800, totalPrice: 145000, description: 'Elegant 22K gold bracelet for women' }
    ],
    shippingAddress: { address: '77 College Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' },
    billingAddress: { address: '77 College Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' }
  },
  {
    id: 'ORD-1008',
    orderDate: '2024-01-22',
    firstName: 'Anita',
    lastName: 'Sharma',
    email: 'anita.sharma@email.com',
    phone: '+91 9876543217',
    branch: 'Shyama Jewels Puttur LLP (NDY)',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    paymentId: 'PAY-782348',
    totalAmount: 65000,
    amountPaid: 65000,
    items: [
      { id: 'ITEM-009', productName: 'Silver Anklet', category: 'Anklet', quantity: 2, weight: '25g', purity: '925', makingCharges: 1000, price: 64000, totalPrice: 65000, description: 'Traditional silver anklet pair' }
    ],
    shippingAddress: { address: '44 Gandhi Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' },
    billingAddress: { address: '44 Gandhi Road', city: 'Puttur', state: 'Karnataka', zipCode: '574201', country: 'India' }
  },
  {
    id: 'ORD-1009',
    orderDate: '2024-01-23',
    firstName: 'Mohit',
    lastName: 'Verma',
    email: 'mohit.verma@email.com',
    phone: '+91 9876543218',
    branch: 'Muliya Gold & Diamonds Bengaluru',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    paymentId: 'PAY-782349',
    totalAmount: 320000,
    amountPaid: 320000,
    items: [
      { id: 'ITEM-010', productName: 'Diamond Ring', category: 'Ring', quantity: 1, weight: '4g', purity: '18K', diamondWeight: '1ct', makingCharges: 15000, price: 305000, totalPrice: 320000, description: 'Solitaire diamond engagement ring' }
    ],
    shippingAddress: { address: '99 Whitefield', city: 'Bengaluru', state: 'Karnataka', zipCode: '560066', country: 'India' },
    billingAddress: { address: '99 Whitefield', city: 'Bengaluru', state: 'Karnataka', zipCode: '560066', country: 'India' }
  },
  {
    id: 'ORD-1010',
    orderDate: '2024-01-24',
    firstName: 'Kavita',
    lastName: 'Rao',
    email: 'kavita.rao@email.com',
    phone: '+91 9876543219',
    branch: 'Muliya Gold & Diamonds Madikeri',
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    paymentId: 'N/A',
    totalAmount: 78000,
    amountPaid: 0,
    items: [
      { id: 'ITEM-011', productName: 'Gold Pendant', category: 'Pendant', quantity: 1, weight: '6g', purity: '22K', makingCharges: 1800, price: 76200, totalPrice: 78000, description: '22K gold pendant with temple design' }
    ],
    shippingAddress: { address: '12 Fort Road', city: 'Madikeri', state: 'Karnataka', zipCode: '571201', country: 'India' },
    billingAddress: { address: '12 Fort Road', city: 'Madikeri', state: 'Karnataka', zipCode: '571201', country: 'India' }
  },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setOrders(stored);
    } else {
      setOrders(initialOrders);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
    const matchesBranch = branchFilter === 'All' || order.branch === branchFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesBranch;
  });

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

  const getCustomerName = (order) => `${order.firstName} ${order.lastName}`;

  const getFirstProduct = (order) => order.items?.[0]?.productName || '-';
  const getItemCount = (order) => order.items?.length || 0;

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
          <span className="stat-value">{orders.filter(o => o.status === 'Pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{orders.filter(o => o.status === 'Delivered').length}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatCurrency(orders.reduce((sum, o) => sum + o.amountPaid, 0))}</span>
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
            {paginatedOrders.map((order, index) => (
              <tr key={order.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <td>
                  <div className="order-id-cell">
                    <ShoppingBag size={16} />
                    <span className="order-id">{order.id}</span>
                  </div>
                </td>
                <td>
                  <div className="order-date">
                    <Calendar size={14} />
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </td>
                <td>
                  <div className="order-customer">
                    <div className="customer-avatar-small">
                      <User size={14} />
                    </div>
                    <span>{getCustomerName(order)}</span>
                  </div>
                </td>
                <td>
                  <span className="order-product">{getFirstProduct(order)}</span>
                  <span className="order-items">{getItemCount(order)} item(s)</span>
                </td>
                <td>
                  <span className="order-amount">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td>
                  <span className={`amount-paid ${order.amountPaid === 0 ? 'pending' : 'paid'}`}>
                    {formatCurrency(order.amountPaid)}
                  </span>
                </td>
                <td>
                  <span className={`payment-status-badge ${order.paymentStatus.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className="payment-id">{order.paymentId}</span>
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
            ))}
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
                <h3>{selectedOrder.id}</h3>
                <span className="order-date">{formatDate(selectedOrder.orderDate)}</span>
              </div>
            </div>
            <div className="order-info-status">
              <span className="status-badge-large" style={{ backgroundColor: `${getStatusColor(selectedOrder.status)}20`, color: getStatusColor(selectedOrder.status) }}>
                {selectedOrder.status}
              </span>
              <span className="payment-badge-large" style={{ backgroundColor: selectedOrder.paymentStatus === 'Paid' ? '#4caf5020' : '#ff980020', color: selectedOrder.paymentStatus === 'Paid' ? '#4caf50' : '#ff9800' }}>
                {selectedOrder.paymentStatus === 'Paid' && <CheckCircle size={14} />}
                {selectedOrder.paymentStatus}
              </span>
            </div>
          </div>

          <div className="detail-grid">
            {/* Customer Details */}
            <div className="detail-section">
              <h4><User size={18} /> Customer Details</h4>
              <div className="customer-info">
                <div className="info-row"><span className="info-label">First Name</span><span className="info-value">{selectedOrder.firstName}</span></div>
                <div className="info-row"><span className="info-label">Last Name</span><span className="info-value">{selectedOrder.lastName}</span></div>
                <div className="info-row"><span className="info-label">Email</span><span className="info-value">{selectedOrder.email}</span></div>
                <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{selectedOrder.phone}</span></div>
              </div>
            </div>

            {/* Purchase Branch */}
            <div className="detail-section">
              <h4><Building2 size={18} /> Purchase Branch</h4>
              <div className="branch-info">
                <div className="info-row"><span className="info-label">Branch Name</span><span className="info-value highlight">{selectedOrder.branch}</span></div>
                <div className="info-row"><span className="info-label">Order Date</span><span className="info-value">{formatDate(selectedOrder.orderDate)}</span></div>
                <div className="info-row"><span className="info-label">Payment Method</span><span className="info-value">{selectedOrder.paymentMethod}</span></div>
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
