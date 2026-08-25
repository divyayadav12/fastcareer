import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, Internship
  category: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isHot: boolean;
  postedBy?: mongoose.Types.ObjectId; // Reference to Employer model later
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    salaryRange: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    isHot: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
