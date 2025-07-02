import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminOverview from '../../components/admin/AdminOverview';
import ClientPipeline from '../../components/admin/ClientPipeline';
import ChatCopilot from '../../components/admin/ChatCopilot';
import WorkflowAutomation from '../../components/admin/WorkflowAutomation';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/pipeline" element={<ClientPipeline />} />
            <Route path="/chat" element={<ChatCopilot />} />
            <Route path="/automation" element={<WorkflowAutomation />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;