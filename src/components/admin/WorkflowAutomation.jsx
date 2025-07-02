import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSettings, FiPlay, FiPause, FiEdit, FiTrash2, FiPlus, FiClock, FiMail, FiFileText, FiBell } = FiIcons;

const WorkflowAutomation = () => {
  const [activeTab, setActiveTab] = useState('active');

  const automations = [
    {
      id: 1,
      name: 'Welcome Email Sequence',
      description: 'Send welcome emails to new inquiries',
      trigger: 'New inquiry submitted',
      actions: ['Send welcome email', 'Create client record', 'Assign agent'],
      status: 'active',
      lastRun: '2 hours ago',
      successRate: '98%',
      icon: FiMail
    },
    {
      id: 2,
      name: 'Document Collection Reminder',
      description: 'Remind clients to submit required documents',
      trigger: 'Documents pending for 48 hours',
      actions: ['Send reminder email', 'SMS notification', 'Update client status'],
      status: 'active',
      lastRun: '6 hours ago',
      successRate: '85%',
      icon: FiFileText
    },
    {
      id: 3,
      name: 'Payment Follow-up',
      description: 'Follow up on pending payments',
      trigger: 'Payment overdue by 24 hours',
      actions: ['Send payment reminder', 'Notify agent', 'Schedule call'],
      status: 'paused',
      lastRun: '1 day ago',
      successRate: '92%',
      icon: FiBell
    },
    {
      id: 4,
      name: 'Post-treatment Check-in',
      description: 'Check in with clients after treatment',
      trigger: '7 days after treatment completion',
      actions: ['Send check-in email', 'Schedule follow-up', 'Request feedback'],
      status: 'active',
      lastRun: '4 hours ago',
      successRate: '96%',
      icon: FiClock
    }
  ];

  const stats = [
    { label: 'Active Automations', value: '12', change: '+2' },
    { label: 'Tasks Automated Today', value: '156', change: '+23' },
    { label: 'Time Saved (hours)', value: '24.5', change: '+3.2' },
    { label: 'Success Rate', value: '94%', change: '+1%' }
  ];

  const filteredAutomations = automations.filter(automation => 
    activeTab === 'all' || automation.status === activeTab
  );

  const toggleAutomation = (id) => {
    // Toggle automation logic
    console.log('Toggle automation:', id);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Workflow Automation</h1>
            <p className="text-gray-600">Automate repetitive tasks and streamline processes</p>
          </div>
          <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Create Automation</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
              <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-2 mb-8"
      >
        <div className="flex space-x-2">
          {[
            { id: 'active', label: 'Active', count: 3 },
            { id: 'paused', label: 'Paused', count: 1 },
            { id: 'all', label: 'All', count: 4 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id ? 'bg-white text-black' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Automations List */}
      <div className="space-y-6">
        {filteredAutomations.map((automation, index) => (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  automation.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <SafeIcon 
                    icon={automation.icon} 
                    className={`w-6 h-6 ${
                      automation.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`} 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-black">{automation.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      automation.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {automation.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{automation.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-black mb-2">Trigger:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        {automation.trigger}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-black mb-2">Actions:</h4>
                      <div className="space-y-1">
                        {automation.actions.map((action, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span>Last run: {automation.lastRun}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Success rate: {automation.successRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAutomation(automation.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.status === 'active'
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={automation.status === 'active' ? FiPause : FiPlay} className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowAutomation;