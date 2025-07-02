import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const { FiMessageCircle, FiX, FiSend, FiBot } = FiIcons;

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Hello! I\'m your EMIRAFRIK assistant. How can I help you with your medical tourism needs today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { t } = useLanguage();

  const quickReplies = [
    'Tell me about cardiac surgery packages',
    'What countries do you serve?',
    'How much does treatment cost?',
    'What is included in the packages?'
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          message: getBotResponse(inputMessage),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('cardiac') || message.includes('heart')) {
      return 'Our cardiac surgery packages start from $25,000 and include pre-operative consultation, surgery, post-operative care, and 7-10 days accommodation in Dubai. Would you like more details about specific procedures?';
    } else if (message.includes('cost') || message.includes('price')) {
      return 'Our medical packages range from $8,000 for basic procedures to $50,000+ for complex surgeries. The price includes medical treatment, accommodation, airport transfers, and tourism activities. Would you like a personalized quote?';
    } else if (message.includes('countries')) {
      return 'We serve clients from the Middle East (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman) and French-speaking African countries (Morocco, Algeria, Tunisia, Senegal, Mali, Burkina Faso, and more). Which country are you from?';
    } else if (message.includes('package') || message.includes('include')) {
      return 'Our packages include: ✓ Medical consultation & treatment ✓ Hospital stay ✓ 4-5 star hotel accommodation ✓ Airport transfers ✓ Tourism activities ✓ 24/7 support ✓ Follow-up care. Would you like to see specific packages?';
    } else {
      return 'Thank you for your question! I\'d be happy to help you with information about our medical tourism services. You can ask me about treatments, pricing, countries we serve, or anything else related to your medical journey.';
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon icon={isOpen ? FiX : FiMessageCircle} className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiBot} className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold">EMIRAFRIK Assistant</h3>
                  <p className="text-xs text-gray-300">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`p-3 rounded-xl ${
                        message.sender === 'user'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;