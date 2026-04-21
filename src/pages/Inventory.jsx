import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import './Inventory.css';

const initialInventory = [
  { id: 'ITM-001', name: 'Princess Cut Diamond Ring', category: 'Ring', material: 'Platinum', price: '₹ 1,20,000', stock: 12, status: 'In Stock' },
  { id: 'ITM-002', name: 'Classic Gold Chain 18k', category: 'Necklace', material: 'Gold', price: '₹ 85,000', stock: 5, status: 'Low Stock' },
  { id: 'ITM-003', name: 'Sapphire Drop Earrings', category: 'Earrings', material: 'White Gold', price: '₹ 95,000', stock: 0, status: 'Out of Stock' },
  { id: 'ITM-004', name: 'Diamond Tennis Bracelet', category: 'Bracelet', material: 'Platinum', price: '₹ 2,50,000', stock: 3, status: 'Low Stock' },
  { id: 'ITM-005', name: 'Emerald Vintage Ring', category: 'Ring', material: 'Gold', price: '₹ 1,75,000', stock: 8, status: 'In Stock' },
];

export default function Inventory() {
  const [items, setItems] = useState(initialInventory);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="inventory-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="inventory-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search inventory items..." style={{ width: '300px' }} />
        </div>
        <div className="inventory-actions">
          <button className="button outline">
            <Filter size={18} />
            Filters
          </button>
          <button className="button" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add New Item
          </button>
        </div>
      </div>

      <div className="glass-panel table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item Details</th>
              <th>Category</th>
              <th>Material</th>
              <th>Price</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <td>
                  <div className="item-details">
                    <div className="item-image-placeholder"></div>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-id">{item.id}</div>
                    </div>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>{item.material}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-main)' }}>{item.price}</td>
                <td>
                  <span className={`status-badge ${item.status.replace(/ /g, '-').toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.stock}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small"><Edit size={16} /></button>
                    <button className="icon-button small danger"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
