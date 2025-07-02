import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiUsers, FiSearch, FiFilter, FiEye, FiEdit, FiPhone, FiMail, FiMapPin, FiCalendar } = FiIcons;

const PatientManagement = () => {
  const { profile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (profile?.id) {
      fetchPatients();
    }
  }, [profile]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          user_profiles_healthcare!patient_journeys_healthcare_patient_id_fkey(
            id, full_name, email, phone_number, country
          ),
          treatment_options_healthcare(name, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.user_profiles_healthcare?.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600 mt-2">Manage and coordinate patient care journeys</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="inquiry">Inquiry</option>
                <option value="planning">Planning</option>
                <option value="approved">Approved</option>
                <option value="travel_prep">Travel Prep</option>
                <option value="in_treatment">In Treatment</option>
                <option value="recovery">Recovery</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patients List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">No patients match your current search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {patient.user_profiles_healthcare?.full_name || 'Unknown Patient'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                          <span>{patient.user_profiles_healthcare?.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiPhone} className="w-4 h-4" />
                          <span>{patient.user_profiles_healthcare?.phone_number || 'Not provided'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                          <span>{patient.user_profiles_healthcare?.country}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                          <span>Created: {new Date(patient.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {patient.treatment_options_healthcare && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">Treatment:</p>
                        <p className="text-sm text-gray-600">{patient.treatment_options_healthcare.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEye} className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientManagement;