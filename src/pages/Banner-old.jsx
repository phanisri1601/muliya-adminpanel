import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Image as ImageIcon, Link2, Star, Trash2, Upload } from 'lucide-react';
import './Banner.css';

const STORAGE_KEY = 'website_banner_images_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Banner() {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && Array.isArray(stored.images)) {
      setImages(stored.images);
      // Set first image as active if no activeId exists
      if (stored.activeId) {
        setActiveId(stored.activeId);
      } else if (stored.images.length > 0) {
        setActiveId(stored.images[0].id);
      }
    } else {
      // Add some default banner images for testing
      const defaultBanners = [
        {
          id: 'banner-1',
          name: 'Homepage Banner 1',
          src: 'https://picsum.photos/1200/400?random=1',
          createdAt: Date.now() - 86400000,
          type: 'default'
        },
        {
          id: 'banner-2',
          name: 'Product Banner',
          src: 'https://picsum.photos/1200/400?random=2',
          createdAt: Date.now() - 86400000 * 2,
          type: 'default'
        },
        {
          id: 'banner-3',
          name: 'Special Offer Banner',
          src: 'https://picsum.photos/1200/400?random=3',
          createdAt: Date.now() - 86400000 * 3,
          type: 'default'
        }
      ];
      setImages(defaultBanners);
      setActiveId(defaultBanners[0].id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ images: defaultBanners, activeId: defaultBanners[0].id }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ images, activeId }));
  }, [images, activeId]);

  const activeImage = useMemo(() => images.find((img) => img.id === activeId) ?? null, [images, activeId]);

  const onPickFiles = async (files) => {
    const list = Array.from(files ?? []);
    if (list.length === 0) return;

    const readAsDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const newImages = await Promise.all(
      list.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        src: await readAsDataUrl(file),
        createdAt: Date.now(),
        type: 'upload',
      }))
    );

    setImages((prev) => {
      const merged = [...newImages, ...prev];
      return merged;
    });

    // Set the first newly uploaded image as active
    if (newImages.length > 0) {
      setActiveId(newImages[0].id);
    }
  };

  const onAddUrl = () => {
    const value = urlInput.trim();
    if (!value) return;

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: value,
      src: value,
      createdAt: Date.now(),
      type: 'url',
    };

    setImages((prev) => [newItem, ...prev]);
    setActiveId((prev) => prev ?? newItem.id);
    setUrlInput('');
  };

  const onDelete = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      setActiveId((current) => {
        if (current !== id) return current;
        return next[0]?.id ?? null;
      });
      return next;
    });
  };

  const onCopyActive = async () => {
    if (!activeImage?.src) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeImage.src);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = activeImage.src;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="banner-page">
      <div className="banner-header glass-panel animate-fade-in" style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="banner-header-left">
          <div className="banner-title-row">
            <ImageIcon size={20} />
            <h3 className="banner-title">Website Banner</h3>
          </div>
          <p className="banner-subtitle">Upload multiple banner images, add via URLs, and set any banner as active.</p>
        </div>

        <div className="banner-header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => onPickFiles(e.target.files)}
          />
          <button className="button" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} />
            Upload Banner Images
          </button>
        </div>
      </div>

      <div className="banner-grid">
        <div className="glass-panel banner-preview-panel animate-fade-in" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="banner-preview-head">
            <h4>Active Banner Preview</h4>
            <button className="button outline" onClick={onCopyActive} disabled={!activeImage}>
              <Copy size={18} />
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>

          <div className="banner-preview">
            {activeImage ? (
              <img src={activeImage.src} alt={activeImage.name} />
            ) : (
              <div className="banner-empty">
                <ImageIcon size={34} />
                <div>No banner selected</div>
              </div>
            )}
          </div>

          <div className="banner-active-meta">
            <div className="meta-row">
              <div className="meta-label">Active</div>
              <div className="meta-value">{activeImage?.name ?? '-'}</div>
            </div>
            <div className="meta-row">
              <div className="meta-label">Source</div>
              <div className="meta-value">{activeImage?.type ?? '-'}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel banner-library-panel animate-fade-in" style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="banner-library-head">
            <h4>Website Banners ({images.length})</h4>
            <div className="banner-url-add">
              <div className="banner-url-input">
                <Link2 size={18} />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste an image URL (https://...)"
                />
              </div>
              <button className="button outline" onClick={onAddUrl}>
                Add URL
              </button>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="banner-library-empty">
              <ImageIcon size={32} />
              <div>Add some images to start</div>
            </div>
          ) : (
            <div className="banner-thumbs">
              {images.map((img) => (
                <div key={img.id} className={`banner-thumb ${img.id === activeId ? 'active' : ''}`}>
                  <button className="banner-thumb-image" onClick={() => setActiveId(img.id)} title="Set as active">
                    <img src={img.src} alt={img.name} />
                  </button>

                  <div className="banner-thumb-info">
                    <div className="banner-thumb-name" title={img.name}>
                      {img.name}
                    </div>
                    <div className="banner-thumb-actions">
                      <button className="icon-button small" onClick={() => setActiveId(img.id)} title="Set active">
                        <Star size={16} />
                      </button>
                      <button className="icon-button small danger" onClick={() => onDelete(img.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
