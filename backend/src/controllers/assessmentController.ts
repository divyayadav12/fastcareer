import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Assessment from '../models/Assessment';
import User from '../models/User';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Answer key for auto-grading MCQs
const MCQ_ANSWER_KEYS: Record<number, string> = {
  1: 'When performance obligation is satisfied and control is transferred to the customer',
  2: '20th of the succeeding month'
};

const getBaseUrl = (req: Request) => {
  const host = req.get('host') || 'fastcareer.onrender.com';
  const protocol = req.protocol === 'http' && !host.includes('localhost') ? 'https' : req.protocol;
  return `${protocol}://${host}`;
};

const normalizeAnswers = (answers: any[], baseUrl: string) => {
  if (!Array.isArray(answers)) return answers;
  return answers.map(ans => {
    const a = ans && typeof ans.toObject === 'function' ? ans.toObject() : { ...ans };
    if (a.candidateAnswer && typeof a.candidateAnswer === 'string' && a.candidateAnswer.startsWith('/uploads/')) {
      a.candidateAnswer = `${baseUrl}${a.candidateAnswer}`;
    }
    return a;
  });
};

// @desc    Upload recorded audio file for assessment
// @route   POST /api/assessments/upload-audio
// @access  Private (Candidate)
export const uploadAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No audio file provided' });
      return;
    }

    const baseUrl = getBaseUrl(req);
    const localUrl = `${baseUrl}/uploads/${req.file.filename}`;
    let finalUrl = localUrl;

    if (isCloudinaryConfigured) {
      try {
        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'fastweb_audio_assessments',
          resource_type: 'auto',
          public_id: `audio-${Date.now()}-${Math.round(Math.random() * 1e4)}`
        });
        if (cloudResult && cloudResult.secure_url) {
          finalUrl = cloudResult.secure_url;
        }
      } catch (cloudErr) {
        console.warn('Cloudinary audio upload fallback to local disk:', cloudErr);
      }
    }

    res.json({
      message: 'Audio uploaded successfully',
      audioUrl: finalUrl,
      mediaUrl: finalUrl
    });
  } catch (error) {
    console.error('Error uploading assessment audio:', error);
    res.status(500).json({ message: 'Server error during audio upload', error });
  }
};

// @desc    Upload recorded video file for assessment
// @route   POST /api/assessments/upload-video
// @access  Private (Candidate)
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No video file provided' });
      return;
    }

    const baseUrl = getBaseUrl(req);
    const localUrl = `${baseUrl}/uploads/${req.file.filename}`;
    let finalUrl = localUrl;

    if (isCloudinaryConfigured) {
      try {
        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'fastweb_video_assessments',
          resource_type: 'auto',
          public_id: `video-${Date.now()}-${Math.round(Math.random() * 1e4)}`
        });
        if (cloudResult && cloudResult.secure_url) {
          finalUrl = cloudResult.secure_url;
        }
      } catch (cloudErr) {
        console.warn('Cloudinary video upload fallback to local disk:', cloudErr);
      }
    }

    res.json({
      message: 'Video uploaded successfully',
      videoUrl: finalUrl,
      mediaUrl: finalUrl
    });
  } catch (error) {
    console.error('Error uploading assessment video:', error);
    res.status(500).json({ message: 'Server error during video upload', error });
  }
};

// @desc    Submit 6-question fast selection assessment
// @route   POST /api/assessments/submit
// @access  Private (Candidate)
export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const candidateId = (req as any).user?._id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== 6) {
      res.status(400).json({ 
        message: 'All 6 assessment questions must be answered before submission (2 MCQs, 2 Written, 2 Video/Voice Recordings).' 
      });
      return;
    }

    let mcqScore = 0;
    const processedAnswers = answers.map((ans: any) => {
      let isCorrect: boolean | undefined = undefined;
      if (ans.type === 'mcq') {
        const expected = MCQ_ANSWER_KEYS[ans.questionId];
        if (expected && ans.candidateAnswer && ans.candidateAnswer.trim().toLowerCase() === expected.trim().toLowerCase()) {
          isCorrect = true;
          mcqScore += 1;
        } else {
          isCorrect = false;
        }
      }

      return {
        questionId: ans.questionId,
        questionText: ans.questionText || `Question ${ans.questionId}`,
        type: ans.type || 'video',
        candidateAnswer: ans.candidateAnswer || '',
        audioDurationSeconds: ans.audioDurationSeconds || ans.videoDurationSeconds || 0,
        videoDurationSeconds: ans.videoDurationSeconds || ans.audioDurationSeconds || 0,
        isCorrect
      };
    });

    // Check if candidate already has an assessment
    let assessment = await Assessment.findOne({ candidate: candidateId });

    if (assessment) {
      assessment.answers = processedAnswers;
      assessment.mcqScore = mcqScore;
      assessment.totalMcqQuestions = 2;
      assessment.status = 'submitted';
      await assessment.save();
    } else {
      assessment = await Assessment.create({
        candidate: candidateId,
        answers: processedAnswers,
        mcqScore,
        totalMcqQuestions: 2,
        status: 'submitted'
      });
    }

    res.status(201).json({
      message: 'Assessment submitted successfully! Fast-track evaluation initiated.',
      assessment
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Server error during assessment submission', error });
  }
};

// @desc    Get candidate's own assessment status and results
// @route   GET /api/assessments/my
// @access  Private (Candidate)
export const getMyAssessment = async (req: Request, res: Response) => {
  try {
    const candidateId = (req as any).user?._id;
    const assessment = await Assessment.findOne({ candidate: candidateId });
    if (!assessment) {
      res.json(null);
      return;
    }
    const baseUrl = getBaseUrl(req);
    const a = assessment.toObject();
    a.answers = normalizeAnswers(a.answers, baseUrl);
    res.json(a);
  } catch (error) {
    console.error('Error fetching candidate assessment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get all candidate assessment results for Admin review
// @route   GET /api/assessments
// @access  Private (Admin / Employer)
export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    const assessments = await Assessment.find({})
      .populate('candidate', 'firstName lastName email phone qualifications caPortfolio experience personalDetails resumeUrl')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Filter out submissions where candidate account was deleted
    const validAssessments = assessments.filter(a => a.candidate);
    const baseUrl = getBaseUrl(req);
    const formattedAssessments = validAssessments.map(doc => {
      const a = doc.toObject();
      a.answers = normalizeAnswers(a.answers, baseUrl);
      return a;
    });

    res.json(formattedAssessments);
  } catch (error) {
    console.error('Error fetching assessments for admin:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Admin review and evaluate candidate test submission
// @route   PUT /api/assessments/:id/review
// @access  Private (Admin / Employer)
export const reviewAssessment = async (req: Request, res: Response) => {
  try {
    const { status, adminNotes, adminRating } = req.body;
    const reviewerId = (req as any).user?._id;

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }

    if (status) assessment.status = status;
    if (adminNotes !== undefined) assessment.adminNotes = adminNotes;
    if (adminRating !== undefined) assessment.adminRating = adminRating;

    assessment.reviewedBy = reviewerId;
    assessment.reviewedAt = new Date();

    const updated = await assessment.save();
    res.json({
      message: 'Assessment review updated successfully',
      assessment: updated
    });
  } catch (error) {
    console.error('Error reviewing assessment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
