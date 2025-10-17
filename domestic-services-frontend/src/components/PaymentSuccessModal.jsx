import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes, FaEnvelope, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { hidePaymentSuccessModal } from '../utils/modalUtils';
import '../mobile-modal-fix.css';
import '../styles/PaymentModal.css';

const PaymentSuccessModal = ({ isOpen, onClose, bookingData }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show modal immediately
      setShowModal(true);
      
      // Auto-close after 1 second
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 1000);
      
      return () => {
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    // Restore body scroll
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
    
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="payment-success-modal fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" 
      style={{ zIndex: 99999 }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        className={`modal-content bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 mobile-safe-area ${
          showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ zIndex: 100000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-3xl text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-green-100">Your booking has been confirmed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-gray-800 mb-3">Booking Details</h3>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold text-gray-800">{bookingData?.serviceName || 'Home Service'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaClock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold text-gray-800">
                  {bookingData?.date && new Date(bookingData.date).toLocaleDateString()} at {bookingData?.time}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-semibold text-gray-800">₹{bookingData?.amount}</p>
              </div>
            </div>

            {bookingData?.location && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {typeof bookingData.location === 'string' 
                      ? bookingData.location 
                      : bookingData.location?.address || 'Location provided'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Email Notification Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">Email Confirmation</p>
                <p className="text-sm text-blue-600">
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          {bookingData?.bookingId && (
            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="font-mono font-bold text-gray-800 text-lg tracking-wider">
                {bookingData.bookingId.toString().substring(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Save this ID for future reference</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Our team will contact you within 2 hours</li>
              <li>• You'll receive SMS updates about your booking</li>
              <li>• Check your email for detailed confirmation</li>
              <li>• You can track your booking in the dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => window.location.href = '/bookings', 500);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              View My Bookings
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;