import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { rating, message } = req.body;
    
    const feedback = new Feedback({
      rating,
      message,
      submittedBy: (req as any).user?._id
    });

    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
