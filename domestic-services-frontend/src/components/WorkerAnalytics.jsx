import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { api } from '../api';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';

const WorkerAnalytics = forwardRef((props, ref) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Expose refresh method to parent components
  useImperativeHandle(ref, () => ({
    refreshAnalytics: fetchAnalytics
  }));

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/bookings/worker/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl shadow-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-white rounded-2xl shadow-lg"></div>
            <div className="h-64 bg-white rounded-2xl shadow-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-2xl p-8 mb-8 border border-red-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">No Analytics Data Available</h3>
          <p className="text-red-600">Complete some services to see your performance analytics.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-purple-400 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute top-20 right-0 w-32 h-32 bg-indigo-400 rounded-full translate-x-16 -translate-y-10"></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-blue-400 rounded-full translate-y-12"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              📈 Performance Analytics
            </h2>
            <p className="text-gray-600 text-lg">Track your success and growth</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedPeriod === 'weekly'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Services */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm uppercase tracking-wide">Total Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalServices}</p>
                <p className="text-purple-500 text-sm mt-1">
                  {analytics.pendingServices + analytics.inProgressServices} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔧</span>
              </div>
            </div>
          </div>

          {/* Completed Services */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.completedServices}</p>
                <p className="text-green-500 text-sm mt-1">
                  {formatPercentage(analytics.completionRate)} success rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(analytics.totalEarnings)}</p>
                <p className="text-blue-500 text-sm mt-1">
                  Avg: {formatCurrency(analytics.averageEarnings)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium text-sm uppercase tracking-wide">Satisfaction</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatPercentage(analytics.customerSatisfaction)}</p>
                <p className="text-yellow-500 text-sm mt-1">Customer rating</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              {selectedPeriod === 'monthly' ? 'Monthly Earnings' : 'Weekly Earnings'}
            </h3>
            <div className="space-y-4">
              {(selectedPeriod === 'monthly' ? analytics.monthlyData : analytics.weeklyData).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-indigo-50 transition-all">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{item.month || item.week}</span>
                      <span className="font-bold text-purple-600">{formatCurrency(item.earnings)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((item.earnings / Math.max(...(selectedPeriod === 'monthly' ? analytics.monthlyData : analytics.weeklyData).map(d => d.earnings))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{item.services} services</span>
                      <span>{item.completed || 0} completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services by Category */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Services by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(analytics.servicesByCategory).map(([category, count], index) => {
                const earnings = analytics.categoryEarnings[category] || 0;
                const maxCount = Math.max(...Object.values(analytics.servicesByCategory));
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-800 capitalize">{category.replace('_', ' ')}</span>
                      <div className="text-right">
                        <div className="font-bold text-indigo-600">{count} services</div>
                        <div className="text-sm text-gray-500">{formatCurrency(earnings)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Top Performing Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topServices.map((service, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{service.name}</span>
                  <span className="text-2xl">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] || '📈'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{service.count} services completed</div>
                  <div className="font-medium text-green-600">{formatCurrency(service.earnings)} earned</div>
                  <div className="text-xs text-gray-500 capitalize">{service.category?.replace('_', ' ') || 'General'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.pendingServices}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium text-sm uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.inProgressServices}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium text-sm uppercase tracking-wide">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.cancelledServices}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">❌</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WorkerAnalytics;
