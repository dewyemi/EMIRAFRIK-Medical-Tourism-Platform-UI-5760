import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';

const { FiArrowRight, FiHeart, FiShield, FiStar, FiGlobe, FiUsers, FiCheck } = FiIcons;

const HomePage = () => {
  const { t, currentLanguage } = useLanguage();

  const features = [
    {
      icon: FiHeart,
      title: t('worldClass'),
      description: t('worldClassDesc'),
    },
    {
      icon: FiUsers,
      title: t('personalizedCare'),
      description: t('personalizedCareDesc'),
    },
    {
      icon: FiShield,
      title: t('seamlessExperience'),
      description: t('seamlessExperienceDesc'),
    },
  ];

  const stats = [
    { number: '500+', label: 'Patients Served' },
    { number: '50+', label: 'Partner Hospitals' },
    { number: '15+', label: 'Countries Served' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <div className={`min-h-screen ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
                {t('welcome')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-2">
                {t('subtitle')}
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                {t('description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/inquiry"
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>{t('startInquiry')}</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/packages"
                className="w-full sm:w-auto border-2 border-black text-black px-8 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>{t('viewPackages')}</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {t('whyChooseUs')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Medical Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get personalized medical treatment recommendations and connect with top specialists in Dubai.
            </p>
            <Link
              to="/inquiry"
              className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 group"
            >
              <span>Start Your Journey</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;