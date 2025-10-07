import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ServiceDetailsPage = () => {
  const { user } = useAuth();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        toast.error('Service not found.');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, navigate]);

  const handleBookNow = () => {
    if (!user) {
      toast.warning('Please login to book this service.', {
        onClose: () => {
          navigate('/login');
        }
      });
      return;
    }
    navigate(`/services/${serviceId}/book`);
  };

  const handleGoBack = () => {
    navigate('/services');
  };

  if (loading) {
    return <LoadingSpinner message="Loading service details..." />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h3>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleGoBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h3>
          <p className="text-gray-600 mb-8">Please login to view detailed service information and book services.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to View Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        <button
          onClick={handleGoBack}
          className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/10"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Services</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                {/* Status & Category */}
                <div className="flex items-center space-x-3">
                  {service.available ? (
                    <div className="flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/50 rounded-full px-3 py-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-300 text-xs font-medium">Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 bg-red-500/30 backdrop-blur-sm border border-red-400/50 rounded-full px-3 py-1.5">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span className="text-red-300 text-xs font-medium">Unavailable</span>
                    </div>
                  )}
                  {service.category && (
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5">
                      <span className="text-white text-xs font-medium">{service.category}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
                    {service.name}
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">4.8★</div>
                    <div className="text-gray-400 text-xs">Rating</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">2-4h</div>
                    <div className="text-gray-400 text-xs">Duration</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">24/7</div>
                    <div className="text-gray-400 text-xs">Support</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Service Image */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-4">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-64 object-cover rounded-xl shadow-xl"
                  />
                  <div className="absolute inset-4 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features & About Section */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Features */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What's Included</h2>
                <p className="text-gray-300 text-sm">Everything you need for perfect service</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🛡️', title: 'Quality Guarantee', desc: 'Professional service assurance' },
                  { icon: '👨🔧', title: 'Expert Technicians', desc: 'Skilled professionals' },
                  { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock support' },
                  { icon: '⚡', title: 'Quick Service', desc: 'Fast & efficient delivery' }
                ].map((feature, index) => (
                  <div key={index} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-xs">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -left-3 w-18 h-18 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">About This Service</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Our {service.name.toLowerCase()} service is performed by trained professionals who ensure the highest quality standards. We use industry-best practices and modern equipment to deliver exceptional results every time.
                </p>
                <p>
                  Whether you need regular maintenance or a one-time service, our team is ready to help you maintain your home in perfect condition with reliable, efficient, and professional service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/90 to-purple-700/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-black text-white mb-1">₹{service.price}</div>
                  <div className="text-blue-100 text-sm">Starting price</div>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">4.8★</div>
                  <div className="text-blue-100 text-xs">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">2-4h</div>
                  <div className="text-blue-100 text-xs">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">24/7</div>
                  <div className="text-blue-100 text-xs">Support</div>
                </div>
              </div>

              {/* Book Button */}
              {service.available ? (
                <button
                  onClick={handleBookNow}
                  className="group w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Book This Service</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-600/50 text-gray-300 font-bold text-lg py-4 px-6 rounded-2xl cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Currently Unavailable</span>
                </button>
              )}

              {/* Security Note */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-blue-100 text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Instant Booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;