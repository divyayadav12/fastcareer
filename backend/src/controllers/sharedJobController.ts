import { Request, Response } from 'express';
import SharedJob from '../models/SharedJob';

// @desc    Share a new job opportunity
// @route   POST /api/shared-jobs
// @access  Public (or Private if we want to enforce login)
export const createSharedJob = async (req: Request, res: Response) => {
  try {
    const {
      industry,
      companyName,
      jobDescription,
      location,
      region,
      noOfPost,
      concernedPerson,
      mobileNo,
      emailId
    } = req.body;

    const sharedJob = await SharedJob.create({
      industry,
      companyName,
      jobDescription,
      location,
      region,
      noOfPost,
      concernedPerson,
      mobileNo,
      emailId,
      // @ts-ignore
      submittedBy: req.user?._id || null
    });

    res.status(201).json(sharedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating shared job' });
  }
};

// @desc    Get all shared jobs
// @route   GET /api/shared-jobs
// @access  Private/Admin
export const getSharedJobs = async (req: Request, res: Response) => {
  try {
    const sharedJobs = await SharedJob.find({}).populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(sharedJobs);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};
