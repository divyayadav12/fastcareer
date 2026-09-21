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

  try {
    if (!jobId || jobId === 'undefined' || !mongoose.Types.ObjectId.isValid(jobId as string)) {
      res.status(400).json({ message: 'Invalid Job ID or job not found' });
      return;
    }

    const candidateId = (req as any).user?._id;
    const candidateUser = await User.findById(candidateId);

    let resumeUrl = req.file ? req.file.path : (existingResumeUrl || candidateUser?.resumeUrl);
    if (!resumeUrl) {
      resumeUrl = 'uploads/default_resume.pdf';
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApplication) {
      res.status(400).json({ message: 'You have already applied for this job' });
      return;
    }

    const application = await Application.create({
      job: new mongoose.Types.ObjectId(jobId as string),
      candidate: new mongoose.Types.ObjectId(candidateId as string),
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'applied'
    });

    // If a new resume was uploaded, update the candidate's profile
    if (req.file) {
      await User.findByIdAndUpdate(candidateId, { resumeUrl: req.file.path });
    }

    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
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
    const jobs = await Job.find({ postedBy: (req as any).user._id });
    const jobIds = jobs.map(j => j._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'firstName lastName email personalDetails qualifications caPortfolio experience skills')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company location type salaryRange')
      .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    let candidateId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!candidateId || candidateId === 'undefined' || candidateId === 'null' || !mongoose.Types.ObjectId.isValid(candidateId)) {
      candidateId = (req as any).user?._id?.toString() || (req as any).user?._id;
    }
    if (!candidateId) {
      res.status(400).json({ message: 'Candidate ID required' });
      return;
    }
    const applications = await Application.find({ candidate: candidateId })
      .populate('job', 'title company location salary status salaryRange type')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error in getCandidateApplications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
