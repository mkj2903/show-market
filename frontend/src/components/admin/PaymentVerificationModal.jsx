import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PaymentVerificationModal = ({ order, onVerify, onClose }) => {
  const [action, setAction] = useState('approve');
  const [utrNumber, setUtrNumber] = useState('');

  const handleSubmit = () => {
    if (action === 'approve' && !utrNumber.trim()) {
      alert('Please enter UTR number for approval');
      return;
    }
    onVerify(order._id || order.id, action, utrNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Verify Payment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Payment Verification</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Verify the UTR number provided by the customer with your bank statement.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
              <p className="text-gray-600">Order ID: #{order.orderId || order.id}</p>
              <p className="text-gray-600">Amount: ₹{order.totalAmount || order.amount}</p>
              <p className="text-gray-600">Customer: {order.user?.name || order.customer}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UTR Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 12-digit UTR number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                maxLength={12}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Action
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAction('approve')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center ${
                    action === 'approve'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle className={`w-8 h-8 mb-2 ${action === 'approve' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Approve</span>
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center ${
                    action === 'reject'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <XCircle className={`w-8 h-8 mb-2 ${action === 'reject' ? 'text-red-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Reject</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 text-white rounded-lg ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {action === 'approve' ? 'Approve Payment' : 'Reject Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal;