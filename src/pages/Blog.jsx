import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, FileText, Image, Edit, Trash2, Upload, X, Save } from 'lucide-react';
import './Blog.css';

const STORAGE_KEY = 'blog_posts_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), []);
    setPosts(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (editingPost) {
      setPosts(prev =>
        prev.map(post =>
          post.id === editingPost.id
            ? { ...post, ...formData, updatedAt: Date.now() }
            : post
        )
      );
    } else {
      const newPost = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPosts(prev => [newPost, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const openModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="blog-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="blog-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button className="button" onClick={openModal}>
          <Plus size={18} />
          Create New Blog
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="glass-panel blog-empty">
          <FileText size={48} />
          <h3>No blog posts yet</h3>
          <p>Create your first blog post to get started</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Create New Blog
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-panel blog-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="glass-panel blog-card animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="blog-card-image">
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div className="blog-image-placeholder">
                    <Image size={32} />
                  </div>
                )}
              </div>
              <div className="blog-card-content">
                <h4 className="blog-card-title">{post.title}</h4>
                <p className="blog-card-description">
                  {post.description.length > 120
                    ? `${post.description.substring(0, 120)}...`
                    : post.description}
                </p>
                <div className="blog-card-meta">
                  <span className="blog-date">{formatDate(post.createdAt)}</span>
                  <div className="blog-card-actions">
                    <button className="icon-button small" onClick={() => handleEdit(post)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="icon-button small danger" onClick={() => handleDelete(post.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="blog-modal-overlay" onClick={closeModal}>
          <div className="blog-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="blog-form">
              <div className="blog-form-content">
                <div className="form-section">
                  <h4>Blog Content</h4>

                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter blog description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Blog Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />

                    {formData.image ? (
                      <div className="blog-image-preview">
                        <img src={formData.image} alt="Blog preview" />
                        <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="blog-image-upload"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={20} />
                        <span>Upload Image</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <h4>SEO Metadata</h4>

                  <div className="form-group">
                    <label htmlFor="metaTitle">Meta Title</label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Enter meta title for SEO"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="metaDescription">Meta Description</label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Enter meta description for SEO"
                      rows={2}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="metaKeywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="metaKeywords"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                </div>
              </div>

              <div className="blog-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={16} />
                  {editingPost ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
