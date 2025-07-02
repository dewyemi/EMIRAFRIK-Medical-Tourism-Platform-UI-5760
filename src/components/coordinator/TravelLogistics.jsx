import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiPlane, FiMapPin, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiEdit, FiPlus } = FiIcons;

const TravelLogistics = () => {
  const { profile } = useAuth();
  const [travelArrangements, setTravelArrangements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (profile?.id) {
      fetchTravelArrangements();
    }
  }, [profile]);

  const fetchTravelArrangements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          user_profiles_healthcare!patient_journeys_healthcare_patient_id_fkey(
            full_name, email, phone_number, country
          ),
          treatment_options_healthcare(name),
          healthcare_providers_healthcare(facility_name, location)
        `)
        .in('status', ['approved', 'travel_prep', 'in_treatment', 'recovery'])
        .order('travel_date', { ascending: true });

      if (error) throw error;
      setTravelArrangements(data || []);
    } catch (error) {
      console.error('Error fetching travel arrangements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArrangements = travelArrangements.filter(arrangement => {
    if (selectedFilter === 'all') return true;
    return arrangement.status === selectedFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800',
      'travel_prep': 'bg-blue-100 text-blue-800',
      'in_treatment': 'bg-orange-100 text-orange-800',
      'recovery': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const mockTravelDetails = [
    {
      type: 'Flight',
      details: 'Emirates EK 123 - Dubai International Airport',
      time: '14:30 - 22:45',
      status: 'Confirmed'
    },
    {
      type: 'Hotel',
      details: 'Four Points by Sheraton Dubai',
      time: 'Check-in: Dec 15, Check-out: Dec 25',
      status: 'Booked'
    },
    {
      type: 'Transport',
      details: 'Airport Transfer & Hospital Transport',
      time: 'As per schedule',
      status: 'Arranged'
    }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Travel & Logistics</h1>
            <p className="text-gray-600 mt-2">Manage patient travel arrangements and logistics</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>New Arrangement</span>
          </button>
        </div>
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
            { id: 'all', label: 'All Patients', count: travelArrangements.length },
            { id: 'travel_prep', label: 'Travel Prep', count: travelArrangements.filter(a => a.status === 'travel_prep').length },
            { id: 'in_treatment', label: 'In Treatment', count: travelArrangements.filter(a => a.status === 'in_treatment').length },
            { id: 'recovery', label: 'Recovery', count: travelArrangements.filter(a => a.status === 'recovery').length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedFilter === filter.id
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading travel arrangements...</p>
        </div>
      ) : filteredArrangements.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiPlane} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No travel arrangements found</h3>
          <p className="text-gray-600">No patients match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredArrangements.map((arrangement, index) => (
            <motion.div
              key={arrangement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiPlane} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {arrangement.user_profiles_healthcare?.full_name}
                    </h3>
                    <p className="text-gray-600">
                      {arrangement.treatment_options_healthcare?.name} at {arrangement.healthcare_providers_healthcare?.facility_name}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(arrangement.status)}`}>
                        {arrangement.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                        {arrangement.user_profiles_healthcare?.country} → Dubai
                      </div>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Contact Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Patient</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{arrangement.user_profiles_healthcare?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{arrangement.user_profiles_healthcare?.phone_number || 'Not provided'}</span>
                </div>
              </div>

              {/* Travel Details */}
              <div className="grid lg:grid-cols-3 gap-6">
                {mockTravelDetails.map((detail, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{detail.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        detail.status === 'Confirmed' || detail.status === 'Booked'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {detail.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{detail.details}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <SafeIcon icon={FiClock} className="w-3 h-3" />
                      <span>{detail.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Travel Timeline</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Dec 14', time: '18:00', event: 'Departure from home country', status: 'pending' },
                    { date: 'Dec 15', time: '08:30', event: 'Arrival in Dubai', status: 'pending' },
                    { date: 'Dec 15', time: '10:00', event: 'Hotel check-in', status: 'pending' },
                    { date: 'Dec 16', time: '09:00', event: 'Hospital consultation', status: 'pending' }
                  ].map((timeline, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{timeline.event}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {timeline.date} at {timeline.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelLogistics;