import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, Edit, Trash2, X, Save } from 'lucide-react';
import { api, endpoints } from '../api';
import './Customers.css';

const STORAGE_KEY = 'customers_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const initialCustomers = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123 MG Road, Bengaluru, Karnataka - 560001',
    joinDate: '2023-01-15',
    totalOrders: 12,
    totalSpent: 245000,
    loyaltyPoints: 2450,
    isActive: true,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    phone: '+91 98234 56789',
    address: '456 Park Street, Kolkata, West Bengal - 700016',
    joinDate: '2023-02-20',
    totalOrders: 8,
    totalSpent: 189500,
    loyaltyPoints: 1895,
    isActive: true,
  },
  {
    id: '3',
    name: 'Anjali Patel',
    email: 'anjali.patel@email.com',
    phone: '+91 98123 45678',
    address: '789 CG Road, Ahmedabad, Gujarat - 380009',
    joinDate: '2023-03-10',
    totalOrders: 15,
    totalSpent: 312000,
    loyaltyPoints: 3120,
    isActive: true,
  },
  {
    id: '4',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@email.com',
    phone: '+91 98345 67890',
    address: '321 Banjara Hills, Hyderabad, Telangana - 500034',
    joinDate: '2023-04-05',
    totalOrders: 6,
    totalSpent: 156000,
    loyaltyPoints: 1560,
    isActive: true,
  },
  {
    id: '5',
    name: 'Meera Iyer',
    email: 'meera.iyer@email.com',
    phone: '+91 98456 78901',
    address: '654 Cathedral Road, Chennai, Tamil Nadu - 600086',
    joinDate: '2023-05-12',
    totalOrders: 10,
    totalSpent: 278000,
    loyaltyPoints: 2780,
    isActive: true,
  },
  {
    id: '6',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    phone: '+91 98567 89012',
    address: '987 Connaught Place, New Delhi - 110001',
    joinDate: '2023-06-18',
    totalOrders: 9,
    totalSpent: 234000,
    loyaltyPoints: 2340,
    isActive: true,
  },
  {
    id: '7',
    name: 'Kavita Nair',
    email: 'kavita.nair@email.com',
    phone: '+91 98678 90123',
    address: '147 Marine Drive, Mumbai, Maharashtra - 400020',
    joinDate: '2023-07-22',
    totalOrders: 18,
    totalSpent: 425000,
    loyaltyPoints: 4250,
    isActive: true,
  },
  {
    id: '8',
    name: 'Rohit Gupta',
    email: 'rohit.gupta@email.com',
    phone: '+91 98789 01234',
    address: '258 Brigade Road, Bengaluru, Karnataka - 560025',
    joinDate: '2023-08-30',
    totalOrders: 7,
    totalSpent: 167000,
    loyaltyPoints: 1670,
    isActive: true,
  },
  {
    id: '9',
    name: 'Sneha Joshi',
    email: 'sneha.joshi@email.com',
    phone: '+91 98890 12345',
    address: '369 FC Road, Pune, Maharashtra - 411016',
    joinDate: '2023-09-14',
    totalOrders: 11,
    totalSpent: 289000,
    loyaltyPoints: 2890,
    isActive: true,
  },
  {
    id: '10',
    name: 'Arjun Malhotra',
    email: 'arjun.malhotra@email.com',
    phone: '+91 98901 23456',
    address: '741 Sector 17, Chandigarh - 160017',
    joinDate: '2023-10-25',
    totalOrders: 5,
    totalSpent: 145000,
    loyaltyPoints: 1450,
    isActive: false,
  },
  {
    id: '11',
    name: 'Deepika Rao',
    email: 'deepika.rao@email.com',
    phone: '+91 98912 34567',
    address: '852 Residency Road, Jaipur, Rajasthan - 302001',
    joinDate: '2023-11-05',
    totalOrders: 9,
    totalSpent: 267000,
    loyaltyPoints: 2670,
    isActive: true,
  },
  {
    id: '12',
    name: 'Karan Thakur',
    email: 'karan.thakur@email.com',
    phone: '+91 98923 45678',
    address: '963 Mall Road, Shimla, Himachal Pradesh - 171001',
    joinDate: '2023-11-12',
    totalOrders: 6,
    totalSpent: 178000,
    loyaltyPoints: 1780,
    isActive: true,
  },
  {
    id: '13',
    name: 'Neha Deshmukh',
    email: 'neha.deshmukh@email.com',
    phone: '+91 98934 56789',
    address: '174 FC Road, Pune, Maharashtra - 411016',
    joinDate: '2023-11-20',
    totalOrders: 14,
    totalSpent: 389000,
    loyaltyPoints: 3890,
    isActive: true,
  },
  {
    id: '14',
    name: 'Ravi Choudhary',
    email: 'ravi.choudhary@email.com',
    phone: '+91 98945 67890',
    address: '285 Gandhi Nagar, Jaipur, Rajasthan - 302020',
    joinDate: '2023-12-01',
    totalOrders: 8,
    totalSpent: 234000,
    loyaltyPoints: 2340,
    isActive: true,
  },
  {
    id: '15',
    name: 'Pooja Krishnan',
    email: 'pooja.krishnan@email.com',
    phone: '+91 98956 78901',
    address: '396 Marine Drive, Kochi, Kerala - 682001',
    joinDate: '2023-12-10',
    totalOrders: 11,
    totalSpent: 312000,
    loyaltyPoints: 3120,
    isActive: true,
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    isActive: true,
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get(endpoints.customers)
      .then((res) => {
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
        const customerList = Array.isArray(normalized) ? normalized : (normalized?.users || normalized?.userlist || []);
        if (isMounted) {
          setCustomers(customerList);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch customers:', err);
        if (isMounted) {
          setCustomers(initialCustomers);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return value.name ?? value.title ?? value.label ?? value._id ?? JSON.stringify(value);
    }
    return String(value);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const name = safeRender(customer.name || customer.username || '').toLowerCase();
      const email = safeRender(customer.email || '').toLowerCase();
      const phone = safeRender(customer.phone || customer.mobile || '');
      return name.includes(searchTerm.toLowerCase()) || 
             email.includes(searchTerm.toLowerCase()) || 
             phone.includes(searchTerm);
    });
  }, [customers, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCustomer) {
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData, updatedAt: Date.now() }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      joinDate: customer.joinDate,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      loyaltyPoints: customer.loyaltyPoints,
      isActive: customer.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    }
  };

  const toggleActive = (id) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id ? { ...customer, isActive: !customer.isActive } : customer
      )
    );
  };

  const openModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="customers-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="customers-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button className="button" onClick={openModal}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="glass-panel customers-empty">
          <User size={48} />
          <h3>No customers yet</h3>
          <p>Add your first customer to get started</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-panel customers-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="customers-stats">
          <div className="stat-card">
            <h4>Total Customers</h4>
            <p>{customers.length}</p>
          </div>
          <div className="stat-card">
            <h4>Active Customers</h4>
            <p>{customers.filter(c => c.isActive).length}</p>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p>{formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}</p>
          </div>
        </div>
      )}

      {filteredCustomers.length > 0 && (
        <div className="glass-panel table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Join Date</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner">Loading customers...</div>
                  </td>
                </tr>
              ) : filteredCustomers.map((customer, index) => {
                const id = customer._id || customer.id;
                const name = customer.name || customer.username || 'Anonymous';
                const email = customer.email || '-';
                const phone = customer.phone || customer.mobile || '-';
                const address = customer.address || customer.city || '-';
                const date = customer.joinDate || customer.createdAt || customer.created_at;
                const orders = customer.totalOrders || customer.order_count || 0;
                const spent = customer.totalSpent || customer.total_purchase || 0;
                const points = customer.loyaltyPoints || customer.points || 0;
                const status = customer.isActive ?? (customer.status === 'Active' || customer.status === 1);

                return (
                  <tr key={`${id}-${index}`} className={`animate-fade-in ${!status ? 'inactive' : ''}`} style={{ animationDelay: `${0.3 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="customer-name">{safeRender(name)}</div>
                          <div className="customer-id">ID: {safeRender(id)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-contact">
                        <div className="contact-item">
                          <Mail size={14} />
                          <span>{safeRender(email)}</span>
                        </div>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{safeRender(phone)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-address">{safeRender(address)}</div>
                    </td>
                    <td>
                      <div className="customer-date">
                        <Calendar size={14} />
                        <span>{formatDate(date)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="order-count">{orders}</span>
                    </td>
                    <td>
                      <span className="total-spent">{formatCurrency(spent)}</span>
                    </td>
                    <td>
                      <span className="loyalty-points">{points}</span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${status ? 'active' : 'inactive'}`}
                        onClick={() => toggleActive(id)}
                        title={status ? 'Active' : 'Inactive'}
                      >
                        {status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-button small" onClick={() => handleEdit(customer)} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="icon-button small danger" onClick={() => handleDelete(id)} title="Delete">
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
      )}

      {isModalOpen && (
        <div className="customer-modal-overlay" onClick={closeModal}>
          <div className="customer-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="customer-form">
              <div className="customer-form-content">
                <div className="form-row">
                  <div className="form-group required">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="form-group required">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Orders</label>
                    <input
                      type="number"
                      name="totalOrders"
                      value={formData.totalOrders}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Spent (₹)</label>
                    <input
                      type="number"
                      name="totalSpent"
                      value={formData.totalSpent}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Loyalty Points</label>
                    <input
                      type="number"
                      name="loyaltyPoints"
                      value={formData.loyaltyPoints}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Is Active</label>
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
              </div>

              <div className="customer-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={16} />
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
