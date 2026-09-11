const fs = require('fs');
const file = 'frontend/src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { Expertise }")) {
  content = content.replace(
    "import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';",
    "import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';\nimport { Expertise } from './Expertise';"
  );
  
  content = content.replace(
    "      {/* CTA Section */}",
    "      {/* Appended Expertise Content */}\n      <Expertise />\n\n      {/* CTA Section */}"
  );
  
  fs.writeFileSync(file, content);
}
