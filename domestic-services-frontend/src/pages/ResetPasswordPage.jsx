
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';


const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('request'); // 'request' or 'reset'
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('token')) {
      setMode('reset');
    }
  }, [location.search]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email });
      toast.success(res.data.message || 'Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (!token) throw new Error('No token provided');
      const res = await api.post('/auth/reset-password/confirm', { token, password });
      toast.success(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50">
      <form
        onSubmit={mode === 'request' ? handleRequest : handleReset}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          {mode === 'request' ? 'Reset Password' : 'Set New Password'}
        </h2>
        {mode === 'request' ? (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter your registered email address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-semibold transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter your new password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-semibold transition"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-indigo-600 hover:underline text-sm"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
