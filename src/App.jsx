import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import LanguageProvider from './contexts/LanguageContext';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Layout Components
import Navbar from './components/layout/Navbar';
import MobileNavbar from './components/layout/MobileNavbar';

// Main Pages
import HomePage from './pages/HomePage';
import MedicalInquiryPage from './pages/MedicalInquiryPage';
import PackageSelectionPage from './pages/PackageSelectionPage';
import PaymentPage from './pages/PaymentPage';
import AftercarePage from './pages/AftercarePage';
import ChatPage from './pages/ChatPage';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Chat Assistant
import EnhancedChatAssistant from './components/chat/EnhancedChatAssistant';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

// Layout wrapper for public pages
const PublicLayout = ({ children }) => {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
      {children}
      <EnhancedChatAssistant />
    </>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          } />
          <Route path="/inquiry" element={
            <PublicLayout>
              <MedicalInquiryPage />
            </PublicLayout>
          } />
          <Route path="/packages" element={
            <PublicLayout>
              <PackageSelectionPage />
            </PublicLayout>
          } />
          <Route path="/payment" element={
            <PublicLayout>
              <PaymentPage />
            </PublicLayout>
          } />
          <Route path="/aftercare" element={
            <PublicLayout>
              <AftercarePage />
            </PublicLayout>
          } />
          <Route path="/chat" element={
            <PublicLayout>
              <ChatPage />
            </PublicLayout>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;