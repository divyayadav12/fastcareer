const https = require('https');
const url = 'https://res.cloudinary.com/dkh6hy0sx/auto/upload/v1787737120/fastweb_resumes/resume-1787737119466.pdf';
https.get(url, (res) => {
  console.log('AUTO Status Code:', res.statusCode);
}).on('error', (e) => console.error(e));
