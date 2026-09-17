import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { viewResume, downloadResume } from '../utils/fileHelper';

interface Props {
  visible: boolean;
  candidate: any;
  onClose: () => void;
}

export default function CandidateDetailsModal({ visible, candidate, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);

  if (!candidate) return null;

  const personal = candidate.personalDetails || {};
  const ca = candidate.caPortfolio || {};
  const edu = candidate.qualifications || {};
  const exp = candidate.experienceInfo || {};
  const resume = candidate.resumeUrl || personal.resumeUrl;

  const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Candidate Profile';
  const phone = candidate.phone || personal.phone || '';
  const email = candidate.email || '';
  const isFresher = ca.isFresherCA !== undefined ? ca.isFresherCA : true;

  const handleCall = () => {
    if (!phone) {
      Alert.alert('Notice', 'Phone number not available');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    if (!email) {
      Alert.alert('Notice', 'Email address not available');
      return;
    }
    Linking.openURL(`mailto:${email}`);
  };

  const DataRow = ({ label, value, icon }: { label: string; value: any; icon?: any }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <View style={styles.dataRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 130 }}>
          {icon ? <Ionicons name={icon} size={14} color="#64748b" style={{ marginRight: 6 }} /> : null}
          <Text style={styles.dataLabel}>{label}</Text>
        </View>
        <Text style={styles.dataValue}>{String(value)}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Modal Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Candidate Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Candidate Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(candidate.firstName?.[0] || 'C').toUpperCase()}
                  {(candidate.lastName?.[0] || '').toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.candidateName}>{fullName}</Text>
                <Text style={styles.candidateEmail}>{email}</Text>
                {phone ? <Text style={styles.candidatePhone}>{phone}</Text> : null}
                <View style={[styles.statusBadge, isFresher ? styles.fresherBadge : styles.expBadge]}>
                  <Text style={[styles.statusText, isFresher ? styles.fresherText : styles.expText]}>
                    {isFresher ? 'Fresher CA' : 'Experienced CA'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Contact & Resume Actions */}
            <View style={styles.heroActions}>
              {phone ? (
                <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                  <Ionicons name="call" size={16} color="#034b71" />
                  <Text style={styles.contactBtnText}>Call</Text>
                </TouchableOpacity>
              ) : null}

              {email ? (
                <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
                  <Ionicons name="mail" size={16} color="#034b71" />
                  <Text style={styles.contactBtnText}>Email</Text>
                </TouchableOpacity>
              ) : null}

              {resume ? (
                <>
                  <TouchableOpacity
                    style={[styles.resumeBtn, styles.viewCvBtn]}
                    onPress={() => viewResume(resume)}
                  >
                    <Ionicons name="eye" size={16} color="#ffffff" />
                    <Text style={styles.resumeBtnText}>View CV</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.resumeBtn, styles.downloadCvBtn]}
                    onPress={() => {
                      downloadResume(resume, fullName, (status) => setDownloading(status));
                    }}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Ionicons name="download" size={16} color="#ffffff" />
                    )}
                    <Text style={styles.resumeBtnText}>Download</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.noResumeBadge}>
                  <Text style={styles.noResumeText}>No Resume Uploaded</Text>
                </View>
              )}
            </View>
          </View>

          {/* ─── 1. Personal Details ────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color="#034b71" />
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
            <View style={styles.sectionBody}>
              <DataRow label="Full Name" value={fullName} />
              <DataRow label="Email" value={email} />
              <DataRow label="Mobile" value={phone} />
              <DataRow label="Gender" value={personal.gender} />
              <DataRow label="Marital Status" value={personal.maritalStatus} />
              <DataRow label="Date of Birth" value={personal.dateOfBirth} />
              <DataRow
                label="Current City"
                value={[personal.currentCity, personal.currentState].filter(Boolean).join(', ')}
              />
              <DataRow label="Current Address" value={personal.currentAddress} />
              <DataRow
                label="Permanent City"
                value={[personal.permanentCity, personal.permanentState].filter(Boolean).join(', ')}
              />
              <DataRow label="Permanent Address" value={personal.permanentAddress} />
              <DataRow
                label="Registered Date"
                value={candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : ''}
              />
            </View>
          </View>

          {/* ─── 2. CA Qualifications ───────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="school-outline" size={18} color="#034b71" />
              <Text style={styles.sectionTitle}>CA Qualification</Text>
            </View>
            <View style={styles.sectionBody}>
              <DataRow label="Work Status" value={isFresher ? 'Fresher CA' : 'Experienced CA'} />

              {/* CA Final */}
              <Text style={styles.subHeading}>CA Final</Text>
              <DataRow
                label="1st Attempt Both"
                value={ca.caFinal?.bothGroups1stAttempt ? 'Yes' : 'No'}
              />
              <DataRow label="Group 1 Attempts" value={ca.caFinal?.group1Attempts} />
              <DataRow label="Group 2 Attempts" value={ca.caFinal?.group2Attempts} />
              <DataRow
                label="Passing Session"
                value={[ca.caFinal?.completionSessionMonth, ca.caFinal?.completionSessionYear].filter(Boolean).join(' ')}
              />
              <DataRow label="Ranker" value={ca.caFinal?.isRanker ? 'Yes' : 'No'} />

              {/* CA Inter */}
              <Text style={styles.subHeading}>CA Intermediate / IPCC</Text>
              <DataRow
                label="1st Attempt Both"
                value={ca.caInter?.bothGroups1stAttempt ? 'Yes' : 'No'}
              />
              <DataRow label="Group 1 Attempts" value={ca.caInter?.group1Attempts} />
              <DataRow label="Group 2 Attempts" value={ca.caInter?.group2Attempts} />
              <DataRow
                label="Passing Session"
                value={[ca.caInter?.completionSessionMonth, ca.caInter?.completionSessionYear].filter(Boolean).join(' ')}
              />
              <DataRow label="Ranker" value={ca.caInter?.isRanker ? 'Yes' : 'No'} />

              {/* CA Foundation */}
              {ca.caFoundation && (
                <>
                  <Text style={styles.subHeading}>CA Foundation / CPT</Text>
                  <DataRow label="Attempts" value={ca.caFoundation?.attempts} />
                  <DataRow
                    label="Passing Session"
                    value={[ca.caFoundation?.month, ca.caFoundation?.year].filter(Boolean).join(' ')}
                  />
                </>
              )}
            </View>
          </View>

          {/* ─── 3. Articleship & Training ──────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="briefcase-outline" size={18} color="#034b71" />
              <Text style={styles.sectionTitle}>Articleship & Training</Text>
            </View>
            <View style={styles.sectionBody}>
              <DataRow
                label="Completion Date"
                value={[ca.articleshipCompletionDateMonth, ca.articleshipCompletionDateYear].filter(Boolean).join(' ')}
              />
              <DataRow label="GMCS Completed" value={ca.gmcsCompleted || 'No'} />
              <DataRow label="Industrial Trainee" value={ca.industrialTrainee || 'No'} />
              <DataRow label="Listed Company Work" value={ca.listedCompanyWork || 'No'} />

              {/* Nature of Work Tags */}
              {ca.natureOfWork ? (
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                  <Text style={styles.dataLabel}>Nature of Work:</Text>
                  <View style={styles.workTagsGrid}>
                    {ca.natureOfWork.split(',').map((w: string, i: number) => (
                      <View key={i} style={styles.workTag}>
                        <Text style={styles.workTagText}>{w.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* Articleship Firms List */}
              {ca.articleships && ca.articleships.length > 0 ? (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Articleship Firms</Text>
                  {ca.articleships.map((f: any, idx: number) => (
                    <View key={idx} style={styles.firmCard}>
                      <Text style={styles.firmName}>{f.firmName || `Firm #${idx + 1}`}</Text>
                      <Text style={styles.firmSub}>
                        {f.type || 'Articleship'} • {f.city || 'City'}
                      </Text>
                      <Text style={styles.firmDetail}>
                        {f.noOfPartners ? `Partners: ${f.noOfPartners}` : ''}
                        {f.noOfMonths ? `  |  Duration: ${f.noOfMonths} Months` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          {/* ─── 4. Education & Academic Background ──────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon-outline" size={18} color="#034b71" />
              <Text style={styles.sectionTitle}>Education & Academics</Text>
            </View>
            <View style={styles.sectionBody}>
              {/* Graduation */}
              {edu.graduation && (
                <>
                  <Text style={styles.subHeading}>Graduation</Text>
                  <DataRow label="Course/Degree" value={edu.graduation.courseName || edu.graduation.type} />
                  <DataRow label="College" value={edu.graduation.college} />
                  <DataRow label="Percentage" value={edu.graduation.percentage ? `${edu.graduation.percentage}%` : ''} />
                  <DataRow label="Year" value={edu.graduation.yearOfCompletion} />
                </>
              )}

              {/* Class 12 */}
              {edu.class12 && (
                <>
                  <Text style={styles.subHeading}>Class XII (Senior Secondary)</Text>
                  <DataRow label="Board" value={edu.class12.board} />
                  <DataRow label="Percentage" value={edu.class12.percentage ? `${edu.class12.percentage}%` : ''} />
                  <DataRow label="Year" value={edu.class12.year} />
                </>
              )}

              {/* Class 10 */}
              {edu.class10 && (
                <>
                  <Text style={styles.subHeading}>Class X (Secondary)</Text>
                  <DataRow label="Board" value={edu.class10.board} />
                  <DataRow label="Percentage" value={edu.class10.percentage ? `${edu.class10.percentage}%` : ''} />
                  <DataRow label="Year" value={edu.class10.year} />
                </>
              )}
            </View>
          </View>

          {/* ─── 5. Experience (if experienced) ─────────────────────────── */}
          {(!isFresher || exp.isExperienced) && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="business-outline" size={18} color="#034b71" />
                <Text style={styles.sectionTitle}>Professional Experience</Text>
              </View>
              <View style={styles.sectionBody}>
                <DataRow label="Years of Experience" value={exp.yearsOfExperience || candidate.experience} />
                <DataRow label="Current Company" value={exp.currentCompany} />
                <DataRow label="Designation" value={exp.designation} />
                <DataRow label="Annual CTC" value={exp.annualCtc} />
                <DataRow label="Notice Period" value={exp.noticePeriod} />
                <DataRow label="Key Responsibilities" value={exp.responsibilities} />
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  closeBtn: { padding: 4 },
  scrollContent: { padding: 16 },

  // Hero Card
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f0f6',
    borderWidth: 2,
    borderColor: '#b2d1e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: 'bold', color: '#034b71' },
  candidateName: { fontSize: 19, fontWeight: 'bold', color: '#0f172a' },
  candidateEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  candidatePhone: { fontSize: 13, color: '#034b71', marginTop: 2, fontWeight: '500' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  fresherBadge: { backgroundColor: '#e6f0f6', borderWidth: 1, borderColor: '#b2d1e5' },
  expBadge: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  fresherText: { color: '#034b71' },
  expText: { color: '#059669' },

  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  contactBtnText: { fontSize: 13, color: '#034b71', fontWeight: 'bold' },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewCvBtn: { backgroundColor: '#034b71' },
  downloadCvBtn: { backgroundColor: '#10b981' },
  resumeBtnText: { fontSize: 13, color: '#ffffff', fontWeight: 'bold' },
  noResumeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  noResumeText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },

  // Section Cards
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  sectionBody: { gap: 6 },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#034b71',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  dataLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  dataValue: { fontSize: 13, color: '#0f172a', fontWeight: '600', flex: 1, textAlign: 'right' },

  // Nature of Work Tags
  workTagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  workTag: {
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  workTagText: { fontSize: 12, color: '#034b71', fontWeight: '600' },

  // Firm Cards
  firmCard: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 6,
  },
  firmName: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },
  firmSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  firmDetail: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
});
