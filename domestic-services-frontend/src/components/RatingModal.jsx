import React, { useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

const RatingModal = ({ booking, isOpen, onClose, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/bookings/${booking._id}`, {
        rating,
        review
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Thank you for your feedback!');
      onRatingSubmit();
      onClose();
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Rate Your Service</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              {booking.serviceId?.name || 'Service'}
            </h3>
            <div className="text-sm text-gray-600">
              <p>📅 {new Date(booking.date).toLocaleDateString()}</p>
              <p>🕐 {booking.time}</p>
              <p>📍 {booking.location}</p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate this service?
            </label>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {rating === 0 && 'Click on a star to rate'}
              {rating === 1 && '😞 Poor'}
              {rating === 2 && '😕 Fair'}
              {rating === 3 && '😐 Good'}
              {rating === 4 && '😊 Very Good'}
              {rating === 5 && '😍 Excellent'}
            </div>
          </div>

          {/* Review Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {review.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
