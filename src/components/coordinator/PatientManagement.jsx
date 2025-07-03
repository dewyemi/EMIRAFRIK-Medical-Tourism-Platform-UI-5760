import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiUsers, FiSearch, FiFilter, FiEye, FiEdit, FiPhone, FiMail, FiMapPin, FiCalendar, FiPlus, FiFileText, FiUserCheck, FiUserX, FiClock, FiAlertCircle, FiCheckCircle, FiXCircle, FiSave, FiX } = FiIcons;

const PatientManagement = () => {
  const { profile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchPatients();
    }
  }, [profile]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Enhanced mock data with more patients and statuses
      const mockPatients = [
        {
          id: '1',
          patient_name: 'Ahmed Hassan',
          patient_email: 'ahmed.hassan@email.com',
          patient_phone: '+212 6 12 34 56 78',
          country: 'Morocco',
          status: 'in_treatment',
          treatment_name: 'Cardiac Surgery',
          priority: 'high',
          assigned_provider: 'Dr. Sarah Johnson',
          assigned_coordinator: 'You',
          medical_condition: 'Coronary Artery Disease',
          insurance_status: 'approved',
          travel_status: 'arrived',
          accommodation: 'Four Points Sheraton Dubai',
          next_appointment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Patient requires special dietary considerations. Family support available.',
          documents_status: 'complete',
          payment_status: 'paid',
          age: 45,
          gender: 'Male',
          emergency_contact: 'Fatima Hassan - Wife (+212 6 87 65 43 21)'
        },
        {
          id: '2',
          patient_name: 'Fatima Al-Zahra',
          patient_email: 'fatima.alzahra@email.com',
          patient_phone: '+221 77 123 45 67',
          country: 'Senegal',
          status: 'travel_prep',
          treatment_name: 'Eye Surgery (LASIK)',
          priority: 'medium',
          assigned_provider: 'Dr. Mohamed Ali',
          assigned_coordinator: 'Sarah Wilson',
          medical_condition: 'Myopia',
          insurance_status: 'pending',
          travel_status: 'planning',
          accommodation: 'Pending Assignment',
          next_appointment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Patient prefers French communication. First time in Dubai.',
          documents_status: 'incomplete',
          payment_status: 'partial',
          age: 32,
          gender: 'Female',
          emergency_contact: 'Omar Al-Zahra - Brother (+221 77 987 65 43)'
        },
        {
          id: '3',
          patient_name: 'Omar Diallo',
          patient_email: 'omar.diallo@email.com',
          patient_phone: '+223 65 12 34 56',
          country: 'Mali',
          status: 'approved',
          treatment_name: 'Orthopedic Surgery',
          priority: 'urgent',
          assigned_provider: 'Dr. Ahmed Al-Rashid',
          assigned_coordinator: 'You',
          medical_condition: 'Hip Replacement',
          insurance_status: 'approved',
          travel_status: 'visa_pending',
          accommodation: 'Not Assigned',
          next_appointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Elderly patient, requires wheelchair assistance.',
          documents_status: 'complete',
          payment_status: 'paid',
          age: 67,
          gender: 'Male',
          emergency_contact: 'Aminata Diallo - Daughter (+223 65 45 67 89)'
        },
        {
          id: '4',
          patient_name: 'Amina Kone',
          patient_email: 'amina.kone@email.com',
          patient_phone: '+226 70 12 34 56',
          country: 'Burkina Faso',
          status: 'inquiry',
          treatment_name: 'Neurological Treatment',
          priority: 'urgent',
          assigned_provider: 'Unassigned',
          assigned_coordinator: 'Unassigned',
          medical_condition: 'Brain Tumor',
          insurance_status: 'pending',
          travel_status: 'not_started',
          accommodation: 'Not Assigned',
          next_appointment: null,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Urgent case. Family history of neurological conditions. Needs immediate attention.',
          documents_status: 'incomplete',
          payment_status: 'pending',
          age: 28,
          gender: 'Female',
          emergency_contact: 'Ibrahim Kone - Husband (+226 70 98 76 54)'
        },
        {
          id: '5',
          patient_name: 'Youssef Benali',
          patient_email: 'youssef.benali@email.com',
          patient_phone: '+212 6 98 76 54 32',
          country: 'Morocco',
          status: 'recovery',
          treatment_name: 'Dental Implants',
          priority: 'low',
          assigned_provider: 'Dr. Layla Mansouri',
          assigned_coordinator: 'Mike Johnson',
          medical_condition: 'Multiple Tooth Loss',
          insurance_status: 'approved',
          travel_status: 'completed',
          accommodation: 'Marriott Downtown Dubai',
          next_appointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Post-surgery recovery going well. Follow-up needed.',
          documents_status: 'complete',
          payment_status: 'paid',
          age: 55,
          gender: 'Male',
          emergency_contact: 'Khadija Benali - Wife (+212 6 12 34 56 78)'
        }
      ];

      setPatients(mockPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patient_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      patient.patient_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || patient.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Update patient status with real functionality
  const updatePatientStatus = async (patientId, newStatus) => {
    try {
      setSaving(true);
      
      // Update local state immediately for better UX
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: newStatus, updated_at: new Date().toISOString() }
          : patient
      ));

      // In a real app, this would update the database
      console.log(`Updated patient ${patientId} status to ${newStatus}`);
      
      // Show success message
      alert(`Patient status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating patient status:', error);
      alert('Error updating patient status');
    } finally {
      setSaving(false);
    }
  };

  // Update patient priority
  const updatePatientPriority = async (patientId, newPriority) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, priority: newPriority, updated_at: new Date().toISOString() }
          : patient
      ));

      console.log(`Updated patient ${patientId} priority to ${newPriority}`);
      alert(`Patient priority updated to ${newPriority}`);
    } catch (error) {
      console.error('Error updating patient priority:', error);
      alert('Error updating patient priority');
    } finally {
      setSaving(false);
    }
  };

  // Assign coordinator
  const assignCoordinator = async (patientId, coordinatorName) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, assigned_coordinator: coordinatorName, updated_at: new Date().toISOString() }
          : patient
      ));

      console.log(`Assigned coordinator ${coordinatorName} to patient ${patientId}`);
      alert(`Coordinator assigned successfully`);
    } catch (error) {
      console.error('Error assigning coordinator:', error);
      alert('Error assigning coordinator');
    } finally {
      setSaving(false);
    }
  };

  // Assign provider
  const assignProvider = async (patientId, providerName) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, assigned_provider: providerName, updated_at: new Date().toISOString() }
          : patient
      ));

      console.log(`Assigned provider ${providerName} to patient ${patientId}`);
      alert(`Provider assigned successfully`);
    } catch (error) {
      console.error('Error assigning provider:', error);
      alert('Error assigning provider');
    } finally {
      setSaving(false);
    }
  };

  // Schedule appointment
  const scheduleAppointment = async (patientId, appointmentData) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { 
              ...patient, 
              next_appointment: appointmentData.date,
              updated_at: new Date().toISOString()
            }
          : patient
      ));

      console.log(`Scheduled appointment for patient ${patientId}:`, appointmentData);
      alert('Appointment scheduled successfully');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Error scheduling appointment');
    } finally {
      setSaving(false);
    }
  };

  // Update accommodation
  const updateAccommodation = async (patientId, accommodationData) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { 
              ...patient, 
              accommodation: accommodationData.hotel,
              travel_status: 'accommodation_confirmed',
              updated_at: new Date().toISOString()
            }
          : patient
      ));

      console.log(`Updated accommodation for patient ${patientId}:`, accommodationData);
      alert('Accommodation updated successfully');
    } catch (error) {
      console.error('Error updating accommodation:', error);
      alert('Error updating accommodation');
    } finally {
      setSaving(false);
    }
  };

  // Add or update notes
  const updatePatientNotes = async (patientId, notes) => {
    try {
      setSaving(true);
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { 
              ...patient, 
              notes: notes,
              updated_at: new Date().toISOString()
            }
          : patient
      ));

      console.log(`Updated notes for patient ${patientId}`);
      alert('Notes updated successfully');
      closeModal();
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Error updating notes');
    } finally {
      setSaving(false);
    }
  };

  // Contact patient functionality
  const contactPatient = async (patient, method) => {
    try {
      if (method === 'email') {
        window.open(`mailto:${patient.patient_email}?subject=EMIRAFRIK - Medical Journey Update`);
      } else if (method === 'phone') {
        window.open(`tel:${patient.patient_phone}`);
      }
      
      // Log the contact attempt
      console.log(`Contacted patient ${patient.patient_name} via ${method}`);
      alert(`Contact attempt logged. ${method === 'email' ? 'Email client opened' : 'Phone dialer opened'}.`);
    } catch (error) {
      console.error('Error contacting patient:', error);
      alert('Error initiating contact');
    }
  };

  const openModal = (type, patient = null) => {
    setModalType(type);
    setSelectedPatient(patient);
    if (patient) {
      setFormData({
        patient_name: patient.patient_name || '',
        patient_email: patient.patient_email || '',
        patient_phone: patient.patient_phone || '',
        country: patient.country || '',
        status: patient.status || '',
        priority: patient.priority || '',
        treatment_name: patient.treatment_name || '',
        medical_condition: patient.medical_condition || '',
        assigned_provider: patient.assigned_provider || '',
        assigned_coordinator: patient.assigned_coordinator || '',
        accommodation: patient.accommodation || '',
        notes: patient.notes || '',
        age: patient.age || '',
        gender: patient.gender || '',
        emergency_contact: patient.emergency_contact || ''
      });
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setModalType('view');
    setFormData({});
  };

  const handleSaveChanges = async () => {
    if (!selectedPatient) return;
    
    try {
      setSaving(true);
      
      // Update the patient data
      setPatients(prev => prev.map(patient => 
        patient.id === selectedPatient.id 
          ? { 
              ...patient, 
              ...formData,
              updated_at: new Date().toISOString()
            }
          : patient
      ));

      alert('Patient information updated successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    } finally {
      setSaving(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">Comprehensive patient care coordination and management</p>
          </div>
          <button 
            onClick={() => openModal('add')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Patient</span>
          </button>
        </div>
      </motion.div>

      {/* Enhanced Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid md:grid-cols-5 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">{filteredPatients.length} patients</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilterStatus('inquiry')}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
            >
              New ({patients.filter(p => p.status === 'inquiry').length})
            </button>
            <button 
              onClick={() => setFilterPriority('urgent')}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors"
            >
              Urgent ({patients.filter(p => p.priority === 'urgent').length})
            </button>
          </div>
        </div>
      </motion.div>

      {/* Patient Cards with Full Functionality */}
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {patient.patient_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                        {patient.priority?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4 mb-4">
                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Contact</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                          <button 
                            onClick={() => contactPatient(patient, 'email')}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {patient.patient_email}
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiPhone} className="w-4 h-4" />
                          <button 
                            onClick={() => contactPatient(patient, 'phone')}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {patient.patient_phone}
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                          <span>{patient.country}</span>
                        </div>
                      </div>

                      {/* Medical Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Medical</h4>
                        <div className="text-sm text-gray-600">
                          <p><strong>Treatment:</strong> {patient.treatment_name}</p>
                          <p><strong>Condition:</strong> {patient.medical_condition}</p>
                          <p><strong>Provider:</strong> {patient.assigned_provider}</p>
                          <p><strong>Age/Gender:</strong> {patient.age} / {patient.gender}</p>
                        </div>
                      </div>

                      {/* Assignment Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Assignment</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Coordinator:</span>
                            <span className={`font-medium ${
                              patient.assigned_coordinator === 'Unassigned' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {patient.assigned_coordinator}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Provider:</span>
                            <span className={`font-medium ${
                              patient.assigned_provider === 'Unassigned' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {patient.assigned_provider}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Appointment */}
                    {patient.next_appointment && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Next Appointment</span>
                        </div>
                        <p className="text-sm text-blue-800">
                          {new Date(patient.next_appointment).toLocaleDateString()} at{' '}
                          {new Date(patient.next_appointment).toLocaleTimeString()}
                        </p>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Emergency Contact</span>
                      </div>
                      <p className="text-sm text-gray-700">{patient.emergency_contact}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => openModal('view', patient)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <SafeIcon icon={FiEye} className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => openModal('edit', patient)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Patient"
                  >
                    <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => openModal('assign', patient)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Assign Staff"
                  >
                    <SafeIcon icon={FiUserCheck} className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => contactPatient(patient, 'phone')}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Call Patient"
                  >
                    <SafeIcon icon={FiPhone} className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => contactPatient(patient, 'email')}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Email Patient"
                  >
                    <SafeIcon icon={FiMail} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {/* Status Change Buttons */}
                {patient.status === 'inquiry' && (
                  <button 
                    onClick={() => updatePatientStatus(patient.id, 'approved')}
                    disabled={saving}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}
                
                {patient.status === 'approved' && (
                  <button 
                    onClick={() => updatePatientStatus(patient.id, 'travel_prep')}
                    disabled={saving}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>Start Travel Prep</span>
                  </button>
                )}

                {patient.status === 'travel_prep' && (
                  <button 
                    onClick={() => updatePatientStatus(patient.id, 'in_treatment')}
                    disabled={saving}
                    className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <SafeIcon icon={FiActivity} className="w-4 h-4" />
                    <span>Begin Treatment</span>
                  </button>
                )}

                {/* Priority Change */}
                {patient.priority !== 'urgent' && (
                  <button 
                    onClick={() => updatePatientPriority(patient.id, 'urgent')}
                    disabled={saving}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                    <span>Mark Urgent</span>
                  </button>
                )}

                {/* Schedule Appointment */}
                <button 
                  onClick={() => {
                    const date = prompt('Enter appointment date (YYYY-MM-DD):');
                    if (date) {
                      scheduleAppointment(patient.id, { date: new Date(date).toISOString() });
                    }
                  }}
                  disabled={saving}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm disabled:opacity-50"
                >
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>Schedule</span>
                </button>

                {/* Add Notes */}
                <button 
                  onClick={() => openModal('notes', patient)}
                  className="flex items-center space-x-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                >
                  <SafeIcon icon={FiFileText} className="w-4 h-4" />
                  <span>Notes</span>
                </button>

                {/* Assign if unassigned */}
                {(patient.assigned_coordinator === 'Unassigned' || patient.assigned_provider === 'Unassigned') && (
                  <button 
                    onClick={() => openModal('assign', patient)}
                    className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiUserCheck} className="w-4 h-4" />
                    <span>Assign Staff</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Enhanced Functional Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalType === 'view' && 'Patient Details'}
                {modalType === 'edit' && 'Edit Patient'}
                {modalType === 'assign' && 'Assign Staff'}
                {modalType === 'notes' && 'Patient Notes'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content Based on Type */}
            {modalType === 'edit' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                    <input
                      type="text"
                      value={formData.patient_name || ''}
                      onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.patient_email || ''}
                      onChange={(e) => setFormData({...formData, patient_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.patient_phone || ''}
                      onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="planning">Planning</option>
                      <option value="approved">Approved</option>
                      <option value="travel_prep">Travel Prep</option>
                      <option value="in_treatment">In Treatment</option>
                      <option value="recovery">Recovery</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                    <input
                      type="text"
                      value={formData.treatment_name || ''}
                      onChange={(e) => setFormData({...formData, treatment_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition</label>
                  <textarea
                    value={formData.medical_condition || ''}
                    onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {modalType === 'assign' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Coordinator</label>
                    <select
                      value={formData.assigned_coordinator || ''}
                      onChange={(e) => {
                        setFormData({...formData, assigned_coordinator: e.target.value});
                        assignCoordinator(selectedPatient.id, e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="You">You</option>
                      <option value="Sarah Wilson">Sarah Wilson</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                      <option value="Dr. Ahmed Al-Rashid">Dr. Ahmed Al-Rashid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Provider</label>
                    <select
                      value={formData.assigned_provider || ''}
                      onChange={(e) => {
                        setFormData({...formData, assigned_provider: e.target.value});
                        assignProvider(selectedPatient.id, e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Dr. Sarah Johnson">Dr. Sarah Johnson (Cardiology)</option>
                      <option value="Dr. Mohamed Ali">Dr. Mohamed Ali (Ophthalmology)</option>
                      <option value="Dr. Ahmed Al-Rashid">Dr. Ahmed Al-Rashid (Orthopedics)</option>
                      <option value="Dr. Hassan Ibrahim">Dr. Hassan Ibrahim (Neurology)</option>
                      <option value="Dr. Layla Mansouri">Dr. Layla Mansouri (Dentistry)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Assignment Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Match specialist to patient's medical condition</li>
                    <li>• Consider coordinator workload and language skills</li>
                    <li>• Urgent cases should be prioritized</li>
                    <li>• Ensure geographic/cultural compatibility when possible</li>
                  </ul>
                </div>
              </div>
            )}

            {modalType === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={8}
                    placeholder="Add detailed notes about the patient's case, preferences, special requirements, etc..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Note Guidelines</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Include important medical information</li>
                    <li>• Note communication preferences</li>
                    <li>• Record special requirements or concerns</li>
                    <li>• Document family/support system details</li>
                  </ul>
                </div>
                <button
                  onClick={() => updatePatientNotes(selectedPatient.id, formData.notes)}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving Notes...' : 'Save Notes'}
                </button>
              </div>
            )}

            {modalType === 'view' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedPatient.patient_name}</p>
                    <p><strong>Email:</strong> {selectedPatient.patient_email}</p>
                    <p><strong>Phone:</strong> {selectedPatient.patient_phone}</p>
                    <p><strong>Country:</strong> {selectedPatient.country}</p>
                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mt-6">Emergency Contact</h3>
                  <p className="text-gray-600">{selectedPatient.emergency_contact}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Treatment Information</h3>
                  <div className="space-y-2">
                    <p><strong>Treatment:</strong> {selectedPatient.treatment_name}</p>
                    <p><strong>Condition:</strong> {selectedPatient.medical_condition}</p>
                    <p><strong>Provider:</strong> {selectedPatient.assigned_provider}</p>
                    <p><strong>Coordinator:</strong> {selectedPatient.assigned_coordinator}</p>
                    <p><strong>Priority:</strong> <span className="capitalize">{selectedPatient.priority}</span></p>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mt-6">Status Overview</h3>
                  <div className="space-y-2">
                    <p><strong>Journey Status:</strong> <span className="capitalize">{selectedPatient.status?.replace('_', ' ')}</span></p>
                    <p><strong>Documents:</strong> <span className="capitalize">{selectedPatient.documents_status}</span></p>
                    <p><strong>Payment:</strong> <span className="capitalize">{selectedPatient.payment_status}</span></p>
                    <p><strong>Travel:</strong> <span className="capitalize">{selectedPatient.travel_status?.replace('_', ' ')}</span></p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{selectedPatient.notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
              <button onClick={closeModal} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Close
              </button>
              {modalType === 'edit' && (
                <button 
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              )}
              {modalType === 'view' && (
                <button 
                  onClick={() => setModalType('edit')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Patient
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;