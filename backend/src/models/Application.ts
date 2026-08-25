import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: { 
      type: String, 
      enum: ['applied', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'], 
      default: 'applied' 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
