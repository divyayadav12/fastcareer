import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getResumeUrl } from './urlHelper';

/**
 * Format any date string to DD-MM-YYYY (e.g. 1984-10-13 -> 13-10-1984)
 */
export const formatDateToDDMMYYYY = (dateVal: any): string => {
  if (!dateVal) return 'N/A';
  const s = String(dateVal).trim();
  if (!s || s === 'N/A' || s === '-') return 'N/A';

  // If already in DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    return s;
  }

  // If in YYYY-MM-DD format (e.g. 1984-10-13 or 1984-10-13T00:00:00.000Z)
  const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}-${m}-${y}`;
  }

  // If in DD/MM/YYYY format
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${d}-${m}-${y}`;
  }

  // Fallback using Date parser
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return s;
};

/**
 * Format articleship completion date to MMM-YY format (e.g. "May 2025" -> "May-25")
 */
export const formatArticleshipCompletionDate = (
  month?: string,
  year?: string,
  fullStr?: string
): string => {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Case 1: Separate month and year provided
  if (month && year) {
    const cleanM = month.trim();
    const cleanY = String(year).trim().slice(-2);
    const capitalizedM = cleanM.charAt(0).toUpperCase() + cleanM.slice(1, 3).toLowerCase();
    return `${capitalizedM}-${cleanY}`;
  }

  // Case 2: Full string e.g. "May 2025", "May 25", "May'25", "2025-05", "May-2025"
  if (fullStr) {
    const s = String(fullStr).trim();
    if (!s || s === 'N/A' || s === '-') return 'N/A';

    // Match text and year e.g. "May 2025", "May-25", "Sept'25", "October 2024"
    const textYearMatch = s.match(/([a-zA-Z]{3,9})[\s\-']+(\d{2,4})/);
    if (textYearMatch) {
      let rawM = textYearMatch[1];
      if (rawM.toLowerCase().startsWith('sept')) rawM = 'Sep';
      const m = rawM.charAt(0).toUpperCase() + rawM.slice(1, 3).toLowerCase();
      const y = textYearMatch[2].slice(-2);
      return `${m}-${y}`;
    }

    // Match ISO format e.g. "2025-05"
    const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})/);
    if (isoMatch) {
      const y = isoMatch[1].slice(-2);
      const mIdx = parseInt(isoMatch[2], 10) - 1;
      const m = shortMonths[mIdx] || isoMatch[2];
      return `${m}-${y}`;
    }

    return s;
  }

  return 'N/A';
};

/**
 * Format registration timestamp into separate date, time (12h AM/PM), and full string
 */
export const formatRegistrationTimestamp = (dateVal: any) => {
  if (!dateVal) {
    return { date: 'N/A', time: 'N/A', full: 'N/A' };
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) {
    return { date: 'N/A', time: 'N/A', full: 'N/A' };
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const timeFormatted = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return {
    date: formattedDate,
    time: timeFormatted,
    full: `${formattedDate} ${timeFormatted}`
  };
};

export const formatCandidateForExcel = (c: any) => {
  const pd = c.personalDetails || {};
  const ca = c.caPortfolio || {};
  const inter = ca.caInter || {};
  const final = ca.caFinal || {};
  const exp = c.experienceInfo || {};
  const qual = c.qualifications || {};
  const grad = qual.graduation || {};
  const c12 = qual.class12 || {};
  const c10 = qual.class10 || {};
  const articleships = Array.isArray(ca.articleships) ? ca.articleships : [];
  const primaryArt = articleships[0] || {};

  const allFirms = articleships
    .filter((a: any) => a && (a.firmName || a.firmType))
    .map((a: any, i: number) => 
      `Firm ${i + 1}: ${a.firmName || 'N/A'} (${a.firmType || 'N/A'}, ${a.city || 'N/A'}, ${a.noOfMonths || 0} mos)`
    )
    .join(' | ');

  // Calculate age if DOB exists
  let age = 'N/A';
  const rawDob = pd.dateOfBirth || c.dateOfBirth || '';
  if (rawDob) {
    let birthYear = parseInt(String(rawDob).split('-')[0], 10);
    if (isNaN(birthYear) || birthYear < 1900) {
      const parts = String(rawDob).split('-');
      if (parts.length === 3 && parseInt(parts[2], 10) > 1900) {
        birthYear = parseInt(parts[2], 10);
      }
    }
    if (!isNaN(birthYear) && birthYear > 1900) {
      age = String(new Date().getFullYear() - birthYear);
    }
  }

  const regInfo = formatRegistrationTimestamp(c.createdAt);

  // Articleship total months
  const totalArticleshipMonths = articleships.reduce(
    (sum: number, curr: any) => sum + (parseInt(curr?.noOfMonths, 10) || 0), 
    0
  );

  const isExp = Boolean(
    exp.isExperienced || 
    c.experienceInfo?.isExperienced || 
    ca.isFresherCA === false || 
    Boolean(exp.currentCompanyName)
  );

  return {
    // ── Personal & Contact Details ──
    'Full Name': `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'N/A',
    'First Name': c.firstName || '',
    'Last Name': c.lastName || '',
    'Email Address': c.email || '',
    'Phone Number': c.phone || pd.phone || 'N/A',
    'Alternate Phone': pd.alternatePhone || 'N/A',
    'Date of Birth': formatDateToDDMMYYYY(rawDob),
    'Age (Years)': age,
    'Gender': pd.gender || 'N/A',
    'Marital Status': pd.maritalStatus || 'N/A',
    'Registration Date': regInfo.date,
    'Registration Time': regInfo.time,
    'Registration Date & Time': regInfo.full,
    'Registered On': regInfo.full,
    'Profile Completed': c.profileCompleted ? 'Yes' : 'No',
    'LinkedIn Profile': c.linkedinUrl || 'N/A',

    // ── Address & Location ──
    'Current City': pd.currentCity || c.currentCity || 'N/A',
    'Current State': pd.currentState || 'N/A',
    'Current Street Address': pd.currentAddress || 'N/A',
    'Permanent City': pd.permanentCity || 'N/A',
    'Permanent State': pd.permanentState || 'N/A',
    'Permanent Street Address': pd.permanentAddress || 'N/A',

    // ── Work Experience Details (Experienced Candidates) ──
    'Career Stage': isExp ? 'Experienced' : 'Fresher CA',
    'Total Work Experience': exp.experienceYears || 'N/A',
    'Current / Recent Company': exp.currentCompanyName || 'N/A',
    'Current Designation': exp.currentDesignation || 'N/A',
    'Work Profile / Domain': exp.workProfile || 'N/A',
    'Notice Period': exp.noticePeriod || 'N/A',
    'Current CTC (LPA)': exp.currentCTC || 'N/A',
    'Expected CTC (LPA)': exp.expectedCTC || 'N/A',

    // ── CA Intermediate ──
    'CA Inter Both Groups 1st Attempt': inter.bothGroups1stAttempt ? 'Yes' : 'No',
    'CA Inter Group 1 Attempts': inter.group1Attempts || 'N/A',
    'CA Inter Group 1 Session': inter.group1Month && inter.group1Year ? `${inter.group1Month} ${inter.group1Year}` : (inter.group1Year || 'N/A'),
    'CA Inter Group 2 Attempts': inter.group2Attempts || 'N/A',
    'CA Inter Group 2 Session': inter.group2Month && inter.group2Year ? `${inter.group2Month} ${inter.group2Year}` : (inter.group2Year || 'N/A'),
    'CA Inter Ranker': inter.ranker || 'No',
    'CA Inter Completion Session': inter.completionSessionMonth && inter.completionSessionYear 
      ? `${inter.completionSessionMonth} ${inter.completionSessionYear}` 
      : (inter.completionSessionYear || 'N/A'),
    'CA Inter Percentage (%)': inter.percentage ? `${inter.percentage}%` : 'N/A',

    // ── CA Final ──
    'CA Final Both Groups 1st Attempt': final.bothGroups1stAttempt ? 'Yes' : 'No',
    'CA Final Group 1 Attempts': final.group1Attempts || 'N/A',
    'CA Final Group 1 Session': final.group1Month && final.group1Year ? `${final.group1Month} ${final.group1Year}` : (final.group1Year || 'N/A'),
    'CA Final Group 2 Attempts': final.group2Attempts || 'N/A',
    'CA Final Group 2 Session': final.group2Month && final.group2Year ? `${final.group2Month} ${final.group2Year}` : (final.group2Year || 'N/A'),
    'CA Final Ranker': final.ranker || 'No',
    'CA Final Completion Session': final.completionSessionMonth && final.completionSessionYear 
      ? `${final.completionSessionMonth} ${final.completionSessionYear}` 
      : (final.completionSessionYear || exp.caFinalCompletionYear || 'N/A'),
    'CA Final Percentage (%)': final.percentage ? `${final.percentage}%` : 'N/A',

    // ── Articleship & Training Details ──
    'Primary Articleship Firm': primaryArt.firmName || 'N/A',
    'Articleship Firm Type': primaryArt.firmType || 'N/A',
    'Articleship City': primaryArt.city || 'N/A',
    'Articleship Firm Partners': primaryArt.noOfPartners || 'N/A',
    'Articleship Firm Duration (Months)': primaryArt.noOfMonths || 'N/A',
    'All Articleship Firms': allFirms || 'N/A',
    'Total Articleship Duration (Months)': totalArticleshipMonths > 0 ? String(totalArticleshipMonths) : 'N/A',
    'Articleship Completion Date': formatArticleshipCompletionDate(
      ca.articleshipCompletionDateMonth, 
      ca.articleshipCompletionDateYear, 
      ca.articleshipCompletionDate
    ),
    'GMCS Completed': ca.gmcsCompleted || 'N/A',
    'Big 4 Articleship': (ca.big4Articleship && ca.big4Articleship !== 'No' && ca.big4Articleship !== 'none' && ca.big4Articleship !== '') ? 'Yes' : 'No',
    'Industrial Trainee': ca.industrialTrainee || 'N/A',
    'Listed Company Work Experience': ca.listedCompanyWork || 'N/A',
    'Articleship Nature of Work': ca.natureOfWork || 'N/A',
    'Audit Experience': Array.isArray(ca.auditExperience) ? ca.auditExperience.join(', ') : (ca.auditExperience || 'N/A'),

    // ── Academic Qualifications ──
    'Graduation Completed': grad.completed || 'N/A',
    'Graduation Type': grad.type || 'N/A',
    'Graduation College / University': grad.college || grad.collegeName || 'N/A',
    'Graduation Passing Year': grad.yearOfCompletion || 'N/A',
    'Graduation Percentage (%)': grad.percentage ? `${grad.percentage}%` : 'N/A',
    'Class 12 Board': c12.board || 'N/A',
    'Class 12 Passing Year': c12.year || 'N/A',
    'Class 12 Percentage (%)': c12.percentage ? `${c12.percentage}%` : 'N/A',
    'Class 10 Board': c10.board || 'N/A',
    'Class 10 Passing Year': c10.year || 'N/A',
    'Class 10 Percentage (%)': c10.percentage ? `${c10.percentage}%` : 'N/A',

    // ── Placement & Job Preferences ──
    'Preferred Campus Drive City': pd.preferredCampusCity || 'N/A',
    'Preferred Job City 1': pd.prefCity1 || 'N/A',
    'Preferred Job City 2': pd.prefCity2 || 'N/A',
    'Preferred Job City 3': pd.prefCity3 || 'N/A',
    'Preferred Job City 4': pd.prefCity4 || 'N/A',
    'Preferred Job City 5': pd.prefCity5 || 'N/A',

    // ── Resume Document Link ──
    'Resume Link': c.resumeUrl ? getResumeUrl(c.resumeUrl) : 'Not uploaded'
  };
};

/**
 * Downloads a complete .xlsx Excel spreadsheet with every single candidate field
 */
export const downloadCandidatesExcel = (candidates: any[], fileNamePrefix = 'Candidates_Full_Data') => {
  if (!candidates || candidates.length === 0) return;

  const excelData = candidates.map(formatCandidateForExcel);
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set optimal column widths
  const columnKeys = Object.keys(excelData[0] || {});
  worksheet['!cols'] = columnKeys.map(key => {
    const maxValLength = Math.max(
      key.length,
      ...excelData.map(row => String((row as any)[key] || '').length).slice(0, 50)
    );
    return { wch: Math.min(Math.max(maxValLength + 3, 12), 45) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates Database');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });

  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `${fileNamePrefix}_${dateStr}.xlsx`);
};
