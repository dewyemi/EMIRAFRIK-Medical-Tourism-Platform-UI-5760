import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiClipboard, FiPlus, FiEdit, FiEye, FiTrash2, FiUser, FiCalendar } = FiIcons;

const Assessments = () => {
  const { profile } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    assessment_type: '',
    findings: '',
    recommendations: '',
    severity: 'low'
  });

  useEffect(() => {
    if (profile?.id) {
      fetchAssessments();
    }
  }, [profile]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      
      // Get provider record
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) {
        setAssessments([]);
        return;
      }

      const { data, error } = await supabase
        .from('medical_assessments_healthcare')
        .select(`
          *,
          user_profiles_healthcare!medical_assessments_healthcare_patient_id_fkey(
            full_name, email
          )
        `)
        .eq('provider_id', providerData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get provider record
      const { data: providerData } = await supabase
        .from('healthcare_providers_healthcare')
        .select('id')
        .eq('user_profile_id', profile.id)
        .single();

      if (!providerData) return;

      const assessmentData = {
        ...formData,
        provider_id: providerData.id,
        created_at: editingAssessment ? editingAssessment.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingAssessment) {
        const { error } = await supabase
          .from('medical_assessments_healthcare')
          .update(assessmentData)
          .eq('id', editingAssessment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medical_assessments_healthcare')
          .insert(assessmentData);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingAssessment(null);
      setFormData({
        patient_id: '',
        assessment_type: '',
        findings: '',
        recommendations: '',
        severity: 'low'
      });
      await fetchAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      patient_id: assessment.patient_id,
      assessment_type: assessment.assessment_type,
      findings: assessment.findings,
      recommendations: assessment.recommendations,
      severity: assessment.severity
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        const { error } = await supabase
          .from('medical_assessments_healthcare')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Medical Assessments</h1>
            <p className="text-gray-600 mt-2">Create and manage patient medical assessments</p>
          </div>
          <button
            onClick={() => {
              setEditingAssessment(null);
              setFormData({
                patient_id: '',
                assessment_type: '',
                findings: '',
                recommendations: '',
                severity: 'low'
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>New Assessment</span>
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiClipboard} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first medical assessment.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiClipboard} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assessment.assessment_type}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(assessment.severity)}`}>
                        {assessment.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>{assessment.user_profiles_healthcare?.full_name || 'Unknown Patient'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(assessment)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assessment.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Findings</h4>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{assessment.findings}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{assessment.recommendations}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Type *
                </label>
                <select
                  value={formData.assessment_type}
                  onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select assessment type</option>
                  <option value="Initial Consultation">Initial Consultation</option>
                  <option value="Pre-operative Assessment">Pre-operative Assessment</option>
                  <option value="Post-operative Review">Post-operative Review</option>
                  <option value="Follow-up Assessment">Follow-up Assessment</option>
                  <option value="Diagnostic Assessment">Diagnostic Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Findings *
                </label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your clinical findings..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations *
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide your treatment recommendations..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAssessment(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAssessment ? 'Update' : 'Create'} Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;