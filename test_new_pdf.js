const https = require('https');
const url = 'https://res.cloudinary.com/dkh6hy0sx/image/upload/v1787744167/fastweb_resumes/resume-1787744167324.pdf';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
