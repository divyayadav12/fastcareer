const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('https://fastcareer.onrender.com/api/users');
    const users = res.data;
    users.forEach(u => {
      if (u.resumeUrl) {
        console.log(`User ${u.email}: ${u.resumeUrl}`);
      }
    });
  } catch (e) {
    console.log("Cannot fetch without auth:", e.message);
  }
}
check();
