import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, User, Mail, Phone, Briefcase, FileText, Download, Eye, Trash2, X, Upload, Calendar, ExternalLink } from 'lucide-react';
import './Careers.css';

const STORAGE_KEY = 'careers_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const STATUS_OPTIONS = ['New', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'];

const initialApplications = [
  {
    id: 'APP-001',
    firstName: 'Ramesh',
    lastName: 'Kumar',
    email: 'ramesh.kumar@email.com',
    phone: '+91 9876543210',
    experience: '5 years',
    position: 'Sales Executive',
    branch: 'Muliya Gold & Diamonds Puttur',
    status: 'Shortlisted',
    resume: null,
    appliedDate: '2024-01-15',
    notes: 'Good communication skills, prior jewelry experience'
  },
  {
    id: 'APP-002',
    firstName: 'Lakshmi',
    lastName: 'Devi',
    email: 'lakshmi.devi@email.com',
    phone: '+91 9876543211',
    experience: '3 years',
    position: 'Jewelry Designer',
    branch: 'Muliya Gold & Diamonds Bengaluru',
    status: 'New',
    resume: null,
    appliedDate: '2024-01-16',
    notes: ''
  },
  {
    id: 'APP-003',
    firstName: 'Suresh',
    lastName: 'Rao',
    email: 'suresh.rao@email.com',
    phone: '+91 9876543212',
    experience: '7 years',
    position: 'Store Manager',
    branch: 'Muliya Gold & Diamonds Madikeri',
    status: 'Reviewed',
    resume: null,
    appliedDate: '2024-01-17',
    notes: 'Extensive retail management experience'
  },
  {
    id: 'APP-004',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543213',
    experience: '2 years',
    position: 'Customer Service',
    branch: 'Shyama Jewels Sourcing LLP',
    status: 'New',
    resume: null,
    appliedDate: '2024-01-18',
    notes: ''
  },
  {
    id: 'APP-005',
    firstName: 'Arun',
    lastName: 'Nayak',
    email: 'arun.nayak@email.com',
    phone: '+91 9876543214',
    experience: '4 years',
    position: 'Goldsmith',
    branch: 'Muliya Gold & Diamonds Belthangady',
    status: 'Hired',
    resume: null,
    appliedDate: '2024-01-10',
    notes: 'Excellent craftsmanship, reference checked'
  }
];

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

const POSITIONS = [
  'Sales Executive',
  'Store Manager',
  'Jewelry Designer',
  'Goldsmith',
  'Customer Service',
  'Accountant',
  'Security Guard',
  'Cleaner',
  'Other'
];

const EXPERIENCE_OPTIONS = [
  'Fresher',
  '1-2 years',
  '2-3 years',
  '3-5 years',
  '5-7 years',
  '7+ years'
];

