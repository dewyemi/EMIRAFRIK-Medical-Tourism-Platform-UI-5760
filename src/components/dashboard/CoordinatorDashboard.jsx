import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiUsers, FiMapPin, FiClock, FiTrendingUp, FiArrowRight, FiAlertTriangle } = FiIcons;

const CoordinatorDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    activeJourneys: 0,
    pendingApprovals: 0,
    travelPrep: 0,
    completedThisMonth: 0
  });
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [recentJourneys, setRecentJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Since the tables don't exist yet, we'll use mock data
      // In a real implementation, these would be actual database queries
      
      // Mock stats
      setStats({
        activeJourneys: 12,
        pendingApprovals: 5,
        travelPrep: 8,
        completedThisMonth: 15
      });

      // Mock recent journeys
      setRecentJourneys([
        {
          id: '1',
          patient_name: 'Ahmed Hassan',
          treatment_name: 'Cardiac Surgery',
          facility_name: 'Dubai Heart Institute',
          status: 'in_treatment',
          created_at: new Date().toISOString(),
          country: 'Morocco'
        },
        {
          id: '2',
          patient_name: 'Fatima Al-Zahra',
          treatment_name: 'Eye Surgery',
          facility_name: 'Emirates Eye Hospital',
          status: 'travel_prep',
          created_at: new Date().toISOString(),
          country: 'Senegal'
        },
        {
          id: '3',
          patient_name: 'Omar Diallo',
          treatment_name: 'Neurological Treatment',
          facility_name: 'Dubai Neurological Center',
          status: 'approved',
          created_at: new Date().toISOString(),
          country: 'Mali'
        }
      ]);

      // Mock urgent tasks
      setUrgentTasks([
        {
          id: '1',
          patient_name: 'Sarah Johnson',
          task: 'Pre-surgery consultation',
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high'
        },
        {
          id: '2',
          patient_name: 'Mohammed Ali',
          task: 'Document verification',
          appointment_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          priority: 'medium'
        }
      ]);

    } catch (error) {
      console.error('Error fetching coordinator dashboard data:', error);
      // Set default values on error
      setStats({
        activeJourneys: 0,
        pendingApprovals: 0,
        travelPrep: 0,
        completedThisMonth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'inquiry': 'bg-yellow-100 text-yellow-800',
      'planning': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'travel_prep': 'bg-purple-100 text-purple-800',
      'in_treatment': 'bg-orange-100 text-orange-800',
      'recovery': 'bg-pink-100 text-pink-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Care Coordination Dashboard
        </h1>
        <p className="text-purple-100">
          Managing {stats.activeJourneys} active patient journeys with {stats.pendingApprovals} pending approvals.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Journeys</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeJourneys}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Travel Preparation</p>
              <p className="text-2xl font-bold text-gray-900">{stats.travelPrep}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedThisMonth}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Urgent Tasks & Recent Journeys */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-2" />
              Urgent Tasks
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {task.task}: {task.patient_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(task.appointment_date).toLocaleDateString()} at{' '}
                      {new Date(task.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiClock} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No urgent tasks</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Journeys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patient Journeys</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {recentJourneys.length > 0 ? (
              recentJourneys.map((journey) => (
                <div key={journey.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiMapPin} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {journey.patient_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {journey.treatment_name} • {journey.facility_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(journey.status)}`}>
                      {journey.status.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(journey.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiMapPin} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent journeys</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center">
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Review Patients</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center">
            <SafeIcon icon={FiMapPin} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Track Journeys</span>
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center">
            <SafeIcon icon={FiClock} className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Schedule Calls</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center">
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CoordinatorDashboard;