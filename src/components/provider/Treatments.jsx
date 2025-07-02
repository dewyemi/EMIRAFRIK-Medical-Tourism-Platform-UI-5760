import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiHeart, FiPlus, FiEdit, FiEye, FiCalendar, FiUser, FiClock, FiActivity } = FiIcons;

const Treatments = () => {
  const { profile } = useAuth();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (profile?.id) {
      fetchTreatments();
    }
  }, [profile]);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      
      // Get provider record
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) {
        setTreatments([]);
        return;
      }

      const { data, error } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          user_profiles_healthcare!patient_journeys_healthcare_patient_id_fkey(
            full_name, email, phone_number, country
          ),
          treatment_options_healthcare(name, category, description),
          medical_appointments_healthcare(appointment_date, appointment_type, status)
        `)
        .eq('provider_id', providerData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTreatments = treatments.filter(treatment => {
    if (filterStatus === 'all') return true;
    return treatment.status === filterStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800',
      'travel_prep': 'bg-blue-100 text-blue-800',
      'in_treatment': 'bg-orange-100 text-orange-800',
      'recovery': 'bg-purple-100 text-purple-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPhaseProgress = (status) => {
    const phases = {
      'approved': 20,
      'travel_prep': 40,
      'in_treatment': 60,
      'recovery': 80,
      'completed': 100
    };
    return phases[status] || 0;
  };

  // Mock treatment timeline data
  const getTreatmentTimeline = (treatment) => [
    {
      date: 'Dec 15, 2024',
      event: 'Initial Consultation',
      status: 'completed',
      notes: 'Patient assessment completed. Treatment plan approved.'
    },
    {
      date: 'Dec 20, 2024',
      event: 'Pre-operative Preparation',
      status: treatment.status === 'in_treatment' || treatment.status === 'recovery' || treatment.status === 'completed' ? 'completed' : 'pending',
      notes: 'Pre-surgical tests and preparation completed.'
    },
    {
      date: 'Dec 22, 2024',
      event: 'Treatment/Surgery',
      status: treatment.status === 'recovery' || treatment.status === 'completed' ? 'completed' : treatment.status === 'in_treatment' ? 'in_progress' : 'pending',
      notes: 'Main treatment procedure.'
    },
    {
      date: 'Dec 25, 2024',
      event: 'Recovery Monitoring',
      status: treatment.status === 'completed' ? 'completed' : treatment.status === 'recovery' ? 'in_progress' : 'pending',
      notes: 'Post-treatment recovery and monitoring.'
    },
    {
      date: 'Jan 5, 2025',
      event: 'Follow-up Assessment',
      status: treatment.status === 'completed' ? 'completed' : 'pending',
      notes: 'Final assessment and discharge planning.'
    }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Treatment Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage patient treatment plans and progress</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-2 mb-8"
      >
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All Treatments', count: treatments.length },
            { id: 'in_treatment', label: 'Active', count: treatments.filter(t => t.status === 'in_treatment').length },
            { id: 'recovery', label: 'Recovery', count: treatments.filter(t => t.status === 'recovery').length },
            { id: 'completed', label: 'Completed', count: treatments.filter(t => t.status === 'completed').length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                filterStatus === filter.id
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Treatments List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading treatments...</p>
            </div>
          ) : filteredTreatments.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiHeart} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments found</h3>
              <p className="text-gray-600">No treatments match the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTreatments.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedTreatment?.id === treatment.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTreatment(treatment)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <SafeIcon icon={FiHeart} className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {treatment.user_profiles_healthcare?.full_name}
                        </h3>
                        <p className="text-gray-600">
                          {treatment.treatment_options_healthcare?.name}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(treatment.status)}`}>
                            {treatment.status?.replace('_', ' ').toUpperCase()}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                            {new Date(treatment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTreatment(treatment);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEye} className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Treatment Progress</span>
                      <span>{getPhaseProgress(treatment.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPhaseProgress(treatment.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <SafeIcon icon={FiUser} className="w-4 h-4" />
                      <span>{treatment.user_profiles_healthcare?.country}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <SafeIcon icon={FiActivity} className="w-4 h-4" />
                      <span>{treatment.treatment_options_healthcare?.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Treatment Details */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
          >
            {selectedTreatment ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Treatment Details
                  </h3>
                  <p className="text-gray-600">
                    {selectedTreatment.user_profiles_healthcare?.full_name}
                  </p>
                </div>

                {/* Patient Info */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Treatment:</span>
                    <span className="font-medium">{selectedTreatment.treatment_options_healthcare?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedTreatment.treatment_options_healthcare?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTreatment.status)}`}>
                      {selectedTreatment.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Treatment Timeline</h4>
                  <div className="space-y-3">
                    {getTreatmentTimeline(selectedTreatment).map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            item.status === 'completed' ? 'text-green-700' :
                            item.status === 'in_progress' ? 'text-blue-700' :
                            'text-gray-500'
                          }`}>
                            {item.event}
                          </p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    <span>Update Progress</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <SafeIcon icon={FiHeart} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Select a treatment to view details</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Treatments;