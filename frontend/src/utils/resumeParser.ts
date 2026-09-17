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
    .filter(l => l.length > 0 && l.length < 50);

  let candidateName = '';
  for (const line of lines.slice(0, 8)) {
    if (line.includes('@') || /(?:\+?91|\d{5})/i.test(line)) continue;
    if (COMMON_NON_NAMES.has(line.toLowerCase())) continue;
    
    const words = line.split(/\s+/).filter(w => /^[a-zA-Z.'-]+$/.test(w));
    if (words.length >= 2 && words.length <= 4) {
      const isHeaderWord = words.some(w => COMMON_NON_NAMES.has(w.toLowerCase()));
      if (!isHeaderWord) {
        candidateName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        break;
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

  // 6. Date of Birth
  const dobRegex = /\b(?:DOB|Date of Birth|Birth Date|D\.O\.B)[\s:-]+([0-3]?\d[\/\-.][0-1]?\d[\/\-.](?:19|20)\d{2})\b/i;
  const dobMatch = cleanText.match(dobRegex);
  if (dobMatch) {
    const parts = dobMatch[1].split(/[\/\-.]/);
    if (parts.length === 3) {
      // Formatted as YYYY-MM-DD
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      result.dateOfBirth = `${year}-${month}-${day}`;
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
