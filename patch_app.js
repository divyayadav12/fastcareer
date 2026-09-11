const fs = require('fs');
const file = 'frontend/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<Route path="\/expertise" element=\{<Expertise \/>\} \/>\r?\n\s*/g, '');
content = content.replace(/<Route path="\/employers" element=\{<Employers \/>\} \/>\r?\n\s*/g, '');
content = content.replace(/<Route path="\/jobs" element=\{<JobListings \/>\} \/>\r?\n\s*/g, '');

fs.writeFileSync(file, content);
