import { Request, Response } from 'express';
import Job from '../models/Job';
import User from '../models/User';
import { calculateMatchScore } from '../utils/matchAlgorithm';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = new Job({
      ...req.body,
      // postedBy: req.user._id // To be implemented with auth
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: 'Invalid job data' });
  }
};

// @desc    Calculate match score for a job and candidate
// @route   GET /api/jobs/:id/match/:userId
// @access  Private
export const getJobMatchScore = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.params.userId);

    if (!job || !user) {
      res.status(404).json({ message: 'Job or User not found' });
      return;
    }

    const matchScore = calculateMatchScore(user, job);
    
    res.json({ matchScore });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
