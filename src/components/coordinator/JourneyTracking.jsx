import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiMapPin, FiClock, FiCheckCircle, FiCircle, FiArrowRight, FiEdit, FiPlus, FiCalendar, FiUser, FiPhone, FiMail } = FiIcons;

const JourneyTracking = () => {
  const { profile } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepUpdate, setStepUpdate] = useState({
    status: '',
    notes: '',
    estimated_completion: ''
  });

  useEffect(() => {
    if (profile?.id) {
      fetchJourneys();
    }
  }, [profile]);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      
      // Enhanced mock data with more detailed journey tracking
      const mockJourneys = [
        {
          id: '1',
          patient_name: 'Ahmed Hassan',
          country: 'Morocco',
          status: 'in_treatment',
          treatment_name: 'Cardiac Surgery',
          facility_name: 'Dubai Heart Institute',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          patient_phone: '+212 6 12 34 56 78',
          patient_email: 'ahmed.hassan@email.com',
          coordinator: 'You',
          provider: 'Dr. Sarah Johnson',
          estimated_duration: '14 days',
          actual_duration: '10 days',
          completion_percentage: 70
        },
        {
          id: '2',
          patient_name: 'Fatima Al-Zahra',
          country: 'Senegal',
          status: 'travel_prep',
          treatment_name: 'Eye Surgery',
          facility_name: 'Emirates Eye Hospital',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          patient_phone: '+221 77 123 45 67',
          patient_email: 'fatima.alzahra@email.com',
          coordinator: 'Sarah Wilson',
          provider: 'Dr. Mohamed Ali',
          estimated_duration: '7 days',
          actual_duration: '7 days',
          completion_percentage: 40
        },
        {
          id: '3',
          patient_name: 'Omar Diallo',
          country: 'Mali',
          status: 'approved',
          treatment_name: 'Neurological Treatment',
          facility_name: 'Dubai Neurological Center',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          patient_phone: '+223 65 12 34 56',
          patient_email: 'omar.diallo@email.com',
          coordinator: 'You',
          provider: 'Dr. Hassan Ibrahim',
          estimated_duration: '21 days',
          actual_duration: '5 days',
          completion_percentage: 20
        }
      ];

      setJourneys(mockJourneys);
      if (mockJourneys.length > 0) {
        setSelectedJourney(mockJourneys[0]);
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
      setJourneys([]);
    } finally {
      setLoading(false);
    }
  };

  const journeySteps = [
    {
      id: 'inquiry',
      name: 'Initial Inquiry',
      description: 'Patient submits medical inquiry',
      estimated_duration: '1 day',
      required_documents: ['Medical history', 'Current symptoms'],
      stakeholders: ['Patient', 'Customer Service']
    },
    {
      id: 'assessment',
      name: 'Medical Assessment',
      description: 'Medical team reviews case',
      estimated_duration: '2-3 days',
      required_documents: ['Medical reports', 'Test results'],
      stakeholders: ['Medical Team', 'Coordinator']
    },
    {
      id: 'planning',
      name: 'Treatment Planning',
      description: 'Create personalized treatment plan',
      estimated_duration: '1-2 days',
      required_documents: ['Treatment plan', 'Cost estimate'],
      stakeholders: ['Doctor', 'Coordinator']
    },
    {
      id: 'approved',
      name: 'Plan Approved',
      description: 'Treatment plan approved by patient',
      estimated_duration: '1 day',
      required_documents: ['Signed consent', 'Payment confirmation'],
      stakeholders: ['Patient', 'Finance Team']
    },
    {
      id: 'travel_prep',
      name: 'Travel Preparation',
      description: 'Arrange travel and accommodation',
      estimated_duration: '3-5 days',
      required_documents: ['Visa', 'Flight booking', 'Hotel booking'],
      stakeholders: ['Travel Coordinator', 'Patient']
    },
    {
      id: 'arrival',
      name: 'Patient Arrival',
      description: 'Patient arrives at destination',
      estimated_duration: '1 day',
      required_documents: ['Arrival confirmation', 'Check-in completed'],
      stakeholders: ['Airport Transfer', 'Hotel', 'Coordinator']
    },
    {
      id: 'in_treatment',
      name: 'Treatment Phase',
      description: 'Active medical treatment',
      estimated_duration: '3-7 days',
      required_documents: ['Medical records', 'Treatment progress'],
      stakeholders: ['Doctor', 'Nurses', 'Coordinator']
    },
    {
      id: 'recovery',
      name: 'Recovery',
      description: 'Post-treatment recovery period',
      estimated_duration: '2-5 days',
      required_documents: ['Recovery notes', 'Discharge plan'],
      stakeholders: ['Medical Team', 'Coordinator']
    },
    {
      id: 'follow_up',
      name: 'Follow-up Care',
      description: 'Ongoing monitoring and care',
      estimated_duration: '1-2 weeks',
      required_documents: ['Follow-up schedule', 'Instructions'],
      stakeholders: ['Doctor', 'Patient', 'Coordinator']
    },
    {
      id: 'completed',
      name: 'Journey Complete',
      description: 'Treatment successfully completed',
      estimated_duration: '1 day',
      required_documents: ['Final report', 'Satisfaction survey'],
      stakeholders: ['All parties']
    }
  ];

  const getStepStatus = (journey, stepId) => {
    const currentStepIndex = journeySteps.findIndex(step => step.id === journey.status);
    const stepIndex = journeySteps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const updateJourneyStep = async (journeyId, newStatus, notes = '') => {
    try {
      // Update journey status
      setJourneys(prev => prev.map(journey => 
        journey.id === journeyId 
          ? { 
              ...journey, 
              status: newStatus,
              updated_at: new Date().toISOString()
            }
          : journey
      ));

      // Update selected journey if it's the one being updated
      if (selectedJourney?.id === journeyId) {
        setSelectedJourney(prev => ({
          ...prev,
          status: newStatus,
          updated_at: new Date().toISOString()
        }));
      }

      console.log(`Updated journey ${journeyId} to status ${newStatus}`);
      alert(`Journey step updated successfully to: ${newStatus.replace('_', ' ')}`);
      
      setIsStepModalOpen(false);
    } catch (error) {
      console.error('Error updating journey step:', error);
      alert('Error updating journey step');
    }
  };

  const addJourneyNote = async (journeyId, note) => {
    try {
      // In a real app, this would save to the database
      console.log(`Added note to journey ${journeyId}: ${note}`);
      alert('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note');
    }
  };

  const contactPatient = (journey, method) => {
    try {
      if (method === 'phone') {
        window.open(`tel:${journey.patient_phone}`);
      } else if (method === 'email') {
        window.open(`mailto:${journey.patient_email}?subject=EMIRAFRIK - Journey Update for ${journey.treatment_name}`);
      }
      
      console.log(`Contacted ${journey.patient_name} via ${method}`);
      alert(`Contact initiated via ${method}`);
    } catch (error) {
      console.error('Error contacting patient:', error);
      alert('Error initiating contact');
    }
  };

  const openStepModal = (step, journey) => {
    setSelectedStep(step);
    setStepUpdate({
      status: step.id,
      notes: '',
      estimated_completion: ''
    });
    setIsStepModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'inquiry': 'bg-yellow-100 text-yellow-800',
      'assessment': 'bg-blue-100 text-blue-800',
      'planning': 'bg-purple-100 text-purple-800',
      'approved': 'bg-green-100 text-green-800',
      'travel_prep': 'bg-indigo-100 text-indigo-800',
      'arrival': 'bg-cyan-100 text-cyan-800',
      'in_treatment': 'bg-orange-100 text-orange-800',
      'recovery': 'bg-pink-100 text-pink-800',
      'follow_up': 'bg-gray-100 text-gray-800',
      'completed': 'bg-green-100 text-green-800'
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
        <p className="text-gray-600 mt-2">Track and monitor patient treatment journeys with real-time updates</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Enhanced Journeys List */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Journeys</h2>
              <button
                onClick={() => alert('Add new journey functionality would be implemented here')}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
              </button>
            </div>
            
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
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedJourney?.id === journey.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {journey.patient_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(journey.status)}`}>
                        {journey.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {journey.treatment_name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{journey.country}</span>
                      <span>{journey.completion_percentage}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${journey.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Journey Timeline */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {selectedJourney ? (
              <>
                {/* Journey Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedJourney.patient_name}'s Journey
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => contactPatient(selectedJourney, 'phone')}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call Patient"
                      >
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => contactPatient(selectedJourney, 'email')}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Email Patient"
                      >
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const note = prompt('Add a note to this journey:');
                          if (note) addJourneyNote(selectedJourney.id, note);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Add Note"
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Treatment:</strong> {selectedJourney.treatment_name}</p>
                      <p><strong>Facility:</strong> {selectedJourney.facility_name}</p>
                      <p><strong>Country:</strong> {selectedJourney.country}</p>
                    </div>
                    <div>
                      <p><strong>Coordinator:</strong> {selectedJourney.coordinator}</p>
                      <p><strong>Provider:</strong> {selectedJourney.provider}</p>
                      <p><strong>Duration:</strong> {selectedJourney.actual_duration} / {selectedJourney.estimated_duration}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Timeline */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Treatment Timeline</h3>
                  
                  {journeySteps.map((step, index) => {
                    const status = getStepStatus(selectedJourney, step.id);
                    const isClickable = status === 'current' || status === 'pending';
                    
                    return (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => isClickable ? openStepModal(step, selectedJourney) : null}
                            disabled={!isClickable}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              status === 'completed'
                                ? 'bg-green-500 text-white'
                                : status === 'current'
                                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300 cursor-pointer'
                            } ${!isClickable ? 'cursor-not-allowed' : ''}`}
                          >
                            <SafeIcon 
                              icon={status === 'completed' ? FiCheckCircle : FiCircle} 
                              className="w-5 h-5" 
                            />
                          </button>
                          {index < journeySteps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-2 ${
                              status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${
                              status === 'completed'
                                ? 'text-green-700'
                                : status === 'current'
                                ? 'text-blue-700'
                                : 'text-gray-500'
                            }`}>
                              {step.name}
                            </h3>
                            {status === 'current' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                                Current Step
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-500">
                            <div>
                              <p><strong>Duration:</strong> {step.estimated_duration}</p>
                              <p><strong>Stakeholders:</strong> {step.stakeholders.join(', ')}</p>
                            </div>
                            <div>
                              <p><strong>Required:</strong></p>
                              <ul className="list-disc list-inside">
                                {step.required_documents.map((doc, i) => (
                                  <li key={i}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {isClickable && (
                            <button
                              onClick={() => openStepModal(step, selectedJourney)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {status === 'current' ? 'Update Step' : 'Start Step'} →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Journey Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => alert('Schedule appointment functionality would be implemented here')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>Schedule Appointment</span>
                    </button>
                    <button
                      onClick={() => contactPatient(selectedJourney, 'email')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <SafeIcon icon={FiMail} className="w-4 h-4" />
                      <span>Send Update</span>
                    </button>
                    <button
                      onClick={() => alert('Generate report functionality would be implemented here')}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      <span>Generate Report</span>
                    </button>
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

      {/* Step Update Modal */}
      {isStepModalOpen && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Update: {selectedStep.name}
              </h2>
              <button 
                onClick={() => setIsStepModalOpen(false)} 
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Step Details</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedStep.description}</p>
                <p className="text-sm text-gray-500">
                  <strong>Duration:</strong> {selectedStep.estimated_duration} | 
                  <strong> Stakeholders:</strong> {selectedStep.stakeholders.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Status
                </label>
                <select
                  value={stepUpdate.status}
                  onChange={(e) => setStepUpdate({...stepUpdate, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={selectedStep.id}>Complete This Step</option>
                  <option value="pending">Mark as Pending</option>
                  <option value="in_progress">Mark as In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Notes
                </label>
                <textarea
                  value={stepUpdate.notes}
                  onChange={(e) => setStepUpdate({...stepUpdate, notes: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about this step update..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion
                </label>
                <input
                  type="datetime-local"
                  value={stepUpdate.estimated_completion}
                  onChange={(e) => setStepUpdate({...stepUpdate, estimated_completion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  onClick={() => setIsStepModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Move to next step in sequence
                    const currentIndex = journeySteps.findIndex(s => s.id === selectedJourney.status);
                    const nextStep = journeySteps[currentIndex + 1];
                    const newStatus = nextStep ? nextStep.id : 'completed';
                    
                    updateJourneyStep(selectedJourney.id, newStatus, stepUpdate.notes);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Step
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyTracking;