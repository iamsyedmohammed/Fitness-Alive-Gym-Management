import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FitnessBlogPage from './pages/FitnessBlogPage';
import GalleryPage from './pages/GalleryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeesManagementPage from './pages/Admin/EmployeesManagementPage';
import EmployeeDetailsPage from './pages/Admin/EmployeeDetailsPage';
import AddEmployeePage from './pages/Admin/AddEmployeePage';
import MembersManagementPage from './pages/Admin/MembersManagementPage';
import AddMemberPage from './pages/Admin/AddMemberPage';
import AttendancePage from './pages/Admin/AttendancePage';
import EmployeeAttendancePage from './pages/Admin/EmployeeAttendancePage';
import PaymentsPage from './pages/Admin/PaymentsPage';
import MembershipsPage from './pages/Admin/MembershipsPage';
import WhatsAppMessagingPage from './pages/Admin/WhatsAppMessagingPage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import SettingsPage from './pages/Admin/SettingsPage';
import ManagePlansPage from './pages/Admin/ManagePlansPage';
import ChangePasswordPage from './pages/Admin/ChangePasswordPage';
import MembersDetailsPage from './pages/Admin/MembersDetailsPage';
import RemindersPage from './pages/Admin/RemindersPage';
import './styles/theme.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/blog" element={<FitnessBlogPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <EmployeeDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/list"
          element={
            <ProtectedRoute>
              <EmployeesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/add"
          element={
            <ProtectedRoute>
              <AddEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedRoute>
              <MembersManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/add"
          element={
            <ProtectedRoute>
              <AddMemberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/details"
          element={
            <ProtectedRoute>
              <MembersDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-members"
          element={
            <ProtectedRoute>
              <MembersDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance/members"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance/employees"
          element={
            <ProtectedRoute>
              <EmployeeAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute>
              <Navigate to="/admin/attendance/members" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/memberships"
          element={
            <ProtectedRoute>
              <MembershipsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/whatsapp"
          element={
            <ProtectedRoute>
              <WhatsAppMessagingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-plans"
          element={
            <ProtectedRoute>
              <ManagePlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reminders"
          element={
            <ProtectedRoute>
              <RemindersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
