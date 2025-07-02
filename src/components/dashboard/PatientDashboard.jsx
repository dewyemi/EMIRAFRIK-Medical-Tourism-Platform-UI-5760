import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiCalendar, FiActivity, FiMapPin, FiClock, FiHeart, FiFileText, FiArrowRight, FiAlertCircle } = FiIcons;

const PatientDashboard = () => {
  const { profile, user } = useAuth();
  const [journey, setJourney] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Fetch current journey (if any)
      const { data: journeyData } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          treatment_options_healthcare(name, category),
          healthcare_providers_healthcare(facility_name)
        `)
        .eq('patient_id', profile.id)
        .in('status', ['in_progress', 'approved', 'planning'])
        .limit(1)
        .maybeSingle();

      if (journeyData) {
        setJourney(journeyData);
      }

      // Fetch upcoming appointments (if any)
      const { data: appointmentsData } = await supabase
        .from('medical_appointments_healthcare')
        .select(`
          *,
          healthcare_providers_healthcare(facility_name)
        `)
        .eq('patient_id', profile.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(3);

      setUpcomingAppointments(appointmentsData || []);

      // Fetch recent communications (if any)
      const { data: communicationsData } = await supabase
        .from('communications_healthcare')
        .select('*')
        .eq('recipient_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(communicationsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseProgress = (phase) => {
    const phases = ['engagement', 'preparation', 'treatment', 'follow_up'];
    const currentIndex = phases.indexOf(phase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getStatusColor = (status) => {
    const colors = {
      'inquiry': 'bg-yellow-100 text-yellow-800',
      'assessment': 'bg-blue-100 text-blue-800',
      'planning': 'bg-purple-100 text-purple-800',
      'approved': 'bg-green-100 text-green-800',
      'travel_prep': 'bg-indigo-100 text-indigo-800',
      'in_treatment': 'bg-orange-100 text-orange-800',
      'recovery': 'bg-pink-100 text-pink-800',
      'follow_up': 'bg-gray-100 text-gray-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.full_name || user?.email || 'Patient'}!
        </h1>
        <p className="text-blue-100">
          Here's an overview of your healthcare journey and upcoming activities.
        </p>
      </motion.div>

      {/* Current Journey Status */}
      {journey ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Journey</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(journey.status)}`}>
              {journey.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(getPhaseProgress(journey.phase || 'engagement'))}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getPhaseProgress(journey.phase || 'engagement')}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Treatment</h3>
              <p className="text-gray-600">{journey.treatment_options_healthcare?.name || 'Treatment details pending'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Healthcare Provider</h3>
              <p className="text-gray-600">{journey.healthcare_providers_healthcare?.facility_name || 'Provider assignment pending'}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <SafeIcon icon={FiMapPin} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Healthcare Journey</h2>
          <p className="text-gray-600 mb-4">Begin your personalized healthcare experience with us.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Start Journey
          </button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Appointment</p>
              <p className="text-lg font-semibold text-gray-900">
                {upcomingAppointments.length > 0 
                  ? new Date(upcomingAppointments[0].appointment_date).toLocaleDateString()
                  : 'None scheduled'
                }
              </p>
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Status</p>
              <p className="text-lg font-semibold text-gray-900">Good</p>
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
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-lg font-semibold text-gray-900">0 files</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Journey Phase</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {journey?.phase || 'Not started'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Appointments & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiCalendar} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">{appointment.appointment_type}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                      {new Date(appointment.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.healthcare_providers_healthcare?.facility_name || 'TBD'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No upcoming appointments</p>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Schedule your first appointment
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <SafeIcon icon={FiActivity} className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiActivity} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm mt-2">Your healthcare journey activity will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Book Appointment</span>
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center">
            <SafeIcon icon={FiFileText} className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Upload Documents</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center">
            <SafeIcon icon={FiHeart} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Health Assessment</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center">
            <SafeIcon icon={FiMapPin} className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Track Journey</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDashboard;