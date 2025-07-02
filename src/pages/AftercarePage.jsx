import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';

const { FiUpload, FiCalendar, FiMessageCircle, FiFileText, FiVideo, FiPhone, FiCheck, FiClock } = FiIcons;

const AftercarePage = () => {
  const { t, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('reports');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const tabs = [
    { id: 'reports', label: 'Upload Reports', icon: FiUpload },
    { id: 'consultation', label: 'Schedule Consultation', icon: FiCalendar },
    { id: 'chat', label: 'Chat with Doctor', icon: FiMessageCircle }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Ahmed Al-Rashid',
      specialty: 'Cardiology',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Video Call'
    },
    {
      id: 2,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Follow-up',
      date: '2024-01-22',
      time: '2:00 PM',
      type: 'Phone Call'
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'doctor',
      name: 'Dr. Ahmed Al-Rashid',
      message: 'Good morning! How are you feeling today? Any pain or discomfort?',
      time: '09:30 AM',
      avatar: '👨‍⚕️'
    },
    {
      id: 2,
      sender: 'patient',
      name: 'You',
      message: 'Good morning doctor. I\'m feeling much better. The pain has reduced significantly.',
      time: '09:35 AM',
      avatar: '👤'
    },
    {
      id: 3,
      sender: 'doctor',
      name: 'Dr. Ahmed Al-Rashid',
      message: 'That\'s great to hear! Please continue with your prescribed medication and don\'t forget to upload your latest test results.',
      time: '09:40 AM',
      avatar: '👨‍⚕️'
    }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className={`min-h-screen bg-gray-50 pt-8 pb-16 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {t('aftercareSupport')}
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive post-treatment care and support
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8"
        >
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Upload Medical Reports</h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-gray-400 transition-colors">
                  <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">
                    Drag and drop files here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <SafeIcon icon={FiFileText} className="w-5 h-5" />
                    <span>Choose Files</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Uploaded Files</h3>
                    <div className="space-y-3">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <SafeIcon icon={FiFileText} className="w-8 h-8 text-gray-600" />
                            <div>
                              <p className="font-medium text-black">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'consultation' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Schedule Consultation</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>02:00 PM</option>
                        <option>03:00 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="consultationType" value="video" className="text-black" />
                        <SafeIcon icon={FiVideo} className="w-5 h-5 text-gray-600" />
                        <span>Video Call</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="consultationType" value="phone" className="text-black" />
                        <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-600" />
                        <span>Phone Call</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Consultation
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      placeholder="Please describe your concerns or questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiCalendar} className="w-5 h-5" />
                    <span>Schedule Consultation</span>
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-black text-white p-6">
                  <h2 className="text-xl font-bold">Chat with Dr. Ahmed Al-Rashid</h2>
                  <p className="text-gray-300">Cardiology Specialist</p>
                </div>

                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === 'patient' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {message.avatar}
                      </div>
                      <div className={`max-w-xs lg:max-w-md ${message.sender === 'patient' ? 'text-right' : ''}`}>
                        <div
                          className={`p-3 rounded-xl ${
                            message.sender === 'patient'
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-black'
                          }`}
                        >
                          <p>{message.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                      <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-black mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-black">{appointment.doctor}</h4>
                      <span className="text-xs bg-black text-white px-2 py-1 rounded">
                        {appointment.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{appointment.date}</span>
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contact</h3>
              <p className="text-sm text-red-700 mb-4">
                If you experience any emergency symptoms, contact us immediately.
              </p>
              <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                <SafeIcon icon={FiPhone} className="w-5 h-5" />
                <span>Call Emergency Line</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AftercarePage;