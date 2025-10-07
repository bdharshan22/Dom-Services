import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';

const BookingConfirmation = ({ bookingData, onClose }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewBookings = () => {
    navigate('/bookings');
    onClose();
  };

  const handleBookAnother = () => {
    navigate('/services');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform animate-pulse">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-green-100 text-lg">Your service has been successfully booked</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Booking Details */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">📋</span>
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Service:</span>
                  <div className="font-semibold">{bookingData?.serviceName}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Date & Time:</span>
                  <div className="font-semibold">{bookingData?.date} at {bookingData?.time}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Booking ID:</span>
                  <div className="font-mono text-blue-600 font-semibold">#{bookingData?.bookingId || 'BK' + Date.now()}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Amount Paid:</span>
                  <div className="font-bold text-green-600 text-xl">₹{bookingData?.amount}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Payment Status:</span>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="font-semibold text-green-600">Paid</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Location:</span>
                  <div className="font-semibold text-sm">{bookingData?.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">⏰</span>
              What happens next?
            </h3>
            <div className="space-y-3 text-yellow-800">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <div>
                  <div className="font-medium">Confirmation Email & SMS</div>
                  <div className="text-sm text-yellow-700">You'll receive booking confirmation within 5 minutes</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <div>
                  <div className="font-medium">Service Provider Assignment</div>
                  <div className="text-sm text-yellow-700">We'll assign the best available professional within 2 hours</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <div>
                  <div className="font-medium">Pre-Service Contact</div>
                  <div className="text-sm text-yellow-700">Service provider will call you 30 minutes before arrival</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">📞</span>
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-white rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Customer Support</div>
                  <div className="text-blue-600 font-semibold">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">WhatsApp Support</div>
                  <div className="text-green-600 font-semibold">+91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleViewBookings}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold text-lg shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View My Bookings
            </button>
            <button
              onClick={handleBookAnother}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Another Service
            </button>
          </div>

          {/* Rating Prompt */}
          <div className="text-center pt-4 border-t">
            <p className="text-gray-600 mb-3">Help us improve by rating your experience</p>
            <button
              onClick={() => setShowFeedback(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-colors font-medium"
            >
              Rate Your Experience
            </button>
          </div>

          {/* Feedback Modal */}
          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            type="service_rating"
            bookingId={bookingData?.bookingId}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;