import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';
import './LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success('Login successful!');

      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-lg animate-fade-in">
            <h1 className="text-4xl font-bold mb-6 pt-8">
              <span className="text-white">Welcome to </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Domestic Services
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Your trusted partner for all home services. Connect with skilled professionals and get your tasks done efficiently.
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">🏠</div>
                <h3 className="font-semibold mb-1">Home Services</h3>
                <p className="text-sm text-gray-300">Professional cleaning, repairs & maintenance</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Quick Booking</h3>
                <p className="text-sm text-gray-300">Book services instantly with just a few clicks</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-1">Trusted Workers</h3>
                <p className="text-sm text-gray-300">Verified professionals you can rely on</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">💳</div>
                <h3 className="font-semibold mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-300">Safe and secure payment processing</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-8">
              <h3 className="text-lg font-semibold mb-2">Join as a Service Provider</h3>
              <p className="text-gray-300 text-sm mb-3">Grow your business with our platform</p>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                Get Started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md animate-fade-in">
            {/* Glass Card */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-gray-300">Welcome back! Please sign in to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-gray-300">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-200">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;