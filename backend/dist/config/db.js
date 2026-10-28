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
const mongoose_1 = __importDefault(require("mongoose"));
const ensureInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = (yield Promise.resolve().then(() => __importStar(require('../models/User')))).default;
        const candidateCount = yield User.countDocuments({ role: 'candidate' });
        if (candidateCount === 0) {
            console.log('No candidates found in database. Auto-seeding 20 realistic candidate profiles...');
            const { seed20 } = yield Promise.resolve().then(() => __importStar(require('../seed20Candidates')));
            yield seed20(false);
            console.log('Auto-seed completed successfully!');
        }
        else {
            console.log(`Verified ${candidateCount} candidates exist in database.`);
        }
    }
    catch (err) {
        console.error('Error ensuring initial candidate data:', err);
    }
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
    try {
        const conn = yield mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Auto-seed if empty so candidates are always available on the platform
        ensureInitialData();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`MongoDB Connection Error: ${error.message}`);
        }
        else {
            console.error(`An unknown error occurred while connecting to MongoDB`);
        }
        // Do not call process.exit(1); keeping the server alive allows health checks and preflight CORS to function
    }
});
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Retrying connection...');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
});
exports.default = connectDB;
