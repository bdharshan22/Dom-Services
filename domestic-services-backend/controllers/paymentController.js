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
    console.log('Payment verification started');

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

    // Signature verification

    if (razorpay_signature !== expectedSign) {
      console.error('Payment signature verification failed');
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Get order details
    const order = await razorpay.orders.fetch(razorpay_order_id);

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

    // Extracted booking data

    // Parse location
    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
    } catch (parseError) {
      parsedLocation = location;
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

    // Creating booking

    // Check if Booking model is available
    if (!Booking) {
      console.error('Booking model is not available');
      return res.status(500).json({ message: 'Database model not available' });
    }

    const booking = await Booking.create(bookingData);

    // Send response immediately
    res.status(201).json({
      message: 'Payment verified and booking created successfully',
      booking
    });

    // Send email asynchronously
    process.nextTick(async () => {
      try {
        const service = await Service.findById(serviceId);
        await notificationService.sendBookingConfirmation({
          email,
          serviceName: service?.name || 'Service',
          date,
          time,
          bookingId: booking._id,
          amount,
          paymentId: razorpay_payment_id
        });
      } catch (error) {
        console.error('Email failed:', error.message);
      }
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
