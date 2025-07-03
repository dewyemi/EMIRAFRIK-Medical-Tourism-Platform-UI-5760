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
import UserRoleManagement from '../components/admin/UserRoleManagement';
import UserProfile from '../components/shared/UserProfile';

// Coordinator Components
import PatientManagement from '../components/coordinator/PatientManagement';
import JourneyTracking from '../components/coordinator/JourneyTracking';
import TravelLogistics from '../components/coordinator/TravelLogistics';
import Communications from '../components/coordinator/Communications';
import Analytics from '../components/coordinator/Analytics';
import PatientAssignment from '../components/coordinator/PatientAssignment';
import ResourceManagement from '../components/coordinator/ResourceManagement';

// Provider Components
import MyPatients from '../components/provider/MyPatients';
import Appointments from '../components/provider/Appointments';
import Assessments from '../components/provider/Assessments';
import Treatments from '../components/provider/Treatments';

// Patient Components
import MedicalHistory from '../components/patient/MedicalHistory';
import Documents from '../components/patient/Documents';
import Payments from '../components/patient/Payments';

// Admin Components
import UserManagement from '../components/admin/UserManagement';
import SystemAnalytics from '../components/admin/SystemAnalytics';

const DashboardPage = () => {
  const { profile, loading, user, error } = useAuth();

  console.log('🎯 DashboardPage state:', { user: user?.email, profile: profile?.role, loading, error });

  // Show loading while profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">
            {user ? `Setting up profile for ${user.email}` : 'Authenticating...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error if there's a connection issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If no profile, show setup message
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
          <p className="mt-2 text-sm text-gray-500">
            Welcome {user.email}, we're creating your account.
          </p>
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

  console.log('✅ Rendering dashboard for role:', profile.role);

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

        {/* Enhanced Coordinator Routes */}
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/patient-assignment" element={<PatientAssignment />} />
        <Route path="/journey-tracking" element={<JourneyTracking />} />
        <Route path="/logistics" element={<TravelLogistics />} />
        <Route path="/resource-management" element={<ResourceManagement />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/user-roles" element={<UserRoleManagement />} />
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