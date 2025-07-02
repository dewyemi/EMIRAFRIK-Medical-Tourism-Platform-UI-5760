import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import ProviderDashboard from '../components/dashboard/ProviderDashboard';
import CoordinatorDashboard from '../components/dashboard/CoordinatorDashboard';
import AdminOverview from '../components/admin/AdminOverview';
import ClientPipeline from '../components/admin/ClientPipeline';
import ChatCopilot from '../components/admin/ChatCopilot';
import WorkflowAutomation from '../components/admin/WorkflowAutomation';
import UserProfile from '../components/shared/UserProfile';
import PatientManagement from '../components/coordinator/PatientManagement';
import JourneyTracking from '../components/coordinator/JourneyTracking';
import TravelLogistics from '../components/coordinator/TravelLogistics';
import Communications from '../components/coordinator/Communications';
import Analytics from '../components/coordinator/Analytics';
import MyPatients from '../components/provider/MyPatients';
import Appointments from '../components/provider/Appointments';
import Assessments from '../components/provider/Assessments';
import Treatments from '../components/provider/Treatments';
import MedicalHistory from '../components/patient/MedicalHistory';
import Documents from '../components/patient/Documents';
import Payments from '../components/patient/Payments';
import UserManagement from '../components/admin/UserManagement';
import SystemAnalytics from '../components/admin/SystemAnalytics';

const DashboardPage = () => {
  const { profile, loading } = useAuth();

  // Show loading while profile is being fetched
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getDefaultRoute = () => {
    switch (profile?.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'coordinator':
        return '/dashboard/coordinator';
      case 'provider':
        return '/dashboard/provider';
      case 'patient':
      default:
        return '/dashboard/patient';
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        {/* Default route redirects based on role */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Patient Routes */}
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/payments" element={<Payments />} />
        
        {/* Provider Routes */}
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/patients" element={<MyPatients />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/treatments" element={<Treatments />} />
        
        {/* Coordinator Routes */}
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/journey-tracking" element={<JourneyTracking />} />
        <Route path="/logistics" element={<TravelLogistics />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/system-analytics" element={<SystemAnalytics />} />
        <Route path="/pipeline" element={<ClientPipeline />} />
        <Route path="/chat-copilot" element={<ChatCopilot />} />
        <Route path="/automation" element={<WorkflowAutomation />} />
        
        {/* Shared Routes */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;