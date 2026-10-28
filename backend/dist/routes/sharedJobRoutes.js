"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharedJobController_1 = require("../controllers/sharedJobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Allow public submission or we can add protect if it must be a logged in user.
// Based on typical candidate dashboards, they are logged in.
router.route('/').post(authMiddleware_1.protect, sharedJobController_1.createSharedJob).get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, sharedJobController_1.getSharedJobs);
exports.default = router;
