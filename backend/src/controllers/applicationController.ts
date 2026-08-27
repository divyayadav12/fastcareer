import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application';
import Job from '../models/Job';
import User from '../models/User';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { coverLetter, existingResumeUrl } = req.body;
  
  // The uploaded file path will be in req.file if using multer
  const resumeUrl = req.file ? req.file.path : existingResumeUrl;

  if (!resumeUrl) {
    res.status(400).json({ message: 'Resume is required' });
    return;
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: (req as any).user._id });
    if (existingApplication) {
      res.status(400).json({ message: 'You have already applied for this job' });
      return;
    }

    const application = await Application.create({
      job: new mongoose.Types.ObjectId(jobId as string),
      candidate: new mongoose.Types.ObjectId((req as any).user._id as string),
      resumeUrl,
      coverLetter,
      status: 'applied'
    });

    // If a new resume was uploaded, update the candidate's profile so it shows up in the Candidates list
    if (req.file) {
      await User.findByIdAndUpdate((req as any).user._id, { resumeUrl: req.file.path });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get applications for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'firstName lastName email headline');
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status (Employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  
  try {
    const application = await Application.findById(req.params.id);
    
    if (application) {
      application.status = status;
      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private (Employer)
export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ employer: (req as any).user._id });
    const jobIds = jobs.map(j => j._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'firstName lastName email personalDetails qualifications caPortfolio experience skills')
      .populate('job', 'title company');
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
