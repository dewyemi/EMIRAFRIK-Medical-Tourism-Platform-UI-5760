import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageSquare, FiBot, FiSend, FiUser, FiCopy, FiRefreshCw, FiGlobe } = FiIcons;

const ChatCopilot = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [copilotSuggestions, setCopilotSuggestions] = useState([]);

  const activeChats = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      country: 'Morocco',
      lastMessage: 'When can I schedule my surgery?',
      time: '2 min ago',
      unread: 2,
      language: 'French'
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      country: 'Senegal',
      lastMessage: 'I need more information about the package',
      time: '15 min ago',
      unread: 1,
      language: 'French'
    },
    {
      id: 3,
      name: 'Omar Diallo',
      country: 'Mali',
      lastMessage: 'Thank you for the quick response',
      time: '1 hour ago',
      unread: 0,
      language: 'French'
    }
  ];

  const chatHistory = [
    {
      id: 1,
      sender: 'client',
      message: 'Bonjour, je souhaiterais avoir plus d\'informations sur les chirurgies cardiaques disponibles.',
      time: '10:30 AM',
      original: true
    },
    {
      id: 2,
      sender: 'agent',
      message: 'Hello! I\'d be happy to help you with information about our cardiac surgery packages.',
      time: '10:32 AM',
      translated: 'Bonjour ! Je serais ravi de vous aider avec des informations sur nos forfaits de chirurgie cardiaque.'
    },
    {
      id: 3,
      sender: 'client',
      message: 'Quels sont les prix et la durée du séjour?',
      time: '10:35 AM',
      original: true
    }
  ];

  const suggestions = [
    {
      type: 'response',
      text: 'Our cardiac surgery packages start from $25,000 and include a 7-10 day stay in Dubai.',
      translation: 'Nos forfaits de chirurgie cardiaque commencent à partir de 25 000 $ et incluent un séjour de 7 à 10 jours à Dubaï.'
    },
    {
      type: 'question',
      text: 'What specific cardiac procedure are you interested in?',
      translation: 'Quelle procédure cardiaque spécifique vous intéresse ?'
    },
    {
      type: 'info',
      text: 'Would you like me to schedule a consultation with our cardiac specialist?',
      translation: 'Souhaitez-vous que je programme une consultation avec notre spécialiste cardiaque ?'
    }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Send message logic
      setChatMessage('');
    }
  };

  const applySuggestion = (suggestion) => {
    setChatMessage(suggestion.text);
  };

  return (
    <div className="p-6 h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-black mb-2">Chat & AI Copilot</h1>
        <p className="text-gray-600">Smart chat assistance with real-time translation and AI suggestions</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-black mb-4">Active Chats</h2>
          <div className="space-y-3">
            {activeChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedClient(chat)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedClient?.id === chat.id ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{chat.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {chat.language}
                    </span>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${selectedClient?.id === chat.id ? 'text-gray-300' : 'text-gray-600'}`}>
                  {chat.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${selectedClient?.id === chat.id ? 'text-gray-400' : 'text-gray-500'}`}>
                    {chat.country}
                  </span>
                  <span className={`text-xs ${selectedClient?.id === chat.id ? 'text-gray-400' : 'text-gray-500'}`}>
                    {chat.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col"
        >
          {selectedClient ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{selectedClient.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{selectedClient.country}</span>
                        <span>•</span>
                        <SafeIcon icon={FiGlobe} className="w-3 h-3" />
                        <span>{selectedClient.language}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg">
                    <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'agent' ? 'text-right' : ''}`}>
                      <div
                        className={`p-3 rounded-xl ${
                          message.sender === 'agent'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        <p>{message.message}</p>
                        {message.translated && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <p className="text-sm opacity-75">{message.translated}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <SafeIcon icon={FiMessageSquare} className="w-16 h-16 mx-auto mb-4" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* AI Copilot Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiBot} className="w-6 h-6 text-black" />
            <h2 className="text-lg font-semibold text-black">AI Copilot</h2>
          </div>

          {selectedClient && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-900 mb-2">Smart Suggestions</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          suggestion.type === 'response' ? 'bg-green-100 text-green-800' :
                          suggestion.type === 'question' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {suggestion.type}
                        </span>
                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <SafeIcon icon={FiCopy} className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{suggestion.text}</p>
                      <p className="text-xs text-gray-600 italic">{suggestion.translation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">Client Context</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{selectedClient.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{selectedClient.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="font-medium">Medical Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium text-orange-600">High</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-yellow-100 hover:bg-yellow-50 transition-colors">
                    Schedule consultation
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-yellow-100 hover:bg-yellow-50 transition-colors">
                    Send package details
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-yellow-100 hover:bg-yellow-50 transition-colors">
                    Request documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedClient && (
            <div className="text-center text-gray-500 mt-8">
              <SafeIcon icon={FiBot} className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">Select a chat to see AI suggestions</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatCopilot;