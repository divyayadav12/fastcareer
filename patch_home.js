const fs = require('fs');
const file = 'frontend/src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { Employers }")) {
  content = content.replace(
    "import { CTASection } from './home/CTASection';",
    "import { CTASection } from './home/CTASection';\nimport { Employers } from './Employers';\nimport { JobListings } from './JobListings';"
  );
  
  content = content.replace(
    "<CandidateSection />",
    "<CandidateSection />\n      <JobListings />"
  );

  content = content.replace(
    "<EmployerSection />",
    "<EmployerSection />\n      <Employers />"
  );
  
  fs.writeFileSync(file, content);
}
