import React, { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import './ProductModal.css';

export default function ProductModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    productName: '',
    category: 'Ring',
    subCategory: '',
    brand: '',
    sku: '',
    material: 'Gold',
    goldPurity: '22K',
    goldWeight: 0,
    netWeight: 0,
    grossWeight: 0,
    wastagePercent: 0,
    makingCharges: 0,
    hallmark: true,
    bisHallmarkNumber: '',
    goldRate: 0,
    stoneCharges: 0,
    gstPercent: 3,
    finalPrice: 0,
    gemstones: [{ stoneType: '', count: 0, carat: 0, quality: '', certification: '' }],
    stock: { initialStock: 0, availableStock: 0, minStockAlert: 0 },
    attributes: { size: '', gender: 'Unisex', occasion: '', color: 'Yellow Gold', finish: '' },
    media: { images: [], video: '', view360: '' },
    description: '',
    features: '',
    careInstructions: '',
    shipping: { weight: 0, returnPolicy: '', warranty: '' }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleGemstoneChange = (index, field, value) => {
    const newGemstones = [...formData.gemstones];
    newGemstones[index] = { ...newGemstones[index], [field]: value };
    setFormData(prev => ({ ...prev, gemstones: newGemstones }));
  };

  const addGemstone = () => {
    setFormData(prev => ({
      ...prev,
      gemstones: [...prev.gemstones, { stoneType: '', count: 0, carat: 0, quality: '', certification: '' }]
    }));
  };

  const removeGemstone = (index) => {
    setFormData(prev => ({
      ...prev,
      gemstones: prev.gemstones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div className="modal-content glass-panel animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-form-content">
            <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="e.g. Princess Cut Diamond Ring" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Ring</option>
                  <option>Necklace</option>
                  <option>Earrings</option>
                  <option>Bracelet</option>
                  <option>Pendant</option>
                  <option>Bangles</option>
                  <option>Anklet</option>
                  <option>Chain</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sub Category</label>
                <input type="text" name="subCategory" value={formData.subCategory} onChange={handleInputChange} placeholder="e.g. Solitaire" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Tanishq" />
              </div>

              <div className="form-group">
                <label>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g. RING-001" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Gold Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Material *</label>
                <select name="material" value={formData.material} onChange={handleInputChange}>
                  <option>Gold</option>
                  <option>White Gold</option>
                  <option>Rose Gold</option>
                  <option>Platinum</option>
                  <option>Silver</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gold Purity</label>
                <select name="goldPurity" value={formData.goldPurity} onChange={handleInputChange}>
                  <option>24K</option>
                  <option>22K</option>
                  <option>18K</option>
                  <option>14K</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gold Weight (grams)</label>
                <input type="number" name="goldWeight" value={formData.goldWeight} onChange={handleInputChange} placeholder="0" step="0.01" />
              </div>

              <div className="form-group">
                <label>Net Weight (grams)</label>
                <input type="number" name="netWeight" value={formData.netWeight} onChange={handleInputChange} placeholder="0" step="0.01" />
              </div>

              <div className="form-group">
                <label>Gross Weight (grams)</label>
                <input type="number" name="grossWeight" value={formData.grossWeight} onChange={handleInputChange} placeholder="0" step="0.01" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Wastage (%)</label>
                <input type="number" name="wastagePercent" value={formData.wastagePercent} onChange={handleInputChange} placeholder="0" step="0.1" />
              </div>

              <div className="form-group">
                <label>Making Charges (₹)</label>
                <input type="number" name="makingCharges" value={formData.makingCharges} onChange={handleInputChange} placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gold Rate (₹/gram)</label>
                <input type="number" name="goldRate" value={formData.goldRate} onChange={handleInputChange} placeholder="0" />
              </div>

              <div className="form-group">
                <label>Stone Charges (₹)</label>
                <input type="number" name="stoneCharges" value={formData.stoneCharges} onChange={handleInputChange} placeholder="0" />
              </div>

              <div className="form-group">
                <label>GST (%)</label>
                <input type="number" name="gstPercent" value={formData.gstPercent} onChange={handleInputChange} placeholder="3" step="0.1" />
              </div>
            </div>

            <div className="form-group">
              <label>Final Price (₹)</label>
              <input type="number" name="finalPrice" value={formData.finalPrice} onChange={handleInputChange} placeholder="0" />
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="hallmark" checked={formData.hallmark} onChange={handleInputChange} />
                  <span>Hallmarked</span>
                </label>
              </div>

              <div className="form-group">
                <label>BIS Hallmark Number</label>
                <input type="text" name="bisHallmarkNumber" value={formData.bisHallmarkNumber} onChange={handleInputChange} placeholder="e.g. HUID-123456" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Gemstones</h4>
            {formData.gemstones.map((gem, index) => (
              <div key={index} className="gemstone-card">
                <div className="gemstone-header">
                  <span>Gemstone {index + 1}</span>
                  {formData.gemstones.length > 1 && (
                    <button type="button" className="icon-button small danger" onClick={() => removeGemstone(index)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Stone Type</label>
                    <select value={gem.stoneType} onChange={(e) => handleGemstoneChange(index, 'stoneType', e.target.value)}>
                      <option value="">Select</option>
                      <option>Diamond</option>
                      <option>Ruby</option>
                      <option>Emerald</option>
                      <option>Sapphire</option>
                      <option>Pearl</option>
                      <option>Topaz</option>
                      <option>Amethyst</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Count</label>
                    <input type="number" value={gem.count} onChange={(e) => handleGemstoneChange(index, 'count', parseFloat(e.target.value) || 0)} placeholder="0" />
                  </div>

                  <div className="form-group">
                    <label>Carat</label>
                    <input type="number" value={gem.carat} onChange={(e) => handleGemstoneChange(index, 'carat', parseFloat(e.target.value) || 0)} placeholder="0" step="0.01" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quality</label>
                    <select value={gem.quality} onChange={(e) => handleGemstoneChange(index, 'quality', e.target.value)}>
                      <option value="">Select</option>
                      <option>Flawless (FL)</option>
                      <option>Internally Flawless (IF)</option>
                      <option>Very Very Slightly Included (VVS)</option>
                      <option>Very Slightly Included (VS)</option>
                      <option>Slightly Included (SI)</option>
                      <option>Included (I)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Certification</label>
                    <input type="text" value={gem.certification} onChange={(e) => handleGemstoneChange(index, 'certification', e.target.value)} placeholder="e.g. GIA, IGI" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="button outline small" onClick={addGemstone}>
              <Plus size={14} /> Add Gemstone
            </button>
          </div>

          <div className="form-section">
            <h4>Stock Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Initial Stock</label>
                <input type="number" value={formData.stock.initialStock} onChange={(e) => handleNestedChange('stock', 'initialStock', parseInt(e.target.value) || 0)} placeholder="0" />
              </div>

              <div className="form-group">
                <label>Available Stock</label>
                <input type="number" value={formData.stock.availableStock} onChange={(e) => handleNestedChange('stock', 'availableStock', parseInt(e.target.value) || 0)} placeholder="0" />
              </div>

              <div className="form-group">
                <label>Min Stock Alert</label>
                <input type="number" value={formData.stock.minStockAlert} onChange={(e) => handleNestedChange('stock', 'minStockAlert', parseInt(e.target.value) || 0)} placeholder="0" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Attributes</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Size</label>
                <input type="text" value={formData.attributes.size} onChange={(e) => handleNestedChange('attributes', 'size', e.target.value)} placeholder="e.g. 16, 18" />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select value={formData.attributes.gender} onChange={(e) => handleNestedChange('attributes', 'gender', e.target.value)}>
                  <option>Unisex</option>
                  <option>Women</option>
                  <option>Men</option>
                  <option>Kids</option>
                </select>
              </div>

              <div className="form-group">
                <label>Color</label>
                <select value={formData.attributes.color} onChange={(e) => handleNestedChange('attributes', 'color', e.target.value)}>
                  <option>Yellow Gold</option>
                  <option>White Gold</option>
                  <option>Rose Gold</option>
                  <option>Platinum</option>
                  <option>Silver</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occasion</label>
                <select value={formData.attributes.occasion} onChange={(e) => handleNestedChange('attributes', 'occasion', e.target.value)}>
                  <option value="">Select</option>
                  <option>Daily Wear</option>
                  <option>Wedding</option>
                  <option>Engagement</option>
                  <option>Anniversary</option>
                  <option>Festive</option>
                  <option>Party</option>
                </select>
              </div>

              <div className="form-group">
                <label>Finish</label>
                <input type="text" value={formData.attributes.finish} onChange={(e) => handleNestedChange('attributes', 'finish', e.target.value)} placeholder="e.g. Matte, Glossy" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Media</h4>
            <div className="form-group">
              <label>Product Images</label>
              <div className="image-upload-area">
                <button type="button" className="upload-btn">
                  <Upload size={20} />
                  <span>Upload Images</span>
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Video URL</label>
                <input type="text" value={formData.media.video} onChange={(e) => handleNestedChange('media', 'video', e.target.value)} placeholder="https://..." />
              </div>

              <div className="form-group">
                <label>360° View URL</label>
                <input type="text" value={formData.media.view360} onChange={(e) => handleNestedChange('media', 'view360', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Description & Details</h4>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Enter product description..."></textarea>
            </div>

            <div className="form-group">
              <label>Features</label>
              <textarea name="features" value={formData.features} onChange={handleInputChange} rows={2} placeholder="Enter key features..."></textarea>
            </div>

            <div className="form-group">
              <label>Care Instructions</label>
              <textarea name="careInstructions" value={formData.careInstructions} onChange={handleInputChange} rows={2} placeholder="Enter care instructions..."></textarea>
            </div>
          </div>

          <div className="form-section">
            <h4>Shipping</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Weight (grams)</label>
                <input type="number" value={formData.shipping.weight} onChange={(e) => handleNestedChange('shipping', 'weight', parseFloat(e.target.value) || 0)} placeholder="0" step="0.01" />
              </div>

              <div className="form-group">
                <label>Return Policy</label>
                <select value={formData.shipping.returnPolicy} onChange={(e) => handleNestedChange('shipping', 'returnPolicy', e.target.value)}>
                  <option value="">Select</option>
                  <option>7 Days</option>
                  <option>15 Days</option>
                  <option>30 Days</option>
                  <option>No Returns</option>
                </select>
              </div>

              <div className="form-group">
                <label>Warranty</label>
                <input type="text" value={formData.shipping.warranty} onChange={(e) => handleNestedChange('shipping', 'warranty', e.target.value)} placeholder="e.g. 1 Year" />
              </div>
            </div>
          </div>
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
