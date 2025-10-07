import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  type: {
    type: String,
    enum: ['service_rating', 'app_feedback', 'booking_experience', 'worker_rating', 'suggestion'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  categories: [{
    name: String,
    rating: Number
  }],
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Feedback', feedbackSchema);