import React, { useEffect, useState, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, MapPin, Phone, X, Image as ImageIcon
} from 'lucide-react';
import { api, endpoints } from '../api';
import './Branches.css';

function getGoogleMapsEmbedSrc(branch) {
  const rawUrl = String(branch?.googleMapsUrl || '').trim();
  const fallbackQuery = String(branch?.address || branch?.name || '').trim();

  if (!rawUrl) {
    return fallbackQuery
      ? `https://www.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&output=embed`
      : '';
  }

  if (/\/maps\/embed/i.test(rawUrl) || /[?&]output=embed/i.test(rawUrl)) {
    return rawUrl;
  }

  try {
    const parsed = new URL(rawUrl);
    const pathname = parsed.pathname.toLowerCase();

    if (pathname.includes('/maps')) {
      const query =
        parsed.searchParams.get('q') ||
        parsed.searchParams.get('query') ||
        parsed.searchParams.get('destination') ||
        fallbackQuery ||
        '';

      return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
  } catch {
    // Fall back to a searchable embed URL below.
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(fallbackQuery || rawUrl)}&output=embed`;
}

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

  const getBranchId = (branch) =>
    branch?._id ??
    branch?.id ??
    branch?.branchId ??
    branch?.branch_id ??
    branch?.BranchId ??
    null;

  // ✅ FETCH BRANCHES
  async function fetchBranches() {
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
  }

  useEffect(() => {
    fetchBranches();
  }, []);

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
        const branchId = getBranchId(editingBranch);
        await api.put(`${endpoints.branchescreate}/${branchId}`, formData);
      } else {
        await api.post(endpoints.branchescreate, formData);
      }

      fetchBranches();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving branch:', err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const branchId = id ?? null;
    if (!branchId) {
      console.error('Error deleting branch: missing branch id');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this branch?');
    if (!confirmed) return;

    try {
      try {
        await api.delete(`${endpoints.branchesDelete}/${branchId}`);
      } catch {
        await api.delete(endpoints.branchesDelete, {
          body: { id: branchId, _id: branchId, branchId },
        });
      }
      await fetchBranches();
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
      <div className="branches-page-header glass-panel">
        <div className="branches-page-title">
          <p className="branches-eyebrow">Locations</p>
          <div className="branches-title-row">
            <h3>Branches</h3>
            <span className="branches-count-badge">{filteredBranches.length} total</span>
          </div>
          <p className="branches-subtitle">
            Search, update, and manage store details, contact info, and map links.
          </p>
        </div>

        <div className="branches-toolbar">
          <div className="branches-search">
            <Search size={18} className="branches-search-icon" />
            <input
              placeholder="Search by branch name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search branches"
            />
          </div>

          <button
            type="button"
            className="branches-add-button"
            onClick={() => handleOpenModal()}
          >
            <Plus size={18} />
            Add Branch
          </button>
        </div>
      </div>

      <div className="branches-list">
        {filteredBranches.map((branch, branchIndex) => {
          const branchId = getBranchId(branch);
          const embedSrc = getGoogleMapsEmbedSrc(branch);
          const isReverse = branchIndex % 2 === 1;

          return (
            <div
              className={`branch-block branch-split-card${isReverse ? ' branch-split-card-reverse' : ''}`}
              key={branchId ?? branch.name}
            >
              <div className="branch-content-panel">
                <div className="branch-header">
                  <div className="branch-image-container">
                    {branch.image ? (
                      <img src={branch.image} alt="" className="branch-image" />
                    ) : (
                      <div className="branch-image-placeholder">
                        <ImageIcon size={30} />
                      </div>
                    )}
                  </div>

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
                </div>

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
                    type="button"
                    className="button"
                    onClick={() => handleOpenModal(branch)}
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    type="button"
                    className="button"
                    onClick={() => handleDelete(branchId)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="branch-map-panel">
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title={`${branch.name} map`}
                  />
                ) : (
                  <div className="branch-map-empty">
                    <MapPin size={28} />
                    <span>No map link available</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBranches.length === 0 && (
        <div className="empty">
          <h3>No branches found</h3>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBranch ? 'Edit Branch' : 'Add Branch'}</h3>
              <button type="button" onClick={handleCloseModal}>
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
