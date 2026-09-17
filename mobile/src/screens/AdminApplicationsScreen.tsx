import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, TextInput, RefreshControl, Modal, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
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

export default function AdminApplicationsScreen() {
  const [apps, setApps] = useState<any[]>([]);
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
      const res = await api.get('/applications');
      setApps(res.data || []);
    } catch (err) {
      console.error('Error fetching applications for admin:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchApps();
    }, [fetchApps])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchApps();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedApp?._id) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/applications/${selectedApp._id}/status`, { status: newStatus });
      setApps(prev =>
        prev.map(a => (a._id === selectedApp._id ? { ...a, status: newStatus } : a))
      );
      setStatusModalVisible(false);
      Alert.alert('Status Updated', `Application status changed to ${newStatus.toUpperCase()}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update application status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const candidate = app.candidate || {};
      const job = app.job || {};
      const candName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
      const candEmail = (candidate.email || '').toLowerCase();
      const jobTitle = (job.title || '').toLowerCase();
      const jobCompany = (job.company || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        candName.includes(q) ||
        candEmail.includes(q) ||
        jobTitle.includes(q) ||
        jobCompany.includes(q);

      const matchesStatus =
        selectedStatus === 'All' ||
        (app.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, selectedStatus]);

  const renderApp = ({ item }: { item: any }) => {
    const candidate = item.candidate || {};
    const job = item.job || {};
    const candidateName = `${candidate.firstName || 'Candidate'} ${candidate.lastName || ''}`.trim();
    const candidatePhone = candidate.phone || candidate.personalDetails?.phone || '';
    const candidateCity = candidate.personalDetails?.currentCity || '';
    const candidateState = candidate.personalDetails?.currentState || '';
    const resume = item.resumeUrl || candidate.resumeUrl;
    const statusCfg = STATUS_CONFIG[item.status?.toLowerCase()] || {
      label: item.status || 'Applied',
      color: '#64748b',
      bg: '#f1f5f9',
    };

    return (
      <View style={styles.card}>
        {/* Top Header: Job Title & Status */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title || 'Untitled Job'}</Text>
            <Text style={styles.companyName}>
              {job.company || 'Unknown Company'}
              {job.location ? ` • ${job.location}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}
            onPress={() => {
              setSelectedApp(item);
              setStatusModalVisible(true);
            }}
          >
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label.toUpperCase()}
            </Text>
            <Ionicons name="pencil" size={10} color={statusCfg.color} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Candidate Info Box */}
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
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Profile</Text>
                <Ionicons name="chevron-forward" size={11} color="#034b71" />
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={12} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.infoText}>{candidate.email || 'No email'}</Text>
            </View>
            {candidatePhone ? (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={12} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>{candidatePhone}</Text>
              </View>
            ) : null}
            {candidateCity ? (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={12} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>{candidateCity}{candidateState ? `, ${candidateState}` : ''}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Applied Date & Actions */}
        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={13} color="#94a3b8" />
            <Text style={styles.dateText}>
              Applied: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            {/* View Resume */}
            <TouchableOpacity
              style={[styles.actionBtn, !resume && styles.actionBtnDisabled]}
              onPress={() => (resume ? viewResume(resume) : null)}
              disabled={!resume}
              activeOpacity={0.7}
            >
              <Ionicons name="eye-outline" size={14} color={resume ? '#034b71' : '#94a3b8'} />
              <Text style={[styles.actionBtnText, !resume && { color: '#94a3b8' }]} numberOfLines={1}>
                {resume ? 'View CV' : 'No CV'}
              </Text>
            </TouchableOpacity>

            {/* Download Resume */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.downloadBtn, !resume && styles.actionBtnDisabled]}
              onPress={() => {
                if (resume) {
                  downloadResume(resume, candidateName, status =>
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
                <Ionicons name="download-outline" size={14} color={resume ? '#10b981' : '#94a3b8'} />
              )}
              <Text style={[styles.actionBtnText, { color: resume ? '#10b981' : '#94a3b8' }]} numberOfLines={1}>
                Download
              </Text>
            </TouchableOpacity>

            {/* Status Change */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.statusBtn]}
              onPress={() => {
                setSelectedApp(item);
                setStatusModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-horizontal-outline" size={14} color="#7c3aed" />
              <Text style={[styles.actionBtnText, { color: '#7c3aed' }]} numberOfLines={1}>Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search candidate, job or company..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter Horizontal Pills */}
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

      {/* Results Counter */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredApps.length} {filteredApps.length === 1 ? 'Application' : 'Applications'} Found
        </Text>
      </View>

      {/* Main List */}
      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filteredApps}
          renderItem={renderApp}
          keyExtractor={i => i._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={56} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No applications found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedStatus !== 'All'
                  ? 'Try adjusting your search or filter.'
                  : 'Candidates who apply for jobs will appear here.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Status Change Modal */}
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
              <Text style={styles.modalTitle}>Update Application Status</Text>
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
  companyName: { fontSize: 13, color: '#64748b', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  candidateBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#034b71' },
  candidateName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  profileBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  profileBadgeText: { fontSize: 10, fontWeight: '700', color: '#034b71', marginRight: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  infoText: { fontSize: 12, color: '#64748b' },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  dateText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#e6f0f6',
    borderWidth: 1,
    borderColor: '#b2d1e5',
    gap: 4,
  },
  actionBtnDisabled: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#034b71' },
  downloadBtn: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
  statusBtn: { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' },

  emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  modalJobInfo: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  statusOptions: { gap: 8 },
  statusOptionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusOptionText: { fontSize: 14, fontWeight: '600', color: '#334155' },
});
