import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';

export default function ResumeViewScreen() {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(authUser);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.log('Error fetching profile for resume view:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const fullName = profile?.name || `${profile?.firstName || 'Chartered'} ${profile?.lastName || 'Accountant'}`.trim();
  const email = profile?.email || 'Not provided';
  const phone = profile?.phone || profile?.personalDetails?.phone || profile?.personalDetails?.mobileNumber || 'Not provided';
  const city = profile?.personalDetails?.currentCity || profile?.city || 'Pan-India';
  const state = profile?.personalDetails?.currentState || '';
  const headline = profile?.headline || 'Chartered Accountant (ACA / FCA)';
  const summary = profile?.summary || profile?.caPortfolio?.natureOfWork || '';

  // CA details (from caPortfolio or fallback)
  const caFinal = profile?.caPortfolio?.caFinal || profile?.caFinalInfo;
  const caInter = profile?.caPortfolio?.caInter || profile?.caInterInfo;
  const articleship = profile?.caPortfolio?.articleships?.[0] || profile?.articleshipInfo;
  const big4 = profile?.caPortfolio?.big4Articleship;
  const education = profile?.qualifications?.graduation;
  const experience = profile?.experienceInfo;

  const handleShareResume = async () => {
    const resumeSummary = `
FAST CAREERS - VERIFIED CA RESUME
===================================
Name: ${fullName}
Title: ${headline}
Email: ${email}
Phone: ${phone}
Location: ${city}${state ? `, ${state}` : ''}

CA FINAL:
Status: ${caFinal?.bothGroups1stAttempt ? 'Qualified Both Groups (1st Attempt)' : 'Chartered Accountant Qualified'}
Group 1 Attempts: ${caFinal?.group1Attempts || 1}
Group 2 Attempts: ${caFinal?.group2Attempts || 1}
Completion Batch: ${caFinal?.completionSessionMonth || ''} ${caFinal?.completionSessionYear || ''}

CA INTERMEDIATE / IPCC:
Status: ${caInter?.bothGroups1stAttempt ? 'Both Groups 1st Attempt' : 'Qualified'}
Group 1 Attempts: ${caInter?.group1Attempts || 1}
Group 2 Attempts: ${caInter?.group2Attempts || 1}

ARTICLESHIP TRAINING:
Firm: ${articleship?.firmName || (big4 && big4 !== 'No' ? 'Big 4 Accounting Firm' : 'Reputed Chartered Accountancy Firm')}
Type: ${articleship?.firmType || 'CA Firm'}
Exposure: ${articleship?.exposureAreas || 'Statutory Audit, Tax Audits, Financial Statement Preparation & GST Compliance'}

GRADUATION:
Degree: ${education?.courseName || 'B.Com'} - ${education?.collegeName || 'University'} (${education?.yearOfCompletion || 'Completed'})

POST-QUALIFICATION EXPERIENCE:
Experience: ${experience?.isExperienced ? `${experience.experienceYears || '1+'} Years` : 'CA Fresher'}
Current Role: ${experience?.currentDesignation || 'Qualified Chartered Accountant'}
Organization: ${experience?.currentCompanyName || 'N/A'}
===================================
Verified Talent on FAST Careers: https://fastcareer.onrender.com
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#034b71" />
        <Text style={styles.loadingText}>Generating CA Resume layout...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />}
    >
      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareResume} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={18} color="#ffffff" />
          <Text style={styles.shareBtnText}>Share Verified Resume</Text>
        </TouchableOpacity>
      </View>

      {/* Resume Document Paper */}
      <View style={styles.resumePaper}>
        {/* Header Section */}
        <View style={styles.resumeHeader}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.titleBadge}>{headline}</Text>

          <View style={styles.contactRow}>
            <View style={styles.contactItemBox}>
              <Ionicons name="mail-outline" size={12} color="#034b71" />
              <Text style={styles.contactItem}>{email}</Text>
            </View>
            <View style={styles.contactItemBox}>
              <Ionicons name="call-outline" size={12} color="#034b71" />
              <Text style={styles.contactItem}>{phone}</Text>
            </View>
            <View style={styles.contactItemBox}>
              <Ionicons name="location-outline" size={12} color="#034b71" />
              <Text style={styles.contactItem}>{city}{state ? `, ${state}` : ''}</Text>
            </View>
          </View>
        </View>

        {/* Professional Summary */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* CA Final Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Chartered Accountancy (CA Final)</Text>
          <View style={styles.sectionBody}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Qualification: </Text>
                {caFinal?.bothGroups1stAttempt ? 'Passed Both Groups in 1st Attempt' : 'Qualified Chartered Accountant'}
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Attempts Breakdown: </Text>
                Group 1: {caFinal?.group1Attempts || 1} Attempt | Group 2: {caFinal?.group2Attempts || 1} Attempt
              </Text>
            </View>
            {(caFinal?.completionSessionMonth || caFinal?.completionSessionYear) && (
              <View style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldLabel}>Passing Session: </Text>
                  {caFinal.completionSessionMonth || ''} {caFinal.completionSessionYear || ''}
                </Text>
              </View>
            )}
            {caFinal?.ranker && caFinal.ranker !== 'No' && (
              <View style={styles.bulletRow}>
                <Text style={styles.bullet}>★</Text>
                <Text style={[styles.bulletText, { color: '#034b71', fontWeight: 'bold' }]}>
                  All India Rank: {caFinal.ranker}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* CA Intermediate / IPCC Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CA Intermediate / IPCC</Text>
          <View style={styles.sectionBody}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Status: </Text>
                {caInter?.bothGroups1stAttempt ? 'Both Groups Cleared in 1st Attempt' : 'Qualified'}
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Attempts: </Text>
                Group 1: {caInter?.group1Attempts || 1} Attempt | Group 2: {caInter?.group2Attempts || 1} Attempt
              </Text>
            </View>
          </View>
        </View>

        {/* Articleship Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Articleship Training</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.boldLabel}>
              {articleship?.firmName || (big4 && big4 !== 'No' ? 'Big 4 Accounting Firm' : 'Chartered Accountancy Practice')}
            </Text>
            <Text style={styles.subText}>
              {articleship?.city || city} • {articleship?.firmType || 'Audit & Assurance Firm'}
            </Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Key Exposure: </Text>
                {articleship?.exposureAreas || 'Statutory Audit, Tax Audits (Sec 44AB), GST Filing & Review, IND-AS Financial Statement Finalisation'}
              </Text>
            </View>
          </View>
        </View>

        {/* Academic Education */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Academic Qualifications</Text>
          <View style={styles.sectionBody}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldLabel}>Graduation: </Text>
                {education?.courseName || 'Bachelor of Commerce (B.Com)'}
                {education?.collegeName ? ` - ${education.collegeName}` : ''}
                {education?.yearOfCompletion ? ` (${education.yearOfCompletion})` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Post-Qualification Experience */}
        {experience?.isExperienced && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Post Qualification Experience</Text>
            <View style={styles.sectionBody}>
              <Text style={styles.boldLabel}>{experience?.currentDesignation || 'Finance Lead'}</Text>
              <Text style={styles.subText}>
                {experience?.currentCompanyName || 'Organization'} • {experience?.experienceYears || '1+'} Years
              </Text>
              {experience?.workProfile ? (
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{experience.workProfile}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Footer Verification Stamp */}
        <View style={styles.resumeFooter}>
          <View style={styles.stampPill}>
            <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
            <Text style={styles.verifiedTag}>Verified Profile • FAST Careers</Text>
          </View>
          <Text style={styles.footerNote}>Generated from registered profile data on FAST Careers platform</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { padding: 14, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b' },
  actionBar: { marginBottom: 12 },
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: '#034b71',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  shareBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  resumePaper: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  resumeHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#034b71',
    paddingBottom: 14,
    marginBottom: 14,
  },
  name: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  titleBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#034b71',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  contactItemBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contactItem: { fontSize: 12, color: '#475569', fontWeight: '500' },
  summaryText: { fontSize: 12.5, color: '#334155', lineHeight: 18, fontStyle: 'italic' },
  section: { marginBottom: 16 },
  sectionHeader: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#034b71',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    marginBottom: 8,
  },
  sectionBody: { paddingLeft: 2 },
  boldLabel: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  subText: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  bullet: { fontSize: 13, color: '#034b71', marginRight: 6, lineHeight: 18 },
  bulletText: { fontSize: 12.5, color: '#334155', flex: 1, lineHeight: 18 },
  resumeFooter: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    gap: 4,
  },
  stampPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 6,
  },
  verifiedTag: { fontSize: 11, fontWeight: '700', color: '#059669' },
  footerNote: { fontSize: 10.5, color: '#94a3b8' },
});
