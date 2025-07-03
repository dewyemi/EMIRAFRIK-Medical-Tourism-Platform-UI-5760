import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiUserCheck, FiUsers, FiSearch, FiFilter, FiArrowRight, FiClock, FiCheckCircle, FiAlertTriangle, FiX, FiSave } = FiIcons;

const PatientAssignment = () => {
  const { profile } = useAuth();
  const [unassignedPatients, setUnassignedPatients] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    coordinatorId: '',
    providerId: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock unassigned patients with more comprehensive data
      const mockUnassignedPatients = [
        {
          id: '6',
          patient_name: 'Mariam Traore',
          patient_email: 'mariam.traore@email.com',
          patient_phone: '+225 07 12 34 56 78',
          country: 'Ivory Coast',
          treatment_name: 'Cardiac Surgery',
          priority: 'urgent',
          medical_condition: 'Heart Valve Replacement',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          waiting_time: '1 day',
          age: 52,
          gender: 'Female',
          languages: ['French'],
          insurance_status: 'pending',
          budget_range: '$20,000-$30,000'
        },
        {
          id: '7',
          patient_name: 'Khalil Mansouri',
          patient_email: 'khalil.mansouri@email.com',
          patient_phone: '+216 98 123 456',
          country: 'Tunisia',
          treatment_name: 'Orthopedic Surgery',
          priority: 'high',
          medical_condition: 'Knee Replacement',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          waiting_time: '3 days',
          age: 45,
          gender: 'Male',
          languages: ['Arabic', 'French'],
          insurance_status: 'approved',
          budget_range: '$15,000-$25,000'
        },
        {
          id: '8',
          patient_name: 'Aisha Diop',
          patient_email: 'aisha.diop@email.com',
          patient_phone: '+221 77 987 65 43',
          country: 'Senegal',
          treatment_name: 'Eye Surgery',
          priority: 'medium',
          medical_condition: 'Cataract Surgery',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          waiting_time: '2 days',
          age: 38,
          gender: 'Female',
          languages: ['French'],
          insurance_status: 'approved',
          budget_range: '$8,000-$12,000'
        },
        {
          id: '9',
          patient_name: 'Hassan Al-Mahmoud',
          patient_email: 'hassan.mahmoud@email.com',
          patient_phone: '+971 50 123 4567',
          country: 'UAE',
          treatment_name: 'Neurological Treatment',
          priority: 'urgent',
          medical_condition: 'Brain Aneurysm',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          waiting_time: '4 hours',
          age: 41,
          gender: 'Male',
          languages: ['Arabic', 'English'],
          insurance_status: 'approved',
          budget_range: '$40,000-$60,000'
        }
      ];

      // Mock coordinators with detailed information
      const mockCoordinators = [
        {
          id: 'coord1',
          name: 'Sarah Wilson',
          specialization: 'Cardiac & Emergency Cases',
          current_load: 8,
          max_capacity: 15,
          availability: 'available',
          languages: ['English', 'French'],
          experience_years: 5,
          success_rate: 95,
          location: 'Dubai'
        },
        {
          id: 'coord2',
          name: 'Mike Johnson',
          specialization: 'Orthopedic & Rehabilitation',
          current_load: 12,
          max_capacity: 15,
          availability: 'busy',
          languages: ['English', 'Arabic'],
          experience_years: 7,
          success_rate: 92,
          location: 'Dubai'
        },
        {
          id: 'coord3',
          name: 'You',
          specialization: 'General Cases & French-speaking',
          current_load: 5,
          max_capacity: 20,
          availability: 'available',
          languages: ['English', 'French', 'Arabic'],
          experience_years: 3,
          success_rate: 97,
          location: 'Dubai'
        },
        {
          id: 'coord4',
          name: 'Dr. Amina Hassan',
          specialization: 'Neurological & Critical Cases',
          current_load: 6,
          max_capacity: 12,
          availability: 'available',
          languages: ['Arabic', 'English'],
          experience_years: 8,
          success_rate: 98,
          location: 'Dubai'
        }
      ];

      // Mock providers with comprehensive details
      const mockProviders = [
        {
          id: 'prov1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          hospital: 'Dubai Heart Institute',
          availability: 'available',
          experience_years: 12,
          success_rate: 96,
          languages: ['English', 'Arabic'],
          next_available: 'Today'
        },
        {
          id: 'prov2',
          name: 'Dr. Ahmed Al-Rashid',
          specialization: 'Orthopedics',
          hospital: 'Dubai Orthopedic Center',
          availability: 'available',
          experience_years: 15,
          success_rate: 94,
          languages: ['Arabic', 'English'],
          next_available: 'Tomorrow'
        },
        {
          id: 'prov3',
          name: 'Dr. Mohamed Ali',
          specialization: 'Ophthalmology',
          hospital: 'Emirates Eye Hospital',
          availability: 'limited',
          experience_years: 10,
          success_rate: 97,
          languages: ['Arabic', 'English', 'French'],
          next_available: '3 days'
        },
        {
          id: 'prov4',
          name: 'Dr. Hassan Ibrahim',
          specialization: 'Neurosurgery',
          hospital: 'Dubai Neurological Center',
          availability: 'available',
          experience_years: 18,
          success_rate: 99,
          languages: ['Arabic', 'English'],
          next_available: 'Today'
        }
      ];

      setUnassignedPatients(mockUnassignedPatients);
      setCoordinators(mockCoordinators);
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching assignment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignPatient = async (patientId, coordinatorId, providerId, notes = '') => {
    try {
      setSaving(true);
      
      // Update assignments
      setAssignments(prev => ({
        ...prev,
        [patientId]: { 
          coordinatorId, 
          providerId, 
          notes,
          assigned_at: new Date().toISOString(),
          assigned_by: profile.full_name || 'Current User'
        }
      }));

      // Remove from unassigned list
      setUnassignedPatients(prev => prev.filter(p => p.id !== patientId));

      // Update coordinator load
      setCoordinators(prev => prev.map(coord => 
        coord.id === coordinatorId 
          ? { ...coord, current_load: coord.current_load + 1 }
          : coord
      ));

      // Log the assignment
      console.log(`Assigned patient ${patientId} to coordinator ${coordinatorId} and provider ${providerId}`);
      
      // Show success message
      alert('Patient assigned successfully!');
      
      // Close modal if open
      setIsModalOpen(false);
      setSelectedPatient(null);
      
    } catch (error) {
      console.error('Error assigning patient:', error);
      alert('Error assigning patient. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getRecommendedCoordinator = (patient) => {
    const availableCoordinators = coordinators.filter(c => 
      c.availability === 'available' && c.current_load < c.max_capacity
    );

    // Priority scoring system
    let bestMatch = null;
    let bestScore = 0;

    availableCoordinators.forEach(coordinator => {
      let score = 0;
      
      // Specialization match
      if (patient.treatment_name.includes('Cardiac') && coordinator.specialization.includes('Cardiac')) score += 50;
      if (patient.treatment_name.includes('Orthopedic') && coordinator.specialization.includes('Orthopedic')) score += 50;
      if (patient.treatment_name.includes('Neurological') && coordinator.specialization.includes('Neurological')) score += 50;
      if (patient.priority === 'urgent' && coordinator.specialization.includes('Emergency')) score += 30;
      
      // Language match
      if (patient.languages && patient.languages.some(lang => coordinator.languages.includes(lang))) score += 20;
      
      // Workload consideration (lower load = higher score)
      score += (coordinator.max_capacity - coordinator.current_load) * 2;
      
      // Experience and success rate
      score += coordinator.success_rate * 0.1;
      score += coordinator.experience_years;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = coordinator;
      }
    });

    return bestMatch || availableCoordinators[0];
  };

  const getRecommendedProvider = (patient) => {
    const availableProviders = providers.filter(p => p.availability !== 'unavailable');
    
    let bestMatch = null;
    let bestScore = 0;

    availableProviders.forEach(provider => {
      let score = 0;
      
      // Specialization exact match
      if (patient.treatment_name.includes('Cardiac') && provider.specialization === 'Cardiology') score += 100;
      if (patient.treatment_name.includes('Orthopedic') && provider.specialization === 'Orthopedics') score += 100;
      if (patient.treatment_name.includes('Eye') && provider.specialization === 'Ophthalmology') score += 100;
      if (patient.treatment_name.includes('Neurological') && provider.specialization === 'Neurosurgery') score += 100;
      
      // Availability bonus
      if (provider.availability === 'available') score += 30;
      if (provider.next_available === 'Today') score += 20;
      
      // Language match
      if (patient.languages && patient.languages.some(lang => provider.languages.includes(lang))) score += 15;
      
      // Experience and success rate
      score += provider.success_rate * 0.1;
      score += provider.experience_years * 0.5;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = provider;
      }
    });

    return bestMatch;
  };

  const openAssignmentModal = (patient) => {
    setSelectedPatient(patient);
    const recommendedCoordinator = getRecommendedCoordinator(patient);
    const recommendedProvider = getRecommendedProvider(patient);
    
    setAssignmentData({
      coordinatorId: recommendedCoordinator?.id || '',
      providerId: recommendedProvider?.id || '',
      notes: `Auto-recommended based on: ${patient.treatment_name}, Priority: ${patient.priority}, Languages: ${patient.languages?.join(', ')}`
    });
    
    setIsModalOpen(true);
  };

  const handleAssignment = () => {
    if (!selectedPatient || !assignmentData.coordinatorId || !assignmentData.providerId) {
      alert('Please select both coordinator and provider');
      return;
    }
    
    assignPatient(
      selectedPatient.id,
      assignmentData.coordinatorId,
      assignmentData.providerId,
      assignmentData.notes
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Patient Assignment</h1>
        <p className="text-gray-600 mt-2">Intelligently assign patients to coordinators and healthcare providers</p>
      </motion.div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-2xl font-bold text-gray-900">{unassignedPatients.length}</p>
              <p className="text-xs text-red-600">
                {unassignedPatients.filter(p => p.priority === 'urgent').length} urgent
              </p>
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
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Coordinators</p>
              <p className="text-2xl font-bold text-gray-900">
                {coordinators.filter(c => c.availability === 'available').length}
              </p>
              <p className="text-xs text-green-600">
                {coordinators.reduce((sum, c) => sum + (c.max_capacity - c.current_load), 0)} total capacity
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
              <SafeIcon icon={FiUserCheck} className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.availability === 'available').length}
              </p>
              <p className="text-xs text-blue-600">
                {providers.filter(p => p.next_available === 'Today').length} available today
              </p>
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
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(unassignedPatients.reduce((sum, p) => {
                  const hours = parseInt(p.waiting_time);
                  return sum + (isNaN(hours) ? 24 : hours);
                }, 0) / unassignedPatients.length) || 0}h
              </p>
              <p className="text-xs text-orange-600">
                Target: &lt;12h
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unassigned Patients with Enhanced Assignment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Unassigned Patients</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : unassignedPatients.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiCheckCircle} className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Patients Assigned</h3>
            <p className="text-gray-600">Great job! All patients have been assigned to coordinators.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unassignedPatients.map((patient, index) => {
              const recommendedCoordinator = getRecommendedCoordinator(patient);
              const recommendedProvider = getRecommendedProvider(patient);
              
              return (
                <div key={patient.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-5 gap-4 items-center">
                    {/* Patient Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{patient.patient_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                          {patient.priority?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{patient.treatment_name}</p>
                      <p className="text-sm text-gray-500">{patient.country} • {patient.age}y {patient.gender}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <SafeIcon icon={FiClock} className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">Waiting: {patient.waiting_time}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Languages: {patient.languages?.join(', ')}
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-900 mb-1">Medical Details</p>
                      <p className="text-xs text-gray-600">{patient.medical_condition}</p>
                      <p className="text-xs text-gray-500 mt-1">Budget: {patient.budget_range}</p>
                      <p className="text-xs text-gray-500">Insurance: {patient.insurance_status}</p>
                    </div>

                    {/* Recommended Coordinator */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-900 mb-1">Recommended Coordinator</p>
                      <p className="font-medium text-gray-900">{recommendedCoordinator?.name}</p>
                      <p className="text-xs text-gray-600">{recommendedCoordinator?.specialization}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        Load: {recommendedCoordinator?.current_load}/{recommendedCoordinator?.max_capacity}
                        <span className="text-green-600 ml-1">({recommendedCoordinator?.success_rate}% success)</span>
                      </div>
                    </div>

                    {/* Recommended Provider */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-green-900 mb-1">Recommended Provider</p>
                      <p className="font-medium text-gray-900">{recommendedProvider?.name}</p>
                      <p className="text-xs text-gray-600">{recommendedProvider?.specialization}</p>
                      <p className="text-xs text-gray-500">{recommendedProvider?.hospital}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        Available: {recommendedProvider?.next_available}
                        <span className="text-green-600 ml-1">({recommendedProvider?.success_rate}% success)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => assignPatient(
                          patient.id, 
                          recommendedCoordinator?.id, 
                          recommendedProvider?.id,
                          'Auto-assigned based on AI recommendations'
                        )}
                        disabled={saving || !recommendedCoordinator || !recommendedProvider}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1 disabled:opacity-50"
                      >
                        <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
                        <span>{saving ? 'Assigning...' : 'Auto Assign'}</span>
                      </button>
                      <button 
                        onClick={() => openAssignmentModal(patient)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Manual Assign
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Team Overview with Enhanced Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Coordinators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Care Coordinators</h2>
          <div className="space-y-4">
            {coordinators.map((coordinator) => (
              <div key={coordinator.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{coordinator.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coordinator.availability === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {coordinator.availability}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{coordinator.specialization}</p>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">
                    Load: {coordinator.current_load}/{coordinator.max_capacity}
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        coordinator.current_load / coordinator.max_capacity > 0.8 
                          ? 'bg-red-500' 
                          : coordinator.current_load / coordinator.max_capacity > 0.6
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(coordinator.current_load / coordinator.max_capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>Experience: {coordinator.experience_years}y</div>
                  <div>Success: {coordinator.success_rate}%</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Languages: {coordinator.languages.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Providers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Healthcare Providers</h2>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    provider.availability === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : provider.availability === 'limited'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.availability}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{provider.specialization}</p>
                <p className="text-sm text-gray-500">{provider.hospital}</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-2">
                  <div>Experience: {provider.experience_years}y</div>
                  <div>Success: {provider.success_rate}%</div>
                  <div>Available: {provider.next_available}</div>
                  <div>Languages: {provider.languages.slice(0, 2).join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Assignment Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Patient: {selectedPatient.patient_name}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Patient Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Treatment:</strong> {selectedPatient.treatment_name}</p>
                  <p><strong>Condition:</strong> {selectedPatient.medical_condition}</p>
                  <p><strong>Priority:</strong> <span className="capitalize">{selectedPatient.priority}</span></p>
                  <p><strong>Country:</strong> {selectedPatient.country}</p>
                  <p><strong>Languages:</strong> {selectedPatient.languages?.join(', ')}</p>
                  <p><strong>Budget:</strong> {selectedPatient.budget_range}</p>
                  <p><strong>Insurance:</strong> {selectedPatient.insurance_status}</p>
                  <p><strong>Waiting:</strong> {selectedPatient.waiting_time}</p>
                </div>
              </div>

              {/* Assignment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Coordinator *
                  </label>
                  <select
                    value={assignmentData.coordinatorId}
                    onChange={(e) => setAssignmentData({...assignmentData, coordinatorId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose coordinator...</option>
                    {coordinators.filter(c => c.availability === 'available').map(coordinator => (
                      <option key={coordinator.id} value={coordinator.id}>
                        {coordinator.name} - {coordinator.specialization} 
                        ({coordinator.current_load}/{coordinator.max_capacity}) - {coordinator.success_rate}% success
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Provider *
                  </label>
                  <select
                    value={assignmentData.providerId}
                    onChange={(e) => setAssignmentData({...assignmentData, providerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose provider...</option>
                    {providers.filter(p => p.availability !== 'unavailable').map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.specialization} 
                        ({provider.hospital}) - Available: {provider.next_available}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Notes
                  </label>
                  <textarea
                    value={assignmentData.notes}
                    onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add notes about this assignment..."
                  />
                </div>
              </div>
            </div>

            {/* Assignment Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Assignment Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Match specialist expertise to patient's medical condition</li>
                <li>• Consider coordinator workload and language compatibility</li>
                <li>• Prioritize urgent cases for immediate availability</li>
                <li>• Factor in cultural/geographic preferences when possible</li>
                <li>• Review provider success rates and experience levels</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignment}
                disabled={saving || !assignmentData.coordinatorId || !assignmentData.providerId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>{saving ? 'Assigning...' : 'Assign Patient'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAssignment;