
import User from '../models/User';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@fastcareers.in';
    const adminUser = await User.findOne({ email: adminEmail });
    
    // Ensure actual admin exists
    if (adminUser) {
      adminUser.password = 'Admin@123';
      await adminUser.save();
    } else {
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        profileCompleted: true
      });
    }

    // DEMOTE all fake admins
    const allowedAdmins = ['admin@fastcareers.in', 'divyayadav141203@gmail.com', 'divyanshyadav10270@gmail.com'];
    await User.updateMany(
      { role: 'admin', email: { $nin: allowedAdmins } },
      { $set: { role: 'employer' } }
    );
    console.log('Admin seed & cleanup ran successfully.');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

