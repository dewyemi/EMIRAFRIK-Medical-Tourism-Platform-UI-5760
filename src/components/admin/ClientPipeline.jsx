import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiClock, FiMapPin, FiPhone, FiMail, FiEdit, FiEye } = FiIcons;

const ClientPipeline = () => {
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = [
    { id: 'all', name: 'All Clients', count: 730 },
    { id: 'inquiry', name: 'Initial Inquiry', count: 235 },
    { id: 'review', name: 'Medical Review', count: 180 },
    { id: 'selection', name: 'Package Selection', count: 120 },
    { id: 'payment', name: 'Payment', count: 85 },
    { id: 'travel', name: 'Travel Planning', count: 65 },
    { id: 'treatment', name: 'Treatment', count: 45 },
    { id: 'aftercare', name: 'Aftercare', count: 30 }
  ];

  const clients = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      country: 'Morocco',
      condition: 'Cardiac Surgery',
      stage: 'review',
      agent: 'Dr. Sarah Johnson',
      lastContact: '2 hours ago',
      priority: 'high',
      phone: '+212 6 12 34 56 78',
      email: 'ahmed.hassan@email.com'
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      country: 'Senegal',
      condition: 'Eye Surgery',
      stage: 'payment',
      agent: 'Dr. Mohamed Ali',
      lastContact: '1 day ago',
      priority: 'medium',
      phone: '+221 77 123 45 67',
      email: 'fatima.alzahra@email.com'
    },
    {
      id: 3,
      name: 'Omar Diallo',
      country: 'Mali',
      condition: 'Orthopedic Surgery',
      stage: 'selection',
      agent: 'Dr. Ahmed Al-Rashid',
      lastContact: '3 hours ago',
      priority: 'high',
      phone: '+223 65 12 34 56',
      email: 'omar.diallo@email.com'
    },
    {
      id: 4,
      name: 'Amina Kone',
      country: 'Burkina Faso',
      condition: 'Neurological Treatment',
      stage: 'treatment',
      agent: 'Dr. Sarah Johnson',
      lastContact: '5 minutes ago',
      priority: 'urgent',
      phone: '+226 70 12 34 56',
      email: 'amina.kone@email.com'
    }
  ];

  const filteredClients = selectedStage === 'all' 
    ? clients 
    : clients.filter(client => client.stage === selectedStage);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      inquiry: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      selection: 'bg-indigo-100 text-indigo-800',
      payment: 'bg-green-100 text-green-800',
      travel: 'bg-teal-100 text-teal-800',
      treatment: 'bg-orange-100 text-orange-800',
      aftercare: 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-black mb-2">Client Pipeline</h1>
        <p className="text-gray-600">Manage and track client progress through the 20-step journey</p>
      </motion.div>

      {/* Stage Filter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-wrap gap-3">
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedStage === stage.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {stage.name} ({stage.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Client List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Condition</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-black">{client.name}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                          <span>{client.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{client.condition}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(client.stage)}`}>
                      {stages.find(s => s.id === client.stage)?.name || client.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{client.agent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(client.priority)}`}>
                      {client.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <SafeIcon icon={FiClock} className="w-3 h-3" />
                      <span>{client.lastContact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientPipeline;