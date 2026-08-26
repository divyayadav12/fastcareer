import { Request, Response } from 'express';
import JobChangeRequest from '../models/JobChangeRequest';

export const submitJobChange = async (req: Request, res: Response) => {
  try {
    const { currentCompany, currentDesignation, currentCTC, expectedCTC, noticePeriod, reason } = req.body;
    
    const jobChange = new JobChangeRequest({
      currentCompany,
      currentDesignation,
      currentCTC,
      expectedCTC,
      noticePeriod,
      reason,
      requestedBy: (req as any).user?._id
    });

    const savedRequest = await jobChange.save();
    res.status(201).json(savedRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getJobChangeRequests = async (req: Request, res: Response) => {
  try {
    const requests = await JobChangeRequest.find().populate('requestedBy', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
