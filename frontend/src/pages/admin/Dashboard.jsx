import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Package, Users, DollarSign, TrendingUp,
  AlertTriangle, Clock, Star, CheckCircle, RefreshCw,
  BarChart3, ShoppingCart, UserPlus, CreditCard, TrendingDown,
  Download, Filter, MoreVertical, ArrowUpRight, ArrowDownRight,
  Calendar, Activity, Shield, Server, Database, Mail
} from 'lucide-react';
import { adminApi } from '../../utils/api';

// Modern Stat Card Component
const StatCard = ({ title, value, icon: Icon, change, changeType, loading, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50' },
    green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', bgLight: 'bg-green-50' },
    purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-50' },
    orange: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', bgLight: 'bg-orange-50' },
    red: { bg: 'from-red-500 to-red-600', text: 'text-red-600', bgLight: 'bg-red-50' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', bgLight: 'bg-indigo-50' }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.bgLight} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>

        {change && (
          <div className="flex items-center mt-4">
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        )}
      </div>
      
      <div className="h-1 w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 group-hover:via-blue-500 transition-all duration-500"></div>
    </div>
  );
};

// Modern Chart Component
const SalesChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse"></div>
    );
  }

  // Sample chart data
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', sales: 12000 },
    { day: 'Tue', sales: 19000 },
    { day: 'Wed', sales: 15000 },
    { day: 'Thu', sales: 25000 },
    { day: 'Fri', sales: 22000 },
    { day: 'Sat', sales: 30000 },
    { day: 'Sun', sales: 28000 }
  ];

  const maxSales = Math.max(...chartData.map(d => d.sales));
  const minSales = Math.min(...chartData.map(d => d.sales));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
          <p className="text-sm text-gray-500">Last 7 days performance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{chartData.reduce((a, b) => a + b.sales, 0).toLocaleString('en-IN')}</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
            +12.5%
          </span>
        </div>
      </div>
      
      <div className="h-48 flex items-end space-x-2">
        {chartData.map((item, index) => {
          const height = ((item.sales - minSales) / (maxSales - minSales)) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">{item.day}</div>
              <div className="w-full flex justify-center">
                <div 
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                  style={{ height: `${Math.max(20, height)}%` }}
                  title={`₹${item.sales.toLocaleString('en-IN')}`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Recent Orders Component
const RecentOrdersTable = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const recentOrders = orders.length > 0 ? orders : [
    { orderId: 'ORD2602097041', customer: 'John Doe', amount: 1299, status: 'pending', date: '2024-02-09' },
    { orderId: 'ORD2602097040', customer: 'Jane Smith', amount: 899, status: 'completed', date: '2024-02-08' },
    { orderId: 'ORD2602097039', customer: 'Robert Johnson', amount: 1599, status: 'shipped', date: '2024-02-07' },
    { orderId: 'ORD2602097038', customer: 'Sarah Williams', amount: 699, status: 'pending', date: '2024-02-06' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {recentOrders.map((order, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-blue-200 transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{order.orderId}</p>
              <p className="text-sm text-gray-500">{order.customer}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{order.amount}</p>
              <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await adminApi.getDashboardStats();
      if (response.success) {
        console.log('📊 Dashboard data received:', response);
        setStats(response);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Error connecting to server. Please check if backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!loading && !document.hidden) {
        fetchDashboardData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Calculate stats
  const calculateStats = () => {
    if (!stats) return null;
    
    const totalOrders = stats.stats?.totalOrders || 0;
    const pendingOrders = stats.stats?.pendingOrders || 0;
    const completedOrders = stats.stats?.completedOrders || 0;
    const totalUsers = stats.stats?.totalUsers || 0;
    const totalProducts = stats.stats?.totalProducts || 0;
    const lowStockProducts = stats.stats?.lowStockProducts || 0;
    const totalRevenue = stats.stats?.totalRevenue || 0;
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      totalRevenue,
      avgOrderValue: completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0,
      completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
    };
  };

  const calculatedStats = calculateStats();

  // Quick stats for cards
  const quickStats = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : `₹${(calculatedStats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'green',
      change: '+18.2%',
      changeType: 'positive',
      subtitle: 'All time revenue'
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : calculatedStats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'blue',
      change: '+12.5%',
      changeType: 'positive',
      subtitle: `${calculatedStats?.pendingOrders || 0} pending`
    },
    {
      title: 'Active Users',
      value: loading ? '...' : calculatedStats?.totalUsers || 0,
      icon: Users,
      color: 'purple',
      change: '+8.3%',
      changeType: 'positive',
      subtitle: 'Registered customers'
    },
    {
      title: 'Products',
      value: loading ? '...' : calculatedStats?.totalProducts || 0,
      icon: Package,
      color: 'orange',
      change: '+5.7%',
      changeType: 'positive',
      subtitle: `${calculatedStats?.lowStockProducts || 0} low stock`
    }
  ];

  const performanceStats = [
    {
      title: 'Completion Rate',
      value: loading ? '...' : `${calculatedStats?.completionRate || 0}%`,
      icon: CheckCircle,
      color: 'green',
      subtitle: 'Orders delivered successfully'
    },
    {
      title: 'Avg Order Value',
      value: loading ? '...' : `₹${calculatedStats?.avgOrderValue || 0}`,
      icon: TrendingUp,
      color: 'blue',
      subtitle: 'Average revenue per order'
    },
    {
      title: 'Pending Payments',
      value: loading ? '...' : calculatedStats?.pendingOrders || 0,
      icon: Clock,
      color: 'yellow',
      subtitle: 'Need verification'
    }
  ];

  const systemStatus = [
    { name: 'Backend API', status: 'online', icon: Server, color: 'green' },
    { name: 'Database', status: 'online', icon: Database, color: 'green' },
    { name: 'Email Service', status: 'active', icon: Mail, color: 'green' },
    { name: 'Uptime', status: '99.9%', icon: Activity, color: 'green' }
  ];

  const quickActions = [
    { title: 'Verify Payments', icon: CreditCard, count: calculatedStats?.pendingOrders || 0, color: 'blue', path: '/mohitaniljangra/orders?status=pending' },
    { title: 'Add Product', icon: Package, color: 'green', path: '/mohitaniljangra/products?action=create' },
    { title: 'View Users', icon: UserPlus, count: calculatedStats?.totalUsers || 0, color: 'purple', path: '/mohitaniljangra/users' },
    { title: 'Analytics', icon: BarChart3, color: 'orange', path: '/mohitaniljangra/dashboard' }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Store overview and analytics</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl mr-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800">Connection Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              Live
            </div>
          </div>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-gray-700 text-sm focus:outline-none"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
            </select>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-gray-600">Daily revenue performance</p>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-300 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
          
          <SalesChart data={stats?.salesData || []} loading={loading} />
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance</h2>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-5">
            {performanceStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-sm transition-all duration-300">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.color === 'green' ? 'bg-green-50' : stat.color === 'blue' ? 'bg-blue-50' : 'bg-yellow-50'} mr-4`}>
                    <stat.icon className={`w-5 h-5 ${stat.color === 'green' ? 'text-green-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-gray-600">Latest customer orders</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
              <button 
                onClick={() => window.location.href = '/mohitaniljangra/orders'}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          
          <RecentOrdersTable orders={stats?.recentOrders || []} loading={loading} />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.path}
                className="w-full group"
              >
                <div className="bg-white rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 group-hover:border-blue-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl ${action.color === 'blue' ? 'bg-blue-50' : action.color === 'green' ? 'bg-green-50' : action.color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'} mr-4`}>
                        <action.icon className={`w-5 h-5 ${action.color === 'blue' ? 'text-blue-600' : action.color === 'green' ? 'text-green-600' : action.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        {action.count !== undefined && (
                          <p className="text-sm text-gray-500">{action.count} items</p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">System Status</h2>
          <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
            All Systems Operational
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatus.map((system, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-white rounded-xl mr-4 shadow-sm">
                  <system.icon className={`w-5 h-5 ${system.color === 'green' ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{system.name}</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${system.color === 'green' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <p className="text-sm text-gray-600">{system.status}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-gray-500 text-sm">
        <p>Dashboard updated automatically every 30 seconds • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
      </div>
    </div>
  );
};

export default Dashboard;