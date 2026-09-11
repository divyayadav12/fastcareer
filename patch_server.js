const fs = require('fs');
const file = 'backend/src/server.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import webhookRoutes from './routes/webhookRoutes';",
  "import webhookRoutes from './routes/webhookRoutes';\nimport contactRoutes from './routes/contactRoutes';"
);

content = content.replace(
  "app.use('/api/webhooks', webhookRoutes);",
  "app.use('/api/webhooks', webhookRoutes);\napp.use('/api/contact', contactRoutes);"
);

fs.writeFileSync(file, content);
