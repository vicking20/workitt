import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy Load Pages
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ProfilePreview = React.lazy(() => import("./pages/ProfilePreview")); // Was unused in original App.tsx but imported
const CoverLetters = React.lazy(() => import("./pages/CoverLetters"));
const CoverLetterEditor = React.lazy(() => import("./pages/CoverLetterEditor"));
const Resumes = React.lazy(() => import("./pages/Resumes"));
const ResumeEditor = React.lazy(() => import("./pages/ResumeEditor"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-light">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-accent"></div>
  </div>
);

import ScrollToTopRouter from "./components/ScrollToTopRouter";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTopRouter />
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cover-letters"
              element={
                <ProtectedRoute>
                  <CoverLetters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cover-letters/create"
              element={
                <ProtectedRoute>
                  <CoverLetterEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cover-letters/:coverId"
              element={
                <ProtectedRoute>
                  <CoverLetterEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <Resumes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes/create"
              element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes/:resumeId"
              element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />

            {/* 404 - Redirect to home */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
