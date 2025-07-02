import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiCalendar, FiClock, FiUser, FiPlus, FiEdit, FiTrash2, FiCheck, FiX } = FiIcons;

const Appointments = () => {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_type: '',
    appointment_date: '',
    notes: ''
  });

  useEffect(() => {
    if (profile?.id) {
      fetchAppointments();
    }
  }, [profile, selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Get provider record
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) {
        setAppointments([]);
        return;
      }

      const { data, error } = await supabase
        .from('medical_appointments_healthcare')
        .select(`
          *,
          user_profiles_healthcare!medical_appointments_healthcare_patient_id_fkey(
            full_name, email, phone_number
          )
        `)
        .eq('provider_id', providerData.id)
        .gte('appointment_date', selectedDate + 'T00:00:00')
        .lt('appointment_date', selectedDate + 'T23:59:59')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get provider record
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) return;

      const appointmentData = {
        ...formData,
        provider_id: providerData.id,
        status: 'scheduled',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('medical_appointments_healthcare')
        .insert(appointmentData);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        patient_id: '',
        appointment_type: '',
        appointment_date: '',
        notes: ''
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { error } = await supabase
        .from('medical_appointments_healthcare')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your patient appointments and schedule</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </motion.div>

      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
          </span>
        </div>
      </motion.div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiCalendar} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600 mb-6">You have no appointments for {new Date(selectedDate).toLocaleDateString()}.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule New Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.user_profiles_healthcare?.full_name || 'Unknown Patient'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiClock} className="w-4 h-4" />
                        <span>
                          {new Date(appointment.appointment_date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{appointment.appointment_type}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}

                    {appointment.status === 'scheduled' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                        className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <span>Start Appointment</span>
                      </button>
                    )}

                    {appointment.status === 'in_progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for New Appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Appointment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type *
                </label>
                <select
                  value={formData.appointment_type}
                  onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="treatment">Treatment</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;