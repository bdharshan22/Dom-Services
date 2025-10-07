import React, { useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

const FeedbackModal = ({ isOpen, onClose, type = 'app_feedback', bookingId = null }) => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    categories: [],
    anonymous: false
  });
  const [loading, setLoading] = useState(false);

  const categories = {
    service_rating: [
      { name: 'Quality', rating: 0 },
      { name: 'Timeliness', rating: 0 },
      { name: 'Professionalism', rating: 0 },
      { name: 'Value for Money', rating: 0 }
    ],
    app_feedback: [
      { name: 'Ease of Use', rating: 0 },
      { name: 'Design', rating: 0 },
      { name: 'Performance', rating: 0 },
      { name: 'Features', rating: 0 }
    ],
    booking_experience: [
      { name: 'Booking Process', rating: 0 },
      { name: 'Payment', rating: 0 },
      { name: 'Communication', rating: 0 }
    ]
  };

  const [categoryRatings, setCategoryRatings] = useState(categories[type] || []);

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleCategoryRating = (index, rating) => {
    const updated = [...categoryRatings];
    updated[index].rating = rating;
    setCategoryRatings(updated);
    setFeedback(prev => ({ ...prev, categories: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.rating) {
      toast.error('Please provide a rating');
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', {
        type,
        bookingId,
        ...feedback
      });
      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Share Your Feedback</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium mb-3">Overall Rating *</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`text-3xl transition-colors ${
                    star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          {categoryRatings.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-3">Rate Categories</label>
              <div className="space-y-3">
                {categoryRatings.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="text-sm">{category.name}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleCategoryRating(index, star)}
                          className={`text-lg transition-colors ${
                            star <= category.rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Comments (Optional)
            </label>
            <textarea
              id="comment"
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Tell us more about your experience..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength="1000"
            />
            <div className="text-xs text-gray-500 mt-1">
              {feedback.comment.length}/1000 characters
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={feedback.anonymous}
              onChange={(e) => setFeedback(prev => ({ ...prev, anonymous: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !feedback.rating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;