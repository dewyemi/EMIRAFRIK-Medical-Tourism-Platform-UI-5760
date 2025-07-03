import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiMessageSquare, FiMail, FiPhone, FiSend, FiUser, FiClock, FiCheck, FiAlertCircle } = FiIcons;

const Communications = () => {
  const { profile } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchCommunications();
    }
  }, [profile]);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      
      // Using mock data since the database tables don't exist yet
      const mockCommunications = [
        {
          id: '1',
          participant: { id: '1', full_name: 'Ahmed Hassan', role: 'patient' },
          messages: [
            {
              id: '1',
              sender_id: '1',
              recipient_id: profile.id,
              message: 'Hello, I have some questions about my upcoming surgery.',
              message_type: 'text',
              created_at: new Date().toISOString(),
              read_at: null
            },
            {
              id: '2',
              sender_id: profile.id,
              recipient_id: '1',
              message: 'Hi Ahmed! I\'d be happy to help you with any questions. What would you like to know?',
              message_type: 'text',
              created_at: new Date().toISOString(),
              read_at: new Date().toISOString()
            }
          ],
          lastMessage: {
            id: '2',
            message: 'Hi Ahmed! I\'d be happy to help you with any questions. What would you like to know?',
            created_at: new Date().toISOString()
          },
          unreadCount: 0
        },
        {
          id: '2',
          participant: { id: '2', full_name: 'Fatima Al-Zahra', role: 'patient' },
          messages: [
            {
              id: '3',
              sender_id: '2',
              recipient_id: profile.id,
              message: 'Can you please confirm my travel arrangements?',
              message_type: 'text',
              created_at: new Date().toISOString(),
              read_at: null
            }
          ],
          lastMessage: {
            id: '3',
            message: 'Can you please confirm my travel arrangements?',
            created_at: new Date().toISOString()
          },
          unreadCount: 1
        },
        {
          id: '3',
          participant: { id: '3', full_name: 'Dr. Sarah Johnson', role: 'provider' },
          messages: [
            {
              id: '4',
              sender_id: '3',
              recipient_id: profile.id,
              message: 'Patient Omar Diallo is ready for discharge. Please coordinate the follow-up care.',
              message_type: 'text',
              created_at: new Date().toISOString(),
              read_at: new Date().toISOString()
            }
          ],
          lastMessage: {
            id: '4',
            message: 'Patient Omar Diallo is ready for discharge. Please coordinate the follow-up care.',
            created_at: new Date().toISOString()
          },
          unreadCount: 0
        }
      ];

      setCommunications(mockCommunications);
      if (mockCommunications.length > 0) {
        setSelectedConversation(mockCommunications[0]);
      }
    } catch (error) {
      console.error('Error fetching communications:', error);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        id: Date.now().toString(),
        sender_id: profile.id,
        recipient_id: selectedConversation.participant.id,
        message: newMessage,
        message_type: 'text',
        created_at: new Date().toISOString(),
        read_at: null
      };

      // Add message to the conversation
      const updatedCommunications = communications.map(comm => {
        if (comm.id === selectedConversation.id) {
          return {
            ...comm,
            messages: [...comm.messages, messageData],
            lastMessage: { ...messageData }
          };
        }
        return comm;
      });

      setCommunications(updatedCommunications);
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, messageData],
        lastMessage: { ...messageData }
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'email': return FiMail;
      case 'phone': return FiPhone;
      case 'text':
      default: return FiMessageSquare;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low':
      default: return 'text-green-600';
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
        <p className="text-gray-600 mt-2">Manage patient and provider communications</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          ) : communications.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No conversations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {communications.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    selectedConversation === conversation
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {conversation.participant?.full_name || 'Unknown'}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.message || 'No messages'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {conversation.participant?.role || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage?.created_at
                        ? new Date(conversation.lastMessage.created_at).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col"
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.participant?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {selectedConversation.participant?.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <SafeIcon icon={FiPhone} className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <SafeIcon icon={FiMail} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversation.messages
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.sender_id === profile.id ? 'text-right' : ''}`}>
                        <div className={`p-3 rounded-xl ${
                          message.sender_id === profile.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <SafeIcon icon={getMessageTypeIcon(message.message_type)} className="w-3 h-3" />
                            {message.priority && (
                              <SafeIcon icon={FiAlertCircle} className={`w-3 h-3 ${getPriorityColor(message.priority)}`} />
                            )}
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                          {message.sender_id === profile.id && message.read_at && (
                            <SafeIcon icon={FiCheck} className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiMessageSquare} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Communications;