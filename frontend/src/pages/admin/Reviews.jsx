import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';
import { adminApi } from '../../utils/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getReviews({
        status: statusFilter
      });
      
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      const response = await adminApi.updateReviewStatus(reviewId, {
        status: action
      });
      
      if (response.success) {
        fetchReviews();
        alert(`Review ${action} successfully!`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600 mt-1">Moderate and manage customer reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Pending ({reviews.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{review.user?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-700">
                        {review.title}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.message}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="font-medium">Product:</span>{' '}
                      <span className="text-blue-600">{review.product?.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Order ID:</span>{' '}
                      <span className="text-gray-600">#{review.orderId}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6">
                  {review.status === 'pending' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReviewAction(review._id, 'approved')}
                        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewAction(review._id, 'rejected')}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {review.status === 'approved' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approved
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejected
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              
              {review.adminMessage && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Admin Note</span>
                  </div>
                  <p className="text-sm text-blue-800">{review.adminMessage}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === 'pending' 
              ? 'No pending reviews' 
              : `No ${statusFilter} reviews`}
          </h3>
          <p className="text-gray-600">
            {statusFilter === 'pending' 
              ? 'All reviews have been moderated' 
              : 'Check back later for more reviews'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;