import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiMail, FiLock, FiEye, FiEyeOff, FiHeart, FiAlertCircle, FiUserPlus, FiCheck } = FiIcons;

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatingTestAccount, setCreatingTestAccount] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔐 Attempting login for:', formData.email);
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful, redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTestAccount = async (email, role) => {
    setCreatingTestAccount(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔧 Creating/using test account:', email);
      
      // First try to sign in with existing credentials
      const { data: signInData, error: signInError } = await signIn(email, 'testpass123');
      
      if (signInData?.user && !signInError) {
        console.log('✅ Test account already exists and login successful');
        setFormData({ email: email, password: 'testpass123' });
        setSuccessMessage(`✅ Test ${role} account logged in successfully!`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        return;
      }

      // If sign in failed, try to create the account
      console.log('🔧 Account does not exist, creating new test account...');
      
      const { data, error } = await signUp(email, 'testpass123', {
        fullName: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: email,
        role: role,
        country: 'United Arab Emirates'
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log('✅ Test account already exists');
          setFormData({ email: email, password: 'testpass123' });
          setSuccessMessage(`Test ${role} account is ready! Credentials filled below. Click "Sign In" to login.`);
        } else {
          console.error('❌ Test account creation error:', error);
          throw error;
        }
      } else if (data.user) {
        console.log('✅ Test account created successfully');
        setFormData({ email: email, password: 'testpass123' });
        setSuccessMessage(`✅ Test ${role} account created! Credentials filled below. Click "Sign In" to login.`);
      }
    } catch (error) {
      console.error('❌ Test account operation failed:', error);
      setError('Failed to create test account: ' + error.message);
    } finally {
      setCreatingTestAccount(false);
    }
  };

  const createCustomAdminAccount = async () => {
    setCreatingTestAccount(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔧 Creating custom admin account: dewyemi+2@icloud.com');
      
      // First try to sign in with existing credentials
      const { data: signInData, error: signInError } = await signIn('dewyemi+2@icloud.com', 'Desktop123');
      
      if (signInData?.user && !signInError) {
        console.log('✅ Admin account already exists and login successful');
        setFormData({ email: 'dewyemi+2@icloud.com', password: 'Desktop123' });
        setSuccessMessage('✅ Admin account logged in successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        return;
      }

      // If sign in failed, try to create the account
      console.log('🔧 Creating new admin account...');
      
      const { data, error } = await signUp('dewyemi+2@icloud.com', 'Desktop123', {
        fullName: 'Admin User',
        email: 'dewyemi+2@icloud.com',
        role: 'admin',
        country: 'United Arab Emirates'
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log('✅ Admin account already exists');
          setFormData({ email: 'dewyemi+2@icloud.com', password: 'Desktop123' });
          setSuccessMessage('Admin account is ready! Credentials filled below. Click "Sign In" to login.');
        } else {
          console.error('❌ Admin account creation error:', error);
          throw error;
        }
      } else if (data.user) {
        console.log('✅ Admin account created successfully');
        setFormData({ email: 'dewyemi+2@icloud.com', password: 'Desktop123' });
        setSuccessMessage('✅ Admin account created! Credentials filled below. Click "Sign In" to login.');
      }
    } catch (error) {
      console.error('❌ Admin account operation failed:', error);
      setError('Failed to create admin account: ' + error.message);
    } finally {
      setCreatingTestAccount(false);
    }
  };

  // Use more standard email formats
  const testAccounts = [
    { email: 'test.patient@demo.com', role: 'patient', label: 'Patient Account', color: 'green' },
    { email: 'test.admin@demo.com', role: 'admin', label: 'Demo Admin', color: 'red' },
    { email: 'test.provider@demo.com', role: 'provider', label: 'Provider Account', color: 'blue' },
    { email: 'test.coordinator@demo.com', role: 'coordinator', label: 'Coordinator Account', color: 'purple' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-800',
      red: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-800',
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      red: 'text-red-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your healthcare account
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || creatingTestAccount}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading || creatingTestAccount ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Custom Admin Account */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">👑 Custom Admin Account</h3>
            <button
              type="button"
              onClick={createCustomAdminAccount}
              disabled={creatingTestAccount}
              className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors disabled:opacity-50 border ${getColorClasses('orange')}`}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUserPlus} className={`w-4 h-4 ${getIconColor('orange')}`} />
                <div>
                  <div className="font-medium">Create Admin Account</div>
                  <div className="text-xs opacity-75">dewyemi+2@icloud.com</div>
                </div>
              </div>
              <div className="text-xs font-mono opacity-75">Desktop123</div>
            </button>
          </div>

          {/* Create Test Accounts Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">🚀 Quick Demo Accounts</h3>
            <p className="text-xs text-gray-600 mb-4">
              Click any button below to create and auto-login to a demo account:
            </p>
            <div className="grid gap-3">
              {testAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => createTestAccount(account.email, account.role)}
                  disabled={creatingTestAccount}
                  className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors disabled:opacity-50 border ${getColorClasses(account.color)}`}
                >
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiUserPlus} className={`w-4 h-4 ${getIconColor(account.color)}`} />
                    <div>
                      <div className="font-medium">{account.label}</div>
                      <div className="text-xs opacity-75">{account.email}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono opacity-75">testpass123</div>
                </button>
              ))}
            </div>
            
            {creatingTestAccount && (
              <div className="mt-4 text-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-600 mt-2">Setting up account...</p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>💡 How it works:</strong><br />
                1. Click any account button to create/login<br />
                2. Custom admin uses your specified credentials<br />
                3. Demo accounts use "testpass123" password<br />
                4. Explore the role-specific dashboard!
              </p>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;