import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  friendName: {
    type: String,
    required: true
  },
  friendEmail: {
    type: String,
    required: true
  },
  friendPhone: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Interviewing', 'Placed', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;
