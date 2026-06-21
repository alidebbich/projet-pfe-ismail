import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Dashboards
import GlobalDashboard from './pages/dashboard/GlobalDashboard';
import DataDashboard from './pages/dashboard/DataDashboard';
import ProjectsDashboard from './pages/dashboard/ProjectsDashboard';
import SupportDashboard from './pages/dashboard/SupportDashboard';

// Modules
import ProjectList from './pages/projects/ProjectList';
import ProjectForm from './pages/projects/ProjectForm';
import ProjectDetail from './pages/projects/ProjectDetail';
import DataQualityList from './pages/data-quality/DataQualityList';
import DataQualityForm from './pages/data-quality/DataQualityForm';
import TicketList from './pages/ticketing/TicketList';
import TicketForm from './pages/ticketing/TicketForm';
import TicketDetail from './pages/ticketing/TicketDetail';
import ReportsPage from './pages/reports/ReportsPage';

// Admin
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';
import ThresholdManagement from './pages/admin/ThresholdManagement';
import AuditLogsViewer from './pages/admin/AuditLogsViewer';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "493510963157-5s973qircr42g6ress6hea56e7hfhf4f.apps.googleusercontent.com";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboards */}
            <Route path="/dashboard" element={<GlobalDashboard />} />
            <Route path="/dashboard/data" element={<DataDashboard />} />
            <Route path="/dashboard/projects" element={<ProjectsDashboard />} />
            <Route path="/dashboard/support" element={<SupportDashboard />} />

            {/* Projects */}
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />

            {/* Data Quality */}
            <Route path="/data-quality" element={<DataQualityList />} />
            <Route path="/data-quality/new" element={<DataQualityForm />} />
            <Route path="/data-quality/:id/edit" element={<DataQualityForm />} />

            {/* Ticketing */}
            <Route path="/ticketing" element={<TicketList />} />
            <Route path="/ticketing/new" element={<TicketForm />} />
            <Route path="/ticketing/:id" element={<TicketDetail />} />
            <Route path="/ticketing/:id/edit" element={<TicketForm />} />

            {/* Reports */}
            <Route path="/reports" element={<Navigate to="/reports/generate" replace />} />
            <Route path="/reports/generate" element={<ReportsPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/:id/edit" element={<UserForm />} />
              <Route path="/admin/thresholds" element={<ThresholdManagement />} />
              <Route path="/admin/thresholds/edit" element={<ThresholdManagement />} />
              <Route path="/admin/audit-logs" element={<AuditLogsViewer />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={
          <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-noir-950 text-gray-800 dark:text-gray-200">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Page non trouvée</p>
              <a href="/" className="text-blue-500 hover:underline">Retour à l'accueil</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
