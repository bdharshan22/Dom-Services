import React, { useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

const QuickFeedback = ({ trigger = 'floating' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleQuickRating = async (selectedRating) => {
    setRating(selectedRating);
    try {
      await api.post('/feedback', {
        type: 'app_feedback',
        rating: selectedRating,
        comment: 'Quick rating'
      });
      setSubmitted(true);
      toast.success('Thanks for your feedback!');
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  if (trigger === 'floating') {
    return (
      <>
        {/* Floating Feedback Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          title="Give Feedback"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* Quick Rating Popup */}
        {isOpen && (
          <div className="fixed bottom-20 right-6 bg-white rounded-2xl shadow-2xl p-4 border z-50 animate-slide-up">
            {!submitted ? (
              <div className="text-center">
                <p className="text-sm font-medium mb-3">How's your experience?</p>
                <div className="flex space-x-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleQuickRating(star)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-500 mt-2 hover:text-gray-700"
                >
                  Maybe later
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-green-600 text-2xl mb-2">✅</div>
                <p className="text-sm font-medium">Thank you!</p>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // Inline version for embedding in pages
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Quick Feedback</h4>
          <p className="text-sm text-gray-600">Rate your experience</p>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleQuickRating(star)}
              className={`text-xl transition-colors ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickFeedback;