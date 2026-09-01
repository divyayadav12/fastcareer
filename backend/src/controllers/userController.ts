import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'This email is already registered. Please use a different email address.' });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'candidate',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.resumeUrl !== undefined) user.resumeUrl = req.body.resumeUrl;
      if (req.body.headline !== undefined) user.headline = req.body.headline;
      if (req.body.skills !== undefined) user.skills = req.body.skills;
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.password) user.password = req.body.password;
      
      if (req.body.personalDetails !== undefined) user.personalDetails = req.body.personalDetails;
      if (req.body.caPortfolio !== undefined) user.caPortfolio = req.body.caPortfolio;
      if (req.body.qualifications !== undefined) user.qualifications = req.body.qualifications;

      const updatedUser = await user.save();

      // Return the updated user object without password, plus token
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
      
      res.json({
        ...userResponse,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all candidates
// @route   GET /api/users/candidates
// @access  Private/Admin
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await User.find({ role: 'candidate' }).select('-password');
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
