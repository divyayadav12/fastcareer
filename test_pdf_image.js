const https = require('https');

const url = 'https://res.cloudinary.com/dkh6hy0sx/image/upload/v1787737120/fastweb_resumes/resume-1787737119466.pdf';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode >= 300 && res.statusCode < 400) {
    console.log('Redirecting to:', res.headers.location);
  }
}).on('error', (e) => {
  console.error(e);
});
