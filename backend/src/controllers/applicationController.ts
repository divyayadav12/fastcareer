import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application';
import Job from '../models/Job';
import User from '../models/User';
import { sendShortlistedWhatsApp } from '../utils/whatsappService';

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

    // Auto-share if job has target employers or shared HR emails
    const hasTargetEmployers = Boolean(
      (job.targetEmployers && job.targetEmployers.length > 0) ||
      (job.sharedHrEmails && job.sharedHrEmails.length > 0)
    );

    const application = await Application.create({
      job: new mongoose.Types.ObjectId(jobId as string),
      candidate: new mongoose.Types.ObjectId(candidateId as string),
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'applied',
      sharedWithEmployer: hasTargetEmployers ? true : false,
    });

    // Auto-assign candidate to target employers of this job so target HRs see applicant details
    if (job.targetEmployers && job.targetEmployers.length > 0) {
      await User.findByIdAndUpdate(candidateId, {
        $addToSet: { assignedEmployers: { $each: job.targetEmployers } }
      });
    }

    if (job.sharedHrEmails && job.sharedHrEmails.length > 0) {
      const matchingEmployers = await User.find({
        email: { $in: job.sharedHrEmails.map((e: string) => new RegExp(`^${e.trim()}$`, 'i')) }
      }).select('_id');
      if (matchingEmployers.length > 0) {
        const empIds = matchingEmployers.map(e => e._id);
        await User.findByIdAndUpdate(candidateId, {
          $addToSet: { assignedEmployers: { $each: empIds } }
        });
      }
    }

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
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'firstName personalDetails email')
      .populate('job', 'title');
    
    if (application) {
      application.status = status;
      const updatedApplication = await application.save();

      // Trigger WhatsApp Notification for Shortlist/Selection
      if (status === 'shortlisted' || status === 'accepted') {
        const candidate: any = application.candidate;
        const job: any = application.job;
        if (candidate?.personalDetails?.phone) {
          sendShortlistedWhatsApp(
            candidate.personalDetails.phone,
            candidate.firstName || 'Candidate',
            job?.title || 'a role'
          );
        }
      }

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
      // Employer: Check if employer posted specific jobs or was targeted in job creation
      const myJobs = await Job.find({
        $or: [
          { postedBy: user?._id },
          { targetEmployers: user?._id },
          { sharedHrEmails: user?.email }
        ]
      });
      const myJobIds = myJobs.map(j => j._id);

      const assignedCandidates = await User.find({ role: 'candidate', assignedEmployers: user?._id }).select('_id');
      const candidateIds = assignedCandidates.map(c => c._id);

      const orConditions: any[] = [];
      if (myJobIds.length > 0) {
        orConditions.push({ job: { $in: myJobIds }, sharedWithEmployer: true });
      }
      if (candidateIds.length > 0) {
        orConditions.push({ candidate: { $in: candidateIds }, sharedWithEmployer: true });
      }

      if (orConditions.length > 0) {
        query = { $or: orConditions };
      } else {
        query = { _id: null }; // Unselected employer gets zero applications
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

// @desc    Share applications with employer
// @route   PUT /api/applications/share
// @access  Private (Admin)
export const shareApplications = async (req: Request, res: Response) => {
  const { applicationIds } = req.body;
  
  if (!applicationIds || !Array.isArray(applicationIds)) {
    res.status(400).json({ message: 'applicationIds array is required' });
    return;
  }

  try {
    await Application.updateMany(
      { _id: { $in: applicationIds } },
      { $set: { sharedWithEmployer: true } }
    );
    res.json({ message: 'Applications successfully shared with employer' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update candidate application status (by application ID or candidate ID)
// @route   PUT /api/applications/candidate-status
// @access  Private (Employer/Admin)
export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { candidateId, applicationId, status } = req.body;
    const user = (req as any).user;
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    let myJobIds: any[] = [];
    if (user?.role === 'employer') {
      const myJobs = await Job.find({
        $or: [
          { postedBy: user._id },
          { targetEmployers: user._id },
          { sharedHrEmails: user.email }
        ]
      }).select('_id');
      myJobIds = myJobs.map(j => j._id);
    }

    let application = null;

    if (applicationId && mongoose.Types.ObjectId.isValid(applicationId as string)) {
      application = await Application.findById(applicationId);
    }

    if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
      if (myJobIds.length > 0) {
        application = await Application.findOne({ candidate: candidateId, job: { $in: myJobIds } }).sort({ createdAt: -1 });
      }
      if (!application) {
        application = await Application.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
      }
    }

    if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
      let job = await Job.findOne({ $or: [{ postedBy: user?._id }, { targetEmployers: user?._id }] });
      if (!job) {
        job = await Job.findOne({});
      }
      if (job) {
        application = await Application.create({
          job: job._id,
          candidate: candidateId,
          resumeUrl: 'uploads/default_resume.pdf',
          status: status,
          sharedWithEmployer: true
        });
      }
    }

    if (application) {
      if (user?.role === 'employer' && myJobIds.length > 0 && !myJobIds.some(id => id.toString() === application.job.toString())) {
        application.job = myJobIds[0];
      }
      application.status = status;
      await application.save();

      // Trigger WhatsApp Notification for Shortlist/Selection
      if (status === 'shortlisted' || status === 'hired') {
        const candidateObj: any = await User.findById(application.candidate);
        const jobObj: any = await Job.findById(application.job);
        if (candidateObj?.personalDetails?.phone || candidateObj?.phone) {
          const phoneNum = candidateObj.personalDetails?.phone || candidateObj.phone;
          sendShortlistedWhatsApp(
            phoneNum,
            candidateObj.firstName || 'Candidate',
            jobObj?.title || 'CA Candidate Profile'
          );
        }
      }

      res.json({ success: true, message: `Status updated to ${status}`, application });
    } else {
      res.status(404).json({ message: 'Candidate application record not found' });
    }
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ message: 'Server error updating candidate status' });
  }
};

