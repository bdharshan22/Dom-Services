import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServiceBookingPage from './pages/ServiceBookingPage';
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
      {/* Always show Navbar */}
      <Navbar isAdmin={isAdmin} isWorker={isWorker} />
      <main className="w-full pt-20">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          {/* Public route for password reset */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Private routes */}
          <Route path="/services/:serviceId" element={
            <PrivateRoute>
              <ServiceDetailsPage />
            </PrivateRoute>
          } />
          <Route path="/services/:serviceId/book" element={
            <PrivateRoute>
              <ServiceBookingPage />
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
    </Router>
  );
};

export default App;
