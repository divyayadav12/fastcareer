const https = require('https');

https.get('https://fastcareer-kappa.vercel.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Find JS files
    const regex = /src="(\/assets\/index-[^"]+\.js)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const jsUrl = 'https://fastcareer-kappa.vercel.app' + match[1];
      console.log('Fetching', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', (chunk) => { jsData += chunk; });
        jsRes.on('end', () => {
          if (jsData.includes('cloudinaryPattern')) {
            console.log('SUCCESS: New code (cloudinaryPattern) is present in Vercel bundle!');
          } else {
            console.log('FAIL: New code is NOT in this bundle.');
          }
          if (jsData.includes('candidate.qualifications?.graduation')) {
            console.log('SUCCESS: qualifications mapping is present in Vercel bundle!');
          } else {
            console.log('FAIL: qualifications mapping is NOT in this bundle.');
          }
        });
      });
    }
  });
});
