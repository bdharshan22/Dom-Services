import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

const ServiceDetailsModal = ({ serviceId, onClose, onBook }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        toast.error('Service not found.');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, onClose]);

  const handleBookNow = () => {
    onBook(serviceId);
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-cyan-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <div className="text-center text-white">
            <div className="spinner mx-auto mb-4"></div>
            <div className="text-lg font-semibold">Loading service details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-cyan-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/20 transform hover:scale-[1.02] transition-all duration-500">
        {/* Header */}
        <div className="relative">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-80 object-cover rounded-t-[2rem]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-[2rem]"></div>

          {/* Availability Badge */}
          <div className="absolute top-6 right-6 z-20">
            {service.available ? (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/20 flex items-center space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Available Now</span>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/20">
                <span>Unavailable</span>
              </div>
            )}
          </div>

          {/* Service Category Badge */}
          <div className="absolute bottom-6 left-6 z-20">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
              {service.category}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 z-20 text-white hover:text-emerald-200 text-2xl bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:bg-white/30 hover:scale-110"
          >
            ←
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 overflow-y-auto max-h-[calc(95vh-20rem)]">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{service.name}</h2>
            <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide">
              {service.category}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-200 leading-relaxed text-lg">
              {service.description}
            </p>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">Service Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">Duration:</span>
                  <span className="font-semibold text-white">2-4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-white">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">Availability:</span>
                  <span className={`font-semibold ${service.available ? 'text-green-400' : 'text-red-400'}`}>
                    {service.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg">
              <h4 className="text-lg font-semibold mb-3">Quick Booking</h4>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">₹{service.price}</div>
                <div className="text-emerald-100 text-sm">per service</div>
                <div className="mt-3 text-xs text-emerald-100 bg-white/10 rounded-lg p-2">
                  🔒 Secure booking with instant confirmation
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 px-6 rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 font-semibold border border-white/20 hover:border-white/30"
            >
              Close
            </button>
            {service.available ? (
              <button
                onClick={handleBookNow}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ✨ Book Now
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-white/10 backdrop-blur-md text-gray-400 py-3 px-6 rounded-2xl cursor-not-allowed font-semibold border border-white/20"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
