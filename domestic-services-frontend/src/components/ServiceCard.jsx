import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ServiceCard = ({ service, onBook }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = (serviceId) => {
    // Allow viewing service details for all users
    navigate(`/services/${serviceId}`);
  };
  return (
    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
      {/* Availability Badge */} 
      <div className="absolute top-4 right-4 z-10">
        {service.available ? (
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Available</span>
          </span>
        ) : (
          <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Unavailable</span>
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-semibold text-gray-800">View Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {service.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-yellow-700">4.5</span>
            </div>
            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-green-700">2-4 hrs</span>
            </div>
          </div>
          {service.category && (
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold">
              {service.category}
            </span>
          )}
        </div>

        {/* Price and Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gray-800">₹{service.price}</span>
            <span className="text-xs text-gray-500">per service</span>
          </div>
          {service.available ? (
            <button
              onClick={() => handleViewDetails(service._id)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
            <span className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed text-sm flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Unavailable</span>
            </span>
          )}
        </div>
      </div>

      {/* Unavailable Overlay */}
      {!service.available && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-center border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Service Unavailable</h3>
            <p className="text-gray-600 text-sm">This service is currently not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
