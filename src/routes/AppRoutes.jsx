
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import UserPage from '../pages/UserPage';
import DashboardAccessPage from '../pages/DashboardAccessPage';
// import RequireAuthPage from '../pages/RequireAuthPage';
// import LoginRegisterPrompt from '../pages/LoginRegisterPrompt';
import AdminPage from '../pages/AdminPage';
import { useState, useEffect } from 'react';
import AdminLogin from '../components/Auth/AdminLogin';
import LostForm from '../components/LostAndFound/LostForm';
import FoundForm from '../components/LostAndFound/FoundForm';
import LostList from '../components/LostAndFound/LostList';
import FoundList from '../components/LostAndFound/FoundList';
import UserHistory from '../pages/UserHistory';
import LoginRegisterPrompt from '../pages/LoginRegisterPrompt';
// import LostFoundAccessPage from '../pages/LostFoundAccessPage';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordPage from '../pages/ForgotPassword';
// ...existing code...

export default function AppRoutes() {
  const [admin, setAdmin] = useState(() => {
    const adminUser = localStorage.getItem('gotcha_admin');
    return adminUser ? JSON.parse(adminUser) : null;
  });
  const { user } = useAuth();

  useEffect(() => {
    if (admin) {
      localStorage.setItem('gotcha_admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('gotcha_admin');
    }
  }, [admin]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
  <Route path="/lost" element={user ? <LostForm /> : <LoginRegisterPrompt />} />
  <Route path="/found" element={user ? <FoundForm /> : <LoginRegisterPrompt />} />
  <Route path="/user/dashboard" element={user ? <UserPage /> : <DashboardAccessPage />} />
  {/* <Route path="/require-auth" element={<RequireAuthPage />} /> */}
  {/* <Route path="/login-register-prompt" element={<LoginRegisterPrompt />} /> */}
      <Route path="/lost-list" element={<LostList />} />
      <Route path="/found-list" element={<FoundList />} />
  <Route path="/admin/login" element={<AdminLogin onLogin={setAdmin} />} />
  <Route path="/admin" element={admin ? <AdminPage /> : <Navigate to="/admin/login" replace />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/history" element={user ? <UserHistory /> : <LoginRegisterPrompt />} />
  {/* <Route path="/lostfound-access" element={<LostFoundAccessPage />} /> */}
  <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
