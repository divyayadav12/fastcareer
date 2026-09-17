import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';
import { ALL_CITIES } from './constants';

// Configure pdfjs worker locally via Vite asset pipeline
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  linkedinUrl?: string;
  workStatus?: 'fresher' | 'experienced';
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
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  const maxPages = Math.min(pdf.numPages, 4);
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
export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docXml = await zip.file('word/document.xml')?.async('text');
  if (!docXml) return '';
  return docXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Intelligent entity extraction from resume text
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
  const phoneRegex = /(?:(?:\+?91|0)[\s.-]?)?([6-9]\d{4}[\s.-]?\d{5})\b/;
  const phoneMatch = cleanText.match(phoneRegex);
  if (phoneMatch) {
    const digits = phoneMatch[1].replace(/\D/g, '');
    if (digits.length === 10) {
      result.phone = digits;
    }
  }

  // 3. LinkedIn Profile URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = cleanText.match(linkedinRegex);
  if (linkedinMatch) {
    result.linkedinUrl = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 4. City Extraction
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

  // 6. Work Status (Experienced vs Fresher / Semi-CA)
  const lower = cleanText.toLowerCase();
  const fresherScore = (lower.match(/\b(fresher|semi-qualified|semi qualified|articleship|recent pass|fresher ca|student)\b/g) || []).length;
  const expScore = (lower.match(/\b(experienced|years of experience|yrs exp|senior associate|manager|assistant manager|post qualification|lead)\b/g) || []).length;

  if (fresherScore > expScore) {
    result.workStatus = 'fresher';
  } else if (expScore > 0) {
    result.workStatus = 'experienced';
  }

  return result;
}

/**
 * High-level function to scan a resume file and extract all data
 */
export async function parseResumeFile(file: File): Promise<ParsedResumeData> {
  const fileName = file.name.toLowerCase();
  let rawText = '';

  if (fileName.endsWith('.pdf')) {
    rawText = await extractTextFromPdf(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    rawText = await extractTextFromDocx(file);
  }

  return parseResumeText(rawText);
}
