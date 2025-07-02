import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiTrendingUp, FiUsers, FiActivity, FiDollarSign, FiCalendar, FiBarChart3, FiArrowUp, FiArrowDown } = FiIcons;

const SystemAnalytics = () => {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalJourneys: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completionRate: 0,
    averageJourneyTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchSystemAnalytics();
    }
  }, [profile, timeRange]);

  const fetchSystemAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      let startDate;
      switch (timeRange) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'quarter':
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('user_profiles_healthcare')
        .select('*', { count: 'exact', head: true });

      // Fetch journeys data
      const { data: journeys, count: totalJourneys } = await supabase
        .from('patient_journeys_healthcare')
        .select('*', { count: 'exact' });

      // Fetch payments data
      const { data: payments } = await supabase
        .from('patient_payments_healthcare')
        .select('amount, status')
        .eq('status', 'completed');

      // Calculate analytics
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const completedJourneys = journeys?.filter(j => j.status === 'completed').length || 0;
      const completionRate = totalJourneys > 0 ? (completedJourneys / totalJourneys) * 100 : 0;

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalJourneys: totalJourneys || 0,
        totalRevenue,
        activeUsers: Math.floor((totalUsers || 0) * 0.7), // Mock active users
        completionRate,
        averageJourneyTime: 14 // Mock average journey time in days
      });
    } catch (error) {
      console.error('Error fetching system analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Journeys',
      value: analytics.totalJourneys.toLocaleString(),
      icon: FiActivity,
      color: 'green',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics.totalRevenue / 1000).toFixed(1)}K`,
      icon: FiDollarSign,
      color: 'purple',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Completion Rate',
      value: `${analytics.completionRate.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: 'orange',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  const platformMetrics = [
    { metric: 'User Growth Rate', value: '12%', trend: 'up' },
    { metric: 'Average Session Duration', value: '45 min', trend: 'up' },
    { metric: 'Platform Uptime', value: '99.9%', trend: 'stable' },
    { metric: 'Support Response Time', value: '2.3 hrs', trend: 'down' }
  ];

  const userDistribution = [
    { role: 'Patients', count: Math.floor(analytics.totalUsers * 0.7), percentage: 70 },
    { role: 'Providers', count: Math.floor(analytics.totalUsers * 0.2), percentage: 20 },
    { role: 'Coordinators', count: Math.floor(analytics.totalUsers * 0.08), percentage: 8 },
    { role: 'Admins', count: Math.floor(analytics.totalUsers * 0.02), percentage: 2 }
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
            <p className="text-gray-600 mt-2">Platform-wide performance and user insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(kpi.color)}`}>
                    <SafeIcon icon={kpi.icon} className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded flex items-center space-x-1 ${
                    kpi.changeType === 'positive' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    <SafeIcon 
                      icon={kpi.changeType === 'positive' ? FiArrowUp : FiArrowDown} 
                      className="w-3 h-3" 
                    />
                    <span>{kpi.change}</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-gray-600 text-sm">{kpi.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* User Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution by Role</h2>
              <div className="space-y-4">
                {userDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700 mr-4">
                      {item.role}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-900">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Platform Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Metrics</h2>
              <div className="space-y-4">
                {platformMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      metric.trend === 'up' ? 'bg-green-100' :
                      metric.trend === 'down' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <SafeIcon 
                        icon={metric.trend === 'up' ? FiArrowUp : metric.trend === 'down' ? FiArrowDown : FiActivity} 
                        className={`w-4 h-4 ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Health Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">99.9%</h3>
                <p className="text-gray-600">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2.3s</h3>
                <p className="text-gray-600">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiActivity} className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SystemAnalytics;