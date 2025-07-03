import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiHome, FiPlane, FiCar, FiCalendar, FiMapPin, FiClock, FiEdit, FiPlus, FiCheck, FiX, FiAlertTriangle } = FiIcons;

const ResourceManagement = () => {
  const { profile } = useAuth();
  const [resources, setResources] = useState({
    accommodation: [],
    transportation: [],
    appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accommodation');

  useEffect(() => {
    if (profile?.id) {
      fetchResources();
    }
  }, [profile]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      // Mock accommodation data
      const mockAccommodation = [
        {
          id: 'acc1',
          patient_name: 'Ahmed Hassan',
          hotel_name: 'Four Points Sheraton Dubai',
          room_type: 'Deluxe Room',
          check_in: '2024-01-15',
          check_out: '2024-01-25',
          status: 'confirmed',
          cost: 150,
          nights: 10,
          location: 'Dubai Marina',
          amenities: ['WiFi', 'Breakfast', 'Airport Transfer']
        },
        {
          id: 'acc2',
          patient_name: 'Fatima Al-Zahra',
          hotel_name: 'Marriott Downtown Dubai',
          room_type: 'Standard Room',
          check_in: '2024-01-20',
          check_out: '2024-01-27',
          status: 'pending',
          cost: 120,
          nights: 7,
          location: 'Downtown Dubai',
          amenities: ['WiFi', 'Gym', 'Pool']
        },
        {
          id: 'acc3',
          patient_name: 'Omar Diallo',
          hotel_name: 'Holiday Inn Express',
          room_type: 'Family Room',
          check_in: '2024-01-18',
          check_out: '2024-01-30',
          status: 'confirmed',
          cost: 95,
          nights: 12,
          location: 'Dubai Healthcare City',
          amenities: ['WiFi', 'Breakfast', 'Medical Shuttle']
        }
      ];

      // Mock transportation data
      const mockTransportation = [
        {
          id: 'trans1',
          patient_name: 'Ahmed Hassan',
          type: 'Airport Transfer',
          pickup_location: 'Dubai International Airport',
          destination: 'Four Points Sheraton Dubai',
          date: '2024-01-15',
          time: '14:30',
          status: 'confirmed',
          vehicle: 'Sedan',
          cost: 75
        },
        {
          id: 'trans2',
          patient_name: 'Ahmed Hassan',
          type: 'Hospital Transfer',
          pickup_location: 'Four Points Sheraton Dubai',
          destination: 'Dubai Heart Institute',
          date: '2024-01-16',
          time: '08:00',
          status: 'scheduled',
          vehicle: 'Medical Transport',
          cost: 50
        },
        {
          id: 'trans3',
          patient_name: 'Fatima Al-Zahra',
          type: 'Airport Transfer',
          pickup_location: 'Dubai International Airport',
          destination: 'Marriott Downtown Dubai',
          date: '2024-01-20',
          time: '16:45',
          status: 'pending',
          vehicle: 'Sedan',
          cost: 85
        }
      ];

      // Mock appointments data
      const mockAppointments = [
        {
          id: 'app1',
          patient_name: 'Ahmed Hassan',
          appointment_type: 'Pre-Surgery Consultation',
          provider: 'Dr. Sarah Johnson',
          hospital: 'Dubai Heart Institute',
          date: '2024-01-16',
          time: '10:00',
          duration: 60,
          status: 'confirmed',
          room: 'Consultation Room 3A'
        },
        {
          id: 'app2',
          patient_name: 'Omar Diallo',
          appointment_type: 'Initial Assessment',
          provider: 'Dr. Ahmed Al-Rashid',
          hospital: 'Dubai Orthopedic Center',
          date: '2024-01-19',
          time: '14:30',
          duration: 45,
          status: 'scheduled',
          room: 'Assessment Room B2'
        },
        {
          id: 'app3',
          patient_name: 'Fatima Al-Zahra',
          appointment_type: 'LASIK Consultation',
          provider: 'Dr. Mohamed Ali',
          hospital: 'Emirates Eye Hospital',
          date: '2024-01-21',
          time: '11:15',
          duration: 30,
          status: 'pending',
          room: 'Eye Clinic Room 1'
        }
      ];

      setResources({
        accommodation: mockAccommodation,
        transportation: mockTransportation,
        appointments: mockAppointments
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const updateResourceStatus = (resourceType, id, newStatus) => {
    setResources(prev => ({
      ...prev,
      [resourceType]: prev[resourceType].map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    }));
  };

  const tabs = [
    { id: 'accommodation', label: 'Accommodation', icon: FiHome, count: resources.accommodation.length },
    { id: 'transportation', label: 'Transportation', icon: FiCar, count: resources.transportation.length },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, count: resources.appointments.length }
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
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-2">Manage patient accommodation, transportation, and appointments</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Resource</span>
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-2 mb-8"
      >
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      ) : (
        <>
          {/* Accommodation Tab */}
          {activeTab === 'accommodation' && (
            <div className="space-y-6">
              {resources.accommodation.map((accommodation, index) => (
                <motion.div
                  key={accommodation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <SafeIcon icon={FiHome} className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{accommodation.hotel_name}</h3>
                        <p className="text-gray-600">{accommodation.patient_name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(accommodation.status)}`}>
                            {accommodation.status.toUpperCase()}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                            {accommodation.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Booking Details</h4>
                      <p className="text-sm text-gray-600"><strong>Room Type:</strong> {accommodation.room_type}</p>
                      <p className="text-sm text-gray-600"><strong>Check-in:</strong> {new Date(accommodation.check_in).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600"><strong>Check-out:</strong> {new Date(accommodation.check_out).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600"><strong>Nights:</strong> {accommodation.nights}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Cost Information</h4>
                      <p className="text-sm text-gray-600"><strong>Per Night:</strong> ${accommodation.cost}</p>
                      <p className="text-sm text-gray-600"><strong>Total Cost:</strong> ${accommodation.cost * accommodation.nights}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {accommodation.amenities.map((amenity, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-4">
                    {accommodation.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateResourceStatus('accommodation', accommodation.id, 'confirmed')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button 
                          onClick={() => updateResourceStatus('accommodation', accommodation.id, 'cancelled')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Transportation Tab */}
          {activeTab === 'transportation' && (
            <div className="space-y-6">
              {resources.transportation.map((transport, index) => (
                <motion.div
                  key={transport.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <SafeIcon icon={FiCar} className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{transport.type}</h3>
                        <p className="text-gray-600">{transport.patient_name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transport.status)}`}>
                            {transport.status.toUpperCase()}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                            {new Date(transport.date).toLocaleDateString()} at {transport.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Route Details</h4>
                      <p className="text-sm text-gray-600"><strong>From:</strong> {transport.pickup_location}</p>
                      <p className="text-sm text-gray-600"><strong>To:</strong> {transport.destination}</p>
                      <p className="text-sm text-gray-600"><strong>Vehicle:</strong> {transport.vehicle}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Cost & Schedule</h4>
                      <p className="text-sm text-gray-600"><strong>Cost:</strong> ${transport.cost}</p>
                      <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(transport.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600"><strong>Time:</strong> {transport.time}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-4">
                    {transport.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateResourceStatus('transportation', transport.id, 'confirmed')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button 
                          onClick={() => updateResourceStatus('transportation', transport.id, 'cancelled')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {resources.appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <SafeIcon icon={FiCalendar} className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{appointment.appointment_type}</h3>
                        <p className="text-gray-600">{appointment.patient_name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.toUpperCase()}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Provider Details</h4>
                      <p className="text-sm text-gray-600"><strong>Provider:</strong> {appointment.provider}</p>
                      <p className="text-sm text-gray-600"><strong>Hospital:</strong> {appointment.hospital}</p>
                      <p className="text-sm text-gray-600"><strong>Room:</strong> {appointment.room}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Appointment Info</h4>
                      <p className="text-sm text-gray-600"><strong>Duration:</strong> {appointment.duration} minutes</p>
                      <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600"><strong>Time:</strong> {appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-4">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateResourceStatus('appointments', appointment.id, 'confirmed')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button 
                          onClick={() => updateResourceStatus('appointments', appointment.id, 'cancelled')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourceManagement;