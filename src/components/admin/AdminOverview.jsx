import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiDollarSign, FiTrendingUp, FiCalendar, FiActivity, FiClock, FiArrowUp, FiArrowDown } = FiIcons;

const AdminOverview = () => {
  const stats = [
    {
      title: 'Total Clients',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FiUsers
    },
    {
      title: 'Revenue',
      value: '$2.5M',
      change: '+8%',
      changeType: 'positive',
      icon: FiDollarSign
    },
    {
      title: 'Success Rate',
      value: '95%',
      change: '+2%',
      changeType: 'positive',
      icon: FiTrendingUp
    },
    {
      title: 'Avg. Process Time',
      value: '14 days',
      change: '-3 days',
      changeType: 'positive',
      icon: FiCalendar
    }
  ];

  const pipelineData = [
    { stage: 'Initial Inquiry', count: 235, percentage: 32 },
    { stage: 'Medical Review', count: 180, percentage: 25 },
    { stage: 'Package Selection', count: 120, percentage: 16 },
    { stage: 'Payment', count: 85, percentage: 12 },
    { stage: 'Treatment', count: 65, percentage: 9 },
    { stage: 'Aftercare', count: 45, percentage: 6 }
  ];

  const revenueData = [
    { month: 'Jan', amount: 120 },
    { month: 'Feb', amount: 132 },
    { month: 'Mar', amount: 101 },
    { month: 'Apr', amount: 134 },
    { month: 'May', amount: 90 },
    { month: 'Jun', amount: 230 },
    { month: 'Jul', amount: 210 },
    { month: 'Aug', amount: 185 },
    { month: 'Sep', amount: 195 },
    { month: 'Oct', amount: 220 },
    { month: 'Nov', amount: 250 },
    { month: 'Dec', amount: 280 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of EMIRAFRIK operations and performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded flex items-center space-x-1 ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                <SafeIcon 
                  icon={stat.changeType === 'positive' ? FiArrowUp : FiArrowDown} 
                  className="w-3 h-3" 
                />
                <span>{stat.change}</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pipeline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-black mb-6">Client Pipeline Overview</h2>
          <div className="space-y-4">
            {pipelineData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 mr-4">
                  {item.stage}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                  <div
                    className="bg-black h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-bold text-black">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-black mb-6">Monthly Revenue Trend</h2>
          <div className="flex items-end space-x-2 h-64">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-black w-full rounded-t-sm transition-all duration-1000 delay-100"
                  style={{ 
                    height: `${(item.amount / maxRevenue) * 80}%`,
                    minHeight: '8px'
                  }}
                ></div>
                <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                  {item.month}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>$0K</span>
            <span>${maxRevenue}K</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-6 mt-8"
      >
        <h2 className="text-xl font-bold text-black mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              action: 'New inquiry received',
              client: 'Ahmed Hassan',
              time: '2 minutes ago',
              status: 'new'
            },
            {
              action: 'Payment completed',
              client: 'Sarah Johnson',
              time: '15 minutes ago',
              status: 'success'
            },
            {
              action: 'Medical review pending',
              client: 'Mohammed Ali',
              time: '1 hour ago',
              status: 'pending'
            },
            {
              action: 'Treatment completed',
              client: 'Fatima Al-Zahra',
              time: '3 hours ago',
              status: 'completed'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'new' ? 'bg-blue-500' :
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
                <div>
                  <p className="font-medium text-black">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Treatments</p>
              <p className="text-3xl font-bold">65</p>
            </div>
            <SafeIcon icon={FiActivity} className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed Today</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Satisfaction Rate</p>
              <p className="text-3xl font-bold">98%</p>
            </div>
            <SafeIcon icon={FiUsers} className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;