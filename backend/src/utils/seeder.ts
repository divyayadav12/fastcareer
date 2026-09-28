
import User from '../models/User';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@fastcareers.in';
    const adminUser = await User.findOne({ email: adminEmail });
    
    // If it exists, update the password back to plain text so the pre-save hook hashes it correctly once
    if (adminUser) {
      adminUser.password = 'Admin@123';
      await adminUser.save();
      console.log('Live Admin user password reset successfully.');
    } else {
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        profileCompleted: true
      });
      console.log('Live Admin user seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

