import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RatingModal from '../components/RatingModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedServices: 0,
    upcomingServices: 0,
    favoriteService: ''
  });
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (authLoading) return;
      if (!user) {
        toast.error('Please log in to view your bookings.');
        navigate('/login');
        return;
      }
      try {
        const res = await api.get('/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(res.data);
        
        // Calculate statistics
        const completedBookings = res.data.filter(b => b.status === 'completed');
        const upcomingBookings = res.data.filter(b => new Date(b.date) > new Date());
        const totalSpent = completedBookings.reduce((sum, b) => sum + (b.amount || b.serviceId?.price || 0), 0);
        
        // Find most booked service
        const serviceCount = {};
        res.data.forEach(b => {
          const serviceName = b.serviceId?.name || b.serviceName || 'Unknown Service';
          serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
        });
        const favoriteService = Object.keys(serviceCount).reduce((a, b) => 
          serviceCount[a] > serviceCount[b] ? a : b, '') || 'None';
        
        setStats({
          totalSpent,
          completedServices: completedBookings.length,
          upcomingServices: upcomingBookings.length,
          favoriteService
        });
      } catch (err) {
        toast.error('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    // Set up auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user, navigate, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <div className="text-white font-medium text-lg">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.date) > new Date());
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const completedBookings = bookings.filter(b => b.status === "completed");
  const inProgressBookings = bookings.filter(b => b.status === "in_progress");

  const handleRatingSubmit = async () => {
    // Refresh bookings data after rating is submitted
    try {
      const res = await api.get('/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to refresh bookings after rating.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 font-heading">My Dashboard</h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Welcome back, {user?.name || 'Customer'}! Track your bookings and manage your services.</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-blue-600 text-sm font-medium">Total</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">All Bookings</h3>
            <p className="text-3xl font-bold text-secondary-800">{bookings.length}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium">Spent</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Total Amount</h3>
            <p className="text-3xl font-bold text-secondary-800">₹{stats.totalSpent}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-blue-600 text-sm font-medium">Done</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.completedServices}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                </svg>
              </div>
              <span className="text-purple-600 text-sm font-medium">Scheduled</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Upcoming</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.upcomingServices}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'all', label: 'All Bookings', icon: '📋', count: bookings.length },
              { id: 'upcoming', label: 'Upcoming', icon: '⏰', count: upcomingBookings.length },
              { id: 'completed', label: 'Completed', icon: '✅', count: completedBookings.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="font-medium">Book New Service</div>
                  <div className="text-sm opacity-90">Browse available services</div>
                </button>
                <button 
                  onClick={() => setActiveTab('upcoming')}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="font-medium">View Upcoming</div>
                  <div className="text-sm opacity-90">{upcomingBookings.length} scheduled</div>
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-medium">Rate Services</div>
                  <div className="text-sm opacity-90">Share your experience</div>
                </button>
              </div>
            </div>
            
            {/* Service Insights */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Your Service Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-primary-800 mb-2">Favorite Service</h4>
                  <p className="text-2xl font-bold text-primary-700">{stats.favoriteService}</p>
                  <p className="text-sm text-primary-600 mt-2">Most frequently booked</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-green-800 mb-2">This Month</h4>
                  <p className="text-2xl font-bold text-green-700">{bookings.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length}</p>
                  <p className="text-sm text-green-600 mt-2">Services booked</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Recent Activity</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{booking.serviceId?.name?.charAt(0) || 'S'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-800">{booking.serviceId?.name || booking.serviceName || 'Unknown Service'}</p>
                      <p className="text-sm text-secondary-600">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary-800 mb-4 md:mb-0 font-heading">All Bookings</h3>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-secondary-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{booking.serviceId?.name || booking.serviceName || 'Unknown Service'}</h4>
                      <p className="text-sm text-secondary-600">{booking.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {booking.mobile}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      ₹{booking.amount || booking.serviceId?.price || 0}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 bg-primary-100 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-200 transition-all duration-300 font-medium text-sm"
                    >
                      View Details
                    </button>
                    {booking.status === 'completed' && !booking.rating && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setRatingModalOpen(true);
                        }}
                        className="bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-all duration-300 font-medium text-sm"
                      >
                        ⭐ Rate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-secondary-600 font-medium">No bookings found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">Upcoming Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-400 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{booking.serviceId?.name || booking.serviceName || 'Unknown Service'}</h4>
                      <p className="text-sm text-secondary-600">{booking.location}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Upcoming
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-purple-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {Math.ceil((new Date(booking.date) - new Date()) / (1000 * 60 * 60 * 24))} days to go
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-all duration-300 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
            
            {upcomingBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏰</div>
                <p className="text-secondary-600 font-medium">No upcoming services</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">Completed Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-400 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{booking.serviceId?.name || booking.serviceName || 'Unknown Service'}</h4>
                      <p className="text-sm text-secondary-600">{booking.location}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    {booking.rating && (
                      <div className="flex items-center text-sm text-yellow-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Rated {booking.rating}/5
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-all duration-300 font-medium text-sm"
                    >
                      View Details
                    </button>
                    {!booking.rating && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setRatingModalOpen(true);
                        }}
                        className="bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-all duration-300 font-medium text-sm"
                      >
                        ⭐ Rate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {completedBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-secondary-600 font-medium">No completed services yet</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && !ratingModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-secondary-800 font-heading">Booking Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Service</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.serviceId?.name || selectedBooking.serviceName || 'Unknown Service'}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Status</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedBooking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        selectedBooking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Date & Time</label>
                      <p className="font-semibold text-secondary-800">{new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Location</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.location}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Contact</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.mobile}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Amount</label>
                      <p className="font-semibold text-green-600 text-lg">₹{selectedBooking.amount || selectedBooking.serviceId?.price || 0}</p>
                    </div>
                    {selectedBooking.workerId && (
                      <div className="bg-secondary-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-secondary-600 mb-1">Worker</label>
                        <p className="font-semibold text-secondary-800">{selectedBooking.workerId?.name || 'Assigned'}</p>
                      </div>
                    )}
                    {selectedBooking.rating && (
                      <div className="bg-secondary-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-secondary-600 mb-1">Your Rating</label>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < selectedBooking.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-secondary-600">({selectedBooking.rating}/5)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 bg-secondary-200 text-secondary-700 py-3 px-6 rounded-xl font-medium hover:bg-secondary-300 transition-all duration-300"
                  >
                    Close
                  </button>
                  {selectedBooking.status === 'completed' && !selectedBooking.rating && (
                    <button
                      onClick={() => {
                        setRatingModalOpen(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                    >
                      ⭐ Rate Service
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        <RatingModal
          booking={selectedBooking}
          isOpen={ratingModalOpen}
          onClose={() => {
            setRatingModalOpen(false);
            setSelectedBooking(null);
          }}
          onRatingSubmit={handleRatingSubmit}
        />
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;