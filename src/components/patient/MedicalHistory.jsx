import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiPlus, FiEdit, FiTrash2, FiHeart, FiActivity, FiClock } = FiIcons;

const MedicalHistory = () => {
  const { profile } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    condition: '',
    diagnosis_date: '',
    treatment: '',
    doctor_name: '',
    notes: '',
    status: 'ongoing'
  });

  useEffect(() => {
    if (profile?.id) {
      fetchMedicalHistory();
    }
  }, [profile]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_history_healthcare')
        .select('*')
        .eq('patient_id', profile.id)
        .order('diagnosis_date', { ascending: false });

      if (error) throw error;
      setMedicalRecords(data || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordData = {
        ...formData,
        patient_id: profile.id,
        created_at: editingRecord ? editingRecord.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('medical_history_healthcare')
          .update(recordData)
          .eq('id', editingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medical_history_healthcare')
          .insert(recordData);
        if (error) throw error;
      }

      await fetchMedicalHistory();
      setIsModalOpen(false);
      setEditingRecord(null);
      setFormData({
        condition: '',
        diagnosis_date: '',
        treatment: '',
        doctor_name: '',
        notes: '',
        status: 'ongoing'
      });
    } catch (error) {
      console.error('Error saving medical record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      condition: record.condition,
      diagnosis_date: record.diagnosis_date?.split('T')[0] || '',
      treatment: record.treatment || '',
      doctor_name: record.doctor_name || '',
      notes: record.notes || '',
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        const { error } = await supabase
          .from('medical_history_healthcare')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchMedicalHistory();
      } catch (error) {
        console.error('Error deleting medical record:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'chronic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
            <p className="text-gray-600 mt-2">Track your medical conditions and treatments</p>
          </div>
          <button
            onClick={() => {
              setEditingRecord(null);
              setFormData({
                condition: '',
                diagnosis_date: '',
                treatment: '',
                doctor_name: '',
                notes: '',
                status: 'ongoing'
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Record</span>
          </button>
        </div>
      </motion.div>

      {loading && !medicalRecords.length ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical history...</p>
        </div>
      ) : medicalRecords.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiHeart} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
          <p className="text-gray-600 mb-6">Start building your medical history by adding your first record.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Record
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {medicalRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{record.condition}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                        {new Date(record.diagnosis_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {record.treatment && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Treatment</h4>
                    <p className="text-gray-600">{record.treatment}</p>
                  </div>
                )}
                {record.doctor_name && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Doctor</h4>
                    <p className="text-gray-600">{record.doctor_name}</p>
                  </div>
                )}
              </div>

              {record.notes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                  <p className="text-gray-600">{record.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis Date *
                  </label>
                  <input
                    type="date"
                    value={formData.diagnosis_date}
                    onChange={(e) => setFormData({ ...formData, diagnosis_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment
                  </label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the condition..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRecord(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingRecord ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;