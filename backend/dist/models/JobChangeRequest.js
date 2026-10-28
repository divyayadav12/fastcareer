"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobChangeRequestSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const JobChangeRequest = mongoose_1.default.model('JobChangeRequest', jobChangeRequestSchema);
exports.default = JobChangeRequest;
