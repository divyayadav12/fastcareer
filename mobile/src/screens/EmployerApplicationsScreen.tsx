import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, TextInput, RefreshControl, Modal, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { viewResume, downloadResume } from '../utils/fileHelper';
import CandidateDetailsModal from '../components/CandidateDetailsModal';

const STATUSES = ['All', 'applied', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  applied: { label: 'Applied', color: '#034b71', bg: '#e6f0f6' },
  reviewing: { label: 'Reviewing', color: '#d97706', bg: '#fef3c7' },
  shortlisted: { label: 'Shortlisted', color: '#16a34a', bg: '#dcfce7' },
  interviewed: { label: 'Interviewed', color: '#9333ea', bg: '#f3e8ff' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
  hired: { label: 'Hired', color: '#059669', bg: '#d1fae5' },
};

export default function EmployerApplicationsScreen() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Status Change Modal
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Candidate Details Modal
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<any>(null);

  const fetchApps = useCallback(async () => {
    try {
      const res = await api.get('/applications/employer');
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApps();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedApp?._id) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/applications/${selectedApp._id}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(a => (a._id === selectedApp._id ? { ...a, status: newStatus } : a))
      );
      setStatusModalVisible(false);
      Alert.alert('Status Updated', `Application status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const candidate = app.candidate || {};
      const job = app.job || {};
      const candName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
      const candEmail = (candidate.email || '').toLowerCase();
      const jobTitle = (job.title || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        candName.includes(q) ||
        candEmail.includes(q) ||
        jobTitle.includes(q);

      const matchesStatus =
        selectedStatus === 'All' ||
        (app.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, selectedStatus]);

  const renderApp = ({ item }: any) => {
    const candidate = item.candidate || {};
    const job = item.job || {};
    const candidateName = `${candidate.firstName || 'Candidate'} ${candidate.lastName || ''}`.trim();
    const candidateEmail = candidate.email || '';
    const candidatePhone = candidate.phone || candidate.personalDetails?.phone || '';
    const candidateCity = candidate.personalDetails?.currentCity || '';
    const resume = item.resumeUrl || candidate.resumeUrl;
    const statusCfg = STATUS_CONFIG[item.status?.toLowerCase()] || {
      label: item.status || 'Applied',
      color: '#034b71',
      bg: '#e6f0f6',
    };

    return (
      <View style={styles.card}>
        {/* Top Header: Job Title & Status */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title || 'Job Opening'}</Text>
            <Text style={styles.jobSub}>
              {job.location ? `${job.location} • ` : ''}
              Applied {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}
            onPress={() => {
              setSelectedApp(item);
              setStatusModalVisible(true);
            }}
          >
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label.toUpperCase()}
            </Text>
            <Ionicons name="pencil" size={10} color={statusCfg.color} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Candidate Info Card */}
        <TouchableOpacity
          style={styles.candidateBox}
          activeOpacity={0.75}
          onPress={() => {
            if (candidate && (candidate.firstName || candidate.email)) {
              setSelectedCandidateForModal(candidate);
              setCandidateModalVisible(true);
            }
          }}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(candidate.firstName?.[0] || 'C').toUpperCase()}
              {(candidate.lastName?.[0] || '').toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.candidateName}>{candidateName}</Text>
              <View style={styles.viewProfilePill}>
                <Text style={styles.viewProfileText}>Full Profile</Text>
                <Ionicons name="chevron-forward" size={11} color="#034b71" />
              </View>
            </View>
            <Text style={styles.infoText}>{candidateEmail || 'No email'}</Text>
            {candidatePhone ? <Text style={styles.infoText}>{candidatePhone}</Text> : null}
            {candidateCity ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="location-outline" size={12} color="#64748b" style={{ marginRight: 3 }} />
                <Text style={styles.infoText}>{candidateCity}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          {/* View Resume */}
          <TouchableOpacity
            style={[styles.actionBtn, !resume && styles.disabledBtn]}
            onPress={() => (resume ? viewResume(resume) : null)}
            disabled={!resume}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={15} color={resume ? "#034b71" : "#94a3b8"} />
            <Text style={[styles.actionBtnText, !resume && { color: "#94a3b8" }]}>
              {resume ? "View CV" : "No CV"}
            </Text>
          </TouchableOpacity>

          {/* Download Resume */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.downloadBtn, !resume && styles.disabledBtn]}
            onPress={() => {
              if (resume) {
                downloadResume(resume, candidateName, (status) =>
                  setDownloadingId(status ? item._id : null)
                );
              }
            }}
            disabled={!resume || downloadingId === item._id}
            activeOpacity={0.7}
          >
            {downloadingId === item._id ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <Ionicons name="download-outline" size={15} color={resume ? "#10b981" : "#94a3b8"} />
            )}
            <Text style={[styles.actionBtnText, { color: resume ? "#10b981" : "#94a3b8" }]}>
              Download
            </Text>
          </TouchableOpacity>

          {/* Update Status */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.statusBtn]}
            onPress={() => {
              setSelectedApp(item);
              setStatusModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal-outline" size={15} color="#7c3aed" />
            <Text style={[styles.actionBtnText, { color: "#7c3aed" }]}>Status</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search and Filters Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search candidate name or job title..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Status Scroll Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusScroll}>
          {STATUSES.map(st => {
            const isActive = selectedStatus.toLowerCase() === st.toLowerCase();
            return (
              <TouchableOpacity
                key={st}
                style={[styles.statusPill, isActive && styles.statusPillActive]}
                onPress={() => setSelectedStatus(st)}
              >
                <Text style={[styles.statusPillText, isActive && styles.statusPillTextActive]}>
                  {st === 'All' ? 'All' : (STATUS_CONFIG[st]?.label || st)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Counter Row */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredApps.length} {filteredApps.length === 1 ? 'Applicant' : 'Applicants'} Found
        </Text>
      </View>

      {/* Main List */}
      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredApps}
          renderItem={renderApp}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="file-tray-outline" size={54} color="#cbd5e1" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyTitle}>No applications received</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedStatus !== 'All'
                  ? 'No applicants match the current filter.'
                  : 'Candidates applying for your posted jobs will appear here.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Status Update Modal */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setStatusModalVisible(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Application Stage</Text>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalJobInfo}>
              {selectedApp?.job?.title || 'Job'} • {selectedApp?.candidate?.firstName} {selectedApp?.candidate?.lastName}
            </Text>

            {updatingStatus ? (
              <ActivityIndicator size="large" color="#034b71" style={{ marginVertical: 30 }} />
            ) : (
              <View style={styles.statusOptions}>
                {Object.keys(STATUS_CONFIG).map(key => {
                  const cfg = STATUS_CONFIG[key];
                  const isCurrent = selectedApp?.status?.toLowerCase() === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.statusOptionBtn,
                        isCurrent && { borderColor: cfg.color, backgroundColor: cfg.bg },
                      ]}
                      onPress={() => handleUpdateStatus(key)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
                        <Text
                          style={[
                            styles.statusOptionText,
                            isCurrent && { color: cfg.color, fontWeight: 'bold' },
                          ]}
                        >
                          {cfg.label}
                        </Text>
                      </View>
                      {isCurrent && <Ionicons name="checkmark" size={18} color={cfg.color} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        visible={candidateModalVisible}
        candidate={selectedCandidateForModal}
        onClose={() => {
          setCandidateModalVisible(false);
          setSelectedCandidateForModal(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  searchSection: { backgroundColor: '#ffffff', padding: 14, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  statusScroll: { flexDirection: 'row', marginTop: 10 },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusPillActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  statusPillText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  statusPillTextActive: { color: '#ffffff' },

  counterRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  counterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },

  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  jobSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  candidateBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#034b71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  candidateName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  viewProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  viewProfileText: { fontSize: 10, fontWeight: 'bold', color: '#034b71' },
  infoText: { fontSize: 12, color: '#64748b', marginTop: 2 },

  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  disabledBtn: { opacity: 0.4 },
  downloadBtn: { backgroundColor: '#ecfdf5' },
  statusBtn: { backgroundColor: '#faf5ff' },
  actionBtnText: { fontSize: 11, fontWeight: '600', color: '#034b71', marginLeft: 4 },

  emptyBox: { alignItems: 'center', marginTop: 50, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  modalJobInfo: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  statusOptions: { gap: 10 },
  statusOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusOptionText: { fontSize: 14, color: '#334155' },
});
