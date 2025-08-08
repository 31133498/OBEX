import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './Dashboard';
import Settings from './pages/Settings';
import History from './pages/History';
import Profile from './pages/Profile';
import LogoLoader from './LogoLoader';
import ZoneManagement from './pages/ZoneManagement';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute requireAuth={false}>
            <ResetPassword />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={
          <ProtectedRoute requireAuth={false}>
            <VerifyEmail />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/zone-management" element={
          <ProtectedRoute requireAuth={true}>
            <ZoneManagement />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requireAuth={true}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute requireAuth={true}>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
    </>
  );
}
