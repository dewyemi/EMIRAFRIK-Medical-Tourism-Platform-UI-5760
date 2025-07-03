import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { SERVED_COUNTRIES, COUNTRY_GROUPS } from '../utils/countries';

const { FiFilter, FiHeart, FiEye, FiBrain, FiActivity, FiMapPin, FiStar, FiCheck } = FiIcons;

const PackageSelectionPage = () => {
  const { t, currentLanguage } = useLanguage();
  const [filters, setFilters] = useState({
    budget: '',
    country: '',
    treatment: '',
    tourism: false
  });

  const packages = [
    {
      id: 1,
      title: 'Cardiac Surgery Package',
      treatment: 'Cardiology',
      hospital: 'Dubai Heart Institute',
      doctor: 'Dr. Ahmed Al-Rashid',
      country: 'UAE',
      price: '$25,000',
      duration: '7-10 days',
      rating: 4.9,
      features: [
        'Pre-operative consultation',
        'Surgery',
        'Post-operative care',
        '24/7 monitoring'
      ],
      tourism: [
        'Burj Khalifa visit',
        'Dubai Mall shopping',
        'Desert safari'
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'Eye Surgery Package',
      treatment: 'Ophthalmology',
      hospital: 'Emirates Eye Hospital',
      doctor: 'Dr. Sarah Johnson',
      country: 'UAE',
      price: '$8,000',
      duration: '3-5 days',
      rating: 4.8,
      features: [
        'LASIK surgery',
        'Follow-up consultations',
        'Medication included'
      ],
      tourism: [
        'Dubai Marina cruise',
        'Gold Souk visit',
        'Traditional dinner'
      ],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Neurological Treatment',
      treatment: 'Neurology',
      hospital: 'Dubai Neurological Center',
      doctor: 'Dr. Mohamed Hassan',
      country: 'UAE',
      price: '$35,000',
      duration: '14-21 days',
      rating: 4.9,
      features: [
        'Comprehensive diagnosis',
        'Advanced treatment',
        'Rehabilitation program'
      ],
      tourism: [
        'Abu Dhabi city tour',
        'Sheikh Zayed Mosque',
        'Louvre Abu Dhabi'
      ],
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop'
    }
  ];

  const budgetRanges = [
    { value: '', label: 'All Budgets' },
    { value: '0-10000', label: '$0 - $10,000' },
    { value: '10000-25000', label: '$10,000 - $25,000' },
    { value: '25000-50000', label: '$25,000 - $50,000' },
    { value: '50000+', label: '$50,000+' }
  ];

  const treatments = [
    { value: '', label: 'All Treatments' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Oncology', label: 'Oncology' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredPackages = packages.filter(pkg => {
    if (filters.treatment && pkg.treatment !== filters.treatment) return false;
    return true;
  });

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
            {t('medicalPackages')}
          </h1>
          <p className="text-lg text-gray-600">
            Choose from our carefully curated medical tourism packages
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-black">Filters</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={filters.budget}
              onChange={(e) => handleFilterChange('budget', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            <select
              value={filters.treatment}
              onChange={(e) => handleFilterChange('treatment', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {treatments.map(treatment => (
                <option key={treatment.value} value={treatment.value}>{treatment.label}</option>
              ))}
            </select>

            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">All Countries</option>
              {COUNTRY_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <label className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filters.tourism}
                onChange={(e) => handleFilterChange('tourism', e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-medium">Include Tourism</span>
            </label>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{pkg.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-2">{pkg.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{pkg.hospital}</span>
                    <span>•</span>
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Doctor:</strong> {pkg.doctor}
                  </p>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{pkg.country}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-black mb-2">Medical Features:</h4>
                  <div className="space-y-1">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {filters.tourism && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-black mb-2">Tourism Add-ons:</h4>
                    <div className="space-y-1">
                      {pkg.tourism.slice(0, 2).map((activity, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-black">{pkg.price}</span>
                    <span className="text-sm text-gray-500 ml-1">total</span>
                  </div>
                  <button className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                    {t('bookNow')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPage;