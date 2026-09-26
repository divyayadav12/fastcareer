const fs = require('fs');
const filePath = 'c:/Users/HP/Desktop/Fast Web/frontend/src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const importsToLazy = [
  { name: 'Home', path: './pages/Home' },
  { name: 'About', path: './pages/About' },
  { name: 'OurTeam', path: './pages/OurTeam' },
  { name: 'Services', path: './pages/Services' },
  { name: 'Expertise', path: './pages/Expertise' },
  { name: 'Employers', path: './pages/Employers' },
  { name: 'Contact', path: './pages/Contact' },
  { name: 'JobListings', path: './pages/JobListings' },
  { name: 'JobDetails', path: './pages/JobDetails' },
  { name: 'Login', path: './pages/auth/Login' },
  { name: 'Register', path: './pages/auth/Register' },
  { name: 'PlacementDriveForm', path: './pages/PlacementDriveForm' },
  { name: 'PlacementResults', path: './pages/PlacementResults' },
  { name: 'CandidateDashboard', path: './pages/candidate/Dashboard' },
  { name: 'JobFair', path: './pages/candidate/JobFair' },
  { name: 'CurrentOpenings', path: './pages/candidate/CurrentOpenings' },
  { name: 'ResumeDownloads', path: './pages/candidate/ResumeDownloads' },
  { name: 'ResumePrint', path: './pages/candidate/ResumePrint' },
  { name: 'Feedback', path: './pages/candidate/Feedback' },
  { name: 'ImpDownloads', path: './pages/candidate/ImpDownloads' },
  { name: 'ReferFriend', path: './pages/candidate/ReferFriend' },
  { name: 'CompaniesRegistered', path: './pages/candidate/CompaniesRegistered' },
  { name: 'WantToChangeJob', path: './pages/candidate/WantToChangeJob' },
  { name: 'PlacementHistory', path: './pages/candidate/PlacementHistory' },
  { name: 'ShareJob', path: './pages/candidate/ShareJob' },
  { name: 'EmployerDashboard', path: './pages/employer/Dashboard' },
  { name: 'EmployerApplications', path: './pages/employer/Applications' },
  { name: 'ManageJobs', path: './pages/employer/ManageJobs' },
  { name: 'EmployerCandidates', path: './pages/employer/Candidates' },
  { name: 'EmployerBilling', path: './pages/employer/Billing' },
  { name: 'CompanyProfile', path: './pages/employer/CompanyProfile' },
  { name: 'PlatformData', path: './pages/employer/PlatformData' },
  { name: 'AdminDashboard', path: './pages/admin/Dashboard' },
  { name: 'FastSelectionTest', path: './pages/candidate/FastSelectionTest' },
  { name: 'CandidateTestResults', path: './pages/admin/CandidateTestResults' }
];

let lazyImports = '';
for (const item of importsToLazy) {
  const regex = new RegExp(`import \\\\{\\\\s*${item.name}\\\\s*\\\\} from '${item.path}';?\\r?\\n`);
  content = content.replace(regex, '');
  lazyImports += `const ${item.name} = lazy(() => import('${item.path}').then(m => ({ default: m.${item.name} })));\n`;
}

if (!content.includes('lazy, Suspense')) {
  content = content.replace("import React from 'react';", "import React, { lazy, Suspense } from 'react';");
}

const lastImportIndex = content.lastIndexOf('import ');
const insertionPoint = content.indexOf('\n', lastImportIndex) + 1;

content = content.slice(0, insertionPoint) + '\n// Lazy Loaded Routes\n' + lazyImports + content.slice(insertionPoint);

const loaderUI = `
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-semibold text-slate-500">Loading Fast Careers...</p>
              </div>
            }>
`;
content = content.replace('<Routes>', loaderUI + '              <Routes>');
content = content.replace('</Routes>', '              </Routes>\n            </Suspense>');

fs.writeFileSync(filePath, content);
console.log('App.tsx successfully optimized!');
