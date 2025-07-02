import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const { FiGlobe, FiUser, FiLogIn } = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/inquiry', label: t('inquiry') },
    { path: '/packages', label: t('packages') },
    { path: '/aftercare', label: t('aftercare') },
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'ع' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-black">EMIRAFRIK</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <SafeIcon icon={FiGlobe} className="w-4 h-4" />
                <span>{currentLanguage.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      currentLanguage === lang.code ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <SafeIcon icon={FiLogIn} className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;