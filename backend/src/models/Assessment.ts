import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAnswer {
  questionId: number;
  questionText: string;
  type: 'mcq' | 'typing' | 'audio' | 'video';
  candidateAnswer: string; // selected option, typed text, or audio/video file URL
  audioDurationSeconds?: number;
  videoDurationSeconds?: number;
  isCorrect?: boolean; // for auto-graded MCQs
}

export interface IAssessment extends Document {
  candidate: mongoose.Types.ObjectId;
  answers: IAssessmentAnswer[];
  mcqScore: number;
  totalMcqQuestions: number;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected';
  adminNotes?: string;
  adminRating?: number; // 1 to 5
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    answers: [
      {
        questionId: { type: Number, required: true },
        questionText: { type: String, required: true },
        type: { type: String, enum: ['mcq', 'typing', 'audio', 'video'], required: true },
        candidateAnswer: { type: String, required: true },
        audioDurationSeconds: { type: Number },
        videoDurationSeconds: { type: Number },
        isCorrect: { type: Boolean }
      }
    ],
    mcqScore: {
      type: Number,
      default: 0
    },
    totalMcqQuestions: {
      type: Number,
      default: 2
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisted', 'rejected'],
      default: 'submitted'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    adminRating: {
      type: Number,
      min: 1,
      max: 5
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
