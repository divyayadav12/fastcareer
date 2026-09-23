import { ALL_CITIES } from './constants';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Prayagraj', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Noida', 'Gurugram', 'Gurgaon'
];

export interface ExtractedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  workStatus?: 'fresher' | 'experienced';
  linkedinUrl?: string;
  bothGroups1stAttempt?: boolean;
  group1Attempts?: string;
  group1Month?: string;
  group1Year?: string;
  group2Attempts?: string;
  group2Month?: string;
  group2Year?: string;
  ranker?: string;
  completionSessionMonth?: string;
  completionSessionYear?: string;
}

/**
 * Reads any Android ContentResolver URI or file:// URI cleanly using XMLHttpRequest + FileReader
 */
export const readUriAsText = (uri: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      if (!uri) return resolve('');
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        try {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve((reader.result as string) || '');
          };
          reader.onerror = function () {
            resolve('');
          };
          reader.readAsText(xhr.response);
        } catch {
          resolve('');
        }
      };
      xhr.onerror = function () {
        resolve('');
      };
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    } catch {
      resolve('');
    }
  });
};

export async function parseResumeDocument(file: { uri: string; name?: string }): Promise<ExtractedResumeData> {
  const result: ExtractedResumeData = {};
  let rawText = '';

  if (file.uri) {
    try {
      rawText = await readUriAsText(file.uri);
    } catch (e) {}
  }

  const combinedSearchText = `${file.name || ''} \n ${rawText}`;
  const lowerText = combinedSearchText.toLowerCase();

  // 1. Extract Email Address
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi;
  const emailMatches = combinedSearchText.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    const validEmails = emailMatches.filter(em => 
      !em.includes('example.com') && 
      !em.includes('schema.org') && 
      !em.includes('w3.org') && 
      !em.includes('adobe.com')
    );
    if (validEmails.length > 0) {
      result.email = validEmails[0].toLowerCase().trim();
    }
  }

  // 2. Extract Mobile Number (10 digits starting with 6-9)
  const phoneRegex = /(?:(?:\+91|0091|0)[\s-]?)?([6-9]\d{9})\b/g;
  let phoneMatch;
  while ((phoneMatch = phoneRegex.exec(combinedSearchText)) !== null) {
    if (phoneMatch[1] && phoneMatch[1].length === 10) {
      result.phone = phoneMatch[1];
      break;
    }
  }

  // 3. Extract City (from Popular Cities or ALL_CITIES)
  for (const city of POPULAR_CITIES) {
    const cityLower = city.toLowerCase();
    const regex = new RegExp(`\\b${cityLower}\\b`, 'i');
    if (regex.test(lowerText)) {
      result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
      break;
    }
  }

  // 4. LinkedIn Profile URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = combinedSearchText.match(linkedinRegex);
  if (linkedinMatch) {
    result.linkedinUrl = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 5. Extract Work Status
  if (lowerText.includes('fresher') || lowerText.includes('articleship completed') || lowerText.includes('ca fresher')) {
    result.workStatus = 'fresher';
  } else if (lowerText.includes('years of experience') || lowerText.includes('total experience') || lowerText.includes('post qualification experience') || lowerText.includes('senior associate') || lowerText.includes('manager')) {
    result.workStatus = 'experienced';
  }

  // 6. CA Final Details Extraction
  const bothGroups1st = /\b(?:both\s+groups?|both\s+grp)[\s\w,-]{0,30}\b(?:1st|first)\s+attempt\b/i.test(combinedSearchText) ||
    /\b(?:1st|first)\s+attempt[\s\w,-]{0,30}\b(?:both\s+groups?|both\s+grp)\b/i.test(combinedSearchText);

  if (bothGroups1st) {
    result.bothGroups1stAttempt = true;
    result.group1Attempts = '1';
    result.group2Attempts = '1';
  }

  const examMonthMatch = combinedSearchText.match(/\b(?:CA\s+Final|Chartered\s+Accountant)[\s:-]+(?:cleared|passed|completed)?[\s:-]*\b(Jan(?:uary)?|May|Sep(?:tember)?|Nov(?:ember)?)\b[\s,/-]+(20[12]\d)\b/i);
  if (examMonthMatch) {
    const m = examMonthMatch[1].slice(0, 3);
    const formattedMonth = m === 'jan' ? 'Jan' : m === 'may' ? 'May' : m === 'sep' ? 'Sep' : 'Nov';
    const y = examMonthMatch[2];
    result.completionSessionMonth = formattedMonth;
    result.completionSessionYear = y;
    result.group1Month = formattedMonth;
    result.group1Year = y;
    if (bothGroups1st) {
      result.group2Month = formattedMonth;
      result.group2Year = y;
    }
  }

  // 7. Extract Candidate Name from filename
  const cleanFileName = (file.name || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/[0-9+()@.]/g, ' ')
    .trim();

  const ignoreWords = new Set([
    'resume', 'cv', 'curriculum', 'vitae', 'biodata', 'profile', 'final', 'ca',
    'pdf', 'docx', 'doc', 'updated', 'latest', 'new', 'ca_final', 'ca_inter',
    'chartered', 'accountant', 'fresher', 'experienced', 'draft', 'copy', 'wfh'
  ]);

  const nameWords = cleanFileName
    .split(/\s+/)
    .filter(w => w.length > 1 && !ignoreWords.has(w.toLowerCase()));

  if (nameWords.length >= 2) {
    result.firstName = nameWords[0].charAt(0).toUpperCase() + nameWords[0].slice(1).toLowerCase();
    result.lastName = nameWords[1].charAt(0).toUpperCase() + nameWords[1].slice(1).toLowerCase();
  } else if (nameWords.length === 1) {
    result.firstName = nameWords[0].charAt(0).toUpperCase() + nameWords[0].slice(1).toLowerCase();
  }

  if (!result.firstName && result.email) {
    const emailPrefix = result.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim();
    const parts = emailPrefix.split(/\s+/).filter(p => p.length > 1);
    if (parts.length >= 2) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      result.lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    } else if (parts.length === 1) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  return result;
}
