import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiTrendingUp, FiUsers, FiClock, FiDollarSign, FiMapPin, FiCalendar, FiBarChart3 } = FiIcons;

const Analytics = () => {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalJourneys: 0,
    activeJourneys: 0,
    completedJourneys: 0,
    averageDuration: 0,
    totalRevenue: 0,
    patientSatisfaction: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (profile?.id) {
      fetchAnalytics();
    }
  }, [profile, timeRange]);

  const fetchAnalytics = async () => {
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

      // Fetch journey data
      const { data: journeys, error: journeysError } = await supabase
        .from('patient_journeys_healthcare')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (journeysError) throw journeysError;

      // Fetch payment data
      const { data: payments, error: paymentsError } = await supabase
        .from('patient_payments_healthcare')
        .select('amount, status')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      if (paymentsError) throw paymentsError;

      // Calculate analytics
      const totalJourneys = journeys?.length || 0;
      const activeJourneys = journeys?.filter(j => 
        ['approved', 'travel_prep', 'in_treatment', 'recovery'].includes(j.status)
      ).length || 0;
      const completedJourneys = journeys?.filter(j => j.status === 'completed').length || 0;
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setAnalytics({
        totalJourneys,
        activeJourneys,
        completedJourneys,
        averageDuration: 14, // Mock data
        totalRevenue,
        patientSatisfaction: 4.8 // Mock data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Journeys',
      value: analytics.totalJourneys,
      icon: FiMapPin,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Active Journeys',
      value: analytics.activeJourneys,
      icon: FiUsers,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Avg. Duration',
      value: `${analytics.averageDuration} days`,
      icon: FiClock,
      color: 'purple',
      change: '-2 days'
    },
    {
      title: 'Revenue',
      value: `$${(analytics.totalRevenue / 1000).toFixed(1)}K`,
      icon: FiDollarSign,
      color: 'orange',
      change: '+15%'
    }
  ];

  const journeyStatusData = [
    { status: 'Inquiry', count: 45, percentage: 25 },
    { status: 'Planning', count: 32, percentage: 18 },
    { status: 'Approved', count: 28, percentage: 16 },
    { status: 'Travel Prep', count: 24, percentage: 13 },
    { status: 'In Treatment', count: 18, percentage: 10 },
    { status: 'Recovery', count: 15, percentage: 8 },
    { status: 'Completed', count: 18, percentage: 10 }
  ];

  const monthlyTrends = [
    { month: 'Jan', journeys: 12, revenue: 180 },
    { month: 'Feb', journeys: 15, revenue: 225 },
    { month: 'Mar', journeys: 18, revenue: 270 },
    { month: 'Apr', journeys: 22, revenue: 330 },
    { month: 'May', journeys: 19, revenue: 285 },
    { month: 'Jun', journeys: 25, revenue: 375 }
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track performance and insights for patient care coordination</p>
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
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-gray-600 text-sm">{kpi.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Journey Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Journey Status Distribution</h2>
              <div className="space-y-4">
                {journeyStatusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700 mr-4">
                      {item.status}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-bold text-gray-900">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Monthly Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Trends</h2>
              <div className="flex items-end space-x-2 h-48 mb-4">
                {monthlyTrends.map((item, index) => {
                  const maxJourneys = Math.max(...monthlyTrends.map(t => t.journeys));
                  const height = (item.journeys / maxJourneys) * 80;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center space-y-1">
                        <div
                          className="bg-blue-600 w-full rounded-t-sm transition-all duration-1000"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        ></div>
                        <div className="text-xs font-medium text-gray-900">{item.journeys}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Journeys per month</span>
                <span>Revenue: $K</span>
              </div>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{analytics.patientSatisfaction}/5</h3>
                <p className="text-gray-600">Patient Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiCalendar} className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                <p className="text-gray-600">On-Time Performance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">92%</h3>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Analytics;