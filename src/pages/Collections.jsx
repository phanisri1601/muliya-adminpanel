import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, Image as ImageIcon, Edit, Trash2, Upload, X, Save, Grid3X3, List, Tag, Eye, EyeOff } from 'lucide-react';
import './Collections.css';

const STORAGE_KEY = 'collections_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const initialCollections = [
  {
    id: 'COL-001',
    title: 'Royal Gold Collection',
    description: 'Exquisite 22K and 24K gold jewellery pieces crafted with traditional techniques for the modern royalty.',
    image: '',
    category: 'Gold',
    isActive: true,
    isFeatured: true,
    productCount: 24,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'COL-002',
    title: 'Diamond Elegance',
    description: 'Brilliant cut diamonds set in 18K gold and platinum for those special moments.',
    image: '',
    category: 'Diamond',
    isActive: true,
    isFeatured: false,
    productCount: 18,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'COL-003',
    title: 'Bridal Heritage',
    description: 'Traditional South Indian bridal jewellery sets featuring temple designs and antique finish.',
    image: '',
    category: 'Bridal',
    isActive: true,
    isFeatured: true,
    productCount: 32,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'COL-004',
    title: 'Contemporary Silver',
    description: 'Modern sterling silver jewellery with minimalist designs for everyday elegance.',
    image: '',
    category: 'Silver',
    isActive: false,
    isFeatured: false,
    productCount: 45,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'COL-005',
    title: 'Platinum Classics',
    description: 'Timeless platinum jewellery pieces that symbolize eternal love and commitment.',
    image: '',
    category: 'Platinum',
    isActive: true,
    isFeatured: false,
    productCount: 12,
    createdAt: Date.now() - 86400000 * 10,
  },
];

const CATEGORIES = ['Gold', 'Diamond', 'Silver', 'Platinum', 'Bridal', 'Temple', 'Antique', 'Contemporary', 'Traditional'];

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Gold',
    isActive: true,
    isFeatured: false,
    productCount: 0,
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setCollections(stored);
    } else {
      setCollections(initialCollections);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCollections));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = 
      collection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || collection.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCollection) {
      setCollections(prev =>
        prev.map(col =>
          col.id === editingCollection.id
            ? { ...col, ...formData, updatedAt: Date.now() }
            : col
        )
      );
    } else {
      const newCollection = {
        id: `COL-${String(collections.length + 1).padStart(3, '0')}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCollections(prev => [newCollection, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      title: collection.title || '',
      description: collection.description || '',
      image: collection.image || '',
      category: collection.category || 'Gold',
      isActive: collection.isActive ?? true,
      isFeatured: collection.isFeatured ?? false,
      productCount: collection.productCount || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      setCollections(prev => prev.filter(col => col.id !== id));
    }
  };

  const toggleStatus = (id, field) => {
    setCollections(prev =>
      prev.map(col =>
        col.id === id ? { ...col, [field]: !col[field] } : col
      )
    );
  };

  const openModal = () => {
    setEditingCollection(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      category: 'Gold',
      isActive: true,
      isFeatured: false,
      productCount: 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="collections-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="collections-header">
        <h2 className="collections-title">Collections</h2>
        <div className="collections-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3X3 size={18} />
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Collection
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="glass-panel collections-empty">
          <ImageIcon size={48} />
          <h3>No collections yet</h3>
          <p>Create your first collection to showcase your jewellery</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Add Collection
          </button>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="glass-panel collections-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={`collections-${viewMode}`}>
          {filteredCollections.map((collection, index) => (
            <div 
              key={collection.id} 
              className={`collection-card animate-fade-in ${viewMode}`}
              style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="collection-image">
                {collection.image ? (
                  <img src={collection.image} alt={collection.title} />
                ) : (
                  <div className="collection-image-placeholder">
                    <ImageIcon size={40} />
                    <span>No Image</span>
                  </div>
                )}
                {collection.isFeatured && (
                  <span className="featured-badge">Featured</span>
                )}
                {!collection.isActive && (
                  <span className="inactive-overlay">
                    <EyeOff size={24} />
                    <span>Hidden</span>
                  </span>
                )}
              </div>
              
              <div className="collection-content">
                <div className="collection-header">
                  <span className="collection-category">{collection.category}</span>
                  <div className="collection-actions">
                    <button 
                      className={`toggle-btn ${collection.isActive ? 'active' : ''}`}
                      onClick={() => toggleStatus(collection.id, 'isActive')}
                      title={collection.isActive ? 'Active' : 'Inactive'}
                    >
                      {collection.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(collection)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(collection.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h4 className="collection-title">{collection.title}</h4>
                <p className="collection-description">{collection.description}</p>
                
                <div className="collection-meta">
                  <span className="product-count">
                    <Tag size={14} />
                    {collection.productCount} products
                  </span>
                  <span className="collection-date">{formatDate(collection.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="collection-modal-overlay" onClick={closeModal}>
          <div className="collection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="collection-modal-header">
              <h3>{editingCollection ? 'Edit Collection' : 'Add Collection'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="collection-form">
              <div className="collection-form-content">
                <div className="form-group required">
                  <label>Collection Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter collection title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter collection description"
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Product Count</label>
                    <input
                      type="number"
                      name="productCount"
                      value={formData.productCount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Collection Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />

                  {formData.image ? (
                    <div className="collection-image-preview">
                      <img src={formData.image} alt="Preview" />
                      <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="collection-image-upload"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={24} />
                      <span>Upload Collection Image</span>
                      <span className="sub-text">Recommended size: 800x600px</span>
                    </button>
                  )}
                </div>

                <div className="form-row checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <span className="check-icon"></span>
                    <span>Active (Visible to customers)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    <span className="check-icon"></span>
                    <span>Featured (Show on homepage)</span>
                  </label>
                </div>
              </div>

              <div className="collection-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={18} />
                  {editingCollection ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
