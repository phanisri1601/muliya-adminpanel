import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, UserCheck, Settings, Eye, Lock, Unlock } from 'lucide-react';
import './UserRoles.css';

const initialRoles = [
  { id: 1, name: 'Super Admin', description: 'Full access to all features and settings', permissions: ['all'], userCount: 2, status: 'Active' },
  { id: 2, name: 'Manager', description: 'Manage inventory, orders, and employees', permissions: ['inventory', 'orders', 'employees', 'customers'], userCount: 5, status: 'Active' },
  { id: 3, name: 'Sales Executive', description: 'Handle sales, customers, and orders', permissions: ['orders', 'customers', 'coupons'], userCount: 12, status: 'Active' },
  { id: 4, name: 'Inventory Manager', description: 'Manage inventory and stock', permissions: ['inventory', 'gold-management'], userCount: 3, status: 'Active' },
  { id: 5, name: 'Content Manager', description: 'Manage blog, collections, and banners', permissions: ['blog', 'collections', 'banner'], userCount: 4, status: 'Active' },
  { id: 6, name: 'Customer Support', description: 'Handle customer reviews and support', permissions: ['reviews', 'customers'], userCount: 8, status: 'Active' },
];

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
  { id: 'inventory', label: 'Inventory', icon: '💎' },
  { id: 'gold-management', label: 'Gold Management', icon: '🪙' },
  { id: 'sales', label: 'Sales', icon: '📋' },
  { id: 'coupons', label: 'Coupons', icon: '🎫' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'customers', label: 'Customers', icon: '👤' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'collections', label: 'Collections', icon: '📁' },
  { id: 'blog', label: 'Blog', icon: '📝' },
  { id: 'careers', label: 'Careers', icon: '💼' },
  { id: 'goldplans', label: 'Gold Plans', icon: '💰' },
  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'branches', label: 'Branches', icon: '🏢' },
  { id: 'banner', label: 'Banner', icon: '🖼️' },
];

export default function UserRoles() {
  const [roles, setRoles] = useState(() => {
    const saved = localStorage.getItem('userRoles');
    return saved ? JSON.parse(saved) : initialRoles;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
    status: 'Active'
  });

  useEffect(() => {
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }, [roles]);

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        status: role.status
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        permissions: [],
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(role => role.id === editingRole.id ? { ...formData, id: role.id, userCount: role.userCount } : role));
    } else {
      setRoles([...roles, { ...formData, id: Date.now(), userCount: 0 }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleTogglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleViewRole = (role) => {
    setViewingRole(role);
  };

  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const activeRoles = roles.filter(r => r.status === 'Active').length;

  return (
    <div className="user-roles-container animate-fade-in">
      <div className="user-roles-header">
        <div>
          <h2>User Roles & Permissions</h2>
          <p>Manage user roles and their access permissions</p>
        </div>
        <button className="button" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Create Role
        </button>
      </div>

      <div className="roles-cards">
        <div className="role-card">
          <div className="role-card-icon">
            <Shield size={32} />
          </div>
          <div className="role-card-content">
            <div className="role-card-label">Total Roles</div>
            <div className="role-card-value">{roles.length}</div>
            <div className="role-card-sub">Configured roles</div>
          </div>
        </div>

        <div className="role-card">
          <div className="role-card-icon">
            <UserCheck size={32} />
          </div>
          <div className="role-card-content">
            <div className="role-card-label">Total Users</div>
            <div className="role-card-value">{totalUsers}</div>
            <div className="role-card-sub">Assigned users</div>
          </div>
        </div>

        <div className="role-card">
          <div className="role-card-icon">
            <Settings size={32} />
          </div>
          <div className="role-card-content">
            <div className="role-card-label">Active Roles</div>
            <div className="role-card-value">{activeRoles}</div>
            <div className="role-card-sub">Currently active</div>
          </div>
        </div>
      </div>

      <div className="glass-panel roles-table-container">
        <div className="table-header">
          <h3>All Roles</h3>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search roles..." />
          </div>
        </div>

        <table className="roles-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <td>
                  <div className="role-name-cell">
                    <Shield size={16} />
                    {role.name}
                  </div>
                </td>
                <td className="role-description">{role.description}</td>
                <td>
                  <div className="permissions-cell">
                    {role.permissions.includes('all') ? (
                      <span className="all-permissions">All Access</span>
                    ) : (
                      <span className="permission-count">{role.permissions.length} permissions</span>
                    )}
                  </div>
                </td>
                <td className="user-count">{role.userCount} users</td>
                <td>
                  <span className={`status-badge ${role.status.toLowerCase()}`}>
                    {role.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small" onClick={() => handleViewRole(role)} title="View">
                      <Eye size={16} />
                    </button>
                    <button className="icon-button small" onClick={() => handleOpenModal(role)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="icon-button small danger" onClick={() => handleDelete(role.id)} title="Delete">
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
              <h3>{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <Trash2 size={20} />
              </button>
            </div>

            <form className="role-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role Name *</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Sales Manager" required />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the role's responsibilities" rows={3} required />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {allPermissions.map((permission) => (
                    <label key={permission.id} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handleTogglePermission(permission.id)}
                      />
                      <span className="permission-icon">{permission.icon}</span>
                      <span className="permission-label">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">{editingRole ? 'Update Role' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingRole && (
        <div className="modal-overlay" onClick={() => setViewingRole(null)}>
          <div className="modal-content glass-panel role-view" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Role Details - {viewingRole.name}</h3>
              <button className="icon-button" onClick={() => setViewingRole(null)}>
                <Trash2 size={20} />
              </button>
            </div>

            <div className="role-view-content">
              <div className="role-view-section">
                <h4>Role Information</h4>
                <div className="role-detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{viewingRole.name}</span>
                </div>
                <div className="role-detail-row">
                  <span className="label">Description:</span>
                  <span className="value">{viewingRole.description}</span>
                </div>
                <div className="role-detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{viewingRole.status}</span>
                </div>
                <div className="role-detail-row">
                  <span className="label">Assigned Users:</span>
                  <span className="value">{viewingRole.userCount}</span>
                </div>
              </div>

              <div className="role-view-section">
                <h4>Permissions</h4>
                {viewingRole.permissions.includes('all') ? (
                  <div className="all-permissions-badge">
                    <Unlock size={20} />
                    Full Access to All Features
                  </div>
                ) : (
                  <div className="permissions-list">
                    {viewingRole.permissions.map((permId) => {
                      const perm = allPermissions.find(p => p.id === permId);
                      return perm ? (
                        <div key={permId} className="permission-item">
                          <span className="permission-icon">{perm.icon}</span>
                          <span className="permission-label">{perm.label}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
