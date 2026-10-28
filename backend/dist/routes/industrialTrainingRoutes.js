"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const industrialTrainingController_1 = require("../controllers/industrialTrainingController");
const router = express_1.default.Router();
// Public routes for candidate registration & verification
router.post('/', industrialTrainingController_1.submitIndustrialTraining);
router.post('/send-otp', industrialTrainingController_1.sendVerificationOTP);
router.post('/verify-otp', industrialTrainingController_1.verifyOTP);
// Admin queries and exports
router.get('/', industrialTrainingController_1.getIndustrialTrainingApplications);
router.get('/export', industrialTrainingController_1.exportIndustrialTrainingExcel);
router.delete('/:id', industrialTrainingController_1.deleteIndustrialTrainingApplication);
exports.default = router;
