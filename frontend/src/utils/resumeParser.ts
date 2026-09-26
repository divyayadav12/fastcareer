import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';
import { ALL_CITIES, STATE_CITY_MAP } from './constants';

// Configure pdfjs worker locally via Vite asset pipeline
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  linkedinUrl?: string;
  workStatus?: 'fresher' | 'experienced';

  // Extended Profile Details
  alternatePhone?: string;
  currentAddress?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Unmarried' | 'Married';

  // CA Portfolio
  isFresherCA?: boolean;
  big4Articleship?: 'Yes' | 'No';
  articleshipFirm?: string;
  articleshipCity?: string;
  natureOfWork?: string;
  industrialTrainee?: 'Yes' | 'No';
  gmcsCompleted?: 'Yes' | 'No';
  caInterYear?: string;
  caFinalYear?: string;

  // CA Final Details
  caFinalBothGroups1stAttempt?: boolean;
  caFinalGroup1Attempts?: string;
  caFinalGroup1Month?: string;
  caFinalGroup1Year?: string;
  caFinalGroup2Attempts?: string;
  caFinalGroup2Month?: string;
  caFinalGroup2Year?: string;
  caFinalRanker?: string;
  caFinalCompletionMonth?: string;
  caFinalCompletionYear?: string;

  // CA Intermediate Details
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

  // Education
  graduationCollege?: string;
  graduationYear?: string;
  graduationPercentage?: string;
  class12Percentage?: string;
  class12Year?: string;
  class12Board?: string;
  class10Percentage?: string;
  class10Year?: string;
  class10Board?: string;

  // Experience
  isExperienced?: boolean;
  experienceYears?: string;
  currentCompanyName?: string;
  currentDesignation?: string;
  workProfile?: string;
}

const COMMON_NON_NAMES = new Set([
  'resume', 'curriculum', 'vitae', 'cv', 'biodata', 'profile', 'contact',
  'email', 'phone', 'mobile', 'address', 'page', 'career', 'objective',
  'summary', 'experience', 'education', 'skills', 'declaration', 'personal'
]);

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Chennai', 'Jaipur', 'Indore', 'Chandigarh', 'Lucknow',
  'Surat', 'Noida', 'Gurgaon', 'Gurugram', 'Bhopal', 'Vadodara', 'Kanpur',
  'Nagpur', 'Coimbatore', 'Kochi', 'Visakhapatnam', 'Patna', 'Thane', 'Navi Mumbai'
];

/**
 * Extract raw text from a PDF file
 */
export async function extractTextFromPdf(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  const maxPages = Math.min(pdf.numPages, 5);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ');
    fullText += '\n' + pageText;
  }

  return fullText;
}

/**
 * Extract raw text from a DOCX file using JSZip
 */
