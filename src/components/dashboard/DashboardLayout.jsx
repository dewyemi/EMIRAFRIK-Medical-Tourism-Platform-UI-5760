import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiMenu, FiX, FiLogOut, FiUser, FiBell, FiHome, FiUsers, FiCalendar, FiActivity, FiFileText, FiMapPin, FiCreditCard, FiSettings, FiBarChart3, FiMessageSquare, FiTruck, FiUserCheck, FiTrendingUp, FiClipboard, FiFolder, FiHeart, FiShield, FiUserPlus, FiCpu } = FiIcons;

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Redirect based on role when profile loads
  useEffect(() => {
    if (profile && location.pathname === '/dashboard') {
      console.log('Profile loaded, redirecting based on role:', profile.role);
      switch (profile.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'coordinator':
          navigate('/dashboard/coordinator');
          break;
        case 'provider':
          navigate('/dashboard/provider');
          break;
        case 'patient':
        default:
          navigate('/dashboard/patient');
          break;
      }
    }
  }, [profile, location.pathname, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (!profile) return [];

    if (profile.role === 'patient') {
      return [
        { path: '/dashboard/patient', label: 'My Journey', icon: FiMapPin },
        { path: '/dashboard/medical-history', label: 'Medical History', icon: FiFileText },
        { path: '/dashboard/appointments', label: 'Appointments', icon: FiCalendar },
        { path: '/dashboard/documents', label: 'Documents', icon: FiFolder },
        { path: '/dashboard/payments', label: 'Payments', icon: FiCreditCard },
        { path: '/dashboard/profile', label: 'Profile', icon: FiUser }
      ];
    }

    if (profile.role === 'provider') {
      return [
        { path: '/dashboard/provider', label: 'Overview', icon: FiHome },
        { path: '/dashboard/patients', label: 'My Patients', icon: FiUsers },
        { path: '/dashboard/appointments', label: 'Appointments', icon: FiCalendar },
        { path: '/dashboard/assessments', label: 'Assessments', icon: FiClipboard },
        { path: '/dashboard/treatments', label: 'Treatments', icon: FiHeart },
        { path: '/dashboard/profile', label: 'Profile', icon: FiUser }
      ];
    }

    if (profile.role === 'coordinator') {
      return [
        { path: '/dashboard/coordinator', label: 'Overview', icon: FiHome },
        { path: '/dashboard/patient-management', label: 'Patient Management', icon: FiUsers },
        { path: '/dashboard/patient-assignment', label: 'Patient Assignment', icon: FiUserPlus },
        { path: '/dashboard/journey-tracking', label: 'Journey Tracking', icon: FiMapPin },
        { path: '/dashboard/logistics', label: 'Travel & Logistics', icon: FiTruck },
        { path: '/dashboard/resource-management', label: 'Resource Management', icon: FiCpu },
        { path: '/dashboard/communications', label: 'Communications', icon: FiMessageSquare },
        { path: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart3 },
        { path: '/dashboard/profile', label: 'Profile', icon: FiUser }
      ];
    }

    if (profile.role === 'admin') {
      return [
        { path: '/dashboard/admin', label: 'Admin Overview', icon: FiHome },
        { path: '/dashboard/user-management', label: 'User Management', icon: FiUserCheck },
        { path: '/dashboard/system-analytics', label: 'System Analytics', icon: FiTrendingUp },
        { path: '/dashboard/pipeline', label: 'Client Pipeline', icon: FiUsers },
        { path: '/dashboard/chat-copilot', label: 'Chat & AI', icon: FiMessageSquare },
        { path: '/dashboard/automation', label: 'Automation', icon: FiSettings },
        { path: '/dashboard/user-roles', label: 'Role Management', icon: FiShield },
        { path: '/dashboard/profile', label: 'Profile', icon: FiUser }
      ];
    }

    return [];
  };

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, don't render anything (will be redirected)
  if (!user) {
    return null;
  }

  // Show loading for profile while it's being fetched
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a moment...</p>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} hidden lg:block`}>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900">EMIRAFRIK</span>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : ''
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SafeIcon icon={sidebarOpen ? FiX : FiMenu} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <SafeIcon icon={FiMenu} className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {profile?.full_name || user?.email || 'User'}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {profile?.role || 'User'} Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <SafeIcon icon={FiBell} className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {profile?.full_name || user?.email || 'User'}
                  </span>
                </button>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">EMIRAFRIK</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            <nav className="mt-8">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : ''
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;