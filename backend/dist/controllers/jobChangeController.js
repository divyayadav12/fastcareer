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
exports.getJobChangeRequests = exports.submitJobChange = void 0;
const JobChangeRequest_1 = __importDefault(require("../models/JobChangeRequest"));
const submitJobChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentCompany, currentDesignation, currentCTC, expectedCTC, noticePeriod, reason } = req.body;
        const jobChange = new JobChangeRequest_1.default({
            currentCompany,
            currentDesignation,
            currentCTC,
            expectedCTC,
            noticePeriod,
            reason,
            requestedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const savedRequest = yield jobChange.save();
        res.status(201).json(savedRequest);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitJobChange = submitJobChange;
const getJobChangeRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield JobChangeRequest_1.default.find().populate('requestedBy', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getJobChangeRequests = getJobChangeRequests;
