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
  // Step 1: Personal Details
  personalDetails?: {
    alternatePhone?: string;
    currentAddress?: string;
    currentState?: string;
    currentCity?: string;
    permanentAddressSameAsCurrent?: boolean;
    permanentAddress?: string;
    permanentState?: string;
    permanentCity?: string;
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other';
    maritalStatus?: string;
    preferredCampusCity?: string;
  };

  // Step 2: CA Portfolio
  caPortfolio?: {
    isFresherCA?: boolean;
    caInter?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group1Month?: string;
      group1Year?: string;
      group2Attempts?: string;
      group2Month?: string;
      group2Year?: string;
      ranker?: string;
      completionSessionMonth?: string;
      completionSessionYear?: string;
      percentage?: string;
    };
    caFinal?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group1Month?: string;
      group1Year?: string;
      group2Attempts?: string;
      group2Month?: string;
      group2Year?: string;
      ranker?: string;
      completionSessionMonth?: string;
      completionSessionYear?: string;
      percentage?: string;
    };
    articleships?: {
      firmType?: string;
      firmName?: string;
      city?: string;
      noOfPartners?: string;
      noOfMonths?: string;
    }[];
    articleshipCompletionDate?: string;
    gmcsCompleted?: string;
    big4Articleship?: string;
    industrialTrainee?: string;
    listedCompanyWork?: string;
    natureOfWork?: string;
  };

  // Step 3: Qualifications
  qualifications?: {
    graduation?: {
      completed?: 'Yes' | 'No/Pursuing' | 'No';
      yearOfCompletion?: string;
      percentage?: string;
      college?: string;
      type?: 'REGULAR' | 'CORRESPONDENCE';
    };
    class12?: {
      percentage?: string;
      year?: string;
      board?: string;
    };
    class10?: {
      percentage?: string;
      year?: string;
      board?: string;
    };
  };
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
    
    // --- Candidate specific fields ---
    headline: { type: String },
    resumeUrl: { type: String },
    skills: [{ type: String }],
    experience: { type: Number },
    
    // Step 1: Personal Details
    personalDetails: {
      alternatePhone: { type: String },
      currentAddress: { type: String },
      currentState: { type: String },
      currentCity: { type: String },
      permanentAddressSameAsCurrent: { type: Boolean, default: false },
      permanentAddress: { type: String },
      permanentState: { type: String },
      permanentCity: { type: String },
      dateOfBirth: { type: String }, // e.g., 'YYYY-MM-DD'
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      maritalStatus: { type: String },
      preferredCampusCity: { type: String },
    },

    // Step 2: CA Portfolio
    caPortfolio: {
      isFresherCA: { type: Boolean, default: false },
      caInter: {
        bothGroups1stAttempt: { type: Boolean, default: false },
        group1Attempts: { type: String },
        group1Year: { type: String },
        group2Attempts: { type: String },
        group2Year: { type: String },
        ranker: { type: String },
        completionSessionMonth: { type: String },
        completionSessionYear: { type: String },
        percentage: { type: String },
      },
      caFinal: {
        bothGroups1stAttempt: { type: Boolean, default: false },
        group1Attempts: { type: String },
        group1Year: { type: String },
        group2Attempts: { type: String },
        group2Year: { type: String },
        ranker: { type: String },
        completionSessionMonth: { type: String },
        completionSessionYear: { type: String },
        percentage: { type: String },
      },
      articleships: [{
        firmType: { type: String }, // e.g., Medium, Big4
        firmName: { type: String },
        city: { type: String },
        noOfPartners: { type: String },
        noOfMonths: { type: String },
      }],
      articleshipCompletionDate: { type: String }, // MMM YYYY
      gmcsCompleted: { type: String },
      big4Articleship: { type: String },
      industrialTrainee: { type: String },
      listedCompanyWork: { type: String },
      natureOfWork: { type: String }, // Min 100 words text area
    },

    // Step 3: Qualifications
    qualifications: {
      graduation: {
        completed: { type: String, enum: ['Yes', 'No/Pursuing', 'No'] },
        yearOfCompletion: { type: String },
        percentage: { type: String },
        college: { type: String },
        type: { type: String, enum: ['REGULAR', 'CORRESPONDENCE'] },
      },
      class12: {
        percentage: { type: String },
        year: { type: String },
        board: { type: String },
      },
      class10: {
        percentage: { type: String },
        year: { type: String },
        board: { type: String },
      }
    },
    
    // --- Employer specific fields ---
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
