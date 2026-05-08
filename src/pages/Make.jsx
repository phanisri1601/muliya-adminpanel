import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Grid,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
} from 'lucide-react';

import { api, IMAGE_BASE_URL } from '../api';
import './Categories.css';

export default function Materials() {
  const MATERIAL_OPTIONS = useMemo(
    () => [
      'Gold',
      'Diamond',
      'Platinum',
      'Silver',
      'Gemstone',
    ],
    []
  );

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMaterialType, setActiveMaterialType] = useState('All');

  // =========================
  // ADD MODAL
  // =========================
  const [showAddModal, setShowAddModal] = useState(false);

  const [addFormData, setAddFormData] = useState({
    materialName: 'Gold',
    image: '',
    description: '',
    status: true,
    createdBy: 'Admin',
  });

  // =========================
  // EDIT MODAL
  // =========================
  const [editingMaterial, setEditingMaterial] = useState(null);

  const [formData, setFormData] = useState({
    materialName: '',
    image: '',
    description: '',
    status: true,
    createdBy: 'Admin',
  });

  // =========================
  // FETCH MATERIALS
  // =========================
  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const res = await api.get('/material/getMaterials');

      const normalized =
        res?.materials ||
        res?.data?.data ||
        res?.data ||
        [];

      setMaterials(Array.isArray(normalized) ? normalized : []);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // =========================
  // SAFE RENDER
  // =========================
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
      return (
        value.name ||
        value.title ||
        value.label ||
        value._id ||
        JSON.stringify(value)
      );
    }

    return String(value);
  };

  // =========================
  // IMAGE URL
  // =========================
  const getImageUrl = (material) => {
    const imagePath = material.image;

    if (!imagePath) return null;

    if (imagePath.startsWith('http')) return imagePath;

    if (imagePath.startsWith('data:image')) return imagePath;

    const cleanPath = imagePath.startsWith('/')
      ? imagePath
      : `/${imagePath}`;

    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  // =========================
  // FILTER
  // =========================
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const name = safeRender(
        material.materialName
      ).toLowerCase();

      const id = safeRender(material._id).toLowerCase();

      const matchesType =
        activeMaterialType === 'All'
          ? true
          : safeRender(material.materialName) ===
            activeMaterialType;

      return (
        matchesType &&
        (name.includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm.toLowerCase()))
      );
    });
  }, [materials, searchTerm, activeMaterialType]);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this material?'
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/material/deleteMaterial/${id}`);

      setMaterials((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert('Material deleted successfully');
    } catch (error) {
      console.error(error);

      alert('Failed to delete material');
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const handleEdit = (material) => {
    setEditingMaterial(material);

    setFormData({
      materialName: material.materialName || '',
      image: material.image || '',
      description: material.description || '',
      status: material.status,
      createdBy: material.createdBy || 'Admin',
    });
  };

  // =========================
  // EDIT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // =========================
  // UPDATE MATERIAL
  // =========================
  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/material/updateMaterial/${editingMaterial._id}`,
        formData
      );

      const updated =
        res?.data?.updatedMaterial ||
        res?.data?.material;

      setMaterials((prev) =>
        prev.map((item) =>
          item._id === editingMaterial._id
            ? updated
            : item
        )
      );

      alert('Material updated successfully');

      setEditingMaterial(null);
    } catch (error) {
      console.error(error);

      alert('Failed to update material');
    }
  };

  // =========================
  // ADD CHANGE
  // =========================
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // =========================
  // CREATE MATERIAL
  // =========================
  const handleCreateMaterial = async () => {
    try {
      const res = await api.post(
        '/material/createMaterial',
        addFormData
      );

      const newMaterial =
        res?.data?.material ||
        res?.data?.data;

      setMaterials((prev) => [
        newMaterial,
        ...prev,
      ]);

      alert('Material created successfully');

      setAddFormData({
        materialName: 'Gold',
        image: '',
        description: '',
        status: true,
        createdBy: 'Admin',
      });

      setShowAddModal(false);
    } catch (error) {
      console.error(error);

      alert('Failed to create material');
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="categories-container animate-fade-in">
        <div className="loading-spinner-container">
          <div className="loading-spinner">
            Loading materials...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container animate-fade-in">
      {/* HEADER */}
      <div className="categories-header">
        <h2 className="categories-title">Materials</h2>

        <div className="categories-actions-top">
          {/* SEARCH */}
          <div className="search-bar">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="Search by material name or ID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="form-group" style={{ margin: 0, minWidth: 180 }}>
            <select
              value={activeMaterialType}
              onChange={(e) =>
                setActiveMaterialType(e.target.value)
              }
            >
              <option value="All">All</option>
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* ADD BUTTON */}
          <button
            className="button button-primary add-category-btn"
            onClick={() => {
              setAddFormData((prev) => ({
                ...prev,
                materialName:
                  activeMaterialType === 'All'
                    ? 'Gold'
                    : activeMaterialType,
              }));
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            Add Material
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="glass-panel categories-panel">
        <div className="categories-grid">
          {filteredMaterials.map((material, index) => (
            <div
              key={material._id || index}
              className="category-card animate-fade-in"
            >
              {/* IMAGE */}
              <div className="category-image">
                {material.image ? (
                  <img
                    src={getImageUrl(material)}
                    alt={material.materialName}
                  />
                ) : (
                  <div className="category-image-placeholder">
                    <Grid size={32} />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="category-info">
                <h3 className="category-name">
                  {safeRender(material.materialName)}
                </h3>

                <p className="category-id">
                  ID: {safeRender(material._id)}
                </p>

                {material.description && (
                  <p className="category-description">
                    {safeRender(material.description)}
                  </p>
                )}

                <div className="material-status">
                  {material.status ? (
                    <span className="status-active">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  ) : (
                    <span className="status-inactive">
                      <XCircle size={14} />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="category-card-actions">
                <button
                  className="category-action-btn edit"
                  title="Edit"
                  onClick={() => handleEdit(material)}
                >
                  <Edit size={16} />
                </button>

                <button
                  className="category-action-btn delete"
                  title="Delete"
                  onClick={() =>
                    handleDelete(material._id)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {filteredMaterials.length === 0 && (
          <div className="categories-empty">
            <Grid size={48} />

            <h3>No materials found</h3>

            <p>
              Try adjusting your search or add a new
              material.
            </p>
          </div>
        )}
      </div>

      {/* =========================
          ADD MATERIAL MODAL
      ========================= */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* HEADER */}
            <div className="modal-header">
              <h3>Add Material</h3>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* MATERIAL NAME */}
              <div className="form-group">
                <label>Material Name</label>

                <select
                  name="materialName"
                  value={addFormData.materialName}
                  onChange={handleAddChange}
                >
                  {MATERIAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE */}
              <div className="form-group">
                <label>Image URL / Base64</label>

                <input
                  type="text"
                  name="image"
                  value={addFormData.image}
                  onChange={handleAddChange}
                  placeholder="Enter image url or base64"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  name="description"
                  value={addFormData.description}
                  onChange={handleAddChange}
                  placeholder="Enter description"
                />
              </div>

              {/* STATUS */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={addFormData.status}
                    onChange={handleAddChange}
                  />

                  Active Status
                </label>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="button cancel-btn"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="button button-primary"
                onClick={handleCreateMaterial}
              >
                <Plus size={16} />
                Create Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          EDIT MODAL
      ========================= */}
      {editingMaterial && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* HEADER */}
            <div className="modal-header">
              <h3>Edit Material</h3>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setEditingMaterial(null)
                }
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* MATERIAL NAME */}
              <div className="form-group">
                <label>Material Name</label>

                <select
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleChange}
                >
                  {MATERIAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE */}
              <div className="form-group">
                <label>Image URL / Base64</label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* STATUS */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />

                  Active Status
                </label>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="button cancel-btn"
                onClick={() =>
                  setEditingMaterial(null)
                }
              >
                Cancel
              </button>

              <button
                className="button button-primary"
                onClick={handleUpdate}
              >
                <Save size={16} />
                Update Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}