export default function Careers() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [viewingResume, setViewingResume] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: 'Fresher',
    position: 'Sales Executive',
    branch: defaultBranches[0],
    status: 'New',
    notes: '',
    resume: null
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setApplications(stored);
    } else {
      setApplications(initialApplications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialApplications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const filteredApplications = applications.filter(app => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
    const matchesSearch = 
      app.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || app.position === positionFilter;
    const matchesBranch = branchFilter === 'All' || app.branch === branchFilter;
    
    return matchesSearch && matchesStatus && matchesPosition && matchesBranch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ 
        ...prev, 
        resume: {
          name: file.name,
          type: file.type,
          data: reader.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newApplication = {
      id: `APP-${String(applications.length + 1).padStart(3, '0')}`,
      ...formData,
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setApplications(prev => [newApplication, ...prev]);
    closeModal();
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const openModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      experience: 'Fresher',
      position: 'Sales Executive',
      branch: defaultBranches[0],
      status: 'New',
      notes: '',
      resume: null
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const viewApplication = (app) => {
    setSelectedApplication(app);
    setViewMode('detail');
  };

  const backToList = () => {
    setViewMode('list');
    setSelectedApplication(null);
  };

  const downloadResume = (app) => {
    if (app.resume?.data) {
      const link = document.createElement('a');
      link.href = app.resume.data;
      link.download = app.resume.name || `Resume_${app.firstName}_${app.lastName}.pdf`;
      link.click();
    } else {
      alert('No resume uploaded for this applicant');
    }
  };

  const viewResume = (app) => {
    if (app.resume?.data) {
      setViewingResume(app);
    } else {
      alert('No resume uploaded for this applicant');
    }
  };

  const closeResumeView = () => {
    setViewingResume(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#2196f3';
      case 'Reviewed': return '#ff9800';
      case 'Shortlisted': return '#9c27b0';
      case 'Hired': return '#4caf50';
      case 'Rejected': return '#f44336';
      default: return '#757575';
    }
  };

  const ListView = () => (
    <>
      <div className="careers-header">
        <h2 className="careers-title">Careers</h2>
        <div className="careers-filters">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
            <option value="All">All Positions</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="All">All Branches</option>
            {defaultBranches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Application
          </button>
        </div>
      </div>

      <div className="careers-stats">
        <div className="stat-card">
          <span className="stat-value">{applications.length}</span>
          <span className="stat-label">Total Applications</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{applications.filter(a => a.status === 'New').length}</span>
          <span className="stat-label">New</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{applications.filter(a => a.status === 'Shortlisted').length}</span>
          <span className="stat-label">Shortlisted</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{applications.filter(a => a.status === 'Hired').length}</span>
          <span className="stat-label">Hired</span>
        </div>
      </div>

      <div className="glass-panel careers-panel">
        <table className="careers-table">
          <thead>
            <tr>
              <th>Applicant ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Experience</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app, index) => (
              <tr key={app.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <td>
                  <span className="app-id">{app.id}</span>
                </td>
                <td>
                  <div className="app-name">
                    <div className="app-avatar">
                      <User size={14} />
                    </div>
                    <span>{app.firstName} {app.lastName}</span>
                  </div>
                </td>
                <td>
                  <div className="app-email">
                    <Mail size={14} />
                    <span>{app.email}</span>
                  </div>
                </td>
                <td>
                  <div className="app-phone">
                    <Phone size={14} />
                    <span>{app.phone}</span>
                  </div>
                </td>
                <td>
                  <span className="app-position">{app.position}</span>
                </td>
                <td>
                  <span className="app-experience">{app.experience}</span>
                </td>
                <td>
                  <span className="app-branch">{app.branch}</span>
                </td>
                <td>
                  <select 
                    className="status-select"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={{ color: getStatusColor(app.status), borderColor: getStatusColor(app.status) }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div className="app-date">
                    <Calendar size={14} />
                    <span>{formatDate(app.appliedDate)}</span>
                  </div>
                </td>
                <td>
                  <div className="app-actions">
                    <button className="action-btn view" onClick={() => viewApplication(app)} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn download" onClick={() => downloadResume(app)} title="Download Resume">
                      <Download size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(app.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="careers-empty">
            <Briefcase size={48} />
            <h3>No applications found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );

  const DetailView = () => {
    if (!selectedApplication) return null;

    return (
      <div className="career-detail-view animate-fade-in">
        <div className="detail-view-header">
          <button className="back-btn" onClick={backToList}>
            <X size={18} />
            Back to List
          </button>
          <div className="detail-view-actions">
            <button className="action-btn-outline" onClick={() => downloadResume(selectedApplication)}>
              <Download size={16} />
              Download Resume
            </button>
          </div>
        </div>

        <div className="career-detail-content">
          <div className="detail-section applicant-header">
            <div className="applicant-info-main">
              <div className="applicant-avatar-large">
                <User size={40} />
              </div>
              <div>
                <h3>{selectedApplication.firstName} {selectedApplication.lastName}</h3>
                <span className="applicant-id">{selectedApplication.id}</span>
              </div>
            </div>
            <span 
              className="status-badge-large"
              style={{ backgroundColor: `${getStatusColor(selectedApplication.status)}20`, color: getStatusColor(selectedApplication.status) }}
            >
              {selectedApplication.status}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h4><User size={18} /> Personal Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">First Name</span>
                  <span className="info-value">{selectedApplication.firstName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Name</span>
                  <span className="info-value">{selectedApplication.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedApplication.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{selectedApplication.phone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4><Briefcase size={18} /> Job Details</h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Position Applied</span>
                  <span className="info-value highlight">{selectedApplication.position}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Experience</span>
                  <span className="info-value">{selectedApplication.experience}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Preferred Branch</span>
                  <span className="info-value">{selectedApplication.branch}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Applied Date</span>
                  <span className="info-value">{formatDate(selectedApplication.appliedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4><FileText size={18} /> Notes</h4>
            <div className="notes-content">
              {selectedApplication.notes || 'No notes added'}
            </div>
          </div>

          <div className="detail-section">
            <h4><FileText size={18} /> Resume</h4>
            <div className="resume-section">
              {selectedApplication.resume ? (
                <div className="resume-file">
                  <FileText size={48} />
                  <span className="resume-name">{selectedApplication.resume.name}</span>
                  <div className="resume-actions">
                    <button className="button outline" onClick={() => viewResume(selectedApplication)}>
                      <Eye size={16} />
                      View
                    </button>
                    <button className="button" onClick={() => downloadResume(selectedApplication)}>
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="resume-empty">
                  <FileText size={48} />
                  <span>No resume uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section status-section">
            <h4>Update Status</h4>
            <div className="status-buttons">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  className={`status-btn ${selectedApplication.status === status ? 'active' : ''}`}
                  onClick={() => handleStatusChange(selectedApplication.id, status)}
                  style={{ 
                    borderColor: getStatusColor(status),
                    color: selectedApplication.status === status ? 'white' : getStatusColor(status),
                    backgroundColor: selectedApplication.status === status ? getStatusColor(status) : 'transparent'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Resume View Modal
  const ResumeViewModal = () => {
    if (!viewingResume) return null;

    const isPDF = viewingResume.resume?.type?.includes('pdf');

    return (
      <div className="resume-view-overlay" onClick={closeResumeView}>
        <div className="resume-view-modal" onClick={(e) => e.stopPropagation()}>
          <div className="resume-view-header">
            <h3>
              <FileText size={20} />
              Resume: {viewingResume.firstName} {viewingResume.lastName}
            </h3>
            <div className="resume-view-actions">
              <button 
                className="action-btn-outline"
                onClick={() => window.open(viewingResume.resume.data, '_blank')}
              >
                <ExternalLink size={16} />
                Open in New Tab
              </button>
              <button className="action-btn-outline" onClick={() => downloadResume(viewingResume)}>
                <Download size={16} />
                Download
              </button>
              <button className="icon-button" onClick={closeResumeView}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="resume-view-content">
            {isPDF ? (
              <iframe 
                src={viewingResume.resume.data} 
                title="Resume Preview"
                className="resume-iframe"
              />
            ) : (
              <div className="resume-fallback">
                <FileText size={64} />
                <p>This file type cannot be previewed</p>
                <button className="button" onClick={() => downloadResume(viewingResume)}>
                  <Download size={16} />
                  Download to View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="careers-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      {viewMode === 'detail' ? <DetailView /> : <ListView />}

      {viewingResume && <ResumeViewModal />}

      {isModalOpen && (
        <div className="career-modal-overlay" onClick={closeModal}>
          <div className="career-modal" onClick={(e) => e.stopPropagation()}>
            <div className="career-modal-header">
              <h3>Add New Application</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="career-form">
              <div className="career-form-content">
                <div className="form-row">
                  <div className="form-group required">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group required">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
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

                <div className="form-row">
                  <div className="form-group required">
                    <label>Position</label>
                    <select name="position" value={formData.position} onChange={handleInputChange} required>
                      {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group required">
                    <label>Experience</label>
                    <select name="experience" value={formData.experience} onChange={handleInputChange} required>
                      {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>Preferred Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                      {defaultBranches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Resume</label>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleResumeUpload} />
                  
                  {formData.resume ? (
                    <div className="resume-uploaded">
                      <FileText size={20} />
                      <span>{formData.resume.name}</span>
                      <button type="button" className="remove-resume" onClick={() => setFormData(prev => ({ ...prev, resume: null }))}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="resume-upload-btn" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={20} />
                      <span>Upload Resume (PDF, DOC)</span>
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Additional notes about the applicant..." />
                </div>
              </div>

              <div className="career-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="button">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
