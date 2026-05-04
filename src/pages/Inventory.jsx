import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import './Inventory.css';

const initialInventory = [
  { id: 'ITM-001', productName: 'Princess Cut Diamond Ring', category: 'Ring', material: 'Platinum', finalPrice: 120000, stock: { availableStock: 12 }, status: 'In Stock' },
  { id: 'ITM-002', productName: 'Classic Gold Chain 18k', category: 'Necklace', material: 'Gold', finalPrice: 85000, stock: { availableStock: 5 }, status: 'Low Stock' },
  { id: 'ITM-003', productName: 'Sapphire Drop Earrings', category: 'Earrings', material: 'White Gold', finalPrice: 95000, stock: { availableStock: 0 }, status: 'Out of Stock' },
  { id: 'ITM-004', productName: 'Diamond Tennis Bracelet', category: 'Bracelet', material: 'Platinum', finalPrice: 250000, stock: { availableStock: 3 }, status: 'Low Stock' },
  { id: 'ITM-005', productName: 'Emerald Vintage Ring', category: 'Ring', material: 'Gold', finalPrice: 175000, stock: { availableStock: 8 }, status: 'In Stock' },
];

export default function Inventory() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('inventoryItems');
    return saved ? JSON.parse(saved) : initialInventory;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const handleSaveProduct = (productData) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...productData, 
              id: editingItem.id,
              status: productData.stock.availableStock > 0 ? (productData.stock.availableStock <= productData.stock.minStockAlert ? 'Low Stock' : 'In Stock') : 'Out of Stock'
            }
          : item
      ));
    } else {
      // Create new item
      const newProduct = {
        ...productData,
        id: `ITM-${String(items.length + 1).padStart(3, '0')}`,
        status: productData.stock.availableStock > 0 ? (productData.stock.availableStock <= productData.stock.minStockAlert ? 'Low Stock' : 'In Stock') : 'Out of Stock'
      };
      setItems([...items, newProduct]);
    }
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const getStockStatus = (stock, minAlert) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minAlert) return 'Low Stock';
    return 'In Stock';
  };

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
                      <div className="item-name">{item.productName}</div>
                      <div className="item-id">{item.id}</div>
                    </div>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>{item.material}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-main)' }}>₹ {item.finalPrice?.toLocaleString('en-IN') || 0}</td>
                <td>
                  <span className={`status-badge ${getStockStatus(item.stock?.availableStock, item.stock?.minStockAlert).replace(/ /g, '-').toLowerCase()}`}>
                    {getStockStatus(item.stock?.availableStock, item.stock?.minStockAlert)}
                  </span>
                </td>
                <td>{item.stock?.availableStock || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button small" onClick={() => handleEditItem(item)}><Edit size={16} /></button>
                    <button className="icon-button small danger" onClick={() => handleDeleteItem(item.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }} 
        onSave={handleSaveProduct}
        editingItem={editingItem}
      />
    </div>
  );
}
