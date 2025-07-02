import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';

const { FiCreditCard, FiSmartphone, FiLock, FiCheck, FiInfo } = FiIcons;

const PaymentPage = () => {
  const { t, currentLanguage } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mobileProvider: 'mtn',
    mobileNumber: ''
  });

  const mobileProviders = [
    { value: 'mtn', label: 'MTN Mobile Money', logo: '📱' },
    { value: 'airtel', label: 'Airtel Money', logo: '📱' },
    { value: 'orange', label: 'Orange Money', logo: '📱' },
    { value: 'moov', label: 'Moov Money', logo: '📱' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment processing
    console.log('Processing payment:', { paymentMethod, formData });
  };

  return (
    <div className={`min-h-screen bg-gray-50 pt-8 pb-16 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {t('paymentOptions')}
          </h1>
          <p className="text-lg text-gray-600">
            Secure payment processing for your medical package
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-black mb-4">Choose Payment Method</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiCreditCard} className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">{t('creditCard')}</div>
                        <div className={`text-sm ${paymentMethod === 'card' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Visa, Mastercard, Amex
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'mobile'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiSmartphone} className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">{t('mobileMoney')}</div>
                        <div className={`text-sm ${paymentMethod === 'mobile' ? 'text-gray-300' : 'text-gray-500'}`}>
                          MTN, Airtel, Orange
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Money Provider *
                      </label>
                      <select
                        name="mobileProvider"
                        value={formData.mobileProvider}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      >
                        {mobileProviders.map(provider => (
                          <option key={provider.value} value={provider.value}>
                            {provider.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Mobile Money Instructions</h4>
                          <p className="text-sm text-blue-700">
                            You will receive an SMS prompt on your mobile device to authorize the payment. 
                            Please ensure your mobile money account has sufficient balance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <SafeIcon icon={FiLock} className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Your payment information is encrypted and secure
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                  <span>Complete Payment</span>
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-semibold text-black mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cardiac Surgery Package</span>
                  <span className="font-medium">$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tourism Add-ons</span>
                  <span className="font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Insurance</span>
                  <span className="font-medium">$1,500</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$29,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-black mb-2">Package Includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Pre-operative consultation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Surgery & hospital stay</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Post-operative care</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Hotel accommodation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                    <span>Airport transfers</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;