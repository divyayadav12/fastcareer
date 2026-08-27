import express from 'express';
import { handleZohoWebhook } from '../controllers/webhookController';

const router = express.Router();

// POST /api/webhooks/zoho
router.post('/zoho', handleZohoWebhook);

export default router;
