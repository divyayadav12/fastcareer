import { Request, Response } from 'express';
import Job from '../models/Job';
import User from '../models/User';
import Application from '../models/Application';
import { calculateMatchScore } from '../utils/matchAlgorithm';
import { isValidCity } from '../utils/locationHelper';

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

// @desc    Get logged in employer's jobs (or all jobs for admin)
// @route   GET /api/jobs/employer
// @access  Private/Employer/Admin
export const getEmployerJobs = async (req: any, res: Response) => {
  try {
    const user = req.user;
    let query: any = {};
    
    if (user?.role === 'admin') {
      query = {};
    } else {
      query = {
        $or: [
          { postedBy: user._id },
          { targetEmployers: user._id },
          { sharedHrEmails: user.email }
        ]
      };
    }

    const jobs = await Job.find(query)
      .populate('targetEmployers', 'companyName firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('targetEmployers', 'companyName firstName lastName email');
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
export const createJob = async (req: any, res: Response) => {
  try {
    const { location, targetEmployers, sharedHrEmails } = req.body;
    
    if (location && !isValidCity(location)) {
      res.status(400).json({ message: 'Invalid location. Please select a valid city from the list.' });
      return;
    }

    const job = new Job({
      ...req.body,
      targetEmployers: targetEmployers || [],
      sharedHrEmails: sharedHrEmails || [],
      postedBy: req.user._id 
    });

    const createdJob = await job.save();
    const populatedJob = await Job.findById(createdJob._id).populate('targetEmployers', 'companyName firstName lastName email');
    res.status(201).json(populatedJob || createdJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: 'Invalid job data' });
  }
};

// @desc    Delete a job and its applications
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
export const deleteJob = async (req: any, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job and associated applications removed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cleanup junk / test jobs (e.g. fdg, new, nj) and orphan applications
// @route   POST /api/jobs/cleanup-test-jobs
// @access  Private/Employer/Admin
export const cleanupTestJobs = async (req: Request, res: Response) => {
  try {
    const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
    const junkJobs = await Job.find({
      $or: [
        { title: { $regex: junkRegex } },
        { company: { $regex: junkRegex } }
      ]
    });
    
    const junkIds = junkJobs.map(j => j._id);
    if (junkIds.length > 0) {
      await Application.deleteMany({ job: { $in: junkIds } });
      await Job.deleteMany({ _id: { $in: junkIds } });
    }

    // Clean orphan applications where candidate or job is missing
    const allApps = await Application.find({});
    let removedOrphans = 0;
    for (const app of allApps) {
      const candidateExists = await User.exists({ _id: app.candidate });
      const jobExists = await Job.exists({ _id: app.job });
      if (!candidateExists || !jobExists) {
        await Application.findByIdAndDelete(app._id);
        removedOrphans++;
      }
    }

    res.json({
      message: 'Cleanup successful',
      deletedJobsCount: junkIds.length,
      deletedOrphanApplicationsCount: removedOrphans
    });
  } catch (error) {
    console.error('Error cleaning up test jobs:', error);
    res.status(500).json({ message: 'Server error during cleanup', error });
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

