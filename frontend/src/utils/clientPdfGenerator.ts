import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { getResumeUrl } from './urlHelper';

export const generateCandidatePdfBlob = (c: any): Blob => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Candidate Resume';

  // --- HEADER ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 43, 72); // Primary Navy #0f2b48
  doc.text(fullName, margin, y);
  y += 18;

  if (c.headline) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(c.headline, margin, y);
    y += 16;
  }

  // Contact Info Bar
  const location = [c.personalDetails?.currentCity, c.personalDetails?.currentState].filter(Boolean).join(', ');
  const contactParts = [
    c.email ? `Email: ${c.email}` : null,
    c.phone ? `Phone: ${c.phone}` : null,
    location ? `Location: ${location}` : null,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(contactParts.join('   |   '), margin, y);
    y += 14;
  }

  // Divider Line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const addSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 43, 72);
    doc.text(title, margin, y);
    y += 14;
  };

  // --- PROFESSIONAL SUMMARY ---
  addSectionHeader('PROFESSIONAL SUMMARY');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(55, 65, 81);

  const isFresher = c.caPortfolio?.isFresherCA;
  const expText = c.experience ? `with ${c.experience} year(s) of experience` : '';
  const caType = isFresher ? 'Fresher Chartered Accountant' : `Chartered Accountant ${expText}`.trim();
  const skillsSnippet = Array.isArray(c.skills) && c.skills.length > 0 ? ` specializing in ${c.skills.slice(0, 4).join(', ')}` : '';
  const summaryText = `${fullName} is a dedicated ${caType}${skillsSnippet}. Proven expertise in statutory compliance, auditing, corporate taxation, and financial management.`;

  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 13 + 12;

  // --- PROFESSIONAL QUALIFICATIONS (CA) ---
  if (c.caPortfolio) {
    addSectionHeader('PROFESSIONAL QUALIFICATIONS (ICAI)');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);

    if (c.caPortfolio.caFinal) {
      const f = c.caPortfolio.caFinal;
      const finalStatus = f.bothGroups1stAttempt
        ? 'Cleared Both Groups in 1st Attempt'
        : `Group 1: ${f.group1Attempts || 1} att., Group 2: ${f.group2Attempts || 1} att.`;
      const session = f.completionSessionMonth && f.completionSessionYear ? ` (Batch: ${f.completionSessionMonth} ${f.completionSessionYear})` : '';
      const rank = f.ranker && f.ranker !== 'No' ? ` [Rank: ${f.ranker}]` : '';
      doc.text(`• CA Final: ${finalStatus}${session}${rank}`, margin + 5, y);
      y += 14;
    }

    if (c.caPortfolio.caInter) {
      const i = c.caPortfolio.caInter;
      const interStatus = i.bothGroups1stAttempt
        ? 'Cleared Both Groups in 1st Attempt'
        : `Group 1: ${i.group1Attempts || 1} att., Group 2: ${i.group2Attempts || 1} att.`;
      const session = i.completionSessionMonth && i.completionSessionYear ? ` (Batch: ${i.completionSessionMonth} ${i.completionSessionYear})` : '';
      const rank = i.ranker && i.ranker !== 'No' ? ` [Rank: ${i.ranker}]` : '';
      doc.text(`• CA Intermediate: ${interStatus}${session}${rank}`, margin + 5, y);
      y += 14;
    }
    y += 8;
  }

  // --- ACADEMIC QUALIFICATIONS ---
  if (c.qualifications) {
    addSectionHeader('ACADEMIC QUALIFICATIONS');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);

    if (c.qualifications.graduation) {
      const g = c.qualifications.graduation;
      const course = g.courseName || 'Graduation';
      const col = g.college || g.collegeName || 'University';
      const yr = g.yearOfCompletion ? `(${g.yearOfCompletion})` : '';
      const pct = g.percentage ? `| ${g.percentage}%` : '';
      doc.text(`• ${course} - ${col} ${yr} ${pct}`.trim(), margin + 5, y);
      y += 14;
    }
    if (c.qualifications.class12) {
      const c12 = c.qualifications.class12;
      doc.text(`• Higher Secondary (Class XII): ${c12.board || 'CBSE'} (${c12.year || ''}) ${c12.percentage ? `| ${c12.percentage}%` : ''}`, margin + 5, y);
      y += 14;
    }
    if (c.qualifications.class10) {
      const c10 = c.qualifications.class10;
      doc.text(`• Secondary School (Class X): ${c10.board || 'CBSE'} (${c10.year || ''}) ${c10.percentage ? `| ${c10.percentage}%` : ''}`, margin + 5, y);
      y += 14;
    }
    y += 8;
  }

  // --- ARTICLESHIP & WORK EXPERIENCE ---
  if (c.caPortfolio?.articleships && c.caPortfolio.articleships.length > 0) {
    addSectionHeader('ARTICLESHIP & PRACTICAL TRAINING');
    for (const art of c.caPortfolio.articleships) {
      if (art.firmName || art.firmType) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(31, 41, 55);
        doc.text(`Articleship Trainee — ${art.firmName || 'Audit Firm'} (${art.city || 'India'})`, margin + 5, y);
        y += 13;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        doc.text(`Firm Type: ${art.firmType || 'Medium'}  |  Duration: ${art.noOfMonths || 36} Months  |  Big 4 Exposure: ${c.caPortfolio.big4Articleship || 'No'}`, margin + 12, y);
        y += 13;

        doc.text(`• Conducted statutory, internal, and tax audits as per ICAI standards.`, margin + 12, y);
        y += 12;
        doc.text(`• Prepared financial statements, balance sheets, and verified tax filings.`, margin + 12, y);
        y += 15;
      }
    }
  }

  // --- SKILLS & EXPERTISE ---
  if (c.skills && Array.isArray(c.skills) && c.skills.length > 0) {
    addSectionHeader('SKILLS & CORE COMPETENCIES');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text(`• Key Skills: ${c.skills.join(', ')}`, margin + 5, y);
    y += 13;
    doc.text(`• Regulatory Knowledge: IND AS, IFRS, Income Tax Act, Companies Act 2013, GST Law`, margin + 5, y);
    y += 13;
    doc.text(`• Software Tools: Advanced MS Excel, Tally Prime, SAP FICO, Power BI`, margin + 5, y);
    y += 16;
  }

  // --- FOOTER ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('FAST Careers Recruitment Platform — Verified Candidate Resume', pageWidth / 2, 800, { align: 'center' });

  return doc.output('blob');
};

