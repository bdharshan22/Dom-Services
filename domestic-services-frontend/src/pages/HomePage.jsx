import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-12 mb-6 sm:mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-8 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="text-white">Professional </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Home Services
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                Your trusted partner for all domestic needs. Book verified professionals with confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0">
                <Link
                  to="/about"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
                >
                  <span>Explore</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  >
                    <span>Join as Provider</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                  <div className="text-gray-300 text-sm">Happy Customers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-gray-300 text-sm">Expert Professionals</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-gray-300 text-sm">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm px-2">
                Join thousands of satisfied customers who trust us with their home service needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
                <Link
                  to="/services"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center text-sm"
                >
                  <span>Browse Services</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-sm"
                >
                  <span>Contact Us</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.5-1.207l-3.5 3.5V12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;