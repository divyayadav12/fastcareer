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
  'px', 'cm', 'inch', 'mm', 'rgb', 'cmyk', 'gray', 'scale', 'view', 'rect', 'box'
]);

/**
 * Fetch raw ArrayBuffer from local content:// or file:// URI via XMLHttpRequest
 */
export const readUriAsArrayBuffer = (uri: string): Promise<ArrayBuffer | null> => {
  return new Promise((resolve) => {
    try {
      if (!uri) return resolve(null);
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response as ArrayBuffer);
      };
      xhr.onerror = function () {
        resolve(null);
      };
      xhr.open('GET', uri);
      xhr.responseType = 'arraybuffer';
      xhr.send();
    } catch {
      resolve(null);
    }
  });
};

/**
 * Extracts clean text from PDF ArrayBuffer
 */
export function extractTextFromPdfArrayBuffer(arrayBuffer: ArrayBuffer): string {
  let fullText = '';
  const uint8 = new Uint8Array(arrayBuffer);
  
  let rawStr = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    const chunk = uint8.subarray(i, i + chunkSize);
    rawStr += String.fromCharCode.apply(null, chunk as any);
  }
  fullText += rawStr + ' ';

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
      fullText += decompStr + ' ';
    } catch (e) {
      try {
        const decompressedRaw = pako.inflateRaw(streamBytes);
        let decompStr = '';
        for (let j = 0; j < decompressedRaw.length; j += chunkSize) {
          decompStr += String.fromCharCode.apply(null, decompressedRaw.subarray(j, j + chunkSize) as any);
        }
        fullText += decompStr + ' ';
      } catch (e2) {}
    }

    pos = end + 9;
  }

  let extractedLiterals = '';
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let tjMatch;
  while ((tjMatch = tjRegex.exec(fullText)) !== null) {
    extractedLiterals += ' ' + tjMatch[1];
  }

  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/gi;
  let arrMatch;
  while ((arrMatch = arrayTjRegex.exec(fullText)) !== null) {
    const inner = arrMatch[1];
    const subMatch = inner.match(/\(([^)]+)\)/g);
    if (subMatch) {
      extractedLiterals += ' ' + subMatch.map(s => s.slice(1, -1)).join('');
    }
  }

  return `${fullText} \n ${extractedLiterals}`;
}

export async function parseResumeDocument(file: { uri: string; name?: string }): Promise<ExtractedResumeData> {
  const result: ExtractedResumeData = {};
  let extractedPdfText = '';

  if (file.uri) {
    try {
      const arrayBuffer = await readUriAsArrayBuffer(file.uri);
      if (arrayBuffer) {
        extractedPdfText = extractTextFromPdfArrayBuffer(arrayBuffer);
      }
    } catch (e) {
      console.warn('PDF ArrayBuffer decompression warning:', e);
    }
  }

  const combinedSearchText = `${file.name || ''} \n ${extractedPdfText}`;
  const lowerText = combinedSearchText.toLowerCase();

  // 1. Extract Email Address
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi;
  const emailMatches = combinedSearchText.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    const validEmails = emailMatches.filter(em => 
      !em.toLowerCase().includes('example.com') && 
      !em.toLowerCase().includes('schema.org') && 
      !em.toLowerCase().includes('w3.org') && 
      !em.toLowerCase().includes('adobe.com') &&
      !em.toLowerCase().includes('github.com')
    );
    if (validEmails.length > 0) {
      result.email = validEmails[0].toLowerCase().trim();
    }
  }

  // Space-separated email fallback: name @ domain . com
  if (!result.email) {
    const spacedEmailRegex = /([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,6})/i;
    const spMatch = combinedSearchText.match(spacedEmailRegex);
    if (spMatch && spMatch[1] && spMatch[2] && spMatch[3]) {
      const reconstructed = `${spMatch[1]}@${spMatch[2]}.${spMatch[3]}`.toLowerCase();
      if (!reconstructed.includes('example.com') && !reconstructed.includes('schema.org')) {
        result.email = reconstructed;
      }
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

  // 7. Extract Candidate Name (Filename prioritized if valid 2-word name, then text lines)
  const cleanFileName = (file.name || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/[0-9+()@.]/g, ' ')
    .trim();

  const fileWords = cleanFileName
    .split(/\s+/)
    .filter(w => w.length > 1 && !PDF_KEYWORDS_IGNORE.has(w.toLowerCase()));

  if (fileWords.length >= 2) {
    result.firstName = fileWords[0].charAt(0).toUpperCase() + fileWords[0].slice(1).toLowerCase();
    result.lastName = fileWords[1].charAt(0).toUpperCase() + fileWords[1].slice(1).toLowerCase();
  } else if (fileWords.length === 1) {
    result.firstName = fileWords[0].charAt(0).toUpperCase() + fileWords[0].slice(1).toLowerCase();
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
