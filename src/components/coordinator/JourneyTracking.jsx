import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiMapPin, FiClock, FiCheckCircle, FiCircle, FiArrowRight } = FiIcons;

const JourneyTracking = () => {
  const { profile } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);

  useEffect(() => {
    if (profile?.id) {
      fetchJourneys();
    }
  }, [profile]);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_journeys_healthcare')
        .select(`
          *,
          user_profiles_healthcare!patient_journeys_healthcare_patient_id_fkey(
            full_name, country
          ),
          treatment_options_healthcare(name),
          healthcare_providers_healthcare(facility_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJourneys(data || []);
    } catch (error) {
      console.error('Error fetching journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const journeySteps = [
    { id: 'inquiry', name: 'Initial Inquiry', description: 'Patient submits medical inquiry' },
    { id: 'assessment', name: 'Medical Assessment', description: 'Medical team reviews case' },
    { id: 'planning', name: 'Treatment Planning', description: 'Create personalized treatment plan' },
    { id: 'approved', name: 'Plan Approved', description: 'Treatment plan approved by patient' },
    { id: 'travel_prep', name: 'Travel Preparation', description: 'Arrange travel and accommodation' },
    { id: 'arrival', name: 'Patient Arrival', description: 'Patient arrives at destination' },
    { id: 'in_treatment', name: 'Treatment Phase', description: 'Active medical treatment' },
    { id: 'recovery', name: 'Recovery', description: 'Post-treatment recovery period' },
    { id: 'follow_up', name: 'Follow-up Care', description: 'Ongoing monitoring and care' },
    { id: 'completed', name: 'Journey Complete', description: 'Treatment successfully completed' }
  ];

  const getStepStatus = (journey, stepId) => {
    const currentStepIndex = journeySteps.findIndex(step => step.id === journey.status);
    const stepIndex = journeySteps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Journey Tracking</h1>
        <p className="text-gray-600 mt-2">Track and monitor patient treatment journeys</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Journeys List */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Journeys</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            ) : journeys.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiMapPin} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No active journeys</p>
              </div>
            ) : (
              <div className="space-y-3">
                {journeys.map((journey) => (
                  <div
                    key={journey.id}
                    onClick={() => setSelectedJourney(journey)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedJourney?.id === journey.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">
                      {journey.user_profiles_healthcare?.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {journey.treatment_options_healthcare?.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(journey.status)}`}>
                        {journey.status?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {journey.user_profiles_healthcare?.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Journey Timeline */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {selectedJourney ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Journey Timeline - {selectedJourney.user_profiles_healthcare?.full_name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedJourney.treatment_options_healthcare?.name} at {selectedJourney.healthcare_providers_healthcare?.facility_name}
                  </p>
                </div>

                <div className="space-y-6">
                  {journeySteps.map((step, index) => {
                    const status = getStepStatus(selectedJourney, step.id);
                    return (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            status === 'completed'
                              ? 'bg-green-500 text-white'
                              : status === 'current'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {status === 'completed' ? (
                              <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
                            ) : (
                              <SafeIcon icon={FiCircle} className="w-5 h-5" />
                            )}
                          </div>
                          {index < journeySteps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-2 ${
                              status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3 className={`font-medium ${
                            status === 'completed'
                              ? 'text-green-700'
                              : status === 'current'
                              ? 'text-blue-700'
                              : 'text-gray-500'
                          }`}>
                            {step.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          {status === 'current' && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                                Current Step
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Journey Details */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Journey Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedJourney.created_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Duration:</span>
                      <span className="ml-2 font-medium">{selectedJourney.expected_duration || 'TBD'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <span className="ml-2 font-medium capitalize">{selectedJourney.priority || 'Standard'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Coordinator:</span>
                      <span className="ml-2 font-medium">{selectedJourney.coordinator_notes || 'Assigned'}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <SafeIcon icon={FiMapPin} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Journey</h3>
                <p className="text-gray-600">Choose a patient journey from the list to view the timeline</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JourneyTracking;