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
exports.getFeedbacks = exports.submitFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rating, message } = req.body;
        const feedback = new Feedback_1.default({
            rating,
            message,
            submittedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const savedFeedback = yield feedback.save();
        res.status(201).json(savedFeedback);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitFeedback = submitFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield Feedback_1.default.find().populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(feedbacks);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getFeedbacks = getFeedbacks;
