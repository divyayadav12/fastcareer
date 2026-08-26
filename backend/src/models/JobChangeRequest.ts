import mongoose from 'mongoose';

const jobChangeRequestSchema = new mongoose.Schema({
  currentCompany: {
    type: String,
    required: true
  },
  currentDesignation: {
    type: String,
    required: true
  },
  currentCTC: {
    type: String,
    required: true
  },
  expectedCTC: {
    type: String,
    required: true
  },
  noticePeriod: {
    type: String,
    required: true
  },
  reason: {
    type: String
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Closed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const JobChangeRequest = mongoose.model('JobChangeRequest', jobChangeRequestSchema);

export default JobChangeRequest;
