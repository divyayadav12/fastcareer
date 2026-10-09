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

  // Multi-Selection State
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // Forward / Share with Company State
  const [sharingModalVisible, setSharingModalVisible] = useState(false);
  const [employers, setEmployers] = useState<any[]>([]);
  const [loadingEmployers, setLoadingEmployers] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>('');
  const [employerSearch, setEmployerSearch] = useState('');
  const [sharing, setSharing] = useState(false);

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

  const fetchEmployers = async () => {
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

  const toggleSelectApp = (id: string) => {
    setSelectedAppIds(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
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

  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredApps.length && filteredApps.length > 0) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApps.map(a => a._id));
    }
  };

  const openShareModal = (specificAppId?: string) => {
    if (specificAppId) {
      setSelectedAppIds([specificAppId]);
    }
    fetchEmployers();
    setSharingModalVisible(true);
  };

  const handleShareWithCompany = async (action: 'assign' | 'unassign') => {
    if (selectedAppIds.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one application.');
      return;
    }
    if (!selectedEmployerId) {
      Alert.alert('Company Required', 'Please select a registered company from the list.');
      return;
    }

    const selectedEmp = employers.find(e => e._id === selectedEmployerId);
    const companyTitle = selectedEmp?.companyName || selectedEmp?.firstName || 'Company';

    setSharing(true);
    try {
      const selectedApps = apps.filter(a => selectedAppIds.includes(a._id));
      const candidateIds = Array.from(
        new Set(selectedApps.map(a => a.candidate?._id).filter(Boolean))
      );

      if (candidateIds.length > 0) {
        await api.put('/users/candidates/assign-company', {
          candidateIds,
          employerId: selectedEmployerId,
          action,
        });
      }

      await api.put('/applications/share', {
        applicationIds: selectedAppIds,
      });

      Alert.alert(
        'Success',
        action === 'assign'
          ? `Successfully shared ${selectedAppIds.length} candidate application(s) with ${companyTitle}!`
          : `Removed access for ${selectedAppIds.length} candidate(s) from ${companyTitle}.`
      );

      setSelectedAppIds([]);
      setSharingModalVisible(false);
      fetchApps();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to share applications.');
    } finally {
      setSharing(false);
    }
  };

  const filteredEmployers = useMemo(() => {
    if (!employerSearch.trim()) return employers;
    const q = employerSearch.toLowerCase().trim();
    return employers.filter(emp =>
      (emp.companyName || '').toLowerCase().includes(q) ||
      (emp.firstName || '').toLowerCase().includes(q) ||
      (emp.email || '').toLowerCase().includes(q)
    );
  }, [employers, employerSearch]);

  const renderApp = ({ item }: { item: any }) => {
    const isSelected = selectedAppIds.includes(item._id);
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
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {/* Top Header: Checkbox + Job Title & Status */}
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.checkboxTouch}
            onPress={() => toggleSelectApp(item._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSelected ? 'checkbox' : 'square-outline'}
              size={22}
              color={isSelected ? '#034b71' : '#94a3b8'}
            />
          </TouchableOpacity>

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

        {/* Shared Badge */}
        {item.sharedWithEmployer ? (
          <View style={styles.sharedBadgeRow}>
            <View style={styles.sharedBadge}>
              <Ionicons name="share-social" size={12} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.sharedBadgeText}>Forwarded to Company</Text>
            </View>
          </View>
        ) : null}

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

            {/* Forward to Company Button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={() => openShareModal(item._id)}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={14} color="#0284c7" />
              <Text style={[styles.actionBtnText, { color: '#0284c7' }]} numberOfLines={1}>Share</Text>
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

  const allFilteredSelected = filteredApps.length > 0 && selectedAppIds.length === filteredApps.length;

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

      {/* Multi-Selection Control Bar */}
      <View style={styles.selectionBar}>
        <TouchableOpacity style={styles.selectAllBtn} onPress={toggleSelectAll}>
          <Ionicons
            name={allFilteredSelected ? 'checkbox' : 'square-outline'}
            size={20}
            color="#034b71"
          />
          <Text style={styles.selectAllText}>
            {allFilteredSelected ? 'Deselect All' : `Select All (${filteredApps.length})`}
          </Text>
        </TouchableOpacity>

        {selectedAppIds.length > 0 ? (
          <View style={styles.bulkActionRight}>
            <TouchableOpacity
              style={styles.forwardBulkBtn}
              onPress={() => openShareModal()}
            >
              <Ionicons name="share-social" size={15} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.forwardBulkText}>
                Share ({selectedAppIds.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearSelectionBtn}
              onPress={() => setSelectedAppIds([])}
            >
              <Ionicons name="close" size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.counterText}>
            {filteredApps.length} {filteredApps.length === 1 ? 'Application' : 'Applications'}
          </Text>
        )}
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

      {/* Forward / Share with Company Modal */}
      <Modal
        visible={sharingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSharingModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSharingModalVisible(false)}
        >
          <View style={styles.shareModalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Share with Registered Company</Text>
                <Text style={styles.modalSubtitle}>
                  Forwarding {selectedAppIds.length} candidate application(s)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSharingModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Employer Search Box */}
            <View style={styles.empSearchBox}>
              <Ionicons name="search" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.empSearchInput}
                placeholder="Search registered company by name..."
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

            {/* Company List */}
            {loadingEmployers ? (
              <ActivityIndicator size="large" color="#034b71" style={{ marginVertical: 30 }} />
            ) : (
              <ScrollView style={{ maxHeight: 280, marginVertical: 10 }}>
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
                          <Ionicons name="checkmark-circle" size={22} color="#034b71" />
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            )}

            {/* Share Actions */}
            <View style={styles.shareActionButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryShareBtn,
                  (!selectedEmployerId || sharing) && styles.disabledShareBtn
                ]}
                onPress={() => handleShareWithCompany('assign')}
                disabled={!selectedEmployerId || sharing}
              >
                {sharing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="send" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryShareBtnText}>Forward & Assign Access</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unassignBtn,
                  (!selectedEmployerId || sharing) && styles.disabledShareBtn
                ]}
                onPress={() => handleShareWithCompany('unassign')}
                disabled={!selectedEmployerId || sharing}
              >
                <Text style={styles.unassignBtnText}>Unassign Company Access</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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

  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#034b71',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  bulkActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forwardBulkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#034b71',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
  },
  forwardBulkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  clearSelectionBtn: {
    padding: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },

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
  cardSelected: {
    borderColor: '#034b71',
    borderWidth: 2,
    backgroundColor: '#f0f9ff',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  checkboxTouch: {
    marginRight: 10,
    marginTop: 2,
  },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  companyName: { fontSize: 13, color: '#64748b', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  sharedBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    marginLeft: 32,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sharedBadgeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },

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
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  profileBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#034b71' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  infoText: { fontSize: 12, color: '#64748b' },

  cardFooter: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10, marginTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dateText: { fontSize: 11, color: '#94a3b8', marginLeft: 4 },
  actionButtons: { flexDirection: 'row', gap: 6 },
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
  actionBtnDisabled: { opacity: 0.4 },
  downloadBtn: { backgroundColor: '#ecfdf5' },
  shareBtn: { backgroundColor: '#e0f2fe' },
  statusBtn: { backgroundColor: '#faf5ff' },
  actionBtnText: { fontSize: 11, fontWeight: '600', color: '#034b71', marginLeft: 3 },

  emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#334155', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },

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
  shareModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  modalSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
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

  shareActionButtons: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  primaryShareBtn: {
    flexDirection: 'row',
    backgroundColor: '#034b71',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryShareBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  unassignBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
  },
  unassignBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledShareBtn: {
    opacity: 0.5,
  },

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
