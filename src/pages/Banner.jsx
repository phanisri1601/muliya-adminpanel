import React, { useState, useEffect } from 'react';
import { Copy, Image as ImageIcon, Link2, Star, Trash2, Upload } from 'lucide-react';
import './Banner.css';

const STORAGE_KEY = 'website_banners_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Banner() {
  const fileInputRef = React.useRef(null);
  const [banners, setBanners] = useState([]);
  const [activeBannerId, setActiveBannerId] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), { banners: [], activeBannerId: null });
    if (stored && stored.banners && stored.banners.length > 0) {
      setBanners(stored.banners);
      setActiveBannerId(stored.activeBannerId || stored.banners[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ banners, activeBannerId }));
  }, [banners, activeBannerId]);

  const activeBanner = banners.find(banner => banner.id === activeBannerId);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newBanners = Array.from(files).map(file => ({
      id: `banner-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      src: URL.createObjectURL(file),
      createdAt: Date.now(),
      type: 'upload'
    }));

    setBanners(prev => [...newBanners, ...prev]);
    if (newBanners.length > 0 && !activeBannerId) {
      setActiveBannerId(newBanners[0].id);
    }
  };

  const handleUrlAdd = () => {
    const url = urlInput.trim();
    if (!url) return;

    const newBanner = {
      id: `banner-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: url.split('/').pop() || 'URL Banner',
      src: url,
      createdAt: Date.now(),
      type: 'url'
    };

    setBanners(prev => [newBanner, ...prev]);
    if (!activeBannerId) {
      setActiveBannerId(newBanner.id);
    }
    setUrlInput('');
  };

  const handleDeleteBanner = (bannerId) => {
    setBanners(prev => prev.filter(banner => banner.id !== bannerId));
    if (activeBannerId === bannerId) {
      setActiveBannerId(banners.length > 1 ? banners[0].id : null);
    }
  };

  const handleSetActiveBanner = (bannerId) => {
    setActiveBannerId(bannerId);
  };

  const handleCopyUrl = async () => {
    if (!activeBanner?.src) return;
    
    try {
      await navigator.clipboard.writeText(activeBanner.src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="banner-container">
      <div className="banner-header">
        <div className="banner-title">
          <ImageIcon size={24} />
          <h2>Website Banners</h2>
        </div>
        <div className="banner-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} />
            Upload Banners
          </button>
        </div>
      </div>

      <div className="banner-content">
        <div className="banner-preview-section">
          <h3>Active Banner Preview</h3>
          <div className="banner-preview">
            {activeBanner ? (
              <img src={activeBanner.src} alt={activeBanner.name} />
            ) : (
              <div className="no-banner">
                <ImageIcon size={48} />
                <p>No active banner selected</p>
              </div>
            )}
          </div>
          {activeBanner && (
            <div className="banner-info">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{activeBanner.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{activeBanner.type}</span>
              </div>
              <button className="btn-secondary" onClick={handleCopyUrl}>
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          )}
        </div>

        <div className="banner-library-section">
          <div className="section-header">
            <h3>Banner Library ({banners.length})</h3>
            <div className="url-input-group">
              <div className="input-wrapper">
                <Link2 size={18} />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter image URL..."
                />
              </div>
              <button className="btn-secondary" onClick={handleUrlAdd}>
                Add URL
              </button>
            </div>
          </div>

          <div className="banner-grid">
            {banners.length === 0 ? (
              <div className="empty-state">
                <ImageIcon size={64} />
                <h3>No banners uploaded</h3>
                <p>Upload banner images or add URLs to get started</p>
              </div>
            ) : (
              banners.map(banner => (
                <div 
                  key={banner.id} 
                  className={`banner-card ${banner.id === activeBannerId ? 'active' : ''}`}
                >
                  <div className="banner-image-wrapper">
                    <img src={banner.src} alt={banner.name} />
                    <div className="banner-overlay">
                      <button 
                        className="btn-icon"
                        onClick={() => handleSetActiveBanner(banner.id)}
                        title="Set as active banner"
                      >
                        <Star size={20} />
                      </button>
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleDeleteBanner(banner.id)}
                        title="Delete banner"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="banner-details">
                    <h4>{banner.name}</h4>
                    <p>Added: {new Date(banner.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
