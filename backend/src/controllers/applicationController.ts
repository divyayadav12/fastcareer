import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application';
import Job from '../models/Job';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;
  
  // The uploaded file path will be in req.file if using multer
  const resumeUrl = req.file ? req.file.path : null;

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
    // const existingApplication = await Application.findOne({ job: jobId, candidate: req.user._id });
    // if (existingApplication) { ... }

    const application = await Application.create({
      job: new mongoose.Types.ObjectId(jobId as string),
      candidate: new mongoose.Types.ObjectId('66a1a1b2c3d4e5f600000000'), // Stub user ID until auth middleware is ready
      resumeUrl,
      coverLetter,
      status: 'applied'
    });

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
