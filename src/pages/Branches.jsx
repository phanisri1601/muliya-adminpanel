import React, { useEffect, useState, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, MapPin, Phone, X, Image as ImageIcon
} from 'lucide-react';
import { api, endpoints } from '../api';
import './Branches.css';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    googleMapsUrl: '',
    image: ''
  });

  // ✅ FETCH BRANCHES
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoints.branches);

      const normalized =
        res?.data ?? res?.Data ?? res?.result ?? res?.branchList ?? res;

      setBranches(Array.isArray(normalized) ? normalized : []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
      setLoading(false);
    }
  };

  // ✅ SEARCH FILTER
  const filteredBranches = useMemo(() => {
    return branches.filter(branch => {
      const name = branch.name?.toLowerCase() || '';
      const address = branch.address?.toLowerCase() || '';
      return (
        name.includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
    });
  }, [branches, searchTerm]);

  // ✅ OPEN MODAL
  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData(branch);
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        googleMapsUrl: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBranch) {
        await api.put(`${endpoints.branchescreate}/${editingBranch._id}`, formData);
      } else {
        await api.post(endpoints.branches, formData);
      }

      fetchBranches();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving branch:', err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoints.branches}/${id}`);
      fetchBranches();
    } catch (err) {
      console.error('Error deleting branch:', err);
    }
  };

  // ✅ IMAGE UPLOAD (BASE64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="branches-section">
        <div className="loading-spinner">Loading branches...</div>
      </div>
    );
  }

  return (
    <section className="branches-section">

      {/* HEADER */}
      <div className="branches-header">
        <h3>Branches</h3>

        <div className="branches-actions">
          <div className="search-bar">
            <Search size={18} />
            <input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="button" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Branch
          </button>
        </div>
      </div>

      {/* LIST */}
    <div className="branches-list">
  {filteredBranches.map((branch) => (
    <div className="branch-block" key={branch._id}>

      <div className="branch-header">

        {/* IMAGE */}
        <div className="branch-image-container">
          {branch.image ? (
            <img src={branch.image} alt="" className="branch-image" />
          ) : (
            <div className="branch-image-placeholder">
              <ImageIcon size={30} />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="branch-info">
          <h4 className="branch-name">{branch.name}</h4>

          <div className="branch-details">
            <div className="branch-detail-item">
              <MapPin size={14} /> {branch.address}
            </div>
            <div className="branch-detail-item">
              <Phone size={14} /> {branch.phone}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="branch-actions">
          {branch.googleMapsUrl && (
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              <MapPin size={14} />
            </a>
          )}

          <button
            className="button"
            onClick={() => handleOpenModal(branch)}
          >
            <Edit size={14} />
          </button>

          <button
            className="button"
            onClick={() => handleDelete(branch._id)}
          >
            <Trash2 size={14} />
          </button>
        </div>

      </div>

      {/* MAP */}
      {branch.googleMapsUrl && (
        <div style={{ marginTop: "10px" }}>
          <iframe
            src={`${branch.googleMapsUrl}&output=embed`}
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "10px" }}
            loading="lazy"
            title="map"
          />
        </div>
      )}

    </div>
  ))}
</div>

      {/* EMPTY */}
      {filteredBranches.length === 0 && (
        <div className="empty">
          <h3>No branches found</h3>
        </div>
      )}

      {/* MODAL */}
     {isModalOpen && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      <div className="modal-header">
        <h3>{editingBranch ? 'Edit Branch' : 'Add Branch'}</h3>
        <button onClick={handleCloseModal}>
          <X size={18} />
        </button>
      </div>

      <form className="branch-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Name</label>
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Google Maps</label>
          <div className="input-with-button">
            <input
              value={formData.googleMapsUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  googleMapsUrl: e.target.value,
                })
              }
            />
            {formData.googleMapsUrl && (
              <a
                href={formData.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="input-button"
              >
                <MapPin size={16} />
              </a>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <label>Image</label>

          <div className="image-upload">
            {formData.image ? (
              <div className="image-preview">
                <img src={formData.image} alt="" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() =>
                    setFormData({ ...formData, image: '' })
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="upload-placeholder">
                <ImageIcon size={24} />
                <span>Upload Image</span>
                <input type="file" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="submit" className="button button-primary">
            {editingBranch ? 'Update' : 'Save'}
          </button>
        </div>

      </form>
    </div>
  </div>
)}

    </section>
  );
}