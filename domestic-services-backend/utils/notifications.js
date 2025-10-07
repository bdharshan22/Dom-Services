import emailService from './email.js';

class NotificationService {
  async sendBookingConfirmation(bookingData) {
    const { email, serviceName, date, time, bookingId, amount } = bookingData;
    
    try {
      if (email && process.env.EMAIL_USER) {
        const emailResult = await emailService.sendBookingConfirmation(email, {
          serviceName, date, time, bookingId, amount
        });
        return { type: 'email', status: 'sent', data: emailResult };
      } else {
        console.log('Email notification skipped - credentials not configured');
        return { type: 'email', status: 'skipped', reason: 'credentials not configured' };
      }
    } catch (error) {
      console.error('Email notification failed:', error.message);
      return { type: 'email', status: 'failed', error: error.message };
    }
  }
}

export default new NotificationService();