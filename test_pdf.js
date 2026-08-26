const https = require('https');
const fs = require('fs');

const url = 'https://res.cloudinary.com/dkh6hy0sx/raw/upload/v1787737120/fastweb_resumes/resume-1787737119466.pdf';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = Buffer.alloc(0);
  res.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  res.on('end', () => {
    console.log('File size:', data.length, 'bytes');
    if (data.length < 1000) {
      console.log('Content:', data.toString());
    } else {
      console.log('First 50 bytes:', data.slice(0, 50).toString('hex'));
      console.log('First 50 bytes (ascii):', data.slice(0, 50).toString('ascii'));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