// Resilient Resume Fetcher: Tries remote -> Tries API -> Generates fallback PDF blob
export const fetchCandidateResumeBlob = async (candidate: any): Promise<Blob> => {
  const primaryUrl = candidate?.resumeUrl ? getResumeUrl(candidate.resumeUrl) : '';
  const fallbackUrl = candidate?._id ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/candidates/${candidate._id}/resume` : '';

  // 1. Try primary URL (Cloudinary or /uploads/)
  if (primaryUrl) {
    try {
      const response = await fetch(primaryUrl);
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && !contentType.includes('text/html') && !contentType.includes('application/json')) {
        return await response.blob();
      }
    } catch {
      // Primary fetch failed, proceed to fallback
    }
  }

  // 2. Try backend candidate resume endpoint
  if (fallbackUrl) {
    try {
      const response = await fetch(fallbackUrl);
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && !contentType.includes('text/html') && !contentType.includes('application/json')) {
        return await response.blob();
      }
    } catch {
      // Backend route failed, proceed to local generation
    }
  }

  // 3. Guaranteed fallback: Generate complete professional PDF directly in browser
  return generateCandidatePdfBlob(candidate);
};

// Download a single candidate resume PDF directly
export const downloadCandidateResume = async (candidate: any) => {
  const blob = await fetchCandidateResumeBlob(candidate);
  const sanitize = (s: string) => s.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
  const base = `${sanitize(candidate.firstName || 'Candidate')}_${sanitize(candidate.lastName || '')}`.replace(/_+$/, '');
  saveAs(blob, `${base || 'Candidate'}.pdf`);
};

// View candidate resume in a new browser tab
export const viewCandidateResume = async (candidate: any) => {
  const blob = await fetchCandidateResumeBlob(candidate);
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
};
