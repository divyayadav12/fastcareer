import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  companyStatus?: 'Pending Review' | 'CV View' | 'CV Rejected' | 'Shortlisted for Round 1' | 'Shortlisted for Round 2' | 'Shortlisted for Round 3' | 'Selected' | 'Rejected';
  sharedWithEmployer: boolean;
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
    companyStatus: {
      type: String,
      enum: [
        'Pending Review',
        'CV View',
        'CV Rejected',
        'Shortlisted for Round 1',
        'Shortlisted for Round 2',
        'Shortlisted for Round 3',
        'Selected',
        'Rejected'
      ],
      default: 'Pending Review'
    },
    sharedWithEmployer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
