import zlib from 'zlib';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
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
}

export function extractTextFromPdfBuffer(buffer: Buffer): string {
  let fullText = '';
  fullText += buffer.toString('latin1') + ' ';

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

  return fullText;
}

export function parseResumeBuffer(buffer: Buffer, originalFilename: string = ''): ParsedResumeResult {
  const result: ParsedResumeResult = {};
  const extractedPdfText = extractTextFromPdfBuffer(buffer);
  const searchPool = `${originalFilename} \n ${extractedPdfText}`;

  // 1. Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi;
  const emailMatches = searchPool.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    const validEmails = emailMatches.filter(em => 
      !em.includes('example.com') && 
      !em.includes('schema.org') && 
      !em.includes('w3.org') &&
      !em.includes('adobe.com') &&
      !em.includes('sentry.io')
    );
    if (validEmails.length > 0) {
      result.email = validEmails[0].toLowerCase().trim();
    }
  }

  // 2. Extract Phone Number (10 digits starting with 6,7,8,9)
  const phoneRegex = /(?:(?:\+91|0091|0)[\s-]?)?([6-9]\d{9})\b/g;
  let phoneMatch;
  while ((phoneMatch = phoneRegex.exec(searchPool)) !== null) {
    if (phoneMatch[1] && phoneMatch[1].length === 10) {
      result.phone = phoneMatch[1];
      break;
    }
  }

  // 3. Extract City
  const lowerSearch = searchPool.toLowerCase();
  for (const city of POPULAR_CITIES) {
    const regex = new RegExp(`\\b${city.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerSearch)) {
      result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
      break;
    }
  }

  // 4. Extract Work Status
  if (lowerSearch.includes('fresher') || lowerSearch.includes('articleship completed') || lowerSearch.includes('ca fresher')) {
    result.workStatus = 'fresher';
  } else if (lowerSearch.includes('years of experience') || lowerSearch.includes('total experience') || lowerSearch.includes('post qualification experience') || lowerSearch.includes('senior associate') || lowerSearch.includes('manager')) {
    result.workStatus = 'experienced';
  }

  // 5. Extract Candidate Name from filename
  const cleanFileName = originalFilename
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/[0-9+()@.]/g, ' ')
    .trim();

  const ignoreWords = new Set([
    'resume', 'cv', 'curriculum', 'vitae', 'biodata', 'profile', 'final', 'ca',
    'pdf', 'docx', 'doc', 'updated', 'latest', 'new', 'chartered', 'accountant',
    'fresher', 'experienced', 'draft', 'copy', 'wfh'
  ]);

  const nameWords = cleanFileName.split(/\s+/).filter(w => w.length > 1 && !ignoreWords.has(w.toLowerCase()));
  if (nameWords.length >= 2) {
    result.firstName = nameWords[0].charAt(0).toUpperCase() + nameWords[0].slice(1).toLowerCase();
    result.lastName = nameWords[1].charAt(0).toUpperCase() + nameWords[1].slice(1).toLowerCase();
  } else if (nameWords.length === 1) {
    result.firstName = nameWords[0].charAt(0).toUpperCase() + nameWords[0].slice(1).toLowerCase();
  }

  // Fallback name from email if needed
  if (!result.firstName && result.email) {
    const prefix = result.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim();
    const parts = prefix.split(/\s+/).filter(p => p.length > 1);
    if (parts.length >= 2) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      result.lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    } else if (parts.length === 1) {
      result.firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  return result;
}
