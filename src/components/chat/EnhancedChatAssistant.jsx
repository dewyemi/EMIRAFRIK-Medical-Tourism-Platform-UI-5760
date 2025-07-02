import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiMessageCircle, FiX, FiSend, FiBot, FiSettings, FiKey } = FiIcons;

const EnhancedChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openAiKey, setOpenAiKey] = useState(localStorage.getItem('openai_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const quickReplies = [
    'Tell me about cardiac surgery packages',
    'What countries do you serve?', 
    'How much does treatment cost?',
    'What is included in the packages?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      // Load default welcome message for non-authenticated users
      setMessages([{
        id: 1,
        sender: 'bot',
        message: 'Hello! I\'m your EMIRAFRIK assistant. How can I help you with your medical tourism needs today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages_emirafrik')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          message: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      } else {
        // First time user - show welcome message
        const welcomeMessage = {
          id: 'welcome',
          sender: 'bot',
          message: 'Hello! I\'m your EMIRAFRIK assistant. How can I help you with your medical tourism needs today?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatMessage = async (message, sender) => {
    if (!user) return;

    try {
      await supabase
        .from('chat_messages_emirafrik')
        .insert({
          user_id: user.id,
          message,
          sender
        });
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const callOpenAI = async (userMessage) => {
    if (!openAiKey) {
      return "I need an OpenAI API key to provide intelligent responses. Please add your API key in the settings.";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful medical tourism assistant for EMIRAFRIK, a platform connecting patients from Middle East and French-speaking African countries with healthcare in Dubai. 

Key information about EMIRAFRIK:
- We offer medical packages starting from $8,000 to $50,000+
- Packages include medical treatment, accommodation, transfers, and tourism activities
- We serve UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, and French-speaking African countries
- Popular treatments: cardiac surgery, eye surgery, neurological treatments, orthopedics
- All treatments are in Dubai with world-class hospitals and specialists

Be helpful, professional, and provide specific information about our services. If asked about pricing, mention our range and suggest they submit an inquiry for personalized quotes.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return "I'm having trouble connecting to my AI service right now. Please try again later, or contact our support team for immediate assistance.";
    }
  };

  const getTemplateResponse = (userMessage) => {
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

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Save user message
      await saveChatMessage(inputMessage, 'user');
      
      const userMessageText = inputMessage;
      setInputMessage('');
      setIsLoading(true);

      // Get bot response
      let botResponse;
      if (openAiKey) {
        botResponse = await callOpenAI(userMessageText);
      } else {
        botResponse = getTemplateResponse(userMessageText);
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        message: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message
      await saveChatMessage(botResponse, 'assistant');
      
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('openai_key', openAiKey);
    setShowSettings(false);
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
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-1.5rem)] h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiBot} className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold">EMIRAFRIK Assistant</h3>
                  <p className="text-xs text-gray-300">
                    {openAiKey ? 'AI-Powered' : 'Template Mode'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <SafeIcon icon={FiSettings} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiKey} className="w-4 h-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">OpenAI API Key</label>
                  </div>
                  <input
                    type="password"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveApiKey}
                      className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`p-3 rounded-xl ${
                        message.sender === 'user'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black p-3 rounded-xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && !isLoading && (
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
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EnhancedChatAssistant;