import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { api, endpoints, IMAGE_BASE_URL } from '../api';
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get(endpoints.inventory)
      .then((res) => {
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
        const productList = Array.isArray(normalized) ? normalized : (normalized?.products || normalized?.productList || []);
        if (isMounted) {
          setItems(productList);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        if (isMounted) {
          setItems(initialInventory);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return value.name ?? value.title ?? value.label ?? value._id ?? JSON.stringify(value);
    }
    return String(value);
  };

  const getImageUrl = (item) => {
    // Check for product_image array/field as commonly found in product APIs
    const imagePath = item.imageUrl || item.image || item.product_image || (Array.isArray(item.product_images) && item.product_images.length > 0 ? item.product_images[0] : item.product_images);
    
    // Check for images nested in an object if that's how the API returns it
    const finalPath = imagePath || (item.images && Array.isArray(item.images) && item.images.length > 0 ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url) : null);
    
    if (!finalPath) return null;
    
    // If it's already a full URL (Google Storage, etc.)
    if (typeof finalPath === 'string' && finalPath.startsWith('http')) return finalPath;
    
    // If it's a relative path, prefix with base URL
    const pathStr = String(finalPath);
    const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const name = safeRender(item.productName || item.name || item.product_name).toLowerCase();
      const id = safeRender(item._id || item.id || item.product_id).toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

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
          <input 
            type="text" 
            placeholder="Search inventory items..." 
            style={{ width: '300px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="loading-spinner">Loading products...</div>
                </td>
              </tr>
            ) : filteredItems.map((item, index) => {
              const itemId = item._id || item.id || item.product_id;
              const name = item.productName || item.name || item.product_name;
              const price = item.finalPrice || item.price || item.total_price || item.originalPrice || 0;
              const stock = item.stock?.availableStock ?? item.stock ?? item.quantity ?? item.total_stock ?? 0;
              const minAlert = item.stock?.minStockAlert ?? 5;
              const imageUrl = getImageUrl(item);
              const categoryName = (typeof item.category === 'object') ? (item.category.name || item.category.title) : item.category;

              return (
                <tr key={`${itemId}-${index}`} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <td>
                    <div className="item-details">
                      <div className="item-image-container">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={name} 
                            className="item-thumb" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentNode.classList.add('image-error');
                            }}
                          />
                        ) : (
                          <div className="item-image-placeholder"></div>
                        )}
                      </div>
                      <div>
                        <div className="item-name">{safeRender(name)}</div>
                        <div className="item-id">{safeRender(itemId)}</div>
                      </div>
                    </div>
                  </td>
                  <td>{safeRender(categoryName || '-')}</td>
                  <td>{safeRender(item.material || item.type || item.product_type || '-')}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-main)' }}>₹ {Number(price).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${getStockStatus(Number(stock), minAlert).replace(/ /g, '-').toLowerCase()}`}>
                      {getStockStatus(Number(stock), minAlert)}
                    </span>
                  </td>
                  <td>{stock}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button small" onClick={() => handleEditItem(item)}><Edit size={16} /></button>
                      <button className="icon-button small danger" onClick={() => handleDeleteItem(itemId)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
