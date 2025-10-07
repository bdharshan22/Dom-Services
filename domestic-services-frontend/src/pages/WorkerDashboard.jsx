import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { useAuth } from '../components/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import WorkerAnalytics from '../components/WorkerAnalytics';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [inProgressBookings, setInProgressBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    console.log('Changing tab to:', tabId);
    setActiveTab(tabId);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    rating: 4.8
  });
  const analyticsRef = useRef();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/bookings/worker', { headers: { Authorization: `Bearer ${token}` } });
      // Filter bookings by status for display
      const confirmedBookings = response.data.filter(b => b.status === 'confirmed' || b.status === 'pending');
      const inProgressBookings = response.data.filter(b => b.status === 'in_progress');
      const completedBookings = response.data.filter(b => b.status === 'completed');
      setConfirmedBookings(confirmedBookings);
      setInProgressBookings(inProgressBookings);
      setCompletedBookings(completedBookings);
      
      // Calculate statistics
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.amount || b.serviceId?.price || 0), 0);
      setStats({
        totalEarnings,
        completedJobs: completedBookings.length,
        pendingJobs: confirmedBookings.length,
        inProgressJobs: inProgressBookings.length,
        rating: 4.8
      });
    } catch (err) {
      toast.error('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Accepting booking:', bookingId);
      const response = await api.patch(`/bookings/${bookingId}`, { status: 'in_progress' }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Accept booking response:', response.data);
      toast.success('Booking accepted and in progress!');
      fetchBookings();
    } catch (error) {
      console.error('Failed to accept booking:', error);
      toast.error('Failed to accept booking.');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/bookings/${bookingId}`, { status: 'completed' }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking completed!');
      fetchBookings();
      // Refresh analytics to show updated data
      if (analyticsRef.current) {
        analyticsRef.current.refreshAnalytics();
      }
    } catch {
      toast.error('Failed to complete booking.');
    }
  };

  // Filter all bookings based on search and status
  const allBookings = [...confirmedBookings, ...inProgressBookings, ...completedBookings];
  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading worker dashboard..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-600 to-primary-800 mb-2 font-heading">Worker Dashboard</h1>
          <p className="text-secondary-600 text-lg">Welcome back, {user?.name || 'Worker'}! Manage your bookings and track your progress.</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <div 
onClick={() => handleTabChange('overview')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-green-50/80"
            style={{pointerEvents: 'auto'}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium">This month</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Total Earnings</h3>
            <p className="text-3xl font-bold text-secondary-800">₹{stats.totalEarnings}</p>
          </div>
          
          <div 
onClick={() => handleTabChange('completed')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-blue-50/80"
            style={{pointerEvents: 'auto'}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-blue-600 text-sm font-medium">Completed</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Jobs Done</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.completedJobs}</p>
          </div>
          
          <div 
onClick={() => handleTabChange('pending')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-yellow-50/80"
            style={{pointerEvents: 'auto'}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-yellow-600 text-sm font-medium">Pending</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Pending Jobs</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.pendingJobs}</p>
          </div>
          
          <div 
onClick={() => handleTabChange('progress')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-orange-50/80"
            style={{pointerEvents: 'auto'}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-orange-600 text-sm font-medium">In Progress</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Active Jobs</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.inProgressJobs}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-purple-600 text-sm font-medium">Average</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Rating</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.rating}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-white/20" style={{position: 'relative', zIndex: 10}}>
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'pending', label: 'Pending', icon: '⏳', count: confirmedBookings.length },
              { id: 'progress', label: 'In Progress', icon: '🔄', count: inProgressBookings.length },
              { id: 'completed', label: 'Completed', icon: '✅', count: completedBookings.length }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTabChange(tab.id);
                }}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer ${
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
            <WorkerAnalytics ref={analyticsRef} />
            
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium">View Pending Jobs</div>
                  <div className="text-sm opacity-90">{confirmedBookings.length} waiting</div>
                </button>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium">Active Jobs</div>
                  <div className="text-sm opacity-90">{inProgressBookings.length} in progress</div>
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-medium">Completed Jobs</div>
                  <div className="text-sm opacity-90">{completedBookings.length} finished</div>
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Recent Activity</h3>
              <div className="space-y-3">
                {allBookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{booking.serviceId?.name?.charAt(0) || 'S'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-800">{booking.serviceId?.name || booking.service} for {booking.userId?.name || 'Customer'}</p>
                      <p className="text-sm text-secondary-600">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary-800 mb-4 md:mb-0 font-heading">Pending & Confirmed Bookings</h3>
              
              {/* Search */}
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
            </div>
            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmedBookings.map(b => (
                <div key={b._id} className="bg-white rounded-2xl shadow-lg border-l-4 border-green-400 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{b.serviceId?.name || b.service}</h4>
                      <p className="text-sm text-secondary-600">{b.userId?.name || 'Customer'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(b.date).toLocaleDateString()} at {b.time}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {b.location}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {b.mobile}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Earn: ₹{b.amount || b.serviceId?.price || 0}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAcceptBooking(b._id)} 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      Accept Job
                    </button>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {confirmedBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-secondary-600 font-medium">No pending bookings</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">Jobs In Progress</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressBookings.map(b => (
                <div key={b._id} className="bg-white rounded-2xl shadow-lg border-l-4 border-yellow-400 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{b.serviceId?.name || b.service}</h4>
                      <p className="text-sm text-secondary-600">{b.userId?.name || 'Customer'}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                      In Progress
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(b.date).toLocaleDateString()} at {b.time}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {b.location}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {b.mobile}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCompleteBooking(b._id)} 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {inProgressBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔄</div>
                <p className="text-secondary-600 font-medium">No jobs in progress</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">Completed Jobs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedBookings.map(b => (
                <div key={b._id} className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-400 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-secondary-800">{b.serviceId?.name || b.service}</h4>
                      <p className="text-sm text-secondary-600">{b.userId?.name || 'Customer'}</p>
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
                      {new Date(b.date).toLocaleDateString()} at {b.time}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {b.location}
                    </div>
                    {b.completedAt && (
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed: {new Date(b.completedAt).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Earned: ₹{b.amount || b.serviceId?.price || 0}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {completedBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-secondary-600 font-medium">No completed jobs yet</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-secondary-800 font-heading">Job Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors cursor-pointer"
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
                      <p className="font-semibold text-secondary-800">{selectedBooking.serviceId?.name || selectedBooking.service}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Customer</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.userId?.name || 'Customer'}</p>
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
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Status</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedBooking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Earnings</label>
                      <p className="font-semibold text-green-600 text-lg">₹{selectedBooking.amount || selectedBooking.serviceId?.price || 0}</p>
                    </div>
                    {selectedBooking.completedAt && (
                      <div className="bg-secondary-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-secondary-600 mb-1">Completed At</label>
                        <p className="font-semibold text-secondary-800">{new Date(selectedBooking.completedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 bg-secondary-200 text-secondary-700 py-3 px-6 rounded-xl font-medium hover:bg-secondary-300 transition-all duration-300 cursor-pointer"
                  >
                    Close
                  </button>
                  {selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending' ? (
                    <button
                      onClick={() => {
                        handleAcceptBooking(selectedBooking._id);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      Accept Job
                    </button>
                  ) : selectedBooking.status === 'in_progress' ? (
                    <button
                      onClick={() => {
                        handleCompleteBooking(selectedBooking._id);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      Mark Complete
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
