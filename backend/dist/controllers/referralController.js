"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferrals = exports.submitReferral = void 0;
const Referral_1 = __importDefault(require("../models/Referral"));
const submitReferral = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { friendName, friendEmail, friendPhone } = req.body;
        let resumeUrl = '';
        if (req.file) {
            resumeUrl = req.file.path.startsWith('http')
                ? req.file.path
                : `/uploads/${req.file.filename}`;
        }
        const referral = new Referral_1.default({
            friendName,
            friendEmail,
            friendPhone,
            resumeUrl,
            referredBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const savedReferral = yield referral.save();
        res.status(201).json(savedReferral);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitReferral = submitReferral;
const getReferrals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referrals = yield Referral_1.default.find().populate('referredBy', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(referrals);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getReferrals = getReferrals;
