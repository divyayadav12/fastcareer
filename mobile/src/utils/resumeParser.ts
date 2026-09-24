import pako from 'pako';
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
  dateOfBirth?: string;
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
  caInterBothGroups1stAttempt?: boolean;
  caInterGroup1Attempts?: string;
  caInterGroup1Month?: string;
  caInterGroup1Year?: string;
  caInterGroup2Attempts?: string;
  caInterGroup2Month?: string;
  caInterGroup2Year?: string;
  caInterRanker?: string;
  caInterCompletionMonth?: string;
  caInterCompletionYear?: string;
}

const PDF_KEYWORDS_IGNORE = new Set([
  'rotate', 'trans', 'transform', 'matrix', 'obj', 'endobj', 'stream', 'endstream',
  'xref', 'trailer', 'mediabox', 'cropbox', 'annots', 'resources', 'font', 'type',
  'subtype', 'catalog', 'pages', 'producer', 'creator', 'creationdate', 'moddate',
  'flatedecode', 'dctdecode', 'filter', 'length', 'root', 'info', 'parent', 'contents',
  'width', 'height', 'colorspace', 'devicergb', 'devicegray', 'devicecmyk', 'procset',
  'extgstate', 'fontdescriptor', 'basefont', 'firstchar', 'lastchar', 'fontbbox',
  'capheight', 'ascent', 'descent', 'flags', 'stemv', 'italicangle', 'fontname',
  'charprocs', 'encoding', 'version', 'identity', 'unicodemap', 'cmap', 'cid', 'gstate',
  'resume', 'curriculum', 'vitae', 'biodata', 'profile', 'contact', 'email', 'phone',
  'mobile', 'address', 'page', 'career', 'objective', 'summary', 'experience',
  'education', 'skills', 'declaration', 'personal', 'pdf', 'docx', 'doc', 'updated',
  'latest', 'new', 'chartered', 'accountant', 'fresher', 'experienced', 'draft', 'copy',
  'wfh', 'ca', 'ca_final', 'ca_inter', 'final', 'inter', 'true', 'false', 'null', 'pt',
  'px', 'cm', 'inch', 'mm', 'rgb', 'cmyk', 'gray', 'scale', 'view', 'rect', 'box',
  'frontenddeveloper', 'backenddeveloper', 'fullstackdeveloper', 'developer', 'engineer',
  'software', 'frontend', 'backend', 'fullstack', 'react', 'node', 'java', 'python',
  'designer', 'intern', 'analyst', 'consultant', 'manager', 'associate', 'lead', 'head',
  'sw', 'dev', 'fe', 'be', 'se', 'sde', 'sde1', 'sde2', 'sde3', 'qa', 'tech', 'eng', 'engg',
  'ui', 'ux', 'web', 'app', 'android', 'ios', 'tester', 'trainee', 'officer', 'executive', 'sr', 'jr'
]);

export function isValidEmailAddress(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  // Strictly ASCII letters, numbers, dots, hyphens, underscores, plus
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/;
  if (!regex.test(clean)) return false;

  // Domain checks
  const parts = clean.split('@');
  if (parts.length !== 2) return false;
  const [username, domain] = parts;
  if (username.length < 1 || domain.length < 3) return false;

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-z]{2,10}$/.test(tld)) return false;

  // Ignore schema/dummy domains
  const ignoreDomains = ['example.com', 'schema.org', 'w3.org', 'adobe.com', 'domain.com'];
  for (const ign of ignoreDomains) {
    if (clean.includes(ign)) return false;
  }

  return true;
}

import { convertUriToBase64 } from '../services/api';

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/^data:[^;]+;base64,/, '').replace(/[\r\n\s]/g, '');
  let bufferLength = clean.length * 0.75;
  if (clean.endsWith('==')) bufferLength -= 2;
  else if (clean.endsWith('=')) bufferLength -= 1;

  const bytes = new Uint8Array(Math.max(0, Math.floor(bufferLength)));
  let p = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const enc1 = B64_CHARS.indexOf(clean[i]);
    const enc2 = B64_CHARS.indexOf(clean[i + 1]);
    const enc3 = B64_CHARS.indexOf(clean[i + 2]);
    const enc4 = B64_CHARS.indexOf(clean[i + 3]);

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    bytes[p++] = chr1;
    if (enc3 !== 64 && enc3 !== -1 && p < bufferLength) bytes[p++] = chr2;
    if (enc4 !== 64 && enc4 !== -1 && p < bufferLength) bytes[p++] = chr3;
  }
  return bytes;
}

function decodeHexPdf(str: string): string {
  return str.replace(/<([0-9a-fA-F\s]{4,})>/g, (_, hex) => {
    const cleanHex = hex.replace(/\s+/g, '');
    let decoded = '';
    if (cleanHex.length >= 4 && cleanHex.startsWith('00')) {
      for (let i = 0; i < cleanHex.length; i += 4) {
        const code = parseInt(cleanHex.substr(i, 4), 16);
        if (code >= 32 && code <= 126) {
          decoded += String.fromCharCode(code);
        }
      }
    } else {
      for (let i = 0; i < cleanHex.length; i += 2) {
        const code = parseInt(cleanHex.substr(i, 2), 16);
        if (code >= 32 && code <= 126) {
          decoded += String.fromCharCode(code);
        }
      }
    }
    return decoded ? ` ${decoded} ` : '';
  });
}

function decodePdfString(str: string): string {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

/**
 * Extracts clean text from PDF Uint8Array bytes
 */
export function extractTextFromPdfBytes(uint8: Uint8Array): string {
  let fullText = '';
  
  let rawStr = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    const chunk = uint8.subarray(i, i + chunkSize);
    rawStr += String.fromCharCode.apply(null, chunk as any);
  }
  fullText += rawStr + ' ';

  // Decode any hex sequences in rawStr
  try {
    fullText += decodeHexPdf(rawStr) + ' ';
  } catch (e) {}

  // Extract URI and mailto links from raw PDF dictionary
  const uriRegex = /\/URI\s*\(([^)]+)\)/gi;
  let uMatch;
  while ((uMatch = uriRegex.exec(rawStr)) !== null) {
    fullText += ' ' + decodePdfString(uMatch[1]) + ' ';
  }

  // Raw mailto matches
  const rawMailMatches = rawStr.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
  for (const rm of rawMailMatches) {
    fullText += ' ' + rm + ' ';
  }

  let pos = 0;
  while ((pos = rawStr.indexOf('stream', pos)) !== -1) {
    let start = pos + 6;
    if (rawStr[start] === '\r') start++;
    if (rawStr[start] === '\n') start++;
    
    const end = rawStr.indexOf('endstream', start);
    if (end === -1) break;

    const streamBytes = uint8.subarray(start, end);
    try {
      const decompressed = pako.inflate(streamBytes);
      let decompStr = '';
      for (let j = 0; j < decompressed.length; j += chunkSize) {
        decompStr += String.fromCharCode.apply(null, decompressed.subarray(j, j + chunkSize) as any);
      }
      fullText += decodeHexPdf(decompStr) + ' ' + decodePdfString(decompStr) + ' ';
      const strEmails = decompStr.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
      for (const se of strEmails) {
        fullText += ' ' + se + ' ';
      }
    } catch (e) {
      try {
        const decompressedRaw = pako.inflateRaw(streamBytes);
        let decompStr = '';
        for (let j = 0; j < decompressedRaw.length; j += chunkSize) {
          decompStr += String.fromCharCode.apply(null, decompressedRaw.subarray(j, j + chunkSize) as any);
        }
        fullText += decodeHexPdf(decompStr) + ' ' + decodePdfString(decompStr) + ' ';
        const strEmails = decompStr.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
        for (const se of strEmails) {
          fullText += ' ' + se + ' ';
        }
      } catch (e2) {}
    }

    pos = end + 9;
  }

  let extractedLiterals = '';
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let tjMatch;
  while ((tjMatch = tjRegex.exec(fullText)) !== null) {
    extractedLiterals += ' ' + decodePdfString(tjMatch[1]);
  }

  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/gi;
  let arrMatch;
  while ((arrMatch = arrayTjRegex.exec(fullText)) !== null) {
    const inner = arrMatch[1];
    const subMatch = inner.match(/\(([^)]+)\)/g);
    if (subMatch) {
      extractedLiterals += ' ' + subMatch.map(s => decodePdfString(s.slice(1, -1))).join('');
    }
  }

  return `${fullText} \n ${extractedLiterals}`;
}

