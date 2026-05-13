import React, { useEffect, useState, useMemo } from 'react';
import { Search, Grid, Plus, Edit, Trash2, Eye, Filter, ArrowLeft, Image as ImageIcon, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api, endpoints, IMAGE_BASE_URL } from '../api';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);
const [formData, setFormData] = useState({
  name: '',
  description: '',
  image: null,
});

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.get(endpoints.categories)
      .then((res) => {
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
        const categoryList = Array.isArray(normalized) ? normalized : (normalized?.categories || []);
        if (mounted) {
          setCategories(categoryList);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return value.name ?? value.title ?? value.label ?? value._id ?? JSON.stringify(value);
    }
    return String(value);
  };

  const getImageUrl = (category) => {
    const imagePath = category.imageUrl || category.image;
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files) {
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const handleAddCategory = async () => {
  try {
    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);

    if (formData.image) {
      data.append('imageFile', formData.image);
    }

    const res = await api.post(endpoints.Addcategories, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setCategories((prev) => [...prev, res.data.category]);

    setShowModal(false);

    setFormData({
      name: '',
      description: '',
      image: null,
    });

  } catch (error) {
    console.error(error);
  }
};

const handleEditClick = (category) => {
  setEditingCategory(category);

  setFormData({
    name: category.name || '',
    description: category.description || '',
    image: null,
  });

  setShowModal(true);
};

const handleUpdateCategory = async () => {
  try {
    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);

    if (formData.image) {
      data.append('imageFile', formData.image);
    }

    const res = await api.put(
      `${endpoints.categories}/${editingCategory._id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    setCategories((prev) =>
      prev.map((item) =>
        item._id === editingCategory._id
          ? res.data.category
          : item
      )
    );

    setShowModal(false);
    setEditingCategory(null);

  } catch (error) {
    console.error(error);
  }
};

const handleDeleteCategory = async (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this category?'
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`${endpoints.categories}/${id}`);

    setCategories((prev) =>
      prev.filter((item) => item._id !== id)
    );

  } catch (error) {
    console.error(error);
  }
};

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const name = safeRender(category.name || category.category_name).toLowerCase();
      const id = safeRender(category._id || category.id).toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
    });
  }, [categories, searchTerm]);

  if (loading) {
    return (
      <div className="categories-container animate-fade-in">
        <div className="loading-spinner-container">
          <div className="loading-spinner">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container animate-fade-in">
      <div className="categories-header">
        <h2 className="categories-title">Categories</h2>
        <div className="categories-actions-top">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by category name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
  className="button button-primary add-category-btn"
  onClick={() => {
    setEditingCategory(null);

    setFormData({
      name: '',
      description: '',
      image: null,
    });

    setShowModal(true);
  }}
>
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      <div className="glass-panel categories-panel">
        <div className="categories-grid">
          {filteredCategories.map((category, index) => (
            <div 
              key={category._id || category.id || index} 
              className="category-card animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="category-image">
                {(category.imageUrl || category.image) ? (
                  <img src={getImageUrl(category)} alt={category.name} />
                ) : (
                  <div className="category-image-placeholder">
                    <Grid size={32} />
                  </div>
                )}
              </div>
              <div className="category-info">
                <h3 className="category-name">{safeRender(category.name || category.category_name)}</h3>
                <p className="category-id">ID: {safeRender(category._id || category.id)}</p>
                {category.description && (
                  <p className="category-description">{safeRender(category.description)}</p>
                )}
              </div>
              <div className="category-card-actions">
              <button
  className="category-action-btn edit"
  title="Edit"
  onClick={() => handleEditClick(category)}
>
                  <Edit size={16} />
                </button>
               <button
  className="category-action-btn delete"
  title="Delete"
  onClick={() => handleDeleteCategory(category._id)}
>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="categories-empty">
            <Grid size={48} />
            <h3>No categories found</h3>
            <p>Try adjusting your search or add a new category.</p>
          </div>
        )}
      </div>

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-box">

      <h2>
        {editingCategory ? 'Edit Category' : 'Add Category'}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={formData.name}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        type="file"
        name="image"
        onChange={handleChange}
      />

      <div className="modal-actions">
        <button
          onClick={() => setShowModal(false)}
          className="button"
        >
          Cancel
        </button>

        <button
          className="button button-primary"
          onClick={
            editingCategory
              ? handleUpdateCategory
              : handleAddCategory
          }
        >
          {editingCategory ? 'Update' : 'Add'}
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}
