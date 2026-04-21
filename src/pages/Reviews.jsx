import React, { useEffect, useState } from 'react';
import { Search, Star, Edit, X, Save, MessageSquare, User, ShoppingBag } from 'lucide-react';
import './Reviews.css';

const STORAGE_KEY = 'customer_reviews_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const REVIEW_STATUSES = ['Pending', 'Approved', 'Rejected'];
const VIEW_MODES = ['Public', 'Private', 'Featured'];

const initialReviews = [
  { id: '1', customer: 'Rahul Sharma', orderId: 'ORD-7821', comment: 'Average experience.', rating: 3, status: 'Approved', viewMode: 'Public', createdAt: Date.now() - 86400000 },
  { id: '2', customer: 'Priya Patel', orderId: 'ORD-7834', comment: 'Excellent quality!', rating: 5, status: 'Approved', viewMode: 'Featured', createdAt: Date.now() - 172800000 },
  { id: '3', customer: 'Amit Kumar', orderId: 'ORD-7856', comment: 'Really good product.', rating: 4, status: 'Rejected', viewMode: 'Private', createdAt: Date.now() - 259200000 },
  { id: '4', customer: 'Sunita Devi', orderId: 'ORD-7890', comment: 'Average experience.', rating: 3, status: 'Approved', viewMode: 'Public', createdAt: Date.now() - 345600000 },
  { id: '5', customer: 'Vikram Singh', orderId: 'ORD-7902', comment: 'Excellent quality!', rating: 5, status: 'Pending', viewMode: 'Public', createdAt: Date.now() - 432000000 },
  { id: '6', customer: 'Neha Gupta', orderId: 'ORD-7923', comment: 'Really good product.', rating: 4, status: 'Approved', viewMode: 'Public', createdAt: Date.now() - 518400000 },
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    status: 'Pending',
    viewMode: 'Public',
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setReviews(stored);
    } else {
      setReviews(initialReviews);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const filteredReviews = reviews.filter(review =>
    review.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingReview) {
      setReviews(prev =>
        prev.map(review =>
          review.id === editingReview.id
            ? { ...review, ...formData, updatedAt: Date.now() }
            : review
        )
      );
    }

    closeModal();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating || 0,
      comment: review.comment || '',
      status: review.status || 'Pending',
      viewMode: review.viewMode || 'Public',
    });
    setIsModalOpen(true);
  };

  const openModal = () => {
    setEditingReview(null);
    setFormData({
      rating: 0,
      comment: '',
      status: 'Pending',
      viewMode: 'Public',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const StarRating = ({ rating, interactive = false, onStarClick }) => {
    return (
      <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
            onClick={interactive ? () => onStarClick(star) : undefined}
            disabled={!interactive}
          >
            <Star size={18} fill={star <= rating ? '#ffc107' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="reviews-header">
        <h2 className="reviews-title">Customer Reviews</h2>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <div className="glass-panel reviews-panel">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReviews.map((review, index) => (
              <tr key={review.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <td>
                  <div className="review-customer">
                    <div className="customer-avatar">
                      <User size={16} />
                    </div>
                    <span className="customer-name">{review.customer}</span>
                  </div>
                </td>
                <td>
                  <div className="review-order">
                    <ShoppingBag size={14} />
                    <span>{review.orderId}</span>
                  </div>
                </td>
                <td>
                  <div className="review-comment">
                    <MessageSquare size={14} />
                    <span>{review.comment}</span>
                  </div>
                </td>
                <td>
                  <StarRating rating={review.rating} />
                </td>
                <td>
                  <span className={`review-status-badge ${review.status.toLowerCase()}`}>
                    {review.status}
                  </span>
                </td>
                <td>
                  <button className="review-edit-btn" onClick={() => handleEdit(review)}>
                    <Edit size={16} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="reviews-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <span>‹</span>
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span>›</span>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="review-modal-overlay" onClick={closeModal}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h3>Edit Review</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
              <div className="review-form-group required">
                <label>Rating</label>
                <StarRating
                  rating={formData.rating}
                  interactive={true}
                  onStarClick={handleStarClick}
                />
              </div>

              <div className="review-form-group">
                <label>Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter review comment..."
                />
              </div>

              <div className="review-form-group required">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {REVIEW_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="review-form-group required">
                <label>View Mode</label>
                <select
                  name="viewMode"
                  value={formData.viewMode}
                  onChange={handleInputChange}
                  required
                >
                  {VIEW_MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div className="review-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={18} />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