export async function parseResumeDocument(file: { uri: string; name?: string }): Promise<ExtractedResumeData> {
  const result: ExtractedResumeData = {};
  let extractedPdfText = '';

  if (file.uri) {
    try {
      const base64 = await convertUriToBase64(file.uri);
      if (base64) {
        const uint8 = base64ToUint8Array(base64);
        if (uint8 && uint8.length > 0) {
          extractedPdfText = extractTextFromPdfBytes(uint8);
        }
      }
    } catch (e) {
      console.warn('PDF Base64 byte decompression warning:', e);
    }
  }

  const combinedSearchText = `${file.name || ''} \n ${extractedPdfText}`;
  const lowerText = combinedSearchText.toLowerCase();

  // 1. Extract Email Address (Exhaustive Search)
  const emailCandidates: string[] = [];

  // Match standard emails and mailto: links
  const standardMatches = combinedSearchText.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
  emailCandidates.push(...standardMatches);

  // Token-level scan for any word containing @ and a dot
  const allTokens = combinedSearchText.split(/[\s\r\n\t,;"'<>()[\]{}]+/);
  for (const tok of allTokens) {
    if (tok.includes('@') && tok.includes('.')) {
      const cleanTok = tok.replace(/^[^\w+]+|[^\w]+$/g, '');
      const parts = cleanTok.split('@');
      if (parts.length === 2 && parts[0].length >= 1 && parts[1].length >= 4 && parts[1].includes('.')) {
        emailCandidates.push(cleanTok);
      }
    }
  }

  // Match spaced emails (e.g. name @ domain . com or n a m e @ g m a i l . c o m)
  const spacedRegex = /([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,10})/gi;
  let spMatch;
  while ((spMatch = spacedRegex.exec(combinedSearchText)) !== null) {
    if (spMatch[1] && spMatch[2] && spMatch[3]) {
      emailCandidates.push(`${spMatch[1].replace(/\s+/g, '')}@${spMatch[2].replace(/\s+/g, '')}.${spMatch[3].replace(/\s+/g, '')}`);
    }
  }

  // Match email labeled lines (e.g. Email: user@domain.com)
  const labeledEmailRegex = /(?:email|e-mail|mail)\s*[:\-\s]\s*([^\s\r\n<>]+@[^\s\r\n<>]+)/gi;
  let lblMatch;
  while ((lblMatch = labeledEmailRegex.exec(combinedSearchText)) !== null) {
    if (lblMatch[1]) {
      emailCandidates.push(lblMatch[1].replace(/[^a-zA-Z0-9._%+-@]/g, ''));
    }
  }

  // Select first valid non-system email (Strict ASCII validation)
  for (const rawEmail of emailCandidates) {
    const clean = rawEmail.toLowerCase().trim().replace(/^mailto:/i, '').replace(/^[^\w+]+/, '').replace(/[^\w]+$/, '');
    if (isValidEmailAddress(clean)) {
      result.email = clean;
      break;
    }
  }

  // 2. Extract Mobile Number (10 digits starting with 6,7,8,9)
  const phoneCandidates = combinedSearchText.match(/(?:(?:\+?91|0091|0)[\s.-]?)?(?:\(?\+?91\)?)?[\s.-]?([6-9][0-9\s.-]{8,14}[0-9])/g) || [];
  for (const cand of phoneCandidates) {
    const digits = cand.replace(/\D/g, '');
    let clean = '';
    if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
      clean = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
      clean = digits.slice(1);
    } else if (digits.length === 10 && /^[6-9]/.test(digits)) {
      clean = digits;
    }
    if (clean) {
      result.phone = clean;
      break;
    }
  }

  if (!result.phone) {
    const raw10Regex = /\b([6-9]\d{9})\b/g;
    const rawMatch = raw10Regex.exec(combinedSearchText);
    if (rawMatch && rawMatch[1]) {
      result.phone = rawMatch[1];
    }
  }

  // 3. Extract Date of Birth (DOB)
  const dobMatch = combinedSearchText.match(/\b(?:DOB|D\.O\.B|Date\s+of\s+Birth|Birth\s+Date|Born)[\s:-]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4})\b/i);
  if (dobMatch && dobMatch[1]) {
    try {
      const rawDob = dobMatch[1].trim();
      const dateParts = rawDob.split(/[\/\-\.]/);
      if (dateParts.length === 3) {
        let [d, m, y] = dateParts;
        if (y.length === 2) y = parseInt(y, 10) > 40 ? `19${y}` : `20${y}`;
        const day = d.padStart(2, '0');
        const month = m.padStart(2, '0');
        result.dateOfBirth = `${y}-${month}-${day}`;
      } else {
        const parsedD = new Date(rawDob);
        if (!isNaN(parsedD.getTime())) {
          result.dateOfBirth = parsedD.toISOString().split('T')[0];
        }
      }
    } catch {
      // ignore date parse errors
    }
  }

  // 4. Extract City (Multi-tier search)
  const normalizedCityText = ` ${lowerText.replace(/[^a-z0-9]/g, ' ')} `;

  // Tier 1: Look for city near explicit location keywords
  const locationKeywordRegex = /(?:location|city|address|current\s*city|residence|based\s*in|native|hometown|residing\s*in|place)\s*[:\-\s]+([a-z\s]{3,30})/gi;
  let locMatch;
  while ((locMatch = locationKeywordRegex.exec(lowerText)) !== null) {
    const snippet = ` ${locMatch[1].replace(/[^a-z0-9]/g, ' ')} `;
    for (const city of POPULAR_CITIES) {
      if (snippet.includes(` ${city.toLowerCase()} `)) {
        result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
        break;
      }
    }
    if (result.city) break;
    for (const city of ALL_CITIES) {
      if (snippet.includes(` ${city.toLowerCase()} `)) {
        result.city = city;
        break;
      }
    }
    if (result.city) break;
  }

  // Tier 2: Check POPULAR_CITIES across whole resume
  if (!result.city) {
    for (const city of POPULAR_CITIES) {
      const cityKey = ` ${city.toLowerCase()} `;
      if (normalizedCityText.includes(cityKey)) {
        result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
        break;
      }
    }
  }

  // Tier 3: Check ALL_CITIES (sorted by length descending)
  if (!result.city) {
    const sortedAllCities = [...ALL_CITIES].sort((a, b) => b.length - a.length);
    for (const city of sortedAllCities) {
      if (city.length >= 4) {
        const cityKey = ` ${city.toLowerCase()} `;
        if (normalizedCityText.includes(cityKey)) {
          result.city = city;
          break;
        }
      }
    }
  }

  // 5. LinkedIn Profile URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = combinedSearchText.match(linkedinRegex);
  if (linkedinMatch) {
    result.linkedinUrl = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 6. Extract Work Status
  if (lowerText.includes('fresher') || lowerText.includes('articleship completed') || lowerText.includes('ca fresher')) {
    result.workStatus = 'fresher';
  } else if (lowerText.includes('years of experience') || lowerText.includes('total experience') || lowerText.includes('post qualification experience') || lowerText.includes('senior associate') || lowerText.includes('manager')) {
    result.workStatus = 'experienced';
  }

  // 7. CA Intermediate Details Extraction
  const interBothGroups1st = /\b(?:CA\s+Inter(?:mediate)?|IPCC)[\s\w,-]{0,35}\b(?:both\s+groups?|both\s+grp)[\s\w,-]{0,30}\b(?:1st|first)\s+attempt\b/i.test(combinedSearchText) ||
    /\b(?:both\s+groups?|both\s+grp)[\s\w,-]{0,30}\b(?:1st|first)\s+attempt[\s\w,-]{0,35}\b(?:CA\s+Inter(?:mediate)?|IPCC)\b/i.test(combinedSearchText);

  if (interBothGroups1st) {
    result.caInterBothGroups1stAttempt = true;
    result.caInterGroup1Attempts = '1';
    result.caInterGroup2Attempts = '1';
  }

  const interExamMatch = combinedSearchText.match(/\b(?:CA\s+Inter(?:mediate)?|IPCC)[\s:-]+(?:cleared|passed|completed)?[\s:-]*\b(Jan(?:uary)?|May|Sep(?:tember)?|Nov(?:ember)?)\b[\s,/-]+(20[12]\d)\b/i);
  if (interExamMatch) {
    const m = interExamMatch[1].slice(0, 3);
    const formattedMonth = m === 'jan' ? 'Jan' : m === 'may' ? 'May' : m === 'sep' ? 'Sep' : 'Nov';
    const y = interExamMatch[2];
    result.caInterCompletionMonth = formattedMonth;
    result.caInterCompletionYear = y;
    result.caInterGroup1Month = formattedMonth;
    result.caInterGroup1Year = y;
    if (interBothGroups1st) {
      result.caInterGroup2Month = formattedMonth;
      result.caInterGroup2Year = y;
    }
  }

  // 8. CA Final Details Extraction
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

  // 7. Extract Candidate Name (Filename prioritized with Indian surname splitter)
  const INDIAN_SURNAMES = [
    'yadav', 'sharma', 'gupta', 'verma', 'jain', 'singh', 'kumar', 'mishra', 'patel', 'shah',
    'agrawal', 'agarwal', 'chouhan', 'chauhan', 'pandey', 'tiwari', 'dubey', 'tripathi', 'shukla',
    'reddy', 'nair', 'iyer', 'menon', 'rao', 'das', 'ghosh', 'banerjee', 'mukherjee', 'chatterjee',
    'bose', 'roy', 'dutta', 'sen', 'mitra', 'joshi', 'bhat', 'bhatt', 'saxena', 'mehta', 'soni',
    'khatri', 'malhotra', 'kapoor', 'khanna', 'chopra', 'bhatia', 'sethi', 'arora', 'grover', 'garg',
    'bansal', 'mittal', 'goel', 'goyal', 'sinha', 'jha', 'thakur', 'kaur'
  ];

  const cleanFileName = (file.name || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/[0-9+()@.]/g, ' ')
    .trim();

  const fileWords = cleanFileName
    .split(/\s+/)
    .filter(w => w.length > 1 && !PDF_KEYWORDS_IGNORE.has(w.toLowerCase()));

  // Split compound names like Divyayadav -> Divya Yadav
  const expandedFileWords: string[] = [];
  for (const rawWord of fileWords) {
    const wordLower = rawWord.toLowerCase();
    let split = false;
    for (const surname of INDIAN_SURNAMES) {
      if (wordLower.endsWith(surname) && wordLower.length > surname.length + 2) {
        const first = wordLower.slice(0, wordLower.length - surname.length);
        expandedFileWords.push(first.charAt(0).toUpperCase() + first.slice(1));
        expandedFileWords.push(surname.charAt(0).toUpperCase() + surname.slice(1));
        split = true;
        break;
      }
    }
    if (!split) {
      expandedFileWords.push(rawWord);
    }
  }

  if (expandedFileWords.length >= 2) {
    result.firstName = expandedFileWords[0].charAt(0).toUpperCase() + expandedFileWords[0].slice(1).toLowerCase();
    result.lastName = expandedFileWords[1].charAt(0).toUpperCase() + expandedFileWords[1].slice(1).toLowerCase();
  } else if (expandedFileWords.length === 1) {
    result.firstName = expandedFileWords[0].charAt(0).toUpperCase() + expandedFileWords[0].slice(1).toLowerCase();
  }

  // If name not extracted from filename, scan clean PDF text lines
  if (!result.firstName) {
    const textLines = extractedPdfText
      .split(/[\r\n]+/)
      .map(l => l.replace(/[^a-zA-Z\s]/g, ' ').trim())
      .filter(l => l.length > 2 && l.length < 40);

    for (const line of textLines.slice(0, 20)) {
      const words = line.split(/\s+/).filter(w => w.length > 1 && !PDF_KEYWORDS_IGNORE.has(w.toLowerCase()));
      if (words.length >= 2 && words.length <= 3) {
        result.firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        result.lastName = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        break;
      }
    }
  }

  // Fallback name from email
  if (!result.firstName && result.email) {
    const emailPrefix = result.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim();
    const parts = emailPrefix.split(/\s+/).filter(p => p.length > 1 && !PDF_KEYWORDS_IGNORE.has(p.toLowerCase()));
    if (parts.length >= 2) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      result.lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    } else if (parts.length === 1) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  return result;
}
