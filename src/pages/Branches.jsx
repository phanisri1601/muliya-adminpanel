import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Phone, Clock3, CalendarDays, CalendarRange, CalendarClock, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import './Branches.css';

const initialBranches = [
  { id: 1, name: 'Muliya Gold & Diamonds Puttur', address: 'Main Road, Puttur, Karnataka - 574201', phone: '+91 824 1234567', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Gold+%26+Diamonds/@12.7606186,75.2016102,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4bd829d105b03:0x5e6430e13609505b!8m2!3d12.7606186!4d75.2016102!16s%2Fg%2F11ys_j146!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.7606186,75.2016102&zoom=15&size=300x200&markers=color:red%7C12.7606186,75.2016102' },
  { id: 2, name: 'Muliya Gold & Diamonds Belthangady', address: 'Market Road, Belthangady, Karnataka - 574214', phone: '+91 824 2345678', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Gold+%26+Diamonds/@12.988843,75.2754389,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4b72b3a798557:0xe086ea0182fe1316!8m2!3d12.9888378!4d75.2780138!16s%2Fg%2F11g0hxzjvc!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTIwNy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.988843,75.2754389&zoom=15&size=300x200&markers=color:red%7C12.988843,75.2754389' },
  { id: 3, name: 'Muliya Gold & Diamonds Bengaluru', address: 'MG Road, Bengaluru, Karnataka - 560001', phone: '+91 80 3456789', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Jewels+%7BShyama+Jewels+Puttur+LLP+(BANGALORE)%7D/@12.974814,77.614599,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae1688af2541a9:0x2a45c41756e82414!8m2!3d12.974814!4d77.614599!16s%2Fg%2F11cnwcwkjn!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.974814,77.614599&zoom=15&size=300x200&markers=color:red%7C12.974814,77.614599' },
  { id: 4, name: 'Muliya Gold & Diamonds Madikeri', address: 'Fort Road, Madikeri, Karnataka - 571201', phone: '+91 827 4567890', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Gold+%26+Diamonds/@12.4256107,75.7377837,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba500736aaaaa95:0x51e46bfb4f1ce4bf!8m2!3d12.4256107!4d75.7377837!16s%2Fg%2F11f4l9mgyv!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.4256107,75.7377837&zoom=15&size=300x200&markers=color:red%7C12.4256107,75.7377837' },
  { id: 5, name: 'Muliya Gold & Diamonds Gonikoppal', address: 'Main Street, Gonikoppal, Karnataka - 571213', phone: '+91 827 5678901', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Gold+%26+Diamonds/@12.1843189,75.9243173,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba5ba3e349a75b5:0x273f847b5ae746d2!8m2!3d12.1843189!4d75.9243173!16s%2Fg%2F11c3k2tdsf!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.1843189,75.9243173&zoom=15&size=300x200&markers=color:red%7C12.1843189,75.9243173' },
  { id: 6, name: 'Muliya Gold & Diamonds Madikeri (Somwarpet)', address: 'Somwarpet Road, Madikeri, Karnataka - 571201', phone: '+91 827 6789012', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Silveriya+Somwarpet/@12.5985656,75.8503478,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba505078bbd78c1:0xbaebbe311fb3fc77!8m2!3d12.5985656!4d75.8503478!16s%2Fg%2F11vkp0rqhx!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.5985656,75.8503478&zoom=15&size=300x200&markers=color:red%7C12.5985656,75.8503478' },
  { id: 7, name: 'Shyama Jewels Sourcing LLP', address: 'Industrial Area, Puttur, Karnataka - 574201', phone: '+91 824 7890123', googleMapsUrl: 'https://www.google.com/maps/place/Shyama+Jewels+LLP+(Head+office)/data=!4m2!3m1!1s0x0:0x14a7f799eea82db5?sa=X&ved=1t:2428&ictx=111', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.7606186,75.2016102&zoom=15&size=300x200&markers=color:red%7C12.7606186,75.2016102' },
  { id: 8, name: 'Shyama Jewels Puttur LLP (NDY)', address: 'NDY Road, Puttur, Karnataka - 574201', phone: '+91 824 8901234', googleMapsUrl: 'https://www.google.com/maps/place/Muliya+Silveriya+Nelyadi+(Muliya+Jewels)/@12.8363064,75.4021547,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4c18c45c5b9a5:0x655fe930c1351f21!8m2!3d12.8363012!4d75.4047296!16s%2Fg%2F11t_yzqw6h!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=12.8363064,75.4021547&zoom=15&size=300x200&markers=color:red%7C12.8363064,75.4021547' },
  { id: 9, name: 'Muliya Gold & Diamonds Udupi', address: 'Car Street, Udupi, Karnataka - 576101', phone: '+91 820 2543210', googleMapsUrl: 'https://www.google.com/maps/place/Udupi,+Karnataka/@13.3409205,74.7421425,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba5c7b0b4f0b5d:0x6f56c5c9e4b2c3!8m2!3d13.3409205!4d74.7421425!16s%2Fg%2F11v6w7k3f!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D', image: 'https://maps.googleapis.com/maps/api/staticmap?center=13.3409205,74.7421425&zoom=15&size=300x200&markers=color:red%7C13.3409205,74.7421425' },
];

const orderRateCards = [
  { label: 'Yesterday', value: '128', icon: Clock3 },
  { label: 'Today', value: '154', icon: CalendarDays },
  { label: 'Monthly', value: '4,120', icon: CalendarRange },
  { label: 'Yearly', value: '49,550', icon: CalendarClock },
];

export default function Branches() {
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('branches');
    return saved ? JSON.parse(saved) : initialBranches;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    googleMapsUrl: '',
    image: ''
  });

  useEffect(() => {
    localStorage.setItem('branches', JSON.stringify(branches));
  }, [branches]);

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        googleMapsUrl: branch.googleMapsUrl,
        image: branch.image
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      setBranches(branches.map(branch => branch.id === editingBranch.id ? { ...formData, id: branch.id } : branch));
    } else {
      setBranches([...branches, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="branches-section">
      <div className="branches-header">
        <h3 className="branches-title">Branches</h3>
        <button className="button" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Branch
        </button>
      </div>

      <div className="branches-list">
        {branches.map((branch, branchIndex) => (
          <div
            className="glass-panel branch-block animate-fade-in"
            style={{ animationDelay: `${0.15 + branchIndex * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            key={branch.id}
          >
            <div className="branch-header">
              <div className="branch-image-container">
                {branch.image ? (
                  <img src={branch.image} alt={branch.name} className="branch-image" />
                ) : (
                  <div className="branch-image-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="branch-info">
                <h4 className="branch-name">{branch.name}</h4>
                <div className="branch-details">
                  <div className="branch-detail-item">
                    <MapPin size={16} />
                    <span>{branch.address}</span>
                  </div>
                  <div className="branch-detail-item">
                    <Phone size={16} />
                    <span>{branch.phone}</span>
                  </div>
                </div>
              </div>
              <div className="branch-actions">
                {branch.googleMapsUrl && (
                  <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="icon-button small" title="Get Directions">
                    <MapPin size={16} />
                  </a>
                )}
                <button className="icon-button small" onClick={() => handleOpenModal(branch)} title="Edit">
                  <Edit size={16} />
                </button>
                <button className="icon-button small danger" onClick={() => handleDelete(branch.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="branch-metrics-grid">
              {orderRateCards.map((rateCard) => (
                <div className="metric-card branch-metric-card" key={`${branch.id}-${rateCard.label}`}>
                  <div className="metric-header">
                    <h5 className="metric-title">Order Rate - {rateCard.label}</h5>
                    <div className="metric-icon">
                      <rateCard.icon size={18} />
                    </div>
                  </div>

                  <div className="metric-content">
                    <div className="metric-value">{rateCard.value}</div>
                    <div className="metric-change positive">Updated live</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form className="branch-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Branch Image</label>
                <div className="image-upload">
                  {formData.image ? (
                    <div className="image-preview">
                      <img src={formData.image} alt="Branch" />
                      <button type="button" className="remove-image" onClick={() => setFormData({ ...formData, image: '' })}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <ImageIcon size={32} />
                      <span>Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Branch Name *</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter branch name" required />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter branch address" rows={3} required />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>

              <div className="form-group">
                <label>Google Maps URL</label>
                <div className="input-with-button">
                  <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })} placeholder="https://maps.google.com/?q=location" />
                  <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="input-button" title="Open Google Maps">
                    <MapPin size={16} />
                  </a>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="button outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="button">{editingBranch ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
