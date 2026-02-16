import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, Globe, Shield, Bell, CreditCard, QrCode, Upload, Image, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'TV Show Merchandise',
    storeEmail: 'support@tvmerch.com',
    storePhone: '+91 9876543210',
    storeAddress: '123 TV Street, Mumbai, India',
    currency: 'INR',
    taxRate: 18,
    shippingCost: 50,
    freeShippingThreshold: 1000,
    notificationEmail: true,
    notificationWhatsApp: false,
    maintenanceMode: false,
    upiId: 'tvmerch@upi',
    qrCodeImage: null
  });

  const [saving, setSaving] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);
  const [qrPreview, setQrPreview] = useState(null);
  
  // ✅ NEW: Email Testing State
  const [emailTest, setEmailTest] = useState({
    testEmail: '',
    testing: false,
    result: null
  });
  const [emailConfig, setEmailConfig] = useState(null);
  const [loadingEmailConfig, setLoadingEmailConfig] = useState(true);

  // Load saved settings on component mount
  useEffect(() => {
    loadSavedSettings();
    checkEmailConfiguration();
  }, []);

  const loadSavedSettings = () => {
    try {
      // Load from localStorage
      const savedSettings = localStorage.getItem('storeSettings');
      const savedQrCode = localStorage.getItem('storeQrCode');
      const savedUpiId = localStorage.getItem('storeUpiId');
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          qrCodeImage: parsedSettings.qrCodeImage || savedQrCode || null,
          upiId: parsedSettings.upiId || savedUpiId || 'tvmerch@upi'
        }));
        
        if (parsedSettings.qrCodeImage || savedQrCode) {
          setQrPreview(parsedSettings.qrCodeImage || savedQrCode);
        }
      } else if (savedQrCode || savedUpiId) {
        // Legacy format support
        setSettings(prev => ({
          ...prev,
          qrCodeImage: savedQrCode,
          upiId: savedUpiId || 'tvmerch@upi'
        }));
        setQrPreview(savedQrCode);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // ✅ NEW: Check Email Configuration
  const checkEmailConfiguration = async () => {
    try {
      setLoadingEmailConfig(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/email/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmailConfig(data);
      } else {
        setEmailConfig({
          success: false,
          configured: false,
          message: 'Failed to check email configuration'
        });
      }
    } catch (error) {
      console.error('Error checking email config:', error);
      setEmailConfig({
        success: false,
        configured: false,
        message: 'Network error while checking email configuration'
      });
    } finally {
      setLoadingEmailConfig(false);
    }
  };

  // ✅ NEW: Send Test Email
  const sendTestEmail = async () => {
    if (!emailTest.testEmail) {
      alert('Please enter an email address to test');
      return;
    }

    if (!emailTest.testEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setEmailTest(prev => ({ ...prev, testing: true, result: null }));
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/email/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailTest.testEmail })
      });
      
      const data = await response.json();
      
      setEmailTest(prev => ({
        ...prev,
        testing: false,
        result: data
      }));
      
      if (data.success) {
        alert('✅ Test email sent successfully! Check your inbox and spam folder.');
      } else {
        alert(`❌ Failed to send test email: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setEmailTest(prev => ({
        ...prev,
        testing: false,
        result: { success: false, message: error.message }
      }));
      alert('❌ Error sending test email: ' + error.message);
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setQrUploading(true);

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setQrPreview(imageUrl);
      
      // Update settings
      const updatedSettings = {
        ...settings,
        qrCodeImage: imageUrl
      };
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('storeQrCode', imageUrl);
      localStorage.setItem('storeUpiId', updatedSettings.upiId);
      localStorage.setItem('storeSettings', JSON.stringify(updatedSettings));
      
      // Trigger storage event for other tabs/components
      window.dispatchEvent(new Event('storage'));
      
      setQrUploading(false);
      alert('QR Code uploaded successfully! It will appear in checkout page.');
    };
    reader.onerror = () => {
      alert('Error reading file');
      setQrUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save all settings to localStorage
      const settingsToSave = {
        ...settings,
        qrCodeImage: qrPreview || settings.qrCodeImage
      };
      
      localStorage.setItem('storeSettings', JSON.stringify(settingsToSave));
      localStorage.setItem('storeUpiId', settings.upiId);
      if (qrPreview) {
        localStorage.setItem('storeQrCode', qrPreview);
      }
      
      // Trigger storage event for other tabs/components
      window.dispatchEvent(new Event('storage'));
      
      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        alert('Settings saved successfully! Changes will reflect in checkout page.');
      }, 1000);
    } catch (error) {
      alert('Error saving settings');
      setSaving(false);
    }
  };

  const refreshAllTabs = () => {
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    alert('Refresh signal sent to all open checkout pages.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store settings and preferences</p>
        </div>
        <button
          onClick={refreshAllTabs}
          className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All Tabs
        </button>
      </div>

      {/* ✅ NEW: Email Configuration Status Card */}
      <div className={`p-4 rounded-lg ${emailConfig?.configured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {loadingEmailConfig ? (
              <RefreshCw className="w-5 h-5 mr-2 text-gray-400 animate-spin" />
            ) : emailConfig?.configured ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
            )}
            <div>
              <h3 className="font-medium">
                Email Service: {loadingEmailConfig ? 'Checking...' : (emailConfig?.configured ? '✅ Configured' : '⚠️ Not Configured')}
              </h3>
              <p className="text-sm text-gray-600">
                {emailConfig?.configured 
                  ? 'Automatic email notifications are enabled for order updates'
                  : 'Configure email in backend .env file to enable notifications'}
              </p>
            </div>
          </div>
          <button
            onClick={checkEmailConfiguration}
            disabled={loadingEmailConfig}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingEmailConfig ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {emailConfig?.config && (
          <div className="mt-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>Host: <span className="font-mono">{emailConfig.config.emailHost}</span></div>
              <div>From: <span className="font-mono">{emailConfig.config.emailFrom}</span></div>
              <div>Status: <span className={emailConfig.config.emailUser === 'Configured' ? 'text-green-600' : 'text-red-600'}>
                {emailConfig.config.emailUser}
              </span></div>
              <div>BCC: <span className="font-mono">{emailConfig.config.bccEmail}</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* ✅ NEW: Email Testing Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Email Testing</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Test Email Notifications
                </label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter email address to test"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={emailTest.testEmail}
                    onChange={(e) => setEmailTest(prev => ({ ...prev, testEmail: e.target.value }))}
                    disabled={emailTest.testing}
                  />
                  <button
                    onClick={sendTestEmail}
                    disabled={emailTest.testing || !emailTest.testEmail}
                    className={`px-4 py-2 rounded-lg flex items-center ${emailTest.testing || !emailTest.testEmail ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {emailTest.testing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This will send a test order confirmation email to verify email service is working.
                </p>
              </div>
              
              {emailTest.result && (
                <div className={`p-4 rounded-lg ${emailTest.result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center">
                    {emailTest.result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <div>
                      <p className={`font-medium ${emailTest.result.success ? 'text-green-800' : 'text-red-800'}`}>
                        {emailTest.result.success ? 'Test email sent successfully!' : 'Failed to send test email'}
                      </p>
                      {emailTest.result.message && (
                        <p className="text-sm mt-1">{emailTest.result.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">📋 Email Notification Types</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span><strong>Order Confirmation:</strong> Sent when customer places order</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span><strong>Payment Verified:</strong> Sent when admin approves payment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span><strong>Payment Rejected:</strong> Sent when admin rejects payment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span><strong>Order Processing:</strong> Sent when order moves to processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span><strong>Order Shipped:</strong> Sent when order is shipped</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span><strong>Order Delivered:</strong> Sent when order is delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.storeName}
                  onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={settings.upiId}
                    onChange={(e) => setSettings({...settings, upiId: e.target.value})}
                    placeholder="yourname@upi"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This UPI ID will appear in checkout</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Address
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* UPI QR Code Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <QrCode className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">UPI QR Code</h2>
                  <p className="text-sm text-gray-600">Upload QR code for checkout page</p>
                </div>
              </div>
              <button
                onClick={loadSavedSettings}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Reload
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current QR Code
                  </label>
                  <div className="border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[250px] bg-gray-50">
                    {qrPreview ? (
                      <>
                        <div className="w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden mb-3 bg-white p-2">
                          <img 
                            src={qrPreview} 
                            alt="UPI QR Code" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          QR Code will appear in checkout page
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-1">
                          UPI ID: {settings.upiId}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                          <Image className="w-16 h-16 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          No QR code uploaded yet
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-1">
                          Upload a QR code for UPI payments
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload New QR Code
                  </label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="hidden"
                        id="qrUpload"
                        disabled={qrUploading}
                      />
                      <label
                        htmlFor="qrUpload"
                        className={`inline-flex items-center px-4 py-3 rounded-lg cursor-pointer transition ${qrUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {qrUploading ? 'Uploading...' : 'Choose Image File'}
                      </label>
                      <p className="text-sm text-gray-500 mt-4">
                        Supported formats: PNG, JPG, JPEG
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max file size: 2MB
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-yellow-800 mb-2">Important Notes:</p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• QR code should be square (1:1 ratio)</li>
                        <li>• Use high quality image for best results</li>
                        <li>• Make sure QR code is scannable</li>
                        <li>• Test the QR code with UPI apps before uploading</li>
                        <li className="font-medium mt-2">• Changes appear in checkout page immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {qrPreview && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      QR code is live in checkout page
                    </p>
                    <p className="text-xs text-gray-400">
                      UPI ID: {settings.upiId}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove the QR code?')) {
                        setQrPreview(null);
                        setSettings(prev => ({ ...prev, qrCodeImage: null }));
                        localStorage.removeItem('storeQrCode');
                        localStorage.setItem('storeSettings', JSON.stringify({
                          ...settings,
                          qrCodeImage: null
                        }));
                        window.dispatchEvent(new Event('storage'));
                        alert('QR Code removed successfully!');
                      }
                    }}
                    className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    Remove QR Code
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Shipping & Tax */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Shipping & Tax</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Cost (₹)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.shippingCost}
                  onChange={(e) => setSettings({...settings, shippingCost: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Shipping Above (₹)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Send email alerts to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notificationEmail}
                    onChange={(e) => setSettings({...settings, notificationEmail: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">WhatsApp Alerts</p>
                  <p className="text-sm text-gray-600">Send WhatsApp messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notificationWhatsApp}
                    onChange={(e) => setSettings({...settings, notificationWhatsApp: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Temporarily disable store</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </div>
              
              <button 
                onClick={() => alert('This will reset all store data. Are you sure?')}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Reset All Data
              </button>
              
              <button 
                onClick={() => alert('Password change feature will be available soon.')}
                className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Change Admin Password
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;