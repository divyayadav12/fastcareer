const https = require('https');
const url = 'https://res.cloudinary.com/dkh6hy0sx/image/upload/fl_attachment/v1787744167/fastweb_resumes/resume-1787744167324.pdf';

https.get(url, (res) => {
  console.log('fl_attachment Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
