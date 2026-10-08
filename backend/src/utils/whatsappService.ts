import axios from 'axios';
import https from 'https';

// Teleobi WhatsApp Webhook URL for Candidate Registration & Shortlisting
const DEFAULT_REGISTRATION_WEBHOOK_URL = 'https://dash.teleobi.com/webhook/whatsapp-workflow/61602.439252.449757.1790665591';
const REGISTRATION_WEBHOOK_URL = process.env.WHATSAPP_REGISTRATION_WEBHOOK_URL || DEFAULT_REGISTRATION_WEBHOOK_URL;
const SHORTLIST_WEBHOOK_URL = process.env.WHATSAPP_SHORTLIST_WEBHOOK_URL || DEFAULT_REGISTRATION_WEBHOOK_URL;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

// Custom HTTPS Agent to prevent SSL certificate verification errors (e.g. unable to verify the first certificate)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Format phone number into all standard variations (91XXXXXXXXXX, raw 10-digit, +91XXXXXXXXXX)
 */
export const getPhoneVariants = (phone: string) => {
  if (!phone) return { formatted: '', raw10: '', withPlus: '' };
  let digits = phone.replace(/\D/g, '');

  // Strip leading 0 if 11 digits (e.g. 09876543210 -> 9876543210)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // If 12 digits starting with 91 (e.g. 919876543210)
  if (digits.length === 12 && digits.startsWith('91')) {
    const raw10 = digits.slice(2);
    return {
      formatted: digits,
      raw10: raw10,
      withPlus: `+${digits}`
    };
  }

  // If standard 10-digit Indian number
  if (digits.length === 10) {
    return {
      formatted: `91${digits}`,
      raw10: digits,
      withPlus: `+91${digits}`
    };
  }

  // Fallback for other lengths
  return {
    formatted: digits,
    raw10: digits.length >= 10 ? digits.slice(-10) : digits,
    withPlus: digits.startsWith('+') ? digits : `+${digits}`
  };
};

/**
 * Clean phone number to 91XXXXXXXXXX format
 */
export const formatPhoneNumber = (phone: string): string => {
  return getPhoneVariants(phone).formatted;
};

/**
 * Sends a welcome WhatsApp message upon candidate registration via Teleobi Webhook
 * @param phone Candidate's phone number
 * @param name Candidate's name
 */
export const sendRegistrationWhatsApp = async (phone: string, name: string): Promise<boolean> => {
  const variants = getPhoneVariants(phone);
  const targetBaseUrl = REGISTRATION_WEBHOOK_URL || DEFAULT_REGISTRATION_WEBHOOK_URL;

  if (!targetBaseUrl) {
    console.log(`[WhatsApp Sync] Registration Webhook URL missing. Skipped sending registration message to ${phone}.`);
    return false;
  }

  if (!variants.formatted) {
    console.log('[WhatsApp Sync] Candidate phone number is empty. Cannot send registration WhatsApp message.');
    return false;
  }

  try {
    const candidateName = (name || 'Candidate').trim();
    const phoneWith91 = variants.formatted; // Strictly 91XXXXXXXXXX (e.g. 918839250427)

    // Comprehensive payload format covering all Teleobi workflow triggers with strict 91 prefix
    const payload = {
      phone: phoneWith91,
      mobile: phoneWith91,
      number: phoneWith91,
      phoneNumber: phoneWith91,
      phone_number: phoneWith91,
      to: phoneWith91,
      destination: phoneWith91,
      recipient: phoneWith91,
      contact: phoneWith91,
      country_code: '91',
      countryCode: '91',

      name: candidateName,
      firstName: candidateName.split(' ')[0] || candidateName,
      lastName: candidateName.split(' ').slice(1).join(' ') || '',
      fullName: candidateName,
      candidateName: candidateName,

      parameters: {
        One: candidateName,
        Two: 'Fast Careers',
        Three: 'Chartered Accountant',
        name: candidateName,
        '1': candidateName,
        '2': 'Fast Careers',
        '3': 'Chartered Accountant',
        candidateName: candidateName,
        company: 'Fast Careers',
        role: 'Chartered Accountant',
        portal: 'Fast Careers',
        platform: 'Fast Careers',
        phone: phoneWith91,
        mobile: phoneWith91,
        number: phoneWith91
      },
      variables: {
        name: candidateName,
        One: candidateName,
        Two: 'Fast Careers',
        Three: 'Chartered Accountant',
        '1': candidateName,
        '2': 'Fast Careers',
        candidateName: candidateName,
        company: 'Fast Careers',
        role: 'Chartered Accountant',
        portal: 'Fast Careers',
        phone: phoneWith91,
        mobile: phoneWith91
      },
      data: {
        name: candidateName,
        phone: phoneWith91,
        mobile: phoneWith91,
        company: 'Fast Careers',
        role: 'Chartered Accountant'
      },
      company: 'Fast Careers',
      role: 'Chartered Accountant',
      portal: 'Fast Careers',
      platform: 'Fast Careers'
    };

    // Post directly to target webhook URL with comprehensive payload
    const targetUrl = targetBaseUrl;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      },
      httpsAgent,
      timeout: 10000 // 10 seconds timeout
    };

    console.log(`[WhatsApp Sync] Triggering Teleobi registration webhook for ${variants.formatted} (${candidateName})...`);
    console.log(`[WhatsApp Sync] Target Webhook URL: ${targetUrl}`);
    
    const response = await axios.post(targetUrl, payload, config);
    console.log(`[WhatsApp Success] Registration webhook fired successfully! Status: ${response.status}`);
    return true;
  } catch (error: any) {
    const errorDetails = error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message;
    console.error(`[WhatsApp Error] Failed to send registration message to ${variants.formatted}:`, errorDetails);
    return false;
  }
};

/**
 * Sends a congratulatory WhatsApp message upon shortlisting
 * @param phone Candidate's phone number
 * @param name Candidate's name
 * @param role The job role they were shortlisted for
 */
export const sendShortlistedWhatsApp = async (phone: string, name: string, role: string): Promise<boolean> => {
  const variants = getPhoneVariants(phone);

  if (!SHORTLIST_WEBHOOK_URL || !variants.formatted) {
    console.log(`[WhatsApp Sync] Shortlist Webhook URL or Phone missing. Skipped sending message to ${phone}`);
    return false;
  }

  try {
    const candidateName = (name || 'Candidate').trim();
    const phoneWith91 = variants.formatted; // Strictly 91XXXXXXXXXX
    const payload = {
      phone: phoneWith91,
      mobile: phoneWith91,
      number: phoneWith91,
      phoneNumber: phoneWith91,
      country_code: '91',
      countryCode: '91',
      name: candidateName,
      role: role,
      parameters: {
        One: candidateName,
        Two: role,
        name: candidateName,
        role: role,
        phone: phoneWith91,
        mobile: phoneWith91
      },
      variables: {
        name: candidateName,
        role: role,
        phone: phoneWith91
      }
    };

    const targetUrl = SHORTLIST_WEBHOOK_URL;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(WHATSAPP_API_KEY ? { 'Authorization': `Bearer ${WHATSAPP_API_KEY}` } : {})
      },
      httpsAgent,
      timeout: 10000
    };

    const response = await axios.post(targetUrl, payload, config);
    console.log(`[WhatsApp Success] Shortlist message sent successfully to ${variants.formatted}. Status: ${response.status}`);
    return true;
  } catch (error: any) {
    const errorDetails = error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message;
    console.error(`[WhatsApp Error] Failed to send shortlist message to ${variants.formatted}:`, errorDetails);
    return false;
  }
};
