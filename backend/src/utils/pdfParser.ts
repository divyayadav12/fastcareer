import zlib from 'zlib';

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
  'px', 'cm', 'inch', 'mm', 'rgb', 'cmyk', 'gray', 'scale', 'view', 'rect', 'box'
]);

/**
 * Decompresses and extracts readable text from raw PDF buffer
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

export function parseResumeBuffer(buffer: Buffer, originalFilename: string = ''): ParsedResumeResult {
  const result: ParsedResumeResult = {};
  const extractedPdfText = extractTextFromPdfBuffer(buffer);
  
  const searchPool = `${originalFilename} \n ${extractedPdfText}`;
  const lowerText = searchPool.toLowerCase();

  // 1. Extract Email Address
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi;
  const emailMatches = searchPool.match(emailRegex);
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
    const spMatch = searchPool.match(spacedEmailRegex);
    if (spMatch && spMatch[1] && spMatch[2] && spMatch[3]) {
      const reconstructed = `${spMatch[1]}@${spMatch[2]}.${spMatch[3]}`.toLowerCase();
      if (!reconstructed.includes('example.com') && !reconstructed.includes('schema.org')) {
        result.email = reconstructed;
      }
    }
  }

  // 2. Extract Phone Number (10 digits starting with 6,7,8,9)
  const phoneRegex = /(?:(?:\+?91|0091|0)[\s.-]?)?([6-9]\d{4}[\s.-]?\d{5})\b/g;
  let phoneMatch = phoneRegex.exec(searchPool);
  if (phoneMatch && phoneMatch[1]) {
    const cleanDigits = phoneMatch[1].replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      result.phone = cleanDigits;
    }
  }

  if (!result.phone) {
    const raw10Regex = /\b([6-9]\d{9})\b/g;
    const rawMatch = raw10Regex.exec(searchPool);
    if (rawMatch && rawMatch[1]) {
      result.phone = rawMatch[1];
    }
  }

  // 3. Extract City
  for (const city of POPULAR_CITIES) {
    const regex = new RegExp(`\\b${city.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerText)) {
      result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
      break;
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

  // 6. Extract Candidate Name (Filename prioritized if valid 2-word name)
  const cleanFileName = originalFilename
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
