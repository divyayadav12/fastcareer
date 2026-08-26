import mongoose from 'mongoose';

const sharedJobSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
  },
  location: {
    type: String,
  },
  region: {
    type: String,
  },
  noOfPost: {
    type: Number,
    required: true,
  },
  concernedPerson: {
    type: String,
  },
  mobileNo: {
    type: String,
  },
  emailId: {
    type: String,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Rejected'],
    default: 'Pending',
  }
}, {
  timestamps: true
});

const SharedJob = mongoose.model('SharedJob', sharedJobSchema);

export default SharedJob;
