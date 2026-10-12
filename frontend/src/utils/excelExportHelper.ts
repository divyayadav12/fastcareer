import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getResumeUrl } from './urlHelper';

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
  const dob = pd.dateOfBirth || c.dateOfBirth || '';
  if (dob) {
    const birthYear = parseInt(dob.split('-')[0], 10);
    if (!isNaN(birthYear) && birthYear > 1900) {
      age = String(new Date().getFullYear() - birthYear);
    }
  }

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
    'Date of Birth': dob || 'N/A',
    'Age (Years)': age,
    'Gender': pd.gender || 'N/A',
    'Marital Status': pd.maritalStatus || 'N/A',
    'Registered On': c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'N/A',
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
    'Articleship Completion Date': (ca.articleshipCompletionDateMonth && ca.articleshipCompletionDateYear) 
      ? `${ca.articleshipCompletionDateMonth} ${ca.articleshipCompletionDateYear}` 
      : (ca.articleshipCompletionDate || 'N/A'),
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
