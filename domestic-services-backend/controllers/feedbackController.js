import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  try {
    const { type, rating, comment, categories, bookingId, anonymous } = req.body;
    
    const feedback = await Feedback.create({
      userId: req.user.id,
      bookingId,
      type,
      rating,
      comment,
      categories,
      anonymous
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { rating: { $exists: true } } },
      {
        $group: {
          _id: '$type',
          averageRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 },
          ratings: { $push: '$rating' }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback stats',
      error: error.message
    });
  }
};