import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const SalesChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading sales data...</p>
      </div>
    );
  }

  // If no data from API, use real calculation or show empty
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium mb-2">No sales data yet</p>
        <p className="text-sm text-center px-8">
          Sales data will appear here once orders are delivered
        </p>
      </div>
    );
  }

  // Ensure data is in correct format
  const chartData = Array.isArray(data) ? data : [];
  
  // If data has objects with date and sales properties
  const maxSales = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.sales || item.totalSales || 0))
    : 10000; // Default max for empty chart

  // Calculate totals
  const totalSales = chartData.reduce((sum, item) => sum + (item.sales || item.totalSales || 0), 0);
  const ordersCount = chartData.reduce((sum, item) => sum + (item.ordersCount || 0), 0);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-72">
      {/* Header with totals */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalSales.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{ordersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between h-40 mt-4 space-x-1">
        {chartData.map((item, index) => {
          const sales = item.sales || item.totalSales || 0;
          const percentage = maxSales > 0 ? (sales / maxSales) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center">
                <div
                  className="w-10/12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer group-hover:from-blue-600 group-hover:to-blue-500"
                  style={{ height: `${percentage}%` }}
                  title={`₹${sales.toLocaleString('en-IN')}`}
                />
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {formatDate(item.date || item._id)}
                </div>
                <div className="text-xs font-medium text-gray-900 mt-1">
                  ₹{(sales / 1000).toFixed(1)}k
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Daily Sales</span>
            </div>
            <div className="text-gray-500">
              Last {chartData.length} days
            </div>
          </div>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">
              {chartData.length > 1 ? 'Trending Up' : 'Data Available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;