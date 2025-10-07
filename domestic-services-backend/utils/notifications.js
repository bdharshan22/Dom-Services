import emailService from './email.js';

class NotificationService {
  async sendBookingConfirmation(bookingData) {
    const { email, serviceName, date, time, bookingId, amount } = bookingData;
    
    console.log('📧 Attempting to send email notification to:', email);
    console.log('📧 Email service configured:', !!process.env.EMAIL_USER);
    
    try {
      if (email && process.env.EMAIL_USER) {
        console.log('📧 Sending email with data:', { serviceName, date, time, bookingId, amount });
        const emailResult = await emailService.sendBookingConfirmation(email, {
          serviceName, date, time, bookingId, amount
        });
        console.log('✅ Email sent successfully:', emailResult);
        return { type: 'email', status: 'sent', data: emailResult };
      } else {
        console.log('⚠️ Email notification skipped - credentials not configured');
        console.log('⚠️ Email provided:', !!email);
        console.log('⚠️ EMAIL_USER configured:', !!process.env.EMAIL_USER);
        return { type: 'email', status: 'skipped', reason: 'credentials not configured' };
      }
    } catch (error) {
      console.error('❌ Email notification failed:', error.message);
      console.error('❌ Full error:', error);
      return { type: 'email', status: 'failed', error: error.message };
    }
  }
}

export default new NotificationService();