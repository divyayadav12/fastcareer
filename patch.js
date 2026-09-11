const fs = require('fs');
const file = 'backend/src/controllers/userController.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const deleteResult = await User\.deleteMany\(\{ email: \{ \$regex: \/@example\\\.com\$\/i \} \}\);/,
  `const deleteResult = await User.deleteMany({ email: { $regex: /@example\\.com$/i } });
    const incompleteDeleteResult = await User.deleteMany({ role: 'candidate', $or: [{ resumeUrl: null }, { resumeUrl: "" }] });`
);

fs.writeFileSync(file, content);
