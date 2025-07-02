import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiUpload, FiFile, FiDownload, FiTrash2, FiEye, FiFolder } = FiIcons;

const Documents = () => {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchDocuments();
    }
  }, [profile]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_documents_healthcare')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // In a real implementation, you would upload to Supabase Storage
        // For now, we'll just store the metadata
        const documentData = {
          patient_id: profile.id,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          document_type: getDocumentType(file.name),
          upload_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('patient_documents_healthcare')
          .insert(documentData);

        if (error) throw error;
      }

      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setUploading(false);
    }
  };

  const getDocumentType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
    if (['doc', 'docx'].includes(extension)) return 'Document';
    return 'Other';
  };

  const getFileIcon = (documentType) => {
    switch (documentType) {
      case 'PDF': return FiFile;
      case 'Image': return FiEye;
      case 'Document': return FiFile;
      default: return FiFile;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const { error } = await supabase
          .from('patient_documents_healthcare')
          .delete()
          .eq('id', documentId);

        if (error) throw error;
        await fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
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
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-2">Manage your medical documents and reports</p>
          </div>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <SafeIcon icon={FiUpload} className="w-5 h-5" />
              <span>{uploading ? 'Uploading...' : 'Upload Documents'}</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Upload Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Guidelines</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG</li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• Upload medical reports, test results, prescriptions, and insurance documents</li>
          <li>• All documents are encrypted and securely stored</li>
        </ul>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiFolder} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
          <p className="text-gray-600 mb-6">Start by uploading your medical documents and reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={getFileIcon(document.document_type)} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{document.file_name}</h3>
                    <p className="text-sm text-gray-500">{document.document_type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* Handle download */}}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span>{new Date(document.upload_date).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;