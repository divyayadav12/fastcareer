
import User from '../models/User';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@fastcareers.in' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@fastcareers.in',
        password: hashedPassword,
        role: 'admin',
        profileCompleted: true
      });
      console.log('Live Admin user seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

