import { useState, useEffect } from 'react';

export const useFeedbackTrigger = () => {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('app_feedback');

  useEffect(() => {
    const checkFeedbackTriggers = () => {
      const lastFeedback = localStorage.getItem('lastFeedbackTime');
      const bookingCount = localStorage.getItem('bookingCount') || 0;
      const sessionTime = Date.now() - (sessionStorage.getItem('sessionStart') || Date.now());
      
      if (bookingCount >= 3 && !lastFeedback) {
        setShouldShowFeedback(true);
        setFeedbackType('booking_experience');
        return;
      }
      
      if (sessionTime > 5 * 60 * 1000 && !lastFeedback) {
        setShouldShowFeedback(true);
        setFeedbackType('app_feedback');
        return;
      }
      
      if (lastFeedback && Date.now() - parseInt(lastFeedback) > 7 * 24 * 60 * 60 * 1000) {
        setShouldShowFeedback(true);
        setFeedbackType('app_feedback');
      }
    };

    if (!sessionStorage.getItem('sessionStart')) {
      sessionStorage.setItem('sessionStart', Date.now().toString());
    }

    const timer = setTimeout(checkFeedbackTriggers, 2000);
    return () => clearTimeout(timer);
  }, []);

  const markFeedbackShown = () => {
    localStorage.setItem('lastFeedbackTime', Date.now().toString());
    setShouldShowFeedback(false);
  };

  const triggerBookingFeedback = (bookingId) => {
    setShouldShowFeedback(true);
    setFeedbackType('service_rating');
    sessionStorage.setItem('feedbackBookingId', bookingId);
  };

  return {
    shouldShowFeedback,
    feedbackType,
    markFeedbackShown,
    triggerBookingFeedback
  };
};