// Modal utility functions for better mobile handling

export const showPaymentSuccessModal = (setShowModal, bookingData) => {
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  
  // Force modal to show with proper timing
  setTimeout(() => {
    setShowModal(true);
  }, 100);
  
  // Vibrate on mobile for feedback
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
  
  // Show browser notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Payment Successful! 🎉', {
      body: `Your booking for ${bookingData?.serviceName || 'service'} has been confirmed.`,
      icon: '/favicon.ico'
    });
  }
};

export const hidePaymentSuccessModal = (setShowModal, onClose) => {
  // Restore body scroll
  document.body.style.overflow = 'auto';
  document.body.classList.remove('modal-open');
  
  setShowModal(false);
  setTimeout(() => {
    onClose();
  }, 300);
};

export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};