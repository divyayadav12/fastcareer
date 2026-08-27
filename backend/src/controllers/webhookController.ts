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

    // Personal Details
    const {
      email, firstName, lastName, phone, password,
      alternatePhone, currentAddress, currentState, currentCity,
      permanentAddressSameAsCurrent, permanentAddress, permanentState, permanentCity,
      dateOfBirth, gender, maritalStatus, preferredCampusCity
    } = payload;

    // CA Portfolio Details
    const {
      caStatus, // To determine isFresherCA
      caInter_bothGroups1stAttempt, caInter_group1Attempts, caInter_group1Month, caInter_group1Year,
      caInter_group2Attempts, caInter_group2Month, caInter_group2Year, caInter_ranker,
      caInter_completionSessionMonth, caInter_completionSessionYear, caInter_percentage,
      
      caFinal_bothGroups1stAttempt, caFinal_group1Attempts, caFinal_group1Month, caFinal_group1Year,
      caFinal_group2Attempts, caFinal_group2Month, caFinal_group2Year, caFinal_ranker,
      caFinal_completionSessionMonth, caFinal_completionSessionYear, caFinal_percentage,

      articleshipFirmType, articleshipFirmName, articleshipCity, articleshipPartners, articleshipMonths,
      articleshipCompletionDateMonth, articleshipCompletionDateYear, gmcsCompleted, big4Articleship, industrialTrainee,
      listedCompanyWork, natureOfWork, auditExperience, communicationSkills, aboutMe
    } = payload;

    // Qualifications
    const {
      grad_completed, grad_yearOfCompletion, grad_percentage, grad_college, grad_type,
      class12_percentage, class12_year, class12_board,
      class10_percentage, class10_year, class10_board
    } = payload;

    if (!email) {
      res.status(400).json({ message: 'Email is required in payload' });
      return;
    }

    const mappedPersonalDetails = {
      alternatePhone: alternatePhone || '',
      currentAddress: currentAddress || '',
      currentState: currentState || '',
      currentCity: currentCity || '',
      permanentAddressSameAsCurrent: permanentAddressSameAsCurrent === 'true' || permanentAddressSameAsCurrent === true,
      permanentAddress: permanentAddress || '',
      permanentState: permanentState || '',
      permanentCity: permanentCity || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      maritalStatus: maritalStatus || '',
      preferredCampusCity: preferredCampusCity || ''
    };

    const isFresher = caStatus && caStatus.toLowerCase().includes('fresher');

    const mappedCaPortfolio = {
      isFresherCA: isFresher || false,
      caInter: {
        bothGroups1stAttempt: caInter_bothGroups1stAttempt === 'true' || caInter_bothGroups1stAttempt === true,
        group1Attempts: caInter_group1Attempts || '',
        group1Month: caInter_group1Month || '',
        group1Year: caInter_group1Year || '',
        group2Attempts: caInter_group2Attempts || '',
        group2Month: caInter_group2Month || '',
        group2Year: caInter_group2Year || '',
        ranker: caInter_ranker || '',
        completionSessionMonth: caInter_completionSessionMonth || '',
        completionSessionYear: caInter_completionSessionYear || '',
        percentage: caInter_percentage || ''
      },
      caFinal: {
        bothGroups1stAttempt: caFinal_bothGroups1stAttempt === 'true' || caFinal_bothGroups1stAttempt === true,
        group1Attempts: caFinal_group1Attempts || '',
        group1Month: caFinal_group1Month || '',
        group1Year: caFinal_group1Year || '',
        group2Attempts: caFinal_group2Attempts || '',
        group2Month: caFinal_group2Month || '',
        group2Year: caFinal_group2Year || '',
        ranker: caFinal_ranker || '',
        completionSessionMonth: caFinal_completionSessionMonth || '',
        completionSessionYear: caFinal_completionSessionYear || '',
        percentage: caFinal_percentage || ''
      },
      articleships: articleshipFirmName ? [{
        firmName: articleshipFirmName,
        city: articleshipCity || '',
        noOfMonths: articleshipMonths || '36',
        firmType: articleshipFirmType || 'Medium',
        noOfPartners: articleshipPartners || '2'
      }] : [],
      articleshipCompletionDateMonth: articleshipCompletionDateMonth || '',
      articleshipCompletionDateYear: articleshipCompletionDateYear || '',
      gmcsCompleted: gmcsCompleted || '',
      big4Articleship: big4Articleship || '',
      industrialTrainee: industrialTrainee || '',
      listedCompanyWork: listedCompanyWork || '',
      natureOfWork: natureOfWork || '',
      auditExperience: auditExperience ? (typeof auditExperience === 'string' ? auditExperience.split(',') : auditExperience) : [],
      communicationSkills: communicationSkills ? parseInt(communicationSkills) : 4,
      aboutMe: aboutMe || ''
    };

    const mappedQualifications = {
      graduation: {
        completed: grad_completed || '',
        yearOfCompletion: grad_yearOfCompletion || '',
        percentage: grad_percentage || '',
        college: grad_college || '',
        type: grad_type || 'REGULAR'
      },
      class12: { percentage: class12_percentage || '', year: class12_year || '', board: class12_board || '' },
      class10: { percentage: class10_percentage || '', year: class10_year || '', board: class10_board || '' }
    };

    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (password) user.password = password;

      // Merge personalDetails
      user.personalDetails = {
        ...(user.personalDetails || {}),
        ...mappedPersonalDetails
      };

      // Merge caPortfolio
      // Only append/update articleships if the incoming payload has them
      if (articleshipFirmName) {
        const existingArticleships = user.caPortfolio?.articleships || [];
        user.caPortfolio = {
          ...(user.caPortfolio || {}),
          ...mappedCaPortfolio,
          articleships: [...existingArticleships, ...mappedCaPortfolio.articleships]
        };
      } else {
        user.caPortfolio = {
          ...(user.caPortfolio || {}),
          ...mappedCaPortfolio,
          articleships: user.caPortfolio?.articleships || []
        };
      }
      
      // Merge qualifications
      user.qualifications = {
        ...(user.qualifications || {}),
        ...mappedQualifications
      };

      await user.save();
      console.log(`Updated user via Webhook: ${email}`);
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      // Create new user
      const generatedPassword = password || crypto.randomBytes(8).toString('hex'); // Generate random password if not provided

      user = await User.create({
        firstName: firstName || 'Zoho',
        lastName: lastName || 'Candidate',
        email,
        password: generatedPassword,
        phone: phone || '',
        role: 'candidate',
        personalDetails: mappedPersonalDetails,
        caPortfolio: mappedCaPortfolio,
        qualifications: mappedQualifications
      });

      console.log(`Created new user via Webhook/Form: ${email} with password setup`);
      res.status(201).json({ message: 'User created successfully', generatedPassword });
    }
  } catch (error: any) {
    console.error('Error handling Zoho Webhook:', error.message);
    res.status(500).json({ message: 'Server error processing webhook' });
  }
};
