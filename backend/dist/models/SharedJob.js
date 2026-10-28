"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sharedJobSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const SharedJob = mongoose_1.default.model('SharedJob', sharedJobSchema);
exports.default = SharedJob;
