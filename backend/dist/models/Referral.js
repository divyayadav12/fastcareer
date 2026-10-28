"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const referralSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Referral = mongoose_1.default.model('Referral', referralSchema);
exports.default = Referral;
