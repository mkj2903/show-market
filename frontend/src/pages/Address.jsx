import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase, 
  Navigation, 
  CheckCircle,
  Edit,
  Trash2,
  ArrowRight,
  X,
  Save
} from 'lucide-react';

const Address = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    houseFlat: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    isDefault: false
  });

  // Load addresses from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      const savedAddresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.email}`)) || [];
      setAddresses(savedAddresses);
      
      // Set default address if exists
      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (savedAddresses.length > 0) {
        setSelectedAddressId(savedAddresses[0].id);
      }
    }
  }, [currentUser]);

  // Load user info into form
  useEffect(() => {
    if (currentUser && !isEditing) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.displayName || currentUser.email.split('@')[0],
        phone: currentUser.phoneNumber || ''
      }));
    }
  }, [currentUser, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'houseFlat', 'street', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      alert('Phone number must be at least 10 digits');
      return false;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert('Pincode must be 6 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newAddress = {
      id: isEditing ? editingId : Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    let updatedAddresses;
    
    if (isEditing) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === editingId ? newAddress : addr
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];
    }

    // If this is set as default, update all other addresses
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${currentUser.email}`, JSON.stringify(updatedAddresses));
    
    // Select this address if it's the first one or if it's default
    if (addresses.length === 0 || newAddress.isDefault) {
      setSelectedAddressId(newAddress.id);
    }

    // Reset form
    resetForm();
    alert(isEditing ? 'Address updated successfully!' : 'Address added successfully!');
  };

  const resetForm = () => {
    setFormData({
      fullName: currentUser?.displayName || currentUser?.email?.split('@')[0] || '',
      phone: currentUser?.phoneNumber || '',
      houseFlat: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'Home',
      isDefault: false
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      houseFlat: address.houseFlat,
      street: address.street,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      addressType: address.addressType,
      isDefault: address.isDefault || false
    });
    setIsEditing(true);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      localStorage.setItem(`addresses_${currentUser.email}`, JSON.stringify(updatedAddresses));
      
      // If deleted address was selected, select another one
      if (selectedAddressId === addressId && updatedAddresses.length > 0) {
        setSelectedAddressId(updatedAddresses[0].id);
      } else if (updatedAddresses.length === 0) {
        setSelectedAddressId(null);
      }
    }
  };

  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${currentUser.email}`, JSON.stringify(updatedAddresses));
    setSelectedAddressId(addressId);
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId) {
      alert('Please select an address to continue');
      return;
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    navigate('/checkout', { state: { selectedAddress } });
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Work': return <Briefcase className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to manage your addresses</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Manage Addresses
              </h1>
              <p className="text-gray-600 mt-2">
                Save your addresses for faster checkout
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                ← Back to Cart
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-md mx-auto mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                1
              </div>
              <div className="ml-2">
                <p className="font-semibold text-gray-900">Cart</p>
                <p className="text-sm text-gray-500">Review items</p>
              </div>
            </div>
            
            <div className="flex-1 h-1 mx-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                2
              </div>
              <div className="ml-2">
                <p className="font-semibold text-gray-900">Address</p>
                <p className="text-sm text-gray-500">Select delivery</p>
              </div>
            </div>
            
            <div className="flex-1 h-1 mx-6 bg-gray-200 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                3
              </div>
              <div className="ml-2">
                <p className="text-gray-500">Checkout</p>
                <p className="text-sm text-gray-400">Payment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address List */}
          <div className="lg:col-span-2">
            {/* Add New Address Button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full group mb-8"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Address</h3>
                    <p className="text-gray-600">Save your delivery address for faster checkout</p>
                  </div>
                </div>
              </button>
            )}

            {/* Address Form */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      House/Flat No. *
                    </label>
                    <input
                      type="text"
                      name="houseFlat"
                      value={formData.houseFlat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="House/Flat number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Street *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Street name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="City"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        maxLength={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Address Type
                      </label>
                      <select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-gray-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 group"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2">
                          <Save className="w-5 h-5" />
                          {isEditing ? 'Update Address' : 'Save Address'}
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Saved Addresses List */}
            {addresses.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Saved Addresses ({addresses.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        selectedAddressId === address.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      {/* Selected Indicator */}
                      {selectedAddressId === address.id && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Default Badge */}
                      {address.isDefault && (
                        <div className="absolute -top-2 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          DEFAULT
                        </div>
                      )}
                      
                      <div className="p-6">
                        {/* Address Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              selectedAddressId === address.id
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {getAddressIcon(address.addressType)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{address.fullName}</h4>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(address);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit address"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(address.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Address Details */}
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            {address.houseFlat}, {address.street}
                          </p>
                          {address.landmark && (
                            <p className="text-gray-600">Near {address.landmark}</p>
                          )}
                          <p className="text-gray-700">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        
                        {/* Address Type */}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {getAddressIcon(address.addressType)}
                            {address.addressType}
                          </span>
                          
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                              Set as default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {addresses.length === 0 && !showForm && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Navigation className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Saved Addresses</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add your first address to enable faster checkout. Your addresses will be securely saved for future orders.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Proceed to Checkout */}
          <div className="space-y-6">
            {/* Selected Address Preview */}
            {selectedAddressId && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Selected Address
                </h3>
                
                {(() => {
                  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                  if (!selectedAddress) return null;
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{selectedAddress.fullName}</p>
                          <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                        </div>
                        {selectedAddress.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      
                      <div className="text-gray-700 text-sm space-y-1">
                        <p>{selectedAddress.houseFlat}, {selectedAddress.street}</p>
                        {selectedAddress.landmark && (
                          <p className="text-gray-600">Near {selectedAddress.landmark}</p>
                        )}
                        <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          + Add another address
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Proceed to Checkout Card */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Ready to Checkout</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-600">Safe & encrypted payment</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address Saved</p>
                    <p className="text-sm text-gray-600">Your addresses are securely stored</p>
                  </div>
                </div>
              </div>
              
              {/* Proceed Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={!selectedAddressId}
                className={`w-full group ${!selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 animate-gradient-x ${
                    !selectedAddressId ? 'opacity-30' : ''
                  }`}></div>
                  <div className={`relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 ${
                    !selectedAddressId ? 'bg-gray-400' : ''
                  }`}>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
              
              {!selectedAddressId && (
                <p className="text-center text-sm text-red-600 mt-4">
                  Please select an address to continue
                </p>
              )}
              
              <p className="text-center text-sm text-gray-500 mt-6">
                You can change your address anytime from your profile
              </p>
            </div>

            {/* Security Note */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Address Security</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</div>
                  <span>Addresses are stored locally in your browser</span>
                </li>
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</div>
                  <span>Only accessible when you're logged in</span>
                </li>
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</div>
                  <span>Safe for multiple delivery locations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default Address;