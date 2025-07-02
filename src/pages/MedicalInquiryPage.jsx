import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiUser, FiGlobe, FiFileText, FiSend } = FiIcons;

const MedicalInquiryPage = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    healthCondition: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const countries = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Morocco',
    'Algeria',
    'Tunisia',
    'Senegal',
    'Mali',
    'Burkina Faso',
    'Niger',
    'Chad',
    'Cameroon',
    'Central African Republic',
    'Gabon',
    'Republic of the Congo',
    'Democratic Republic of the Congo',
    'Madagascar'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        full_name: formData.fullName,
        country: formData.country,
        issue: formData.healthCondition,
        status: 'pending'
      };

      // If user is authenticated, include user_id
      if (user) {
        inquiryData.user_id = user.id;
      }

      const { error } = await supabase
        .from('inquiries_emirafrik')
        .insert(inquiryData);

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 pt-8 pb-16 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {t('medicalInquiry')}
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your medical needs and we'll connect you with the right specialists.
          </p>
        </motion.div>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')} *
                </label>
                <div className="relative">
                  <SafeIcon
                    icon={FiUser}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('country')} *
                </label>
                <div className="relative">
                  <SafeIcon
                    icon={FiGlobe}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Health Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('healthCondition')} *
                </label>
                <div className="relative">
                  <SafeIcon
                    icon={FiFileText}
                    className="absolute left-3 top-3 text-gray-400 w-5 h-5"
                  />
                  <textarea
                    name="healthCondition"
                    value={formData.healthCondition}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                    placeholder={t('healthConditionPlaceholder')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('submitInquiry')}</span>
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiSend} className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">
              Inquiry Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your inquiry. Our medical specialists will review your case and contact you within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <strong>What's next?</strong><br />
                • Medical specialist review (2-4 hours)<br />
                • Treatment plan proposal (24 hours)<br />
                • Video consultation scheduling
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MedicalInquiryPage;