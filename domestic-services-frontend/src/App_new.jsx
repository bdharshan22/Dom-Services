import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chat from './components/Chat';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingForm from './components/BookingForm';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuth } from './components/AuthProvider';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

const App = () => {
  const { user, loading } = useAuth();
  // Helper: check if user is admin
  const isAdmin = user && user.role === 'admin';
  // Helper: check if user is worker
  const isWorker = user && user.role === 'worker';
  return (
    <Router>
      {/* Only show Navbar and Footer if logged in */}
      {user && <Navbar isAdmin={isAdmin} isWorker={isWorker} />}
      <main className="container mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          {/* Public route for password reset */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Private routes */}
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/about" element={
            <PrivateRoute>
              <AboutPage />
            </PrivateRoute>
          } />
          <Route path="/services" element={
            <PrivateRoute>
              <ServicesPage />
            </PrivateRoute>
          } />
          <Route path="/bookings" element={
            <PrivateRoute>
              <BookingsPage />
            </PrivateRoute>
          } />
          <Route path="/book/:serviceId" element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          } />
          <Route path="/contact" element={
            <PrivateRoute>
              <ContactPage />
            </PrivateRoute>
          } />
          {/* Admin-only route */}
          <Route path="/admin" element={
            <PrivateRoute>
              {isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            </PrivateRoute>
          } />
          {/* Worker-only route */}
          <Route path="/worker" element={
            <PrivateRoute>
              {user && user.role === 'worker' ? <WorkerDashboard /> : <Navigate to="/" />}
            </PrivateRoute>
          } />
        </Routes>
      </main>
      {user && <Footer />}
      {/* Chat component - only show when user is logged in */}
      {user && <Chat />}
    </Router>
  );
};

export default App;
