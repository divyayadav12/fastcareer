"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true
    },
    submittedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});
const Feedback = mongoose_1.default.model('Feedback', feedbackSchema);
exports.default = Feedback;