export async function extractTextFromDocx(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docXml = await zip.file('word/document.xml')?.async('text');
  if (!docXml) return '';
  return docXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Intelligent entity extraction from resume text for both registration & full profile
 */
export function parseResumeText(rawText: string): ParsedResumeData {
  const result: ParsedResumeData = {};
  if (!rawText || !rawText.trim()) return result;

  const cleanText = rawText.replace(/\r\n/g, '\n');

  // 1. Email Extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = cleanText.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[1].toLowerCase().trim();
  }

  // 2. Phone Extraction (Indian 10-digit mobile)
  const phoneMatches = cleanText.matchAll(/(?:(?:\+?91|0)[\s.-]?)?([6-9]\d{4}[\s.-]?\d{5})\b/g);
  const phonesFound: string[] = [];
  for (const match of phoneMatches) {
    const digits = match[1].replace(/\D/g, '');
    if (digits.length === 10 && !phonesFound.includes(digits)) {
      phonesFound.push(digits);
    }
  }
  if (phonesFound.length > 0) {
    result.phone = phonesFound[0];
  }
  if (phonesFound.length > 1) {
    result.alternatePhone = phonesFound[1];
  }

  // 3. LinkedIn Profile URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = cleanText.match(linkedinRegex);
  if (linkedinMatch) {
    result.linkedinUrl = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 4. City & State Extraction
  for (const city of POPULAR_CITIES) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(cleanText)) {
      result.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurugram' ? 'Gurgaon' : city;
      break;
    }
  }
  if (!result.city) {
    for (const city of ALL_CITIES) {
      if (city.length > 3) {
        const regex = new RegExp(`\\b${city}\\b`, 'i');
        if (regex.test(cleanText)) {
          result.city = city;
          break;
        }
      }
    }
  }

  // Auto-find state for the detected city
  if (result.city) {
    for (const [stateName, cities] of Object.entries(STATE_CITY_MAP)) {
      if (cities.some(c => c.toLowerCase() === result.city?.toLowerCase())) {
        result.state = stateName;
        break;
      }
    }
  }

  // 5. Name Extraction
  const lines = cleanText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && l.length < 60);

  let candidateName = '';

  // Explicit Name: pattern
  const explicitNameMatch = cleanText.match(/\b(?:Name|Candidate Name|Full Name)[\s:-]+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){1,3})\b/i);
  if (explicitNameMatch) {
    candidateName = explicitNameMatch[1].trim();
  }

  if (!candidateName) {
    for (const line of lines.slice(0, 8)) {
      if (line.includes('@') || /(?:\+?91|\d{5})/i.test(line)) continue;
      if (COMMON_NON_NAMES.has(line.toLowerCase())) continue;
      
      // Remove prefixes like CA, Mr., Ms., Mrs., Dr.
      const sanitizedLine = line.replace(/^(?:CA\s+|Mr\.\s+|Ms\.\s+|Mrs\.\s+|Dr\.\s+)/i, '').trim();
      const words = sanitizedLine.split(/\s+/).filter(w => /^[a-zA-Z.'-]+$/.test(w));
      if (words.length >= 2 && words.length <= 4) {
        const isHeaderWord = words.some(w => COMMON_NON_NAMES.has(w.toLowerCase()));
        if (!isHeaderWord) {
          candidateName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          break;
        }
      }
    }
  }

  if (!candidateName && result.email) {
    const prefix = result.email.split('@')[0];
    const parts = prefix.split(/[._-]/).filter(p => p.length > 1 && /^[a-zA-Z]+$/.test(p));
    if (parts.length >= 2) {
      candidateName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    } else if (parts.length === 1 && parts[0].length >= 3) {
      candidateName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }

  if (candidateName) {
    const nameParts = candidateName.split(' ');
    result.firstName = nameParts[0];
    result.lastName = nameParts.slice(1).join(' ') || '';
  }

  // 6. Comprehensive Date of Birth (DOB) Extraction
  const MONTH_MAP: Record<string, string> = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', sept: '09', september: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12'
  };

  const parseRawDateToIso = (raw: string): string | undefined => {
    if (!raw) return undefined;
    const str = raw.trim().replace(/[,]/g, ' ').replace(/\s+/g, ' ');

    // 1. YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
    const ymdMatch = str.match(/\b(19\d{2}|20\d{2})[\/\-.](0?[1-9]|1[0-2])[\/\-.](0?[1-9]|[12]\d|3[01])\b/);
    if (ymdMatch) {
      const y = ymdMatch[1];
      const m = ymdMatch[2].padStart(2, '0');
      const d = ymdMatch[3].padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    // 2. DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    const dmyMatch = str.match(/\b(0?[1-9]|[12]\d|3[01])[\/\-.](0?[1-9]|1[0-2])[\/\-.](19\d{2}|20\d{2})\b/);
    if (dmyMatch) {
      const d = dmyMatch[1].padStart(2, '0');
      const m = dmyMatch[2].padStart(2, '0');
      const y = dmyMatch[3];
      return `${y}-${m}-${d}`;
    }

    // 3. DD-MM-YY or DD/MM/YY (2-digit year)
    const dmy2Match = str.match(/\b(0?[1-9]|[12]\d|3[01])[\/\-.](0?[1-9]|1[0-2])[\/\-.](\d{2})\b/);
    if (dmy2Match) {
      const d = dmy2Match[1].padStart(2, '0');
      const m = dmy2Match[2].padStart(2, '0');
      const yr = parseInt(dmy2Match[3], 10);
      const y = yr > 40 ? `19${yr}` : `20${yr < 10 ? '0' + yr : yr}`;
      return `${y}-${m}-${d}`;
    }

    // 4. DD [MonthName] YYYY (e.g. 14th May 1998, 14-May-1998, 14 May 1998)
    const textMonthMatch1 = str.match(/\b(0?[1-9]|[12]\d|3[01])(?:st|nd|rd|th)?[\s\/\-.\\-]+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|sept|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[\s\/\-.\\-]+(19\d{2}|20\d{2}|\d{2})\b/i);
    if (textMonthMatch1) {
      const d = textMonthMatch1[1].padStart(2, '0');
      const mStr = textMonthMatch1[2].toLowerCase();
      const m = MONTH_MAP[mStr] || '01';
      let yr = textMonthMatch1[3];
      if (yr.length === 2) {
        const yrNum = parseInt(yr, 10);
        yr = yrNum > 40 ? `19${yrNum}` : `20${yrNum < 10 ? '0' + yrNum : yrNum}`;
      }
      return `${yr}-${m}-${d}`;
    }

    // 5. [MonthName] DD, YYYY (e.g. May 14, 1998 or May 14th 1998)
    const textMonthMatch2 = str.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|sept|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[\s\/\-.\\-]+(0?[1-9]|[12]\d|3[01])(?:st|nd|rd|th)?[\s\/\-.\\-]+(19\d{2}|20\d{2}|\d{2})\b/i);
    if (textMonthMatch2) {
      const mStr = textMonthMatch2[1].toLowerCase();
      const m = MONTH_MAP[mStr] || '01';
      const d = textMonthMatch2[2].padStart(2, '0');
      let yr = textMonthMatch2[3];
      if (yr.length === 2) {
        const yrNum = parseInt(yr, 10);
        yr = yrNum > 40 ? `19${yrNum}` : `20${yrNum < 10 ? '0' + yrNum : yrNum}`;
      }
      return `${yr}-${m}-${d}`;
    }

    return undefined;
  };

  // Check labeled DOB patterns
  const dobRegex = /(?:date\s+of\s+birth|d\.?\s*o\.?\s*b\.?|birth\s*date|birthdate|born(?:\s+on)?)\s*[:=\-]?\s*([^\n\r;|]{3,40})/gi;
  let dobMatch: RegExpExecArray | null;
  while ((dobMatch = dobRegex.exec(cleanText)) !== null) {
    const isoDate = parseRawDateToIso(dobMatch[1]);
    if (isoDate) {
      result.dateOfBirth = isoDate;
      break;
    }
  }

  // Fallback: check inside Personal Details / Biodata section
  if (!result.dateOfBirth) {
    const personalSectionMatch = cleanText.match(/(?:personal\s+(?:details|profile|information)|biodata|bio\s+data)[\s\S]{0,500}/i);
    if (personalSectionMatch) {
      const isoDate = parseRawDateToIso(personalSectionMatch[0]);
      if (isoDate) {
        result.dateOfBirth = isoDate;
      }
    }
  }

  // 7. Gender
  const genderMatch = cleanText.match(/\b(?:Gender|Sex)[\s:-]+(Male|Female|Other)\b/i);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    result.gender = g.startsWith('f') ? 'Female' : 'Male';
  }

  // 8. Marital Status
  const maritalMatch = cleanText.match(/\b(?:Marital Status)[\s:-]+(Married|Unmarried|Single)\b/i);
  if (maritalMatch) {
    const m = maritalMatch[1].toLowerCase();
    result.maritalStatus = m === 'married' ? 'Married' : 'Unmarried';
  }

  // 9. Work Status & CA Portfolio Analysis
  const lower = cleanText.toLowerCase();
  const fresherScore = (lower.match(/\b(fresher|semi-qualified|semi qualified|articleship|recent pass|fresher ca|student|articleship completed)\b/g) || []).length;
  const expScore = (lower.match(/\b(years of experience|yrs exp|senior associate|assistant manager|deputy manager|manager|post qualification)\b/g) || []).length;

  if (fresherScore > expScore) {
    result.workStatus = 'fresher';
    result.isFresherCA = true;
    result.isExperienced = false;
  } else if (expScore > 0) {
    result.workStatus = 'experienced';
    result.isFresherCA = false;
    result.isExperienced = true;
  }

  // Big 4 Articleship Detection
  const big4Keywords = ['deloitte', 'pwc', 'pricewaterhousecoopers', 'ey', 'ernst & young', 'kpmg'];
  const hasBig4 = big4Keywords.some(b => lower.includes(b));
  if (hasBig4) {
    result.big4Articleship = 'Yes';
    if (lower.includes('deloitte')) result.articleshipFirm = 'Deloitte';
    else if (lower.includes('pwc') || lower.includes('pricewaterhousecoopers')) result.articleshipFirm = 'PwC';
    else if (lower.includes('ey') || lower.includes('ernst & young')) result.articleshipFirm = 'EY';
    else if (lower.includes('kpmg')) result.articleshipFirm = 'KPMG';
  } else {
    // Non-big 4 firm detection
    const firmMatch = cleanText.match(/\b(?:Articleship|Articled Assistant|Article Trainee)\s+(?:at|in|with)?\s*([A-Z][A-Za-z\s&.]{3,35}(?:LLP|& Co|and Co|Associates)?)\b/i);
    if (firmMatch && firmMatch[1].length < 40) {
      result.articleshipFirm = firmMatch[1].trim();
    }
  }

  // Nature of Work in Articleship
  const auditTypes: string[] = [];
  if (lower.includes('statutory audit')) auditTypes.push('Statutory Audit');
  if (lower.includes('tax audit') || lower.includes('direct tax')) auditTypes.push('Tax Audit / Direct Tax');
  if (lower.includes('internal audit')) auditTypes.push('Internal Audit');
  if (lower.includes('gst') || lower.includes('indirect tax')) auditTypes.push('GST / Indirect Tax');
  if (lower.includes('transfer pricing')) auditTypes.push('Transfer Pricing');
  if (lower.includes('financial reporting') || lower.includes('ind as')) auditTypes.push('Ind AS / Reporting');
  if (auditTypes.length > 0) {
    result.natureOfWork = auditTypes.join(', ');
  }

  if (lower.includes('industrial trainee') || lower.includes('industrial training')) {
    result.industrialTrainee = 'Yes';
  }
  if (lower.includes('gmcs')) {
    result.gmcsCompleted = 'Yes';
  }

  // CA Final Examination Parsing
  const caFinalBothGroups = /\b(?:both\s+groups?|both\s+grp)[\s\w,-]{0,30}\b(?:1st|first)\s+attempt\b/i.test(cleanText) ||
    /\b(?:1st|first)\s+attempt[\s\w,-]{0,30}\b(?:both\s+groups?|both\s+grp)\b/i.test(cleanText) ||
    /\bcleared\s+both\s+groups?\s+in\s+(?:1st|first)\s+attempt\b/i.test(cleanText);

  if (caFinalBothGroups) {
    result.caFinalBothGroups1stAttempt = true;
    result.caFinalGroup1Attempts = '1';
    result.caFinalGroup2Attempts = '1';
  }

  const normalizeExamMonth = (mStr: string) => {
    const m = mStr.toLowerCase().slice(0, 3);
    if (m === 'jan') return 'Jan';
    if (m === 'may') return 'May';
    if (m === 'sep') return 'Sep';
    if (m === 'nov') return 'Nov';
    return m.charAt(0).toUpperCase() + m.slice(1, 3);
  };

  // CA Final exam session match (e.g. "CA Final: May 2023" or "Chartered Accountant (Nov 2022)")
  const finalExamMatch = cleanText.match(/\b(?:CA\s+Final|Chartered\s+Accountan(?:cy|t)\s+Final|ICAI\s+Final|Chartered\s+Accountant)[\s:-]+(?:cleared|passed|completed)?[\s:-]*\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s,/-]+(20[12]\d)\b/i) ||
    cleanText.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s,/-]+(20[12]\d)[^\n]{0,60}\b(?:CA\s+Final|Chartered\s+Accountan(?:cy|t))\b/i);

  if (finalExamMatch) {
    const m = normalizeExamMonth(finalExamMatch[1]);
    const y = finalExamMatch[2];
    result.caFinalYear = y;
    result.caFinalCompletionMonth = m;
    result.caFinalCompletionYear = y;
    result.caFinalGroup1Month = m;
    result.caFinalGroup1Year = y;
    if (caFinalBothGroups) {
      result.caFinalGroup2Month = m;
      result.caFinalGroup2Year = y;
    }
  } else {
    const finalYearOnly = cleanText.match(/\b(?:CA\s+Final|ICAI\s+Final)[\s:-]+(?:cleared|passed|completed)?[\s:-]*(20[12]\d)\b/i);
    if (finalYearOnly) {
      result.caFinalYear = finalYearOnly[1];
      result.caFinalCompletionYear = finalYearOnly[1];
      result.caFinalGroup1Year = finalYearOnly[1];
      if (caFinalBothGroups) result.caFinalGroup2Year = finalYearOnly[1];
    }
  }

  // Check group 1 & group 2 specific attempts
  const g1AttemptMatch = cleanText.match(/\b(?:Group\s*(?:1|I)|Grp\s*(?:1|I))[^\n]{0,40}\b(\d+)(?:st|nd|rd|th)?\s+attempt\b/i);
  if (g1AttemptMatch) {
    result.caFinalGroup1Attempts = g1AttemptMatch[1];
  }
  const g2AttemptMatch = cleanText.match(/\b(?:Group\s*(?:2|II)|Grp\s*(?:2|II))[^\n]{0,40}\b(\d+)(?:st|nd|rd|th)?\s+attempt\b/i);
  if (g2AttemptMatch) {
    result.caFinalGroup2Attempts = g2AttemptMatch[1];
  }

  if (!result.caFinalGroup1Attempts) {
    const generalAttemptMatch = cleanText.match(/\b(?:CA\s+Final|Final)[^\n]{0,40}\b(\d+)(?:st|nd|rd|th)?\s+attempt\b/i);
    if (generalAttemptMatch) {
      result.caFinalGroup1Attempts = generalAttemptMatch[1];
      if (!result.caFinalGroup2Attempts) result.caFinalGroup2Attempts = generalAttemptMatch[1];
    }
  }

  // CA Final Ranker check
  const rankMatch = cleanText.match(/\b(?:AIR|All\s+India\s+Rank|Rank)[\s:-]*(\d{1,3})\b/i);
  if (rankMatch && !cleanText.toLowerCase().includes('graduation rank')) {
    result.caFinalRanker = 'Yes';
  } else {
    result.caFinalRanker = 'No';
  }

  // CA Intermediate / IPCC Details Parsing
  const caInterBothGroups = /\b(?:CA\s+Inter(?:mediate)?|IPCC|PCC)[\s\w,-]{0,30}\b(?:both\s+groups?|both\s+grp)[\s\w,-]{0,30}\b(?:1st|first)\s+attempt\b/i.test(cleanText) ||
    /\b(?:CA\s+Inter(?:mediate)?|IPCC|PCC)[^\n]{0,50}\b(?:1st|first)\s+attempt\b/i.test(cleanText) ||
    /\b(?:IPCC|Intermediate)\s*:\s*Cleared\s+Both\s+Groups\s+in\s+1st\s+Attempt\b/i.test(cleanText);

  if (caInterBothGroups) {
    result.caInterBothGroups1stAttempt = true;
    result.caInterGroup1Attempts = '1';
    result.caInterGroup2Attempts = '1';
  }

  const interExamMatch = cleanText.match(/\b(?:CA\s+Inter(?:mediate)?|IPCC|PCC)[\s:-]+(?:cleared|passed|completed)?[\s:-]*\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s,/-]+(20[12]\d)\b/i) ||
    cleanText.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s,/-]+(20[12]\d)[^\n]{0,60}\b(?:CA\s+Inter(?:mediate)?|IPCC)\b/i);

  if (interExamMatch) {
    const m = normalizeExamMonth(interExamMatch[1]);
    const y = interExamMatch[2];
    result.caInterYear = y;
    result.caInterCompletionMonth = m;
    result.caInterCompletionYear = y;
    result.caInterGroup1Month = m;
    result.caInterGroup1Year = y;
    if (caInterBothGroups) {
      result.caInterGroup2Month = m;
      result.caInterGroup2Year = y;
    }
  } else {
    const interYearOnly = cleanText.match(/\b(?:CA\s+Inter(?:mediate)?|IPCC|PCC)[\s:-]+(?:cleared|passed|completed)?[\s:-]*(20[12]\d)\b/i);
    if (interYearOnly) {
      result.caInterYear = interYearOnly[1];
      result.caInterCompletionYear = interYearOnly[1];
      result.caInterGroup1Year = interYearOnly[1];
      if (caInterBothGroups) result.caInterGroup2Year = interYearOnly[1];
    }
  }

  const interG1AttemptMatch = cleanText.match(/\b(?:Inter(?:mediate)?|IPCC)[^\n]{0,30}\b(?:Group\s*(?:1|I)|Grp\s*(?:1|I))[^\n]{0,30}\b(\d+)(?:st|nd|rd|th)?\s+attempt\b/i);
  if (interG1AttemptMatch) {
    result.caInterGroup1Attempts = interG1AttemptMatch[1];
  }
  const interG2AttemptMatch = cleanText.match(/\b(?:Inter(?:mediate)?|IPCC)[^\n]{0,30}\b(?:Group\s*(?:2|II)|Grp\s*(?:2|II))[^\n]{0,30}\b(\d+)(?:st|nd|rd|th)?\s+attempt\b/i);
  if (interG2AttemptMatch) {
    result.caInterGroup2Attempts = interG2AttemptMatch[1];
  }

  result.caInterRanker = 'No';

  // 10. Education Details
  // Graduation College
  const collegeKeywords = [
    'delhi university', 'mumbai university', 'calcutta university', 'bangalore university',
    'pune university', 'st. xavier', 'srcc', 'shri ram college', 'christ university',
    'symbiosis', 'nm college', 'hr college', 'mithibai', 'loyola', 'hindu college',
    'hansraj', 'ramjas', 'narsee monjee', 'sydenham', 'ra podar', 'bhawanipur'
  ];
  for (const c of collegeKeywords) {
    if (lower.includes(c)) {
      result.graduationCollege = c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // Years & Percentages
  const bcomMatch = cleanText.match(/\b(?:B\.Com|BCom|Bachelor of Commerce|Graduation)[^\n]{0,60}\b(201\d|202\d)\b/i);
  if (bcomMatch) {
    result.graduationYear = bcomMatch[1];
  }

  const gradPctMatch = cleanText.match(/\b(?:B\.Com|BCom|Graduation)[^\n]{0,40}\b(\d{2}(?:\.\d{1,2})?)\s*%/i);
  if (gradPctMatch) {
    result.graduationPercentage = gradPctMatch[1];
  }

  // 12th & 10th
  const c12Match = cleanText.match(/\b(?:12th|XII|HSC|Senior Secondary)[^\n]{0,40}\b(\d{2}(?:\.\d{1,2})?)\s*%/i);
  if (c12Match) {
    result.class12Percentage = c12Match[1];
  }
  if (lower.includes('cbse')) result.class12Board = 'CBSE';
  else if (lower.includes('icse') || lower.includes('isc')) result.class12Board = 'ICSE';

  const c10Match = cleanText.match(/\b(?:10th|X|SSC|Secondary)[^\n]{0,40}\b(\d{2}(?:\.\d{1,2})?)\s*%/i);
  if (c10Match) {
    result.class10Percentage = c10Match[1];
  }
  if (!result.class10Board && result.class12Board) {
    result.class10Board = result.class12Board;
  }

  // 11. Experience Details
  const expYearsMatch = cleanText.match(/\b(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience\b/i);
  if (expYearsMatch) {
    result.experienceYears = expYearsMatch[1];
    result.isExperienced = true;
    result.workStatus = 'experienced';
  }

  const designations = [
    'Senior Associate', 'Assistant Manager', 'Deputy Manager', 'Manager',
    'Senior Executive', 'Associate', 'Consultant', 'Senior Consultant',
    'Financial Analyst', 'Tax Associate', 'Audit Senior', 'Internal Auditor'
  ];
  for (const desig of designations) {
    if (new RegExp(`\\b${desig}\\b`, 'i').test(cleanText)) {
      result.currentDesignation = desig;
      result.isExperienced = true;
      break;
    }
  }

  // Current Company Name
  const companyMatch = cleanText.match(/\b(?:working at|currently at|employed at|company|employer)[\s:-]+([A-Z][A-Za-z0-9\s&.]{3,30})\b/i);
  if (companyMatch) {
    result.currentCompanyName = companyMatch[1].trim();
  }

  return result;
}

/**
 * High-level function to scan a resume file and extract all data
 */
export async function parseResumeFile(file: File | Blob): Promise<ParsedResumeData> {
  const fileName = (file as File).name ? (file as File).name.toLowerCase() : 'resume.pdf';
  let rawText = '';

  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    rawText = await extractTextFromDocx(file);
  } else {
    rawText = await extractTextFromPdf(file);
  }

  return parseResumeText(rawText);
}

/**
 * Fetch and scan a remote resume URL (e.g. Cloudinary PDF)
 */
export async function parseResumeFromUrl(url: string): Promise<ParsedResumeData> {
  const response = await fetch(url);
  const blob = await response.blob();
  return parseResumeFile(blob);
}
