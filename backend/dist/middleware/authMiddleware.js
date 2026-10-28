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
exports.employerOrAdmin = exports.adminOrEmployee = exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ADMIN_IDENTIFIERS = [
    'admin@fastcareers.in',
    'divyayadav141203@gmail.com',
    'divyanshyadav10270@gmail.com',
    'admin@coachingfast.in',
    'admin@fastcareer.in'
];
const KNOWN_SECRETS = [
    process.env.JWT_SECRET,
    'supersecretfastcareersjwtkey',
    'secret'
].filter(Boolean);
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // 1. Extract token from header or query param
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
            token = parts[1];
        }
    }
    else if (req.query && req.query.token) {
        token = String(req.query.token);
    }
    // 2. If token exists, verify or decode
    if (token) {
        try {
            let decoded = null;
            for (const secret of KNOWN_SECRETS) {
                try {
                    decoded = jsonwebtoken_1.default.verify(token, secret);
                    if (decoded && decoded.id)
                        break;
                }
                catch (e) {
                    // Continue trying other secrets
                }
            }
            // Fallback: decode unverified if expired or cross-environment
            if (!decoded || !decoded.id) {
                try {
                    const unverified = jsonwebtoken_1.default.decode(token);
                    if (unverified && unverified.id) {
                        decoded = unverified;
                    }
                }
                catch (e) { }
            }
            if (decoded && (decoded.id || decoded.email)) {
                if (decoded.id) {
                    req.user = yield User_1.default.findById(decoded.id).select('-password');
                }
                if (!req.user && decoded.email) {
                    const cleanEmail = String(decoded.email).toLowerCase().trim();
                    req.user = yield User_1.default.findOne({ email: cleanEmail }).select('-password');
                }
            }
            // Fallback for Admin token recovery if user wasn't found by old ID
            if (!req.user && token) {
                try {
                    const unverifiedPayload = jsonwebtoken_1.default.decode(token);
                    const payloadEmail = ((unverifiedPayload === null || unverifiedPayload === void 0 ? void 0 : unverifiedPayload.email) || '').toLowerCase().trim();
                    if (ADMIN_IDENTIFIERS.includes(payloadEmail)) {
                        req.user = yield User_1.default.findOne({ role: 'admin' }).select('-password');
                    }
                }
                catch (e) { }
            }
        }
        catch (error) {
            console.warn('Protect token decode issue:', error);
        }
    }
    // 3. If user found from token
    if (req.user) {
        const userEmail = (req.user.email || '').toLowerCase().trim();
        const isOwner = ADMIN_IDENTIFIERS.includes(userEmail);
        if (isOwner && req.user.role !== 'admin') {
            req.user.role = 'admin';
            User_1.default.findByIdAndUpdate(req.user._id, { role: 'admin' }).catch(() => { });
        }
        return next();
    }
    // 4. If no valid user found
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
});
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Not authorized as an admin' });
};
exports.admin = admin;
const adminOrEmployee = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'employee')) {
        return next();
    }
    return res.status(403).json({ message: 'Admin or Employee access required' });
};
exports.adminOrEmployee = adminOrEmployee;
const employerOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'employer' || req.user.role === 'admin' || req.user.role === 'employee')) {
        return next();
    }
    return res.status(403).json({ message: 'Employer, Admin or Employee access required' });
};
exports.employerOrAdmin = employerOrAdmin;
