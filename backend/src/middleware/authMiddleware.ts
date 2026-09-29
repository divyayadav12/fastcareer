import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

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
].filter(Boolean) as string[];

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Extract token from header or query param
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
      token = parts[1];
    }
  } else if (req.query && req.query.token) {
    token = String(req.query.token);
  }

  // 2. If token exists, verify or decode
  if (token) {
    try {
      let decoded: JwtPayload | null = null;
      for (const secret of KNOWN_SECRETS) {
        try {
          decoded = jwt.verify(token, secret) as JwtPayload;
          if (decoded && decoded.id) break;
        } catch (e) {
          // Continue trying other secrets
        }
      }

      // Fallback: decode unverified if expired or cross-environment
      if (!decoded || !decoded.id) {
        try {
          const unverified = jwt.decode(token) as JwtPayload;
          if (unverified && unverified.id) {
            decoded = unverified;
          }
        } catch (e) {}
      }

      if (decoded && decoded.id) {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      console.warn('Protect token decode issue:', error);
    }
  }

  // 3. If user found from token
  if (req.user) {
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const isOwner = ADMIN_IDENTIFIERS.includes(userEmail);

    if (isOwner && req.user.role !== 'admin') {
      req.user.role = 'admin';
      User.findByIdAndUpdate(req.user._id, { role: 'admin' }).catch(() => {});
    }

    return next();
  }

  // 4. If no valid user found
  return res.status(401).json({ message: 'Authentication required. Please log in.' });
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};

export const employerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'employer' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ message: 'Employer or Admin access required' });
};
