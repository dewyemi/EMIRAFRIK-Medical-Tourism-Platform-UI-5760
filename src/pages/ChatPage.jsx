import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiSend, FiBot, FiSettings, FiKey, FiUser } = FiIcons;

const ChatPage = () => {
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
      setMessages([{
        id: 'welcome',
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
          sender: msg.sender === 'assistant' ? 'bot' : msg.sender,
          message: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      } else {
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
          sender: sender === 'bot' ? 'assistant' : sender
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
      
      await saveChatMessage(inputMessage, 'user');
      
      const userMessageText = inputMessage;
      setInputMessage('');
      setIsLoading(true);

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
      await saveChatMessage(botResponse, 'bot');
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBot} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">EMIRAFRIK Assistant</h1>
            <p className="text-sm text-gray-600">
              {openAiKey ? 'AI-Powered Chat' : 'Template Mode'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiSettings} className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 border-b border-gray-200 p-4"
        >
          <div className="max-w-md space-y-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiKey} className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">OpenAI API Key</label>
            </div>
            <input
              type="password"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveApiKey}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save Key
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <SafeIcon 
                    icon={message.sender === 'user' ? FiUser : FiBot} 
                    className="w-4 h-4 text-gray-600" 
                  />
                </div>
                <div className={`${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white text-black shadow-sm border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 px-1">{message.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <SafeIcon icon={FiBot} className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white text-black p-4 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && !isLoading && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('typeMessage')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSend} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;