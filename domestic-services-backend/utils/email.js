import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      // Verify transporter configuration
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      
      const mailOptions = {
        from: `"Domestic Services" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        replyTo: process.env.EMAIL_USER
      };

      console.log('📧 Sending email to:', to);
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent with messageId:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Email sending error:', error.message);
      console.error('❌ Email config check:', {
        user: !!process.env.EMAIL_USER,
        pass: !!process.env.EMAIL_PASS,
        to
      });
      throw error;
    }
  }

  async sendBookingConfirmation(email, bookingDetails) {
    const { serviceName, date, time, bookingId, amount, paymentId } = bookingDetails;
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email not configured, skipping email send');
      return { status: 'skipped', reason: 'credentials not configured' };
    }
    
    try {
      const subject = 'Booking Confirmed & Payment Successful - Domestic Services';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #4f46e5; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏠 Domestic Services</h1>
            <p style="margin: 10px 0 0 0;">Booking & Payment Confirmation</p>
          </div>
          
          <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">✅ SUCCESS!</h2>
            <p style="margin: 10px 0 0 0;">Your booking is confirmed and payment is complete</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #dcfce7; border: 2px solid #16a34a; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3 style="color: #15803d; margin: 0 0 15px 0;">💳 PAYMENT CONFIRMED</h3>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Amount Paid:</strong> <span style="color: #15803d; font-size: 20px; font-weight: bold;">₹${amount}</span></p>
              <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: #15803d; font-weight: bold;">SUCCESSFUL</span></p>
              ${paymentId ? `<p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${paymentId}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: #dbeafe; border: 2px solid #3b82f6; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3 style="color: #1d4ed8; margin: 0 0 15px 0;">📋 BOOKING DETAILS</h3>
              <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">⏰ What's Next?</h3>
              <p style="margin: 5px 0; color: #78350f;">Our team will contact you 30 minutes before the scheduled time.</p>
              <p style="margin: 5px 0; color: #78350f;">Please keep your booking reference handy: <strong>${bookingId}</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <h3 style="color: #1f2937; margin: 0;">Thank You! 🙏</h3>
              <p style="color: #6b7280; margin: 10px 0 0 0;">We appreciate your business and look forward to serving you.</p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Contact: dharshancgm2005@gmail.com</p>
          </div>
        </div>
      `;
      
      const result = await this.sendEmail(email, subject, html);
      console.log('✅ Email sent successfully');
      return { status: 'sent', messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      // Log email details for debugging
      console.log('EMAIL DETAILS:', {
        to: email,
        service: serviceName,
        date, time, bookingId, amount, paymentId
      });
      return { status: 'failed', error: error.message };
    }
  }

  async sendPaymentConfirmation(email, paymentDetails) {
    const { serviceName, amount, paymentId, bookingId } = paymentDetails;

    const subject = 'Payment Confirmation - Domestic Services';
    const html = `
      <h2>Payment Successful!</h2>
      <p>Your payment has been processed successfully.</p>
      <div style="background: #e8f5e8; padding: 15px; border-radius: 5px;">
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      </div>
      <p>Your service is confirmed and scheduled.</p>
      <p>Thank you for your payment!</p>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendRegistrationConfirmation(email, userDetails) {
    const { name } = userDetails;

    const subject = 'Welcome to Domestic Services - Account Created Successfully!';
    const html = `
      <h2>Welcome to Domestic Services!</h2>
      <p>Dear ${name},</p>
      <p>Your account has been created successfully.</p>
      <div style="background: #f0f8ff; padding: 15px; border-radius: 5px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
      <p>You can now log in to your account and start booking services.</p>
      <p>Thank you for joining us!</p>
      <p>Best regards,<br>Domestic Services Team</p>
    `;

    return this.sendEmail(email, subject, html);
  }
}

export default new EmailService();