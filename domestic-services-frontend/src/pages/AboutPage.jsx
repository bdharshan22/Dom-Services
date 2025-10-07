import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mb-6 shadow-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                About
              </h1>
              <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed text-sm">
                We are your trusted partner for all domestic service needs. Our mission is to bring quality, reliability, and convenience right to your doorstep.
              </p>
            </div>
          </div>

          {/* Our Services Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Our Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Home Cleaning */}
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Home Cleaning</h3>
                  <p className="text-gray-300 text-center text-xs">
                    Professional cleaning services for your home and office.
                  </p>
                </div>

                {/* Repairs & Maintenance */}
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Repairs & Maintenance</h3>
                  <p className="text-gray-300 text-center text-xs">
                    Expert repair services for appliances and fixtures.
                  </p>
                </div>

                {/* Electrical */}
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Electrical Services</h3>
                  <p className="text-gray-300 text-center text-xs">
                    Certified electricians for wiring and installations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -left-3 w-18 h-18 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reliable Service */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Reliable Service</h3>
                  <p className="text-gray-300 text-xs">
                    Vetted professionals deliver consistent, high-quality service.
                  </p>
                </div>

                {/* 24/7 Support */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">24/7 Support</h3>
                  <p className="text-gray-300 text-xs">
                    Round-the-clock customer support whenever you need.
                  </p>
                </div>

                {/* Expert Team */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">Expert Team</h3>
                  <p className="text-gray-300 text-xs">
                    Skilled professionals with years of experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm">
                Book your domestic service today and experience professional home services.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                >
                  <span>Book a Service</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm"
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

export default AboutPage;
