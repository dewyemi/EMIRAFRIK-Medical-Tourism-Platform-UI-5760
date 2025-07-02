import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const { FiMenu, FiX, FiGlobe, FiMessageCircle, FiFileText, FiUser, FiLogIn } = FiIcons;

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  // Bottom navigation items for mobile
  const navItems = [
    { path: '/inquiry', label: t('inquiry'), icon: FiFileText },
    { path: '/chat', label: 'Chat', icon: FiMessageCircle },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 md:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-lg font-bold text-black">EMIRAFRIK</span>
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-black bg-gray-50'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-6 h-6 mb-1" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <span className="text-lg font-bold text-black">EMIRAFRIK</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('home')}
                  </Link>
                  <Link
                    to="/packages"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/packages'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('packages')}
                  </Link>
                  <Link
                    to="/aftercare"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/aftercare'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('aftercare')}
                  </Link>
                </div>

                {/* User Section */}
                {user ? (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 mb-2"
                    >
                      <SafeIcon icon={FiUser} className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium bg-black text-white hover:bg-gray-800"
                    >
                      <SafeIcon icon={FiLogIn} className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  </div>
                )}

                {/* Language Selector */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <SafeIcon icon={FiGlobe} className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Language</span>
                  </div>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavbar;