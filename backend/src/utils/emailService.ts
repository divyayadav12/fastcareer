import nodemailer from 'nodemailer';
import User from '../models/User';

// Helper to create Nodemailer Transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

export interface SharedCandidateInfo {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  currentCity?: string;
  caQualification?: string;
  jobTitle?: string;
  resumeUrl?: string;
}

/**
 * Send Email Notification to Company HR when Admin shares/assigns shortlisted candidate profiles
 */
export const sendCandidateSharedEmail = async (
  employerEmail: string,
  employerName: string,
  companyName: string,
  candidates: SharedCandidateInfo[]
) => {
  try {
    if (!employerEmail) {
      console.warn('Skipping email notification: No employer email provided.');
      return;
    }

    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!emailUser || !emailPass) {
      console.warn('EMAIL_USER/EMAIL_PASS not configured in environment. Logged email notification for HR:', {
        to: employerEmail,
        companyName,
        candidateCount: candidates.length,
      });
      return;
    }

    const transporter = createTransporter();
    const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Format candidate rows for HTML email
    const candidateRowsHtml = candidates.map((c, index) => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Candidate';
      const city = c.currentCity || 'N/A';
      const qual = c.caQualification || 'CA Candidate';
      const job = c.jobTitle || 'General Application';
      const phone = c.phone ? ` • ${c.phone}` : '';

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-weight: 600; color: #1e293b;">${index + 1}. ${name}</td>
          <td style="padding: 12px 16px; color: #475569;">${c.email}${phone}</td>
          <td style="padding: 12px 16px; color: #475569;">${city}</td>
          <td style="padding: 12px 16px; color: #1e40af; font-weight: 600;">${qual}</td>
          <td style="padding: 12px 16px; color: #047857; font-weight: 600;">${job}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Shortlisted Candidates Shared</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #334155;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">FAST CAREERS</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Premier CA & Finance Talent Network</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700;">
              Hello ${employerName || companyName || 'Hiring Manager'},
            </h2>

            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
              Fast Careers Administration has shortlisted and forwarded <strong>${candidates.length} candidate profile(s)</strong> specifically to <strong>${companyName || 'your company'}</strong> for your active job postings and recruitment review.
            </p>

            <!-- Table of Candidates -->
            <div style="overflow-x: auto; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                <thead>
                  <tr style="background-color: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                    <th style="padding: 10px 16px; border-bottom: 1px solid #cbd5e1;">Candidate</th>
                    <th style="padding: 10px 16px; border-bottom: 1px solid #cbd5e1;">Contact Details</th>
                    <th style="padding: 10px 16px; border-bottom: 1px solid #cbd5e1;">City</th>
                    <th style="padding: 10px 16px; border-bottom: 1px solid #cbd5e1;">Qualification</th>
                    <th style="padding: 10px 16px; border-bottom: 1px solid #cbd5e1;">Job Role</th>
                  </tr>
                </thead>
                <tbody>
                  ${candidateRowsHtml}
                </tbody>
              </table>
            </div>

            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0 20px 0;">
              <a href="${portalUrl}/employer/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 28px; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);">
                View Candidates & Resumes in Company Portal &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;">
              You can log in to your Fast Careers company portal using your registered email: <strong>${employerEmail}</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-t: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Fast Careers Inc. All rights reserved.</p>
            <p style="margin: 4px 0 0 0;">This is an automated notification sent when candidates are shared by Fast Careers Admin.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `Fast Careers <${emailUser}>`,
      to: employerEmail,
      subject: `[Fast Careers] ${candidates.length} Shortlisted Candidate Profile(s) Shared with ${companyName || 'Your Company'}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent candidate sharing notification email to ${employerEmail}`);
  } catch (error) {
    console.error('Error sending candidate shared email:', error);
  }
};
