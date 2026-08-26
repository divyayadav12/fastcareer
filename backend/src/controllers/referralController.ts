import { Request, Response } from 'express';
import Referral from '../models/Referral';

export const submitReferral = async (req: Request, res: Response) => {
  try {
    const { friendName, friendEmail, friendPhone } = req.body;
    let resumeUrl = '';

    if (req.file) {
      resumeUrl = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }
    
    const referral = new Referral({
      friendName,
      friendEmail,
      friendPhone,
      resumeUrl,
      referredBy: (req as any).user?._id
    });

    const savedReferral = await referral.save();
    res.status(201).json(savedReferral);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getReferrals = async (req: Request, res: Response) => {
  try {
    const referrals = await Referral.find().populate('referredBy', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(referrals);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
