import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import notificationService from '../utils/notifications.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      serviceId,
      date,
      time,
      location,
      mobile,
      email,
      fullName,
      specialInstructions,
      emergencyContactName,
      emergencyContactMobile,
      emergencyContactRelationship
    } = req.body;

    if (!amount || !serviceId || !date || !time || !location || !mobile) {
      return res.status(400).json({
        message: 'amount, serviceId, date, time, location, mobile are required'
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa (1 INR = 100 paisa)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        serviceId,
        date,
        time,
        location: JSON.stringify(location),
        mobile,
        email,
        fullName,
        specialInstructions,
        emergencyContactName,
        emergencyContactMobile,
        emergencyContactRelationship
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Verify payment and create booking
export const verifyPayment = async (req, res) => {
  try {
    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Request body:', req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing required payment verification fields');
      return res.status(400).json({ message: 'All payment verification fields are required' });
    }

    // Check if environment variables are set
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Payment configuration error' });
    }

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    console.log('Signature verification:', {
      provided: razorpay_signature,
      expected: expectedSign,
      match: razorpay_signature === expectedSign
    });

    if (razorpay_signature !== expectedSign) {
      console.error('Payment signature verification failed');
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Get order details
    console.log('Fetching order details for:', razorpay_order_id);
    const order = await razorpay.orders.fetch(razorpay_order_id);
    console.log('Order details:', order);
    console.log('Order notes:', order.notes);

    // Validate that all required fields are present
    const requiredFields = ['userId', 'serviceId', 'date', 'time', 'location', 'mobile'];
    for (const field of requiredFields) {
      if (!order.notes[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const {
      userId,
      serviceId,
      date,
      time,
      location,
      mobile,
      email,
      fullName,
      specialInstructions,
      emergencyContactName,
      emergencyContactMobile,
      emergencyContactRelationship
    } = order.notes;
    const amount = order.amount / 100; // Convert back from paisa

    console.log('Extracted booking data:', {
      userId,
      serviceId,
      date,
      time,
      location,
      mobile,
      email,
      fullName,
      amount
    });

    // Safely parse location
    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
      console.log('Successfully parsed location:', parsedLocation);
    } catch (parseError) {
      console.error('Error parsing location:', parseError);
      parsedLocation = location; // Fallback to string if parsing fails
    }

    // Create booking
    const bookingData = {
      userId,
      serviceId,
      date,
      time,
      location: parsedLocation,
      mobile,
      email,
      fullName,
      specialInstructions,
      emergencyContact: {
        name: emergencyContactName,
        mobile: emergencyContactMobile,
        relationship: emergencyContactRelationship
      },
      amount,
      paymentStatus: 'paid',
      paymentIntentId: razorpay_payment_id
    };

    console.log('Creating booking with data:', bookingData);

    // Check if Booking model is available
    if (!Booking) {
      console.error('Booking model is not available');
      return res.status(500).json({ message: 'Database model not available' });
    }

    const booking = await Booking.create(bookingData);
    console.log('Booking created successfully:', booking._id);

    // Fetch service details for notifications
    let serviceName = 'Service';
    try {
      const service = await Service.findById(serviceId);
      if (service) {
        serviceName = service.name;
      }
    } catch (serviceError) {
      console.error('Error fetching service details:', serviceError.message);
    }

    // Send notifications
    console.log('\n=== SENDING EMAIL NOTIFICATION ===');
    console.log('Email:', email);
    console.log('Service:', serviceName);
    
    try {
      const notificationResult = await notificationService.sendBookingConfirmation({
        email,
        serviceName,
        date,
        time,
        bookingId: booking._id,
        amount,
        paymentId: razorpay_payment_id
      });
      console.log('\u2705 Email notification completed');
      console.log('Email result:', notificationResult);
    } catch (notificationError) {
      console.error('\u274c Email notification error:', notificationError.message);
    }
    console.log('==============================\n');

    console.log('=== PAYMENT VERIFICATION SUCCESS ===');

    res.status(201).json({
      message: 'Payment verified and booking created successfully',
      booking
    });
  } catch (error) {
    console.error('=== PAYMENT VERIFICATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Booking data validation failed',
        error: error.message
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid data format',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      status: payment.status,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      message: 'Error getting payment status',
      error: error.message
    });
  }
};
