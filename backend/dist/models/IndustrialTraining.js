"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const IndustrialTrainingSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.model('IndustrialTraining', IndustrialTrainingSchema);
