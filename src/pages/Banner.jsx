import React, { useState, useEffect } from 'react';
import { Copy, Image as ImageIcon, Link2, Star, Trash2, Upload } from 'lucide-react';
import { api, endpoints, IMAGE_BASE_URL } from '../api';
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
  const [loading, setLoading] = useState(true);
  const [activeBannerId, setActiveBannerId] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get(endpoints.banner)
      .then((res) => {
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
        const bannerList = Array.isArray(normalized) ? normalized : (normalized?.bannerlist || normalized?.banners || []);
        if (isMounted) {
          setBanners(bannerList);
          if (bannerList.length > 0) {
            setActiveBannerId(bannerList[0]._id || bannerList[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch banners:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getImageUrl = (banner) => {
    const imagePath = banner.imageUrl || banner.image || banner.src || banner.banner_image;
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const activeBanner = banners.find(banner => (banner._id || banner.id) === activeBannerId);

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
              <img src={getImageUrl(activeBanner)} alt={activeBanner.name || activeBanner.title} />
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
                <span className="info-value">{activeBanner.name || activeBanner.title || 'Untitled'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{activeBanner.type || 'System'}</span>
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
            {/* URL input group hidden for dynamic API view unless needed */}
          </div>

          <div className="banner-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">Loading banners...</div>
              </div>
            ) : banners.length === 0 ? (
              <div className="empty-state">
                <ImageIcon size={64} />
                <h3>No banners available</h3>
              </div>
            ) : (
              banners.map(banner => {
                const bId = banner._id || banner.id;
                return (
                  <div 
                    key={bId} 
                    className={`banner-card ${bId === activeBannerId ? 'active' : ''}`}
                  >
                    <div className="banner-image-wrapper">
                      <img src={getImageUrl(banner)} alt={banner.name || banner.title} />
                      <div className="banner-overlay">
                        <button 
                          className="btn-icon"
                          onClick={() => handleSetActiveBanner(bId)}
                          title="Set as active banner"
                        >
                          <Star size={20} />
                        </button>
                        <button 
                          className="btn-icon btn-danger"
                          onClick={() => handleDeleteBanner(bId)}
                          title="Delete banner"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="banner-details">
                      <h4>{banner.name || banner.title || 'Untitled'}</h4>
                      {banner.createdAt && <p>Added: {new Date(banner.createdAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
