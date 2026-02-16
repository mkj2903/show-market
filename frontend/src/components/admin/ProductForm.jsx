// frontend/src/components/admin/ProductForm.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Camera } from 'lucide-react';

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 't-shirts',
    subCategory: 'regular',
    gender: 'unisex',
    price: '',
    mrp: '',
    discount: 0,
    images: [],
    sizes: [],
    colors: ['Black'],
    quantity: 0,
    material: 'Cotton',
    brand: 'TV Merchandise',
    isActive: true,
    featured: false,
    dealOfDay: false,
    tags: []
  });

  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const productImages = product.images || [];
      const validImages = productImages.filter(img => 
        img && typeof img === 'string' && img.trim().length > 0
      );

      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 't-shirts',
        subCategory: product.subCategory || 'regular',
        gender: product.gender || 'unisex',
        price: product.price || '',
        mrp: product.mrp || product.price || '',
        discount: product.discount || 0,
        images: validImages.length > 0 ? validImages : [],
        sizes: product.sizes || [],
        colors: product.colors && product.colors.length > 0 ? product.colors : ['Black'],
        quantity: product.quantity || 0,
        material: product.material || 'Cotton',
        brand: product.brand || 'TV Merchandise',
        isActive: product.isActive !== false,
        featured: product.featured || false,
        dealOfDay: product.dealOfDay || false,
        tags: product.tags || []
      });
    } else {
      setFormData(prev => ({
        ...prev,
        images: []
      }));
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      alert('Valid price is required');
      return;
    }
    
    setLoading(true);
    
    // Prepare data for backend
    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || `Product description for ${formData.name}`,
      category: formData.category,
      subCategory: formData.subCategory,
      gender: formData.gender,
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price),
      discount: Number(formData.discount) || 0,
      images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/500x500.png?text=TV+Merch+Product'],
      colors: formData.colors.length > 0 ? formData.colors : ['Black'],
      sizes: formData.sizes.length > 0 ? formData.sizes : getDefaultSizes(formData.category),
      quantity: Number(formData.quantity) || 0,
      material: formData.material,
      brand: formData.brand,
      specifications: {
        material: formData.material,
        brand: formData.brand,
        weight: '',
        dimensions: '',
        washCare: 'Machine wash cold'
      },
      careInstructions: ['Machine wash cold'],
      tags: formData.tags,
      isActive: formData.isActive,
      featured: formData.featured,
      dealOfDay: formData.dealOfDay,
      showName: '',
      season: ''
    };

    console.log('ProductForm submitting:', productData);
    onSave(productData);
    setLoading(false);
  };

  const getDefaultSizes = (category) => {
    switch(category) {
      case 't-shirts':
      case 'hoodies':
        return ['M', 'L', 'XL'];
      default:
        return ['One Size'];
    }
  };

  const addImageUrl = () => {
    const trimmedImage = newImage.trim();
    if (!trimmedImage) {
      alert('Please enter an image URL');
      return;
    }
    
    if (!trimmedImage.startsWith('http://') && !trimmedImage.startsWith('https://')) {
      alert('Image URL must start with http:// or https://');
      return;
    }
    
    if (formData.images.includes(trimmedImage)) {
      alert('This image URL is already added');
      return;
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, trimmedImage]
    });
    setNewImage('');
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleCategoryChange = (category) => {
    const updatedFormData = {
      ...formData,
      category: category,
      subCategory: category === 't-shirts' ? 'regular' : '',
      sizes: getDefaultSizes(category)
    };

    // Set defaults based on category
    if (category === 't-shirts') {
      updatedFormData.subCategory = 'regular';
      updatedFormData.gender = 'unisex';
      updatedFormData.colors = ['Black', 'White'];
      updatedFormData.material = 'Cotton';
    } else if (category === 'mugs') {
      updatedFormData.subCategory = 'ceramic';
      updatedFormData.colors = ['White'];
      updatedFormData.material = 'Ceramic';
    } else if (category === 'hoodies') {
      updatedFormData.subCategory = 'regular';
      updatedFormData.gender = 'unisex';
      updatedFormData.colors = ['Black', 'Gray'];
      updatedFormData.material = 'Cotton Blend';
    } else if (category === 'accessories') {
      updatedFormData.colors = ['Black'];
    }

    setFormData(updatedFormData);
  };

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size'];
  const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy'];

  const getFormTitle = () => {
    return product && product._id ? 'Edit Product' : 'Add New Product';
  };

  const getSubmitButtonText = () => {
    return product && product._id ? 'Update Product' : 'Create Product';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getFormTitle()}</h2>
            <p className="text-gray-600">Fill in the product details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={loading}
                >
                  <option value="t-shirts">T-Shirts</option>
                  <option value="mugs">Coffee Mugs</option>
                  <option value="accessories">Accessories</option>
                  <option value="combos">Combos</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="caps">Caps</option>
                  <option value="posters">Posters</option>
                  <option value="photo-frames">Photo Frames</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="TV Merchandise"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  placeholder="Cotton"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the product..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={(e) => {
                      const price = e.target.value;
                      setFormData({
                        ...formData,
                        price: price,
                        mrp: price || formData.mrp,
                        discount: price && formData.mrp ? 
                          Math.round((1 - price/formData.mrp) * 100) : 0
                      });
                    }}
                    placeholder="299"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MRP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.mrp}
                    onChange={(e) => {
                      const mrp = e.target.value;
                      setFormData({
                        ...formData,
                        mrp: mrp,
                        discount: formData.price && mrp ? 
                          Math.round((1 - formData.price/mrp) * 100) : 0
                      });
                    }}
                    placeholder="399"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = e.target.value;
                      const mrp = formData.mrp || formData.price;
                      setFormData({
                        ...formData,
                        discount: discount,
                        price: mrp ? Math.round(mrp * (1 - discount/100)) : formData.price
                      });
                    }}
                    placeholder="0"
                    disabled={loading}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                {formData.discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Save ₹{Math.round((formData.mrp || formData.price) - formData.price)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
            <div className="space-y-3">
              {/* URL Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Image URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Enter image URL (https://example.com/image.jpg)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center disabled:bg-gray-300"
                    disabled={loading}
                  >
                    Add URL
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter direct image URL from the web
                </p>
              </div>

              {/* Image Gallery Preview */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Images ({formData.images.length})
                  </h4>
                  <p className="text-xs text-gray-500">
                    First image will be displayed as main image
                  </p>
                </div>
                
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://dummyimage.com/300x300/e5e7eb/6b7280&text=Image+Error';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="Remove image"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {index === 0 ? 'Main' : index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No images added yet</p>
                    <p className="text-sm text-gray-500">
                      Add image URLs above
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sizes and Colors */}
          {(formData.category === 't-shirts' || formData.category === 'hoodies') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      const newSizes = formData.sizes.includes(size)
                        ? formData.sizes.filter(s => s !== size)
                        : [...formData.sizes, size];
                      setFormData({...formData, sizes: newSizes});
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      formData.sizes.includes(size)
                        ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={loading}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    const newColors = formData.colors.includes(color)
                      ? formData.colors.filter(c => c !== color)
                      : [...formData.colors, color];
                    setFormData({...formData, colors: newColors});
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all flex items-center ${
                    formData.colors.includes(color)
                      ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></div>
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="50"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      disabled={loading}
                    />
                    <label htmlFor="featured" className="ml-3 text-sm text-gray-700 font-medium">
                      Featured Product
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      disabled={loading}
                    />
                    <label htmlFor="active" className="ml-3 text-sm text-gray-700 font-medium">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dealOfDay"
                    className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    checked={formData.dealOfDay}
                    onChange={(e) => setFormData({...formData, dealOfDay: e.target.checked})}
                    disabled={loading}
                  />
                  <label htmlFor="dealOfDay" className="ml-3 text-sm text-gray-700 font-medium">
                    Deal of the Day
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                getSubmitButtonText()
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;