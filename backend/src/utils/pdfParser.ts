import zlib from 'zlib';
const pdfParse = require('pdf-parse');

export const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Prayagraj', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Noida', 'Gurugram', 'Gurgaon'
];

export interface ParsedResumeResult {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  workStatus?: 'fresher' | 'experienced';
  caFinalYear?: string;
  caFinalAttempts?: string;
  articleshipFirm?: string;
  linkedinUrl?: string;
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
  'designer', 'intern', 'analyst', 'consultant', 'manager', 'associate', 'lead', 'head'
]);

export function isValidEmailAddress(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/;
  if (!regex.test(clean)) return false;

  const parts = clean.split('@');
  if (parts.length !== 2) return false;
  const [username, domain] = parts;
  if (username.length < 1 || domain.length < 3) return false;

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-z]{2,10}$/.test(tld)) return false;

  const ignoreDomains = ['example.com', 'schema.org', 'w3.org', 'adobe.com', 'github.com', 'fastcareer'];
  for (const ign of ignoreDomains) {
    if (clean.includes(ign)) return false;
  }

  return true;
}

/**
 * Decompresses and extracts readable text from raw PDF buffer using zlib
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  let fullText = '';
  
  try {
    fullText += buffer.toString('latin1') + ' ';
  } catch (e) {}

  const str = buffer.toString('binary');
  let streamIndex = 0;

  while ((streamIndex = str.indexOf('stream', streamIndex)) !== -1) {
    let start = streamIndex + 6;
    if (str[start] === '\r') start++;
    if (str[start] === '\n') start++;
    const end = str.indexOf('endstream', start);
    if (end === -1) break;

    const streamBuffer = buffer.subarray(start, end);
    try {
      const decompressed = zlib.inflateSync(streamBuffer);
      fullText += decompressed.toString('latin1') + ' ';
    } catch (e) {
      try {
        const decompressedRaw = zlib.inflateRawSync(streamBuffer);
        fullText += decompressedRaw.toString('latin1') + ' ';
      } catch (e2) {}
    }
    streamIndex = end + 9;
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

export async function parseResumeBuffer(buffer: Buffer, originalFilename: string = ''): Promise<ParsedResumeResult> {
  const result: ParsedResumeResult = {};
  let extractedPdfText = '';

  // 1. Primary: Mozilla PDF.js engine
  try {
    if (pdfParse && pdfParse.PDFParse) {
      const parser = new pdfParse.PDFParse({ data: buffer });
      const data = await parser.getText();
      if (data && data.text) {
        extractedPdfText += data.text + ' ';
      }
    } else if (typeof pdfParse === 'function') {
      const pdfData = await pdfParse(buffer);
      if (pdfData && pdfData.text) {
        extractedPdfText += pdfData.text + ' ';
      }
    } else if (pdfParse && typeof pdfParse.default === 'function') {
      const pdfData = await pdfParse.default(buffer);
      if (pdfData && pdfData.text) {
        extractedPdfText += pdfData.text + ' ';
      }
    }
  } catch (pdfErr) {
    console.warn('pdfParse fallback:', pdfErr);
  }

  // 2. Secondary: Raw Stream Decompressor
  try {
    const streamText = extractTextFromPdfBuffer(buffer);
    extractedPdfText += streamText + ' ';
  } catch (streamErr) {}

  const searchPool = `${originalFilename} \n ${extractedPdfText}`;
  const lowerText = searchPool.toLowerCase();

  // 1. Extract Email Address (Multi-tier Regex)
  const emailCandidates: string[] = [];

  // Match standard emails
  const standardMatches = searchPool.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
  emailCandidates.push(...standardMatches);

  // Match mailto: links
  const mailtoMatches = searchPool.match(/mailto:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/gi) || [];
  for (const m of mailtoMatches) {
    const clean = m.replace(/^mailto:\s*/i, '');
    emailCandidates.push(clean);
  }

  // Token-level scan for any word containing @ and a dot
  const allTokens = searchPool.split(/[\s\r\n\t,;"'<>()[\]{}]+/);
  for (const tok of allTokens) {
    if (tok.includes('@') && tok.includes('.')) {
      const cleanTok = tok.replace(/^[^\w+]+|[^\w]+$/g, '');
      const parts = cleanTok.split('@');
      if (parts.length === 2 && parts[0].length >= 1 && parts[1].length >= 4 && parts[1].includes('.')) {
        emailCandidates.push(cleanTok);
      }
    }
  }

  // Match spaced emails (e.g. name @ domain . com or name.last @ domain.com)
  const spacedRegex = /([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,10})/gi;
  let spMatch;
  while ((spMatch = spacedRegex.exec(searchPool)) !== null) {
    if (spMatch[1] && spMatch[2] && spMatch[3]) {
      emailCandidates.push(`${spMatch[1].replace(/\s+/g, '')}@${spMatch[2].replace(/\s+/g, '')}.${spMatch[3].replace(/\s+/g, '')}`);
    }
  }

  // Match email labeled lines (e.g. Email: user@domain.com)
  const labeledEmailRegex = /(?:email|e-mail|mail)\s*[:\-\s]\s*([^\s\r\n<>]+@[^\s\r\n<>]+)/gi;
  let lblMatch;
  while ((lblMatch = labeledEmailRegex.exec(searchPool)) !== null) {
    if (lblMatch[1]) {
      emailCandidates.push(lblMatch[1].replace(/[^a-zA-Z0-9._%+-@]/g, ''));
    }
  }

  // Select first valid non-system email (Strict ASCII validation)
  for (const rawEmail of emailCandidates) {
    const clean = rawEmail.toLowerCase().trim().replace(/^mailto:/i, '').replace(/[),;:]+$/, '');
    if (isValidEmailAddress(clean)) {
      result.email = clean;
      break;
    }
  }

  // 2. Extract Phone Number (10 digits starting with 6,7,8,9)
  const phoneCandidates = searchPool.match(/(?:(?:\+?91|0091|0)[\s.-]?)?(?:\(?\+?91\)?)?[\s.-]?([6-9][0-9\s.-]{8,14}[0-9])/g) || [];
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
    const rawMatch = raw10Regex.exec(searchPool);
    if (rawMatch && rawMatch[1]) {
      result.phone = rawMatch[1];
    }
  }

  // 3. Extract City (Multi-tier search)
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

  // 4. LinkedIn Profile URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = searchPool.match(linkedinRegex);
  if (linkedinMatch) {
    result.linkedinUrl = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 5. Extract Work Status
  if (
    lowerText.includes('fresher') || 
    lowerText.includes('articleship completed') || 
    lowerText.includes('ca fresher') || 
    lowerText.includes('recently qualified')
  ) {
    result.workStatus = 'fresher';
  } else if (
    lowerText.includes('years of experience') || 
    lowerText.includes('yrs experience') || 
    lowerText.includes('total experience') || 
    lowerText.includes('post qualification experience') || 
    lowerText.includes('senior associate') || 
    lowerText.includes('manager')
  ) {
    result.workStatus = 'experienced';
  }

  // 6. Extract Candidate Name (Filename prioritized with Indian surname splitter)
  const INDIAN_SURNAMES = [
    'yadav', 'sharma', 'gupta', 'verma', 'jain', 'singh', 'kumar', 'mishra', 'patel', 'shah',
    'agrawal', 'agarwal', 'chouhan', 'chauhan', 'pandey', 'tiwari', 'dubey', 'tripathi', 'shukla',
    'reddy', 'nair', 'iyer', 'menon', 'rao', 'das', 'ghosh', 'banerjee', 'mukherjee', 'chatterjee',
    'bose', 'roy', 'dutta', 'sen', 'mitra', 'joshi', 'bhat', 'bhatt', 'saxena', 'mehta', 'soni',
    'khatri', 'malhotra', 'kapoor', 'khanna', 'chopra', 'bhatia', 'sethi', 'arora', 'grover', 'garg',
    'bansal', 'mittal', 'goel', 'goyal', 'sinha', 'jha', 'thakur', 'kaur'
  ];

  const cleanFileName = originalFilename
    .replace(/\.[^/.]+$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
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
    const singleWord = fileWords[0].toLowerCase();
    let splitDone = false;
    for (const surname of INDIAN_SURNAMES) {
      if (singleWord.endsWith(surname) && singleWord.length > surname.length + 2) {
        const first = singleWord.slice(0, singleWord.length - surname.length);
        result.firstName = first.charAt(0).toUpperCase() + first.slice(1);
        result.lastName = surname.charAt(0).toUpperCase() + surname.slice(1);
        splitDone = true;
        break;
      }
    }
    if (!splitDone) {
      result.firstName = fileWords[0].charAt(0).toUpperCase() + fileWords[0].slice(1).toLowerCase();
    }
  }

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
    const prefix = result.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim();
    const parts = prefix.split(/\s+/).filter(p => p.length > 1 && !PDF_KEYWORDS_IGNORE.has(p.toLowerCase()));
    if (parts.length >= 2) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      result.lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    } else if (parts.length === 1) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  return result;
}
