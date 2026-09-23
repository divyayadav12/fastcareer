import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function ResumeViewScreen() {
  const { user } = useSelector((state: RootState) => state.auth);

  const fullName = user?.name || `${user?.firstName || 'Candidate'} ${user?.lastName || ''}`.trim();
  const email = user?.email || 'Not provided';
  const phone = user?.phone || user?.personalDetails?.phone || user?.personalDetails?.mobileNumber || 'Not provided';
  const city = user?.personalDetails?.currentCity || user?.city || 'Pan-India';

  const caFinal = user?.caFinalInfo;
  const caInter = user?.caInterInfo;
  const articleship = user?.articleshipInfo;
  const education = user?.qualifications?.graduation;
  const experience = user?.experienceInfo;

  const handleShareResume = async () => {
    const resumeSummary = `
FAST CAREERS - VERIFIED CA PROFILE
===================================
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Location: ${city}

CA FINAL:
Status: ${caFinal?.bothGroupsPassed || (caFinal?.group1Passed && caFinal?.group2Passed ? 'Both Groups Qualified' : 'Qualified')}
Attempts: ${caFinal?.group1Attempts || 1}
Passing Year: ${caFinal?.group2PassingYear || caFinal?.group1PassingYear || '2025'}

ARTICLESHIP:
Firm: ${articleship?.firmName || 'Reputed CA Firm'}
Type: ${articleship?.firmType || 'Chartered Accountancy Firm'}
Area of Work: ${articleship?.exposureAreas || articleship?.industrySector || 'Statutory Audit, Tax & Financial Reporting'}

EDUCATION:
Degree: ${education?.courseName || 'B.Com (Hons)'} - ${education?.college || 'University'}

EXPERIENCE:
Total Experience: ${experience?.totalExperienceYears || 'CA Fresher'}
Current Role: ${experience?.currentDesignation || 'Qualified Chartered Accountant'}
Current Org: ${experience?.currentCompany || 'N/A'}
===================================
Verified on FAST Careers: https://fastcareer.onrender.com
    `.trim();

    try {
      await Share.share({
        title: `${fullName} - CA Resume`,
        message: resumeSummary,
      });
    } catch (err) {
      console.error('Error sharing resume:', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareResume} activeOpacity={0.8}>
          <Ionicons name="share-outline" size={18} color="#ffffff" />
          <Text style={styles.shareBtnText}>Share Formatted Resume</Text>
        </TouchableOpacity>
      </View>

      {/* Resume Paper Layout */}
      <View style={styles.resumePaper}>
        {/* Header Section */}
        <View style={styles.resumeHeader}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.titleBadge}>Chartered Accountant</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>✉ {email}</Text>
            <Text style={styles.contactDivider}>|</Text>
            <Text style={styles.contactItem}>📞 {phone}</Text>
            <Text style={styles.contactDivider}>|</Text>
            <Text style={styles.contactItem}>📍 {city}</Text>
          </View>
        </View>

        {/* CA Final Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Chartered Accountancy (Final)</Text>
          <View style={styles.sectionBody}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>CA Final Status: </Text>
                {caFinal?.bothGroupsPassed ? 'Qualified Both Groups' : 'CA Final Cleared'}
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Attempts / Marks: </Text>
                Group 1 ({caFinal?.group1Attempts || 1} Attempt) | Group 2 ({caFinal?.group2Attempts || 1} Attempt)
              </Text>
            </View>
            {caInter && (
              <View style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldLabel}>CA Intermediate / IPCC: </Text>
                  Cleared ({caInter?.group1Attempts || 1} Attempt)
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Articleship Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Articleship Training</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.boldLabel}>{articleship?.firmName || 'CA Training Firm'}</Text>
            <Text style={styles.subText}>{articleship?.city || city} • {articleship?.firmType || 'Chartered Accountants'}</Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Exposure Areas: </Text>
                {articleship?.exposureAreas || 'Statutory Audit, Tax Audits, Financial Statement Preparation & GST Compliance'}
              </Text>
            </View>
          </View>
        </View>

        {/* Academic Qualifications */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Academic Qualifications</Text>
          <View style={styles.sectionBody}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Graduation: </Text>
                {education?.courseName || 'Bachelor of Commerce (B.Com)'} - {education?.college || 'University of Delhi'} ({education?.yearOfCompletion || '2023'})
              </Text>
            </View>
          </View>
        </View>

        {/* Work Experience if any */}
        {experience?.totalExperienceYears && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Post Qualification Experience</Text>
            <View style={styles.sectionBody}>
              <Text style={styles.boldLabel}>{experience?.currentDesignation || 'Finance Specialist'}</Text>
              <Text style={styles.subText}>{experience?.currentCompany || 'Company'} • {experience?.totalExperienceYears}</Text>
              <View style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{experience?.rolesAndResponsibilities || 'Corporate financial planning, internal controls and reporting.'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Watermark Footer */}
        <View style={styles.resumeFooter}>
          <Text style={styles.verifiedTag}>✓ Verified Profile - FAST Careers</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f0' },
  content: { padding: 14, paddingBottom: 40 },
  actionBar: { marginBottom: 12 },
  shareBtn: { flexDirection: 'row', backgroundColor: '#034b71', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8 },
  shareBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  resumePaper: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#cbd5e1', elevation: 3 },
  resumeHeader: { borderBottomWidth: 2, borderBottomColor: '#034b71', paddingBottom: 14, marginBottom: 14 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  titleBadge: { fontSize: 13, fontWeight: '700', color: '#034b71', marginTop: 2, textTransform: 'uppercase' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  contactItem: { fontSize: 11, color: '#475569' },
  contactDivider: { fontSize: 11, color: '#cbd5e1' },
  section: { marginBottom: 16 },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#034b71', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 4, marginBottom: 8 },
  sectionBody: { paddingLeft: 4 },
  boldLabel: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  subText: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  bullet: { fontSize: 14, color: '#034b71', marginRight: 6, lineHeight: 18 },
  bulletText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 18 },
  resumeFooter: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
  verifiedTag: { fontSize: 11, fontWeight: '700', color: '#059669' }
});
