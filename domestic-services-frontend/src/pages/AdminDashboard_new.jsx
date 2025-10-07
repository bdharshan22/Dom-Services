import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
  const [editingService, setEditingService] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({ status: '', date: '', time: '', location: '', mobile: '' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeUserTab, setActiveUserTab] = useState('admin');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedBookings: 0,
    pendingBookings: 0,
    activeWorkers: 0
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, workersRes, bookingsRes, servicesRes] = await Promise.all([
        api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/workers', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/services'),
      ]);
      setUsers(usersRes.data);
      setWorkers(workersRes.data);
      setBookings(bookingsRes.data.bookings || bookingsRes.data);
      setServices(servicesRes.data);
      
      // Calculate statistics
      const allBookings = bookingsRes.data.bookings || bookingsRes.data;
      const completedCount = allBookings.filter(b => b.status === 'completed').length;
      const pendingCount = allBookings.filter(b => b.status === 'pending').length;
      const totalRevenue = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);
      
      setStats({
        totalRevenue,
        completedBookings: completedCount,
        pendingBookings: pendingCount,
        activeWorkers: workersRes.data.length
      });
    } catch (err) {
      toast.error('Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combine users and workers, and filter by role
  const allUsersAndWorkers = [
    ...users.filter(u => u.role === 'admin' || u.role === 'user'),
    ...workers.map(w => ({ ...w, role: 'worker' }))
  ];
  const filteredUsers = allUsersAndWorkers.filter(u => u.role === activeUserTab);
  
  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Service management handlers
  const handleServiceFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingService) {
        await api.put(`/admin/services/${editingService._id}`, serviceForm, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Service updated!');
      } else {
        await api.post('/admin/services', serviceForm, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Service added!');
      }
      setServiceForm({ name: '', description: '', price: '' });
      setEditingService(null);
      fetchData();
    } catch {
      toast.error('Service action failed.');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({ name: service.name, description: service.description, price: service.price });
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/services/${serviceId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Service deleted!');
      fetchData();
    } catch {
      toast.error('Delete failed.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <div className="text-primary-700 font-medium text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-600 to-primary-800 mb-2 font-heading">Admin Dashboard</h1>
          <p className="text-secondary-600 text-lg">Manage your domestic services platform</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 10-8 0v3m12 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a6 6 0 0112 0z" />
                </svg>
              </div>
              <span className="text-primary-600 text-sm font-medium">+12% this month</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-secondary-800">{users.length}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2m0 0v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2z" />
                </svg>
              </div>
              <span className="text-accent-600 text-sm font-medium">+8% this week</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold text-secondary-800">{bookings.length}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium">₹{stats.totalRevenue}</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold text-secondary-800">{stats.completedBookings}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                </svg>
              </div>
              <span className="text-purple-600 text-sm font-medium">{services.filter(s => s.available).length} active</span>
            </div>
            <h3 className="text-secondary-600 text-sm font-medium mb-1">Total Services</h3>
            <p className="text-3xl font-bold text-secondary-800">{services.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'services', label: 'Services', icon: '🛠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
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
                  onClick={() => setActiveTab('services')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-medium">Add New Service</div>
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">👨‍💼</div>
                  <div className="font-medium">Manage Workers</div>
                </button>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">View Bookings</div>
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-secondary-800 mb-4 font-heading">Recent Activity</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{booking.userId?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-800">{booking.userId?.name || 'User'} booked {booking.serviceId?.name || booking.service}</p>
                      <p className="text-sm text-secondary-600">{new Date(booking.createdAt).toLocaleDateString()}</p>
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

        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">User Management</h3>
            
            {/* User role tabs */}
            <div className="mb-6 flex space-x-2 bg-secondary-100 rounded-2xl p-1">
              {['admin', 'worker', 'user'].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveUserTab(role)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeUserTab === role
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}s ({allUsersAndWorkers.filter(u => u.role === role).length})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(u => (
                <div key={u._id} className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{u.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-secondary-800">{u.name}</h4>
                      <p className="text-sm text-secondary-600">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red-100 text-red-800' :
                      u.role === 'worker' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {u.role}
                    </span>
                    <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-secondary-600 font-medium">No {activeUserTab}s found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary-800 mb-4 md:mb-0 font-heading">Booking Management</h3>
              
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredBookings.map(b => (
                <div key={b._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-400 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-secondary-800">{b.serviceId?.name || b.service}</h4>
                      <p className="text-sm text-secondary-600">{b.userId?.name || b.user?.name || 'User'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.status === 'completed' ? 'bg-green-100 text-green-800' :
                      b.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      b.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {b.workerId?.name || 'Unassigned'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="flex-1 bg-primary-100 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-200 transition-all duration-300 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-secondary-600 font-medium">No bookings found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-secondary-800 mb-6 font-heading">Service Management</h3>

            {/* Add Service Form */}
            <form onSubmit={handleServiceSubmit} className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-bold text-secondary-800 mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  value={serviceForm.name}
                  onChange={handleServiceFormChange}
                  placeholder="Service Name"
                  className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="description"
                  value={serviceForm.description}
                  onChange={handleServiceFormChange}
                  placeholder="Description"
                  className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={serviceForm.price}
                  onChange={handleServiceFormChange}
                  placeholder="Price"
                  className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg"
                >
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
                {editingService && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingService(null); setServiceForm({ name: '', description: '', price: '' }); }}
                    className="bg-secondary-200 text-secondary-700 px-6 py-3 rounded-xl font-medium hover:bg-secondary-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => (
                <div key={s._id} className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-secondary-800">{s.name}</h4>
                      <p className="text-sm text-secondary-600 mt-1">{s.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {s.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary-600">₹{s.price}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(s)}
                      className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-all duration-300 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(s._id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-all duration-300 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛠️</div>
                <p className="text-secondary-600 font-medium">No services found</p>
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
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Customer</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.userId?.name || selectedBooking.user?.name || 'User'}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Service</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.serviceId?.name || selectedBooking.service}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Date</label>
                      <p className="font-semibold text-secondary-800">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Time</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.time}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Location</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.location}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Mobile</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.mobile}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-secondary-600 mb-1">Worker</label>
                      <p className="font-semibold text-secondary-800">{selectedBooking.workerId?.name || 'Unassigned'}</p>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;