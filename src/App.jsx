import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginRegisterPrompt from './pages/LoginRegisterPrompt';
import { NotificationProvider } from './context/NotificationContext';
import { ItemProvider } from './context/ItemContext';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import AdminLogin from './components/Auth/AdminLogin';
import UserPage from './pages/UserPage';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import VerifyEmail from './components/Auth/VerifyEmail';
import ForgotPassword from './components/Auth/ForgotPassword';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
// import ThemeSwitcher from './components/Layout/ThemeSwitcher';
import DarkModeToggle from './components/Layout/DarkModeToggle';
import Sidebar from './components/Layout/Sidebar';
import UserProfile from './pages/UserProfile';
import UserHistory from './pages/UserHistory';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import LostForm from './components/LostAndFound/LostForm';
import FoundForm from './components/LostAndFound/FoundForm';
import LostList from './components/LostAndFound/LostList';
import FoundList from './components/LostAndFound/FoundList';
import ItemDetails from './components/LostAndFound/ItemDetails';
import ApprovalQueue from './components/Admin/ApprovalQueue';
import UserManagement from './components/Admin/UserManagement';
import Notification from './components/Notifications/Notification';
import EmailNotification from './components/Notifications/EmailNotification';
import PushNotification from './components/Notifications/PushNotification';
import LocationUpdate from './components/Location/LocationUpdate';
import MapView from './components/Location/MapView';
import DashboardAccessPage from './pages/DashboardAccessPage';



function ProtectedRoute({ element }) {
  const { user } = useAuth();
  return user ? element : <LoginRegisterPrompt />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ItemProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
              <Navbar />
              {/* <ThemeSwitcher /> */}
              <DarkModeToggle />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/approval-queue" element={<ApprovalQueue />} />
                    <Route path="/admin/user-management" element={<UserManagement />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/user/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
                    <Route path="/history" element={<ProtectedRoute element={<UserHistory />} />} />
                    <Route path="/lost" element={<ProtectedRoute element={<LostForm />} />} />
                    <Route path="/found" element={<ProtectedRoute element={<FoundForm />} />} />
                    <Route path="/lost-list" element={<ProtectedRoute element={<LostList />} />} />
                    <Route path="/found-list" element={<ProtectedRoute element={<FoundList />} />} />
                    <Route path="/item/:id" element={<ItemDetails />} />
                    <Route path="/notifications" element={<Notification message="Sample notification" />} />
                    <Route path="/email-notification" element={<EmailNotification to="test@example.com" subject="Test" body="Hello" />} />
                    <Route path="/push-notification" element={<PushNotification message="Push notification!" />} />
                    <Route path="/location-update" element={<LocationUpdate />} />
                    <Route path="/map-view" element={<MapView />} />
                    <Route path="/dashboard-access" element={<DashboardAccessPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </ItemProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}