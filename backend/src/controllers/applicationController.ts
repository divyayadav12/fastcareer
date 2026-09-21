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

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private (Employer or Admin)
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get all applications for employer's jobs or admin overview
// @route   GET /api/applications/employer
// @access  Private (Employer or Admin)
export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    // 1. Automatically cleanup any junk test jobs (fdg, new, nj, test)
    try {
      const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
      const junkJobs = await Job.find({
        $or: [
          { title: { $regex: junkRegex } },
          { company: { $regex: junkRegex } }
        ]
      });
      if (junkJobs.length > 0) {
        const junkIds = junkJobs.map(j => j._id);
        await Application.deleteMany({ job: { $in: junkIds } });
        await Job.deleteMany({ _id: { $in: junkIds } });
      }
    } catch (cleanErr) {
      console.error('Error auto-cleaning junk jobs:', cleanErr);
    }

    const user = (req as any).user;
    let query: any = {};

    if (user?.role === 'admin') {
      // Admin has full platform visibility
      query = {};
    } else {
      // Employer: Check if employer posted specific jobs
      const myJobs = await Job.find({ postedBy: user?._id });
      const myJobIds = myJobs.map(j => j._id);

      if (myJobIds.length > 0) {
        // Also include platform unassigned jobs so employer doesn't miss applicants
        const platformJobs = await Job.find({
          $or: [
            { postedBy: { $exists: false } },
            { postedBy: null }
          ]
        });
        const allAccessibleJobIds = [...myJobIds, ...platformJobs.map(j => j._id)];
        query = { job: { $in: allAccessibleJobIds } };
      } else {
        // If employer hasn't created separate jobs yet, show all candidate applications
        query = {};
      }
    }
    
    const applications = await Application.find(query)
      .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails qualifications caPortfolio experience skills')
      .populate('job', 'title company location type salaryRange salary')
      .sort({ createdAt: -1 });

    // Filter out orphan applications and delete them in the background
    const validApplications: any[] = [];
    for (const app of applications) {
      if (!app.candidate || !app.job) {
        Application.findByIdAndDelete(app._id).catch(() => {});
      } else {
        validApplications.push(app);
      }
    }
      
    res.json(validApplications);
  } catch (error) {
    console.error('Error fetching employer applications:', error);
    res.status(500).json({ message: 'Server error', error });
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
