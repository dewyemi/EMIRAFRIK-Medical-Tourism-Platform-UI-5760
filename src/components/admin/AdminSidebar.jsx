import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiMessageSquare, FiSettings, FiX, FiMenu } = FiIcons;

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: FiHome },
    { path: '/admin/pipeline', label: 'Client Pipeline', icon: FiUsers },
    { path: '/admin/chat', label: 'Chat & Copilot', icon: FiMessageSquare },
    { path: '/admin/automation', label: 'Automation', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => onClose()}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-black text-white rounded-lg"
      >
        <SafeIcon icon={FiMenu} className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-black">Admin</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-600 hover:text-black"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;