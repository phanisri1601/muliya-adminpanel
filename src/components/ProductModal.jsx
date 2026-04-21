import React from 'react';
import { X } from 'lucide-react';
import './ProductModal.css';

export default function ProductModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div className="modal-content glass-panel animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form className="product-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="e.g. Princess Cut Diamond Ring" required />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select defaultValue="Ring">
                <option>Ring</option>
                <option>Necklace</option>
                <option>Earrings</option>
                <option>Bracelet</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Material</label>
              <select defaultValue="Gold">
                <option>Gold</option>
                <option>White Gold</option>
                <option>Platinum</option>
                <option>Silver</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" placeholder="0.00" required />
            </div>
            
            <div className="form-group">
              <label>Initial Stock</label>
              <input type="number" placeholder="0" required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description & Gemstones</label>
            <textarea rows={3} placeholder="Enter product description and gemstone details (e.g. VS1 Diamond, Ruby accents)..."></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="button outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="button">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
