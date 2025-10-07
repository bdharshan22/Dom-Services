import express from 'express';
import { submitFeedback, getFeedbackStats } from '../controllers/feedbackController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, submitFeedback);
router.get('/stats', auth, getFeedbackStats);

export default router;