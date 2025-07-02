import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiUsers, FiCalendar, FiActivity, FiClock, FiTrendingUp, FiArrowRight } = FiIcons;

const ProviderDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activeJourneys: 0,
    completedTreatments: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      // Get provider facility
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) return;

      // Fetch stats
      const today = new Date().toISOString().split('T')[0];

      // Total patients
      const { count: totalPatients } = await supabase
        .from('patient_journeys_healthcare')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerData.id);

      // Today's appointments
      const { data: appointmentsData, count: todayCount } = await supabase
        .from('medical_appointments_healthcare')
        .select(`
          *,
          user_profiles_healthcare!medical_appointments_healthcare_patient_id_fkey(full_name, phone_number)
        `, { count: 'exact' })
        .eq('provider_id', providerData.id)
        .gte('appointment_date', `${today}T00:00:00`)
        .lt('appointment_date', `${today}T23:59:59`)
        .order('appointment_date', { ascending: true });

      setTodayAppointments(appointmentsData || []);

      // Active journeys
      const { count: activeJourneys } = await supabase
        .from('patient_journeys_healthcare')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerData.id)
        .in('status', ['approved', 'travel_prep', 'in_treatment', 'recovery']);

      // Completed treatments
      const { count: completedTreatments } = await supabase
        .from('patient_journeys_healthcare')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerData.id)
        .eq('status', 'completed');

      setStats({
        totalPatients: totalPatients || 0,
        todayAppointments: todayCount || 0,
        activeJourneys: activeJourneys || 0,
        completedTreatments: completedTreatments || 0
      });

      // Recent patients
      const { data: recentPatientsData } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          user_profiles_healthcare!patient_journeys_healthcare_patient_id_fkey(full_name, country),
          treatment_options_healthcare(name)
        `)
        .eq('provider_id', providerData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPatients(recentPatientsData || []);

    } catch (error) {
      console.error('Error fetching provider dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-orange-100 text-orange-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
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
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Dr. {profile?.full_name}!
        </h1>
        <p className="text-green-100">
          You have {stats.todayAppointments} appointments scheduled for today.
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
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
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
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-orange-600" />
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
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTreatments}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Appointments & Recent Patients */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiClock} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {appointment.user_profiles_healthcare?.full_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.appointment_date).toLocaleTimeString()} • {appointment.appointment_type}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No appointments for today</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {recentPatients.length > 0 ? (
              recentPatients.map((journey) => (
                <div key={journey.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {journey.user_profiles_healthcare?.full_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {journey.treatment_options_healthcare?.name} • {journey.user_profiles_healthcare?.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(journey.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiUsers} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent patients</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderDashboard;