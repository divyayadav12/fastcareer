import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'candidate' | 'employer' | 'admin';
  phone?: string;
  // Candidate specific
  headline?: string;
  resumeUrl?: string;
  skills?: string[];
  experience?: number;
  // Employer specific
  companyName?: string;
  companyWebsite?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'employer', 'admin'], default: 'candidate' },
    phone: { type: String },
    
    // Candidate specific fields
    headline: { type: String },
    resumeUrl: { type: String },
    skills: [{ type: String }],
    experience: { type: Number },
    
    // Employer specific fields
    companyName: { type: String },
    companyWebsite: { type: String },
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
