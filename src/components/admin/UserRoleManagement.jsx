import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';
import { SERVED_COUNTRIES, COUNTRY_GROUPS } from '../../utils/countries';

const { FiUsers, FiUserPlus, FiEdit, FiTrash2, FiEye, FiShield, FiMail, FiPhone, FiMapPin, FiCalendar, FiActivity, FiSearch, FiFilter, FiMoreVertical, FiCheck, FiX, FiKey, FiSettings } = FiIcons;

const UserRoleManagement = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view', 'permissions'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country: '',
    role: 'patient',
    status: 'active',
    provider_type: '',
    specialization: '',
    facility_name: '',
    permissions: {
      dashboard_access: true,
      patient_management: false,
      user_management: false,
      analytics_access: false,
      system_settings: false,
      data_export: false,
      financial_access: false,
      admin_panel: false
    }
  });

  const roles = [
    { value: 'patient', label: 'Patient', description: 'Standard patient access' },
    { value: 'provider', label: 'Healthcare Provider', description: 'Medical professionals' },
    { value: 'coordinator', label: 'Care Coordinator', description: 'Patient journey coordination' },
    { value: 'admin', label: 'Administrator', description: 'Full system access' }
  ];

  const permissions = [
    { key: 'dashboard_access', label: 'Dashboard Access', description: 'Basic dashboard viewing' },
    { key: 'patient_management', label: 'Patient Management', description: 'Manage patient records' },
    { key: 'user_management', label: 'User Management', description: 'Create and manage users' },
    { key: 'analytics_access', label: 'Analytics Access', description: 'View reports and analytics' },
    { key: 'system_settings', label: 'System Settings', description: 'Modify system configuration' },
    { key: 'data_export', label: 'Data Export', description: 'Export system data' },
    { key: 'financial_access', label: 'Financial Access', description: 'View financial reports' },
    { key: 'admin_panel', label: 'Admin Panel', description: 'Full administrative access' }
  ];

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles_healthcare')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        country: user.country || '',
        role: user.role || 'patient',
        status: user.status || 'active',
        provider_type: user.provider_type || '',
        specialization: user.specialization || '',
        facility_name: user.facility_name || '',
        permissions: user.permissions || {
          dashboard_access: true,
          patient_management: false,
          user_management: false,
          analytics_access: false,
          system_settings: false,
          data_export: false,
          financial_access: false,
          admin_panel: false
        }
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        country: '',
        role: 'patient',
        status: 'active',
        provider_type: '',
        specialization: '',
        facility_name: '',
        permissions: {
          dashboard_access: true,
          patient_management: false,
          user_management: false,
          analytics_access: false,
          system_settings: false,
          data_export: false,
          financial_access: false,
          admin_panel: false
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalType === 'create') {
        // For demo purposes, we'll just create the profile
        // In a real app, you'd use Supabase Admin API to create the user
        const profileData = {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          country: formData.country,
          role: formData.role,
          status: formData.status,
          provider_type: formData.provider_type || null,
          specialization: formData.specialization || null,
          facility_name: formData.facility_name || null,
          permissions: formData.permissions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('user_profiles_healthcare')
          .insert(profileData);

        if (profileError) throw profileError;

      } else if (modalType === 'edit' || modalType === 'permissions') {
        // Update existing user
        const updateData = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          country: formData.country,
          role: formData.role,
          status: formData.status,
          provider_type: formData.provider_type || null,
          specialization: formData.specialization || null,
          facility_name: formData.facility_name || null,
          permissions: formData.permissions,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('user_profiles_healthcare')
          .update(updateData)
          .eq('id', selectedUser.id);

        if (error) throw error;
      }

      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from('user_profiles_healthcare')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('user_profiles_healthcare')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'coordinator': 'bg-purple-100 text-purple-800',
      'provider': 'bg-blue-100 text-blue-800',
      'patient': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRolePermissions = (role) => {
    const defaultPermissions = {
      patient: {
        dashboard_access: true,
        patient_management: false,
        user_management: false,
        analytics_access: false,
        system_settings: false,
        data_export: false,
        financial_access: false,
        admin_panel: false
      },
      provider: {
        dashboard_access: true,
        patient_management: true,
        user_management: false,
        analytics_access: true,
        system_settings: false,
        data_export: false,
        financial_access: false,
        admin_panel: false
      },
      coordinator: {
        dashboard_access: true,
        patient_management: true,
        user_management: false,
        analytics_access: true,
        system_settings: false,
        data_export: true,
        financial_access: false,
        admin_panel: false
      },
      admin: {
        dashboard_access: true,
        patient_management: true,
        user_management: true,
        analytics_access: true,
        system_settings: true,
        data_export: true,
        financial_access: true,
        admin_panel: true
      }
    };
    return defaultPermissions[role] || defaultPermissions.patient;
  };

  // Auto-update permissions when role changes
  useEffect(() => {
    if (formData.role) {
      setFormData(prev => ({
        ...prev,
        permissions: getRolePermissions(formData.role)
      }));
    }
  }, [formData.role]);

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Role Management</h1>
            <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
          </div>
          <button
            onClick={() => openModal('create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">{filteredUsers.length} users</span>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name || 'Unknown'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiMail} className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone_number && (
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiPhone} className="w-3 h-3" />
                                <span>{user.phone_number}</span>
                              </div>
                            )}
                          </div>
                          {user.country && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                              <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                              <span>{user.country}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status || 'active')}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{new Date(user.updated_at || user.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', user)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', user)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('permissions', user)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiShield} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={user.status === 'active' ? FiX : FiCheck} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalType === 'create' && 'Create New User'}
                {modalType === 'edit' && 'Edit User'}
                {modalType === 'view' && 'User Details'}
                {modalType === 'permissions' && 'Manage Permissions'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={modalType === 'view' || modalType === 'edit'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Select country</option>
                    {COUNTRY_GROUPS.map(group => (
                      <optgroup key={group.label} label={group.label}>
                        {group.countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    required
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Provider-specific fields */}
              {formData.role === 'provider' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Provider Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider Type
                      </label>
                      <select
                        name="provider_type"
                        value={formData.provider_type}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="">Select type</option>
                        <option value="doctor">Doctor</option>
                        <option value="specialist">Specialist</option>
                        <option value="facility">Medical Facility</option>
                        <option value="nurse">Nurse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="e.g., Cardiology, Orthopedics"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      name="facility_name"
                      value={formData.facility_name}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Hospital or clinic name"
                    />
                  </div>
                </div>
              )}

              {/* Permissions Section */}
              {(modalType === 'permissions' || modalType === 'create' || modalType === 'edit') && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Permissions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {permissions.map(permission => (
                      <label key={permission.key} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name={`permissions.${permission.key}`}
                          checked={formData.permissions[permission.key] || false}
                          onChange={handleInputChange}
                          disabled={modalType === 'view'}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{permission.label}</p>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {modalType !== 'view' && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (modalType === 'create' ? 'Create User' : 'Save Changes')}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;