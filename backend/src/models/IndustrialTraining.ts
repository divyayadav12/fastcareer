import mongoose, { Document, Schema } from 'mongoose';

export interface IIndustrialTraining extends Document {
  name: string;
  email: string;
  phone: string;
  currentLocation: string;
  currentState: string;
  permanentLocation: string;
  permanentState: string;
  dob: string;
  gender: string;
  caInterBatch: string;
  bothGroups1stAttempt: string; // 'Yes' | 'No'
  group1: string; // e.g. '1st Attempt', '2nd Attempt'
  group2: string; // e.g. '1st Attempt', '2nd Attempt'
  group1Batch?: string;
  group2Batch?: string;
  caInterRank: string; // e.g. 'No Rank' or 'AIR 15'
  articleshipFirmName: string;
  articleshipStartMonthYear: string;
  big6Articleship?: string; // 'Yes' | 'No'
  preferredCities?: string[];
  preferredSectors?: string[];
  remarks?: string;
  resumeUrl?: string;
  isVerified: boolean;
  verificationMethod?: string;
  verificationCode?: string;
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Selected' | 'Rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrialTrainingSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    currentLocation: { type: String, required: true, trim: true },
    currentState: { type: String, required: true, trim: true },
    permanentLocation: { type: String, required: true, trim: true },
    permanentState: { type: String, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    caInterBatch: { type: String, required: true, trim: true },
    bothGroups1stAttempt: { type: String, required: true, default: 'No' },
    group1: { type: String, required: true, trim: true },
    group2: { type: String, required: true, trim: true },
    group1Batch: { type: String, trim: true },
    group2Batch: { type: String, trim: true },
    caInterRank: { type: String, default: 'No Rank', trim: true },
    articleshipFirmName: { type: String, required: true, trim: true },
    articleshipStartMonthYear: { type: String, required: true, trim: true },
    big6Articleship: { type: String, default: '', trim: true },
    preferredCities: { type: [String], default: [] },
    preferredSectors: { type: [String], default: [] },
    remarks: { type: String, default: '', trim: true },
    resumeUrl: { type: String, default: '', trim: true },
    isVerified: { type: Boolean, default: true },
    verificationMethod: { type: String, default: 'OTP & ICAI Declaration' },
    verificationCode: { type: String },
    status: { 
      type: String, 
      enum: ['Applied', 'Reviewing', 'Shortlisted', 'Selected', 'Rejected'], 
      default: 'Applied' 
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IIndustrialTraining>('IndustrialTraining', IndustrialTrainingSchema);
