import axios from 'axios';

// These will be configured in the .env file once Sir provides the details
const REGISTRATION_WEBHOOK_URL = process.env.WHATSAPP_REGISTRATION_WEBHOOK_URL || '';
const SHORTLIST_WEBHOOK_URL = process.env.WHATSAPP_SHORTLIST_WEBHOOK_URL || '';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

/**
 * Sends a welcome WhatsApp message upon successful registration
 * @param phone Candidate's phone number
 * @param name Candidate's name
 */
export const sendRegistrationWhatsApp = async (phone: string, name: string) => {
  if (!REGISTRATION_WEBHOOK_URL) {
    console.log(`[WhatsApp Sync] Registration Webhook URL missing. Would have sent message to ${phone}`);
    return;
  }

  try {
    // Note: The payload format might change based on Sir's sample JSON
    const payload = {
      phone: phone,
      parameters: {
        One: name
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': WHATSAPP_API_KEY ? `Bearer ${WHATSAPP_API_KEY}` : ''
      }
    };

    await axios.post(REGISTRATION_WEBHOOK_URL, payload, config);
    console.log(`[WhatsApp] Registration message sent successfully to ${phone}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Failed to send registration message to ${phone}:`, error.message);
  }
};

/**
 * Sends a congratulatory WhatsApp message upon shortlisting
 * @param phone Candidate's phone number
 * @param name Candidate's name
 * @param role The job role they were shortlisted for
 */
export const sendShortlistedWhatsApp = async (phone: string, name: string, role: string) => {
  if (!SHORTLIST_WEBHOOK_URL) {
    console.log(`[WhatsApp Sync] Shortlist Webhook URL missing. Would have sent message to ${phone}`);
    return;
  }

  try {
    // Note: The payload format might change based on Sir's sample JSON
    const payload = {
      phone: phone,
      parameters: {
        One: name,
        Two: role
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': WHATSAPP_API_KEY ? `Bearer ${WHATSAPP_API_KEY}` : ''
      }
    };

    await axios.post(SHORTLIST_WEBHOOK_URL, payload, config);
    console.log(`[WhatsApp] Shortlist message sent successfully to ${phone}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Failed to send shortlist message to ${phone}:`, error.message);
  }
};
