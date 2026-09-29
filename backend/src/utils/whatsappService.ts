import axios from 'axios';

// Default Teleobi WhatsApp Webhook URL provided by user for Candidate Registration
const DEFAULT_REGISTRATION_WEBHOOK_URL = 'https://dash.teleobi.com/webhook/whatsapp-workflow/61602.439252.449757.1790665591';

const REGISTRATION_WEBHOOK_URL = process.env.WHATSAPP_REGISTRATION_WEBHOOK_URL || DEFAULT_REGISTRATION_WEBHOOK_URL;
const SHORTLIST_WEBHOOK_URL = process.env.WHATSAPP_SHORTLIST_WEBHOOK_URL || '';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

/**
 * Format phone number to international 91XXXXXXXXXX format for Indian numbers if necessary
 */
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
};

/**
 * Sends a welcome WhatsApp message upon candidate registration via Teleobi Webhook
 * @param phone Candidate's phone number
 * @param name Candidate's name
 */
export const sendRegistrationWhatsApp = async (phone: string, name: string) => {
  const formattedPhone = formatPhoneNumber(phone);
  const targetUrl = REGISTRATION_WEBHOOK_URL || DEFAULT_REGISTRATION_WEBHOOK_URL;

  if (!formattedPhone) {
    console.log('[WhatsApp Sync] Candidate phone number is empty. Cannot send registration WhatsApp message.');
    return;
  }

  try {
    // Comprehensive Teleobi & generic WhatsApp payload format
    const payload = {
      phone: formattedPhone,
      mobile: formattedPhone,
      number: formattedPhone,
      name: name,
      firstName: name,
      parameters: {
        One: name,
        name: name,
        '1': name
      },
      variables: {
        name: name,
        One: name
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      },
      timeout: 5000 // 5 seconds timeout so registration response isn't delayed
    };

    console.log(`[WhatsApp Sync] Triggering Teleobi registration webhook for ${formattedPhone} (${name})...`);
    const response = await axios.post(targetUrl, payload, config);
    console.log(`[WhatsApp Success] Registration webhook fired. Status: ${response.status}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Failed to send registration message to ${formattedPhone}:`, error.message);
  }
};

/**
 * Sends a congratulatory WhatsApp message upon shortlisting
 * @param phone Candidate's phone number
 * @param name Candidate's name
 * @param role The job role they were shortlisted for
 */
export const sendShortlistedWhatsApp = async (phone: string, name: string, role: string) => {
  const formattedPhone = formatPhoneNumber(phone);

  if (!SHORTLIST_WEBHOOK_URL || !formattedPhone) {
    console.log(`[WhatsApp Sync] Shortlist Webhook URL or Phone missing. Skipped sending message to ${phone}`);
    return;
  }

  try {
    const payload = {
      phone: formattedPhone,
      mobile: formattedPhone,
      name: name,
      role: role,
      parameters: {
        One: name,
        Two: role
      },
      variables: {
        name: name,
        role: role
      }
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      },
      timeout: 5000
    };

    await axios.post(SHORTLIST_WEBHOOK_URL, payload, config);
    console.log(`[WhatsApp Success] Shortlist message sent successfully to ${formattedPhone}`);
  } catch (error: any) {
    console.error(`[WhatsApp Error] Failed to send shortlist message to ${formattedPhone}:`, error.message);
  }
};
