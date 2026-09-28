const fs = require('fs');
const path = 'c:/Users/HP/Desktop/Fast Web/frontend/src/layouts/EmployerLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/{user\?\.role === 'admin' \? \(user\?\.firstName \? \`\$\{user\.firstName\} \(Admin\)\` : 'FAST Admin'\) : \(user\?\.companyName \|\| user\?\.firstName \|\| 'Employer'\)}/, 
  "{user?.companyName || user?.firstName || 'Employer'}"
);
content = content.replace(/{user\?\.role === 'admin' \? 'Administrator' : 'Employer Account'}/, 
  "Employer Account"
);

fs.writeFileSync(path, content);
