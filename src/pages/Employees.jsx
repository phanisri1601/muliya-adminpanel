import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, Users, Edit, Trash2, Upload, X, Save, User, Briefcase, Car, Building2, FileText, CheckCircle } from 'lucide-react';
import './Employees.css';

const STORAGE_KEY = 'employees_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'employee', label: 'Employee', icon: Briefcase },
  { id: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 'bank', label: 'Bank', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
];

const ROLES = ['Staff', 'Manager', 'Admin', 'Sales', 'Accountant'];
const SHIFTS = ['Morning', 'Afternoon', 'Night', 'General'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Terminated'];
const LANGUAGES = ['India', 'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'];
const VERIFICATIONS = ['Verified', 'Pending', 'Not Verified'];

const DOCUMENT_TYPES = [
  { id: 'aadhaar', label: 'Aadhaar Card' },
  { id: 'pan', label: 'PAN Card' },
  { id: 'driving', label: 'Driving License' },
  { id: 'rc', label: 'Vehicle RC' },
  { id: 'insurance', label: 'Insurance' },
];

const initialFormData = {
  // Basic Info
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  password: '',
  userType: 'Staff',
  language: 'India',
  verified: 'Verified',
  photo: '',
  // Location
  address: '',
  city: '',
  state: '',
  zipCode: '',
  // Employee
  employeeId: '',
  role: 'Staff',
  salary: '',
  shift: 'Morning',
  status: 'Active',
  // Vehicle
  vehicleType: '',
  vehicleNumber: '',
  vehicleModel: '',
  // Bank
  bankName: '',
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  // Documents
  documents: {
    aadhaar: '',
    pan: '',
    driving: '',
    rc: '',
    insurance: '',
  },
};

const initialEmployees = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@company.com',
    mobileNumber: '+91 98765 43210',
    userType: 'Manager',
    language: 'English',
    verified: 'Verified',
    photo: '',
    address: '123 Main Street',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560001',
    employeeId: 'EMP0001',
    role: 'Manager',
    salary: '45000',
    shift: 'Morning',
    status: 'Active',
    vehicleType: 'Car',
    vehicleNumber: 'KA01AB1234',
    vehicleModel: 'Honda City',
    bankName: 'State Bank of India',
    accountHolderName: 'Rajesh Kumar',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 365,
    updatedAt: Date.now() - 86400000 * 30,
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@company.com',
    mobileNumber: '+91 98234 56789',
    userType: 'Sales',
    language: 'English',
    verified: 'Verified',
    photo: '',
    address: '456 Park Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    employeeId: 'EMP0002',
    role: 'Sales',
    salary: '35000',
    shift: 'General',
    status: 'Active',
    vehicleType: 'Bike',
    vehicleNumber: 'MH02CD3456',
    vehicleModel: 'Honda Activa',
    bankName: 'ICICI Bank',
    accountHolderName: 'Priya Sharma',
    accountNumber: '234567890123',
    ifscCode: 'ICIC0002345',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 300,
    updatedAt: Date.now() - 86400000 * 20,
  },
  {
    id: '3',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@company.com',
    mobileNumber: '+91 98345 67890',
    userType: 'Accountant',
    language: 'Hindi',
    verified: 'Verified',
    photo: '',
    address: '789 Gandhi Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zipCode: '380001',
    employeeId: 'EMP0003',
    role: 'Accountant',
    salary: '40000',
    shift: 'Morning',
    status: 'Active',
    vehicleType: 'Car',
    vehicleNumber: 'GJ01AB7890',
    vehicleModel: 'Maruti Suzuki Swift',
    bankName: 'HDFC Bank',
    accountHolderName: 'Amit Patel',
    accountNumber: '345678901234',
    ifscCode: 'HDFC0003456',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 250,
    updatedAt: Date.now() - 86400000 * 15,
  },
  {
    id: '4',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@company.com',
    mobileNumber: '+91 98456 78901',
    userType: 'Staff',
    language: 'Telugu',
    verified: 'Pending',
    photo: '',
    address: '321 MG Road',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500001',
    employeeId: 'EMP0004',
    role: 'Staff',
    salary: '25000',
    shift: 'Afternoon',
    status: 'Active',
    vehicleType: 'Bike',
    vehicleNumber: 'TS02CD2345',
    vehicleModel: 'TVS Jupiter',
    bankName: 'Bank of Baroda',
    accountHolderName: 'Sneha Reddy',
    accountNumber: '456789012345',
    ifscCode: 'BARB0456789',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 200,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: '5',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@company.com',
    mobileNumber: '+91 98567 89012',
    userType: 'Admin',
    language: 'English',
    verified: 'Verified',
    photo: '',
    address: '654 Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    zipCode: '110001',
    employeeId: 'EMP0005',
    role: 'Admin',
    salary: '55000',
    shift: 'Morning',
    status: 'Active',
    vehicleType: 'Car',
    vehicleNumber: 'DL01AB3456',
    vehicleModel: 'Toyota Innova',
    bankName: 'Punjab National Bank',
    accountHolderName: 'Vikram Singh',
    accountNumber: '567890123456',
    ifscCode: 'PUNB0567890',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 180,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: '6',
    firstName: 'Anjali',
    lastName: 'Nair',
    email: 'anjali.nair@company.com',
    mobileNumber: '+91 98678 90123',
    userType: 'Sales',
    language: 'Kannada',
    verified: 'Verified',
    photo: '',
    address: '987 Brigade Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560025',
    employeeId: 'EMP0006',
    role: 'Sales',
    salary: '32000',
    shift: 'General',
    status: 'On Leave',
    vehicleType: 'Bike',
    vehicleNumber: 'KA05EF6789',
    vehicleModel: 'Hero Splendor',
    bankName: 'Canara Bank',
    accountHolderName: 'Anjali Nair',
    accountNumber: '678901234567',
    ifscCode: 'CNRB0678901',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 150,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: '7',
    firstName: 'Rohit',
    lastName: 'Gupta',
    email: 'rohit.gupta@company.com',
    mobileNumber: '+91 98789 01234',
    userType: 'Staff',
    language: 'Hindi',
    verified: 'Not Verified',
    photo: '',
    address: '147 FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411016',
    employeeId: 'EMP0007',
    role: 'Staff',
    salary: '28000',
    shift: 'Night',
    status: 'Active',
    vehicleType: 'Bike',
    vehicleNumber: 'MH12GH1234',
    vehicleModel: 'Bajaj Pulsar',
    bankName: 'Axis Bank',
    accountHolderName: 'Rohit Gupta',
    accountNumber: '789012345678',
    ifscCode: 'UTIB0789012',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 120,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: '8',
    firstName: 'Kavita',
    lastName: 'Iyer',
    email: 'kavita.iyer@company.com',
    mobileNumber: '+91 98890 12345',
    userType: 'Sales',
    language: 'Tamil',
    verified: 'Verified',
    photo: '',
    address: '258 Cathedral Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600086',
    employeeId: 'EMP0008',
    role: 'Sales',
    salary: '33000',
    shift: 'Morning',
    status: 'Active',
    vehicleType: 'Scooter',
    vehicleNumber: 'TN04AB5678',
    vehicleModel: 'Honda Dio',
    bankName: 'Indian Bank',
    accountHolderName: 'Kavita Iyer',
    accountNumber: '890123456789',
    ifscCode: 'IDIB0890123',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: '9',
    firstName: 'Arjun',
    lastName: 'Malhotra',
    email: 'arjun.malhotra@company.com',
    mobileNumber: '+91 98901 23456',
    userType: 'Manager',
    language: 'English',
    verified: 'Verified',
    photo: '',
    address: '369 Sector 17',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160017',
    employeeId: 'EMP0009',
    role: 'Manager',
    salary: '42000',
    shift: 'Morning',
    status: 'Active',
    vehicleType: 'Car',
    vehicleNumber: 'CH01AB8901',
    vehicleModel: 'Hyundai Creta',
    bankName: 'UCO Bank',
    accountHolderName: 'Arjun Malhotra',
    accountNumber: '901234567890',
    ifscCode: 'UCBA0901234',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: '10',
    firstName: 'Meera',
    lastName: 'Joshi',
    email: 'meera.joshi@company.com',
    mobileNumber: '+91 98912 34567',
    userType: 'Staff',
    language: 'Kannada',
    verified: 'Pending',
    photo: '',
    address: '741 Race Course Road',
    city: 'Mysuru',
    state: 'Karnataka',
    zipCode: '570001',
    employeeId: 'EMP0010',
    role: 'Staff',
    salary: '26000',
    shift: 'Afternoon',
    status: 'Inactive',
    vehicleType: 'Bike',
    vehicleNumber: 'KA09JK2345',
    vehicleModel: 'Royal Enfield Classic',
    bankName: 'Syndicate Bank',
    accountHolderName: 'Meera Joshi',
    accountNumber: '012345678901',
    ifscCode: 'SYNB0123456',
    documents: {
      aadhaar: '',
      pan: '',
      driving: '',
      rc: '',
      insurance: '',
    },
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 4,
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const fileInputRef = useRef(null);
  const [currentDocType, setCurrentDocType] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setEmployees(stored);
    } else {
      setEmployees(initialEmployees);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = employees.filter(emp =>
    emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocUpload = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [docType]: reader.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingEmployee) {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingEmployee.id
            ? { ...emp, ...formData, updatedAt: Date.now() }
            : emp
        )
      );
    } else {
      const newEmployee = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setEmployees(prev => [newEmployee, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      mobileNumber: emp.mobileNumber || '',
      password: '',
      userType: emp.userType || 'Staff',
      language: emp.language || 'India',
      verified: emp.verified || 'Verified',
      photo: emp.photo || '',
      address: emp.address || '',
      city: emp.city || '',
      state: emp.state || '',
      zipCode: emp.zipCode || '',
      employeeId: emp.employeeId || '',
      role: emp.role || 'Staff',
      salary: emp.salary || '',
      shift: emp.shift || 'Morning',
      status: emp.status || 'Active',
      vehicleType: emp.vehicleType || '',
      vehicleNumber: emp.vehicleNumber || '',
      vehicleModel: emp.vehicleModel || '',
      bankName: emp.bankName || '',
      accountHolderName: emp.accountHolderName || '',
      accountNumber: emp.accountNumber || '',
      ifscCode: emp.ifscCode || '',
      documents: emp.documents || initialFormData.documents,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const openModal = () => {
    setEditingEmployee(null);
    setFormData({
      ...initialFormData,
      employeeId: `EMP${String(employees.length + 1).padStart(4, '0')}`,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setActiveTab('basic');
  };

  const hasDocument = (docType) => formData.documents[docType];

  const isVerified = (emp) => emp.verified === 'Verified' && (emp.documents?.aadhaar || emp.documents?.pan);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="tab-content">
            <div className="photo-upload-section">
              <div className="photo-preview">
                {formData.photo ? (
                  <img src={formData.photo} alt="Employee" />
                ) : (
                  <div className="photo-placeholder">
                    <User size={40} />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <button type="button" className="button outline small" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} />
                Upload Photo
              </button>
            </div>

            <div className="form-row">
              <div className="form-group required">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              </div>
              <div className="form-group required">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group required">
                <label>Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Password {editingEmployee && '(leave blank to keep)'}</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editingEmployee ? 'Leave blank to keep current' : ''} />
              </div>
              <div className="form-group">
                <label>User Type</label>
                <select name="userType" value={formData.userType} onChange={handleInputChange}>
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Language</label>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Verified</label>
                <select name="verified" value={formData.verified} onChange={handleInputChange}>
                  {VERIFICATIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="form-section-title">
              <span className="location-icon">📍</span> Location
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="123456" />
              </div>
            </div>
          </div>
        );

      case 'employee':
        return (
          <div className="tab-content">
            <div className="form-row">
              <div className="form-group">
                <label>Employee ID</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} readOnly className="readonly" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Salary (₹)</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="0" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shift</label>
                <select name="shift" value={formData.shift} onChange={handleInputChange}>
                  {SHIFTS.map(shift => <option key={shift} value={shift}>{shift}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  {STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 'vehicle':
        return (
          <div className="tab-content">
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Type</label>
                <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} placeholder="e.g. Car, Bike" />
              </div>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="KA01AB1234" />
              </div>
              <div className="form-group">
                <label>Vehicle Model</label>
                <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="e.g. Honda Activa" />
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="tab-content">
            <div className="form-row">
              <div className="form-group">
                <label>Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="State Bank of India" />
              </div>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} placeholder="John Doe" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="123456789012" />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="SBIN0001234" />
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="tab-content">
            <p className="doc-instruction">Upload image or PDF for each document. Accepted formats: JPG, PNG, PDF.</p>
            <div className="documents-grid">
              {DOCUMENT_TYPES.map((doc) => (
                <div key={doc.id} className="document-upload-box">
                  <label>{doc.label}</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id={`doc-${doc.id}`}
                    onChange={(e) => handleDocUpload(e, doc.id)}
                  />
                  {hasDocument(doc.id) ? (
                    <div className="document-uploaded">
                      <FileText size={32} />
                      <span>Document uploaded</span>
                      <button
                        type="button"
                        className="remove-doc-btn"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, [doc.id]: '' }
                        }))}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor={`doc-${doc.id}`} className="document-upload-placeholder">
                      <FileText size={32} />
                      <span>Click to upload</span>
                      <span className="sub-text">Image or PDF</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="employees-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="employees-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button className="button" onClick={openModal}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="glass-panel employees-empty">
          <Users size={48} />
          <h3>No employees yet</h3>
          <p>Add your first employee to get started</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="glass-panel employees-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="glass-panel table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role & ID</th>
                <th>Salary</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="employee-name-email">
                        <div className="emp-name">{emp.firstName} {emp.lastName}</div>
                        <div className="emp-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="emp-role">{emp.role}</div>
                    <div className="emp-id">{emp.employeeId}</div>
                  </td>
                  <td>
                    <div className="emp-salary">{emp.salary ? `₹${emp.salary}` : '-'}</div>
                  </td>
                  <td>
                    <div className="emp-contact">{emp.mobileNumber}</div>
                  </td>
                  <td>
                    <div className="emp-location">
                      {emp.city}{emp.city && emp.state ? ', ' : ''}{emp.state}
                    </div>
                  </td>
                  <td>
                    <span className={`verification-badge ${isVerified(emp) ? 'verified' : 'pending'}`}>
                      {isVerified(emp) ? (
                        <><CheckCircle size={14} /> Verified</>
                      ) : (
                        <>{emp.verified}</>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge emp-${emp.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button small" onClick={() => handleEdit(emp)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="icon-button small danger" onClick={() => handleDelete(emp.id)} title="Delete">
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
        <div className="employee-modal-overlay" onClick={closeModal}>
          <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
            <div className="employee-modal-header">
              <h3><span className="edit-icon">✏️</span> {editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="employee-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`emp-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              <div className="employee-form-content">
                {renderTabContent()}
              </div>

              <div className="employee-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={18} />
                  {editingEmployee ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
