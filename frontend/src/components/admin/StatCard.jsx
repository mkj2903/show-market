import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  loading = false,
  subtitle 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  const trendColors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  const getTrendIcon = (trendValue) => {
    if (!trendValue) return <Minus className="w-3 h-3" />;
    if (trendValue.includes('+')) return <TrendingUp className="w-3 h-3" />;
    if (trendValue.includes('-')) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="p-3 rounded-full bg-gray-200">
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border ${colorClasses[color]} p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4">
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${trendColors[color]}`}>
            {getTrendIcon(trend)}
            <span className="ml-1">{trend}</span>
          </span>
          <span className="text-xs text-gray-600 ml-2">from last month</span>
        </div>
      )}
      
      {/* Progress bar for some stats */}
      {(title.includes('Pending') || title.includes('Low Stock')) && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {typeof value === 'number' && value > 100 ? '100%' : `${value}%`}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${colorClasses[color].split(' ')[0]}`}
              style={{ 
                width: `${Math.min(100, value)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;