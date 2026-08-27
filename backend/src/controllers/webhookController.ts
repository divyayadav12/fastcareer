import { Request, Response } from 'express';
import User from '../models/User';
import crypto from 'crypto';

export const handleZohoWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    console.log('Received Zoho Webhook payload:', payload);

    if (!payload || Object.keys(payload).length === 0) {
      res.status(400).json({ message: 'Empty payload received' });
      return;
    }

    // Extract standardized keys we instruct Zoho to send
    const {
      email,
      firstName,
      lastName,
      phone,
      currentCity,
      caStatus, // "CA Fresher (Jan'26 Qualified)" etc.
      experience,
      articleshipFirm,
      articleshipCity,
      articleshipMonths
    } = payload;

    if (!email) {
      res.status(400).json({ message: 'Email is required in payload' });
      return;
    }

    // Attempt to find existing user
    let user = await User.findOne({ email });

    const isFresher = caStatus && caStatus.toLowerCase().includes('fresher');

    const mappedCaPortfolio = {
      isFresherCA: isFresher || false,
      articleships: articleshipFirm ? [{
        firmName: articleshipFirm,
        city: articleshipCity || '',
        noOfMonths: articleshipMonths || '36',
        firmType: 'Medium',
        noOfPartners: '2'
      }] : []
    };

    const mappedPersonalDetails = {
      currentCity: currentCity || '',
    };

    if (user) {
      // Update existing user
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;

      // Merge personalDetails
      user.personalDetails = {
        ...(user.personalDetails || {}),
        ...mappedPersonalDetails
      };

      // Merge caPortfolio
      // Only append/update articleships if the incoming payload has them
      if (articleshipFirm) {
        const existingArticleships = user.caPortfolio?.articleships || [];
        user.caPortfolio = {
          ...(user.caPortfolio || {}),
          isFresherCA: mappedCaPortfolio.isFresherCA,
          articleships: [...existingArticleships, ...mappedCaPortfolio.articleships]
        };
      } else {
        user.caPortfolio = {
          ...(user.caPortfolio || {}),
          isFresherCA: mappedCaPortfolio.isFresherCA
        };
      }

      await user.save();
      console.log(`Updated user via Webhook: ${email}`);
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      // Create new user
      const generatedPassword = crypto.randomBytes(8).toString('hex'); // Generate random password

      user = await User.create({
        firstName: firstName || 'Zoho',
        lastName: lastName || 'Candidate',
        email,
        password: generatedPassword,
        phone: phone || '',
        role: 'candidate',
        personalDetails: mappedPersonalDetails,
        caPortfolio: mappedCaPortfolio
      });

      console.log(`Created new user via Webhook: ${email} with password ${generatedPassword}`);
      res.status(201).json({ message: 'User created successfully', generatedPassword });
    }
  } catch (error: any) {
    console.error('Error handling Zoho Webhook:', error.message);
    res.status(500).json({ message: 'Server error processing webhook' });
  }
};
