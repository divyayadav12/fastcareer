import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator, Alert, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { viewResume, downloadResume } from '../utils/fileHelper';

interface Props {
  visible: boolean;
  candidate: any;
  onClose: () => void;
  onCandidateUpdated?: () => void;
}

export default function CandidateDetailsModal({ visible, candidate, onClose, onCandidateUpdated }: Props) {
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const [downloading, setDownloading] = useState(false);

  // Assign to Company Modal State
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [employers, setEmployers] = useState<any[]>([]);
  const [loadingEmployers, setLoadingEmployers] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>('');
  const [employerSearch, setEmployerSearch] = useState('');
  const [assigning, setAssigning] = useState(false);

  if (!candidate) return null;

  const isAdminOrEmployee = currentUser?.role === 'admin' || currentUser?.role === 'employee';
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

  const openAssignModal = async () => {
    setAssignModalVisible(true);
    setLoadingEmployers(true);
    try {
      const res = await api.get('/users/employers');
      setEmployers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching employers:', err);
    } finally {
      setLoadingEmployers(false);
    }
  };

  const handleAssignAction = async (action: 'assign' | 'unassign') => {
    if (!candidate._id) {
      Alert.alert('Error', 'Candidate ID not found.');
      return;
    }
    if (!selectedEmployerId) {
      Alert.alert('Company Required', 'Please select a company from the list.');
      return;
    }

    const selectedEmp = employers.find(e => e._id === selectedEmployerId);
    const companyTitle = selectedEmp?.companyName || selectedEmp?.firstName || 'Company';

    setAssigning(true);
    try {
      await api.put('/users/candidates/assign-company', {
        candidateIds: [candidate._id],
        employerId: selectedEmployerId,
        action,
      });

      Alert.alert(
        'Success',
        action === 'assign'
          ? `Candidate ${fullName} successfully assigned to ${companyTitle}!`
          : `Candidate ${fullName} removed from ${companyTitle}.`
      );

      setAssignModalVisible(false);
      if (onCandidateUpdated) {
        onCandidateUpdated();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update company assignment.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredEmployers = employers.filter(emp => {
    if (!employerSearch.trim()) return true;
    const q = employerSearch.toLowerCase().trim();
    return (
      (emp.companyName || '').toLowerCase().includes(q) ||
      (emp.firstName || '').toLowerCase().includes(q) ||
      (emp.email || '').toLowerCase().includes(q)
    );
  });

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

            {/* Admin / Employee Assign to Company Button */}
            {isAdminOrEmployee ? (
              <TouchableOpacity
                style={styles.assignToCompanyHeroBtn}
                onPress={openAssignModal}
                activeOpacity={0.8}
              >
                <Ionicons name="business-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.assignToCompanyHeroText}>Assign to Registered Company</Text>
              </TouchableOpacity>
            ) : null}
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
                  {ca.articleships.map((f: any, i: number) => (
                    <View key={i} style={styles.firmCard}>
                      <Text style={styles.firmName}>{f.firmName || `Firm #${i + 1}`}</Text>
                      <Text style={styles.firmSub}>
                        {f.firmType ? `Type: ${f.firmType}` : ''}
                        {f.city ? ` • ${f.city}` : ''}
                      </Text>
                      {f.duration ? <Text style={styles.firmDetail}>Duration: {f.duration}</Text> : null}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          {/* ─── 4. Academic Qualifications ─────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={18} color="#034b71" />
              <Text style={styles.sectionTitle}>Academic Qualifications</Text>
            </View>
            <View style={styles.sectionBody}>
              {/* Graduation */}
              <Text style={styles.subHeading}>Graduation</Text>
              <DataRow label="Course Name" value={edu.graduation?.courseName} />
              <DataRow label="College / Inst." value={edu.graduation?.collegeName} />
              <DataRow label="University" value={edu.graduation?.university} />
              <DataRow label="Mode" value={edu.graduation?.type} />
              <DataRow label="Passing Year" value={edu.graduation?.passingYear} />
              <DataRow label="Percentage" value={edu.graduation?.percentage ? `${edu.graduation.percentage}%` : null} />

              {/* 12th Standard */}
              {edu.class12 && (
                <>
                  <Text style={styles.subHeading}>Class XII (Senior Secondary)</Text>
                  <DataRow label="Board" value={edu.class12?.board} />
                  <DataRow label="School" value={edu.class12?.schoolName} />
                  <DataRow label="Passing Year" value={edu.class12?.passingYear} />
                  <DataRow label="Percentage" value={edu.class12?.percentage ? `${edu.class12.percentage}%` : null} />
                </>
              )}

              {/* 10th Standard */}
              {edu.class10 && (
                <>
                  <Text style={styles.subHeading}>Class X (Secondary)</Text>
                  <DataRow label="Board" value={edu.class10?.board} />
                  <DataRow label="School" value={edu.class10?.schoolName} />
                  <DataRow label="Passing Year" value={edu.class10?.passingYear} />
                  <DataRow label="Percentage" value={edu.class10?.percentage ? `${edu.class10.percentage}%` : null} />
                </>
              )}
            </View>
          </View>

          {/* ─── 5. Experience (if not Fresher) ─────────────────────────── */}
          {!isFresher && exp.companies && exp.companies.length > 0 ? (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="business-outline" size={18} color="#034b71" />
                <Text style={styles.sectionTitle}>Post-CA Work Experience</Text>
              </View>
              <View style={styles.sectionBody}>
                <DataRow label="Total Experience" value={exp.totalExperience} />
                <DataRow label="Current CTC" value={exp.currentCTC ? `₹${exp.currentCTC} LPA` : null} />
                <DataRow label="Expected CTC" value={exp.expectedCTC ? `₹${exp.expectedCTC} LPA` : null} />
                <DataRow label="Notice Period" value={exp.noticePeriod} />

                {exp.companies.map((c: any, i: number) => (
                  <View key={i} style={styles.firmCard}>
                    <Text style={styles.firmName}>{c.companyName || `Company #${i + 1}`}</Text>
                    <Text style={styles.firmSub}>{c.designation || 'Role'}</Text>
                    <Text style={styles.firmDetail}>
                      {c.startDate ? new Date(c.startDate).toLocaleDateString() : ''} -{' '}
                      {c.isCurrent ? 'Present' : c.endDate ? new Date(c.endDate).toLocaleDateString() : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Company Assignment Picker Modal */}
        <Modal
          visible={assignModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAssignModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.assignModalOverlay}
            activeOpacity={1}
            onPress={() => setAssignModalVisible(false)}
          >
            <View style={styles.assignModalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.assignModalHeader}>
                <View>
                  <Text style={styles.assignModalTitle}>Assign to Registered Company</Text>
                  <Text style={styles.assignModalSub}>Candidate: {fullName}</Text>
                </View>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Search Box */}
              <View style={styles.empSearchBox}>
                <Ionicons name="search" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.empSearchInput}
                  placeholder="Search company by name or email..."
                  placeholderTextColor="#94a3b8"
                  value={employerSearch}
                  onChangeText={setEmployerSearch}
                />
                {employerSearch ? (
                  <TouchableOpacity onPress={() => setEmployerSearch('')}>
                    <Ionicons name="close-circle" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Employer List */}
              {loadingEmployers ? (
                <ActivityIndicator size="large" color="#034b71" style={{ marginVertical: 30 }} />
              ) : (
                <ScrollView style={{ maxHeight: 260, marginVertical: 8 }}>
                  {filteredEmployers.length === 0 ? (
                    <Text style={styles.noEmployersText}>No registered companies found.</Text>
                  ) : (
                    filteredEmployers.map(emp => {
                      const isPicked = selectedEmployerId === emp._id;
                      const cTitle = emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Company';
                      return (
                        <TouchableOpacity
                          key={emp._id}
                          style={[styles.empOptionRow, isPicked && styles.empOptionRowPicked]}
                          onPress={() => setSelectedEmployerId(emp._id)}
                        >
                          <View style={styles.empIconBox}>
                            <Ionicons
                              name="business"
                              size={18}
                              color={isPicked ? '#034b71' : '#64748b'}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.empNameText, isPicked && { color: '#034b71', fontWeight: 'bold' }]}>
                              {cTitle}
                            </Text>
                            <Text style={styles.empEmailText}>{emp.email}</Text>
                          </View>
                          {isPicked && (
                            <Ionicons name="checkmark-circle" size={20} color="#034b71" />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </ScrollView>
              )}

              {/* Action Buttons */}
              <View style={styles.assignModalFooter}>
                <TouchableOpacity
                  style={[
                    styles.primaryAssignBtn,
                    (!selectedEmployerId || assigning) && styles.disabledBtn
                  ]}
                  onPress={() => handleAssignAction('assign')}
                  disabled={!selectedEmployerId || assigning}
                >
                  {assigning ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="link-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.primaryAssignBtnText}>Assign Candidate</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.unassignActionBtn,
                    (!selectedEmployerId || assigning) && styles.disabledBtn
                  ]}
                  onPress={() => handleAssignAction('unassign')}
                  disabled={!selectedEmployerId || assigning}
                >
                  <Text style={styles.unassignActionBtnText}>Remove Assignment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  closeBtn: { padding: 4 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Hero Card
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#034b71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  candidateName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  candidateEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  candidatePhone: { fontSize: 13, color: '#64748b', marginTop: 1 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  fresherBadge: { backgroundColor: '#e6f0f6' },
  expBadge: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  fresherText: { color: '#034b71' },
  expText: { color: '#d97706' },

  heroActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  contactBtnText: { color: '#034b71', fontSize: 12, fontWeight: 'bold' },
  resumeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 4,
  },
  viewCvBtn: { backgroundColor: '#034b71' },
  downloadCvBtn: { backgroundColor: '#10b981' },
  resumeBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  noResumeBadge: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  noResumeText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },

  assignToCompanyHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  assignToCompanyHeroText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

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

  // Assign Modal
  assignModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  assignModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  assignModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignModalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  assignModalSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  empSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  empSearchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  noEmployersText: { textAlign: 'center', color: '#94a3b8', paddingVertical: 20, fontSize: 13 },
  empOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  empOptionRowPicked: {
    backgroundColor: '#f0f9ff',
    borderColor: '#034b71',
  },
  empIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  empNameText: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  empEmailText: { fontSize: 12, color: '#64748b', marginTop: 1 },

  assignModalFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  primaryAssignBtn: {
    flexDirection: 'row',
    backgroundColor: '#034b71',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryAssignBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  unassignActionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
  },
  unassignActionBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
