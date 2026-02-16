import React, { useState } from 'react';
import { 
  Tag, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Info,
  Percent,
  IndianRupee
} from 'lucide-react';

const CouponApply = ({ 
  orderAmount, 
  onCouponApplied, 
  appliedCoupon,
  onRemoveCoupon 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDetails, setShowDetails] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    if (appliedCoupon) {
      setMessage({ type: 'error', text: 'Coupon already applied' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: orderAmount
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setMessage({ 
          type: 'success', 
          text: `Coupon applied! You saved ₹${data.coupon.discount}` 
        });
        onCouponApplied(data.coupon);
        setCouponCode('');
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Invalid coupon code' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to validate coupon. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateCoupon();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{appliedCoupon.code}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    APPLIED
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {appliedCoupon.discountType === 'percentage' 
                    ? `${appliedCoupon.discountValue}% OFF` 
                    : `₹${appliedCoupon.discountValue} OFF`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                - ₹{appliedCoupon.discount}
              </div>
              <button
                onClick={onRemoveCoupon}
                className="text-sm text-red-600 hover:text-red-700 font-medium mt-1"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Coupon Details */}
          <div className="mt-3 pt-3 border-t border-green-100">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Info className="h-4 w-4 mr-1" />
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            
            {showDetails && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Name:</span> {appliedCoupon.name}</p>
                <p><span className="font-medium">Min. Order:</span> ₹{appliedCoupon.minOrderAmount}</p>
                {appliedCoupon.maxDiscount && (
                  <p><span className="font-medium">Max. Discount:</span> ₹{appliedCoupon.maxDiscount}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coupon Input Section */}
      {!appliedCoupon && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Have a coupon code?</h3>
              <p className="text-sm text-gray-600">Apply to get instant discount</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code (e.g., SUMMER20)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                disabled={loading}
              />
            </div>
            <button
              onClick={validateCoupon}
              disabled={loading || !couponCode.trim()}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${loading || !couponCode.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Available Coupons Hint */}
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              Popular codes: <span className="font-mono font-bold">SUMMER20</span>,{' '}
              <span className="font-mono font-bold">WELCOME10</span>,{' '}
              <span className="font-mono font-bold">FESTIVE15</span>
            </p>
          </div>
        </div>
      )}

      {/* Coupon Terms */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Coupon Terms</span>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>One coupon per order</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Cannot be combined with other offers</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Valid on minimum order amount</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Expires on the specified date</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CouponApply;