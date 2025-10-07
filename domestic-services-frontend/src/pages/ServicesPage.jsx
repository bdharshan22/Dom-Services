import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { api } from '../api';
import ServiceCard from '../components/ServiceCard';
import BookingForm from '../components/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        toast.error('Failed to fetch services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBook = (serviceId) => {
    if (!user) {
      toast.warning('Please login to book a service.', {
        onClose: () => {
          navigate('/login');
        }
      });
      return;
    }
    setSelectedServiceId(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedServiceId(null);
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && service.price < 500) ||
                        (priceRange === 'medium' && service.price >= 500 && service.price < 1500) ||
                        (priceRange === 'high' && service.price >= 1500);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['all', ...new Set(services.map(service => service.category || 'general'))];

  if (loading) {
    return <LoadingSpinner message="Loading services..." />;
  }

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
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mb-4 shadow-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                <span className="text-white">Our </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Services
                </span>
              </h1>
              <p className="text-gray-300 text-sm">Professional home services at your fingertips</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8">
            {/* Floating Elements */}
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-3 -right-3 w-18 h-18 bg-orange-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800 text-white">
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                  >
                    <option value="all" className="bg-gray-800 text-white">All Prices</option>
                    <option value="low" className="bg-gray-800 text-white">Under ₹500</option>
                    <option value="medium" className="bg-gray-800 text-white">₹500 - ₹1500</option>
                    <option value="high" className="bg-gray-800 text-white">Above ₹1500</option>
                  </select>
                </div>
              </div>

              {/* Filter Results Info */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-300 text-sm">
                  {filteredServices.length} of {services.length} services
                </p>
                {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceRange('all');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onBook={handleBook}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Services Found</h3>
                <p className="text-gray-300 mb-4 text-sm">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm"
                >
                  View All Services
                </button>
              </div>
            )}
          </div>

          {/* CTA Section */}
          {services.length > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-700/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Need a Custom Service?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm">
                  Can't find what you're looking for? Contact us for custom service requests.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                  >
                    <span>Contact Us</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.5-1.207l-3.5 3.5V12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                  </Link>
                  {!user && (
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm"
                    >
                      <span>Join as Provider</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedServiceId && (
        <BookingForm serviceId={selectedServiceId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ServicesPage;
