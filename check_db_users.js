const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });
const uri = process.env.MONGO_URI;

async function check() {
  await mongoose.connect(uri);
  const users = await mongoose.connection.collection('users').find({ role: { $in: ['employer', 'admin'] } }).toArray();
  console.log('Employers/Admins in DB:', users.map(u => ({ email: u.email, role: u.role })));
  
  // Also check candidates
  const candidates = await mongoose.connection.collection('users').find({ role: 'candidate' }).limit(5).toArray();
  console.log('Candidates in DB:', candidates.map(c => ({ name: c.firstName + ' ' + c.lastName, email: c.email, resumeUrl: c.resumeUrl })));

  await mongoose.disconnect();
}

check().catch(console.error);
