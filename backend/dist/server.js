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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const sharedJobRoutes_1 = __importDefault(require("./routes/sharedJobRoutes"));
const candidateDashboardRoutes_1 = __importDefault(require("./routes/candidateDashboardRoutes"));
const assessmentRoutes_1 = __importDefault(require("./routes/assessmentRoutes"));
const db_1 = __importDefault(require("./config/db"));
const seeder_1 = require("./utils/seeder");
dotenv_1.default.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Connect to MongoDB
(0, db_1.default)().then(() => {
    (0, seeder_1.seedAdmin)(); // Ensure admin exists on server start
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
const corsOptions = {
    origin: true, // Dynamically allow request origin (production Vercel, preview URLs, localhost)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)(corsOptions));
// Handle preflight across all routes
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
    }
    next();
});
// Disable helmet's crossOriginResourcePolicy for now to allow local images/pdfs to load
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, morgan_1.default)('dev'));
const resumeGenerator_1 = require("./utils/resumeGenerator");
// Static folder for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Fallback dynamic resume/file handler for /uploads when physical file is missing (e.g. ephemeral Render disk)
app.get('/uploads/:filename', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawFilename = req.params.filename;
        const filename = Array.isArray(rawFilename) ? rawFilename[0] : (rawFilename || '');
        if (!filename || !filename.toLowerCase().endsWith('.pdf')) {
            return next();
        }
        const buffer = yield (0, resumeGenerator_1.fetchOrGenerateResumeBuffer)(filename);
        if (buffer) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            return res.end(buffer);
        }
        next();
    }
    catch (err) {
        console.error('Error in /uploads fallback handler:', err);
        next();
    }
}));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const industrialTrainingRoutes_1 = __importDefault(require("./routes/industrialTrainingRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
// Health Check Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});
// Routes
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/applications', applicationRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/shared-jobs', sharedJobRoutes_1.default);
app.use('/api/candidate', candidateDashboardRoutes_1.default);
app.use('/api/webhooks', webhookRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/assessments', assessmentRoutes_1.default);
app.use('/api/industrial-training', industrialTrainingRoutes_1.default);
app.use('/api/locations', locationRoutes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.send('FAST CAREERS API is running');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // connectDB();
});
