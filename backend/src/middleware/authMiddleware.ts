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
  'divyayadav141203@gmail.com',
  'divyanshyadav10270@gmail.com',
  'admin@coachingfast.in',
  'admin@fastcareer.in'
];

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401).json({ message: 'User account not found or session expired' });
        return;
      }

      // Auto-grant admin role to Divya / owner accounts
      const userEmail = (req.user.email || '').toLowerCase();
      const userFirstName = (req.user.firstName || '').toLowerCase();
      const isOwner = ADMIN_IDENTIFIERS.includes(userEmail) || 
                      userEmail.includes('divya') || 
                      userFirstName === 'divya' ||
                      userEmail.includes('admin');

      if (isOwner && req.user.role !== 'admin') {
        req.user.role = 'admin';
        await User.findByIdAndUpdate(req.user._id, { role: 'admin' });
      }

      next();
      return;
    } catch (error) {
      console.error('Auth protect error:', error);
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Failsafe for Divya
    const userEmail = (req.user?.email || '').toLowerCase();
    const userFirstName = (req.user?.firstName || '').toLowerCase();
    if (userEmail.includes('divya') || userFirstName === 'divya' || userEmail.includes('admin')) {
      if (req.user) req.user.role = 'admin';
      return next();
    }
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const employerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'employer')) {
    next();
  } else {
    // Failsafe for Divya
    const userEmail = (req.user?.email || '').toLowerCase();
    const userFirstName = (req.user?.firstName || '').toLowerCase();
    if (userEmail.includes('divya') || userFirstName === 'divya' || userEmail.includes('admin')) {
      if (req.user) {
        req.user.role = 'admin';
        User.findByIdAndUpdate(req.user._id, { role: 'admin' }).catch(() => {});
      }
      return next();
    }
    res.status(401).json({ message: 'Not authorized for this action. Employer or Admin access required.' });
  }
};
