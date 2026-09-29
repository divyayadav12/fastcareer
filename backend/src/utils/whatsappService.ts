import axios from 'axios';

const CANDIDATE_SELECTED_WEBHOOK_URL = process.env.WHATSAPP_SHORTLIST_WEBHOOK_URL || 'https://dash.teleobi.com/webhook/whatsapp-workflow/61602.439252.449757.1790665591';
const REGISTRATION_WEBHOOK_URL = process.env.WHATSAPP_REGISTRATION_WEBHOOK_URL || CANDIDATE_SELECTED_WEBHOOK_URL;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

/**
 * Sends a welcome WhatsApp message upon successful registration
 */
export const sendRegistrationWhatsApp = async (phone: string, name: string) => {
  const url = REGISTRATION_WEBHOOK_URL;
  if (!url) return;

  try {
    const payload = {
      phone: phone,
      name: name,
      parameters: {
        One: name
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      }
    };

    await axios.post(url, payload, config);
    console.log(`[WhatsApp] Registration message sent to ${phone}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Registration message to ${phone}:`, error.message);
  }
};

/**
 * Sends WhatsApp notification when a candidate is selected / shortlisted / granted access to a company
 */
export const sendCandidateSelectedWhatsApp = async (phone: string, name: string, companyOrRole: string) => {
  const url = CANDIDATE_SELECTED_WEBHOOK_URL;
  if (!url) return;

  try {
    const payload = {
      phone: phone,
      name: name,
      company: companyOrRole,
      role: companyOrRole,
      parameters: {
        One: name,
        Two: companyOrRole
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      }
    };

    await axios.post(url, payload, config);
    console.log(`[WhatsApp] Candidate Selected notification sent to ${phone} for ${companyOrRole}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Selection message to ${phone}:`, error.message);
  }
};

export const sendShortlistedWhatsApp = sendCandidateSelectedWhatsApp;
