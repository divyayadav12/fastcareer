import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import api from '../services/api';

interface AssessmentSubmission {
  _id: string;
  candidate: any;
  answers: Array<{
    questionId: number;
    questionText: string;
    type: 'mcq' | 'typing' | 'audio' | 'video';
    candidateAnswer: string;
    audioDurationSeconds?: number;
    videoDurationSeconds?: number;
    isCorrect?: boolean;
  }>;
  mcqScore: number;
  totalMcqQuestions: number;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected';
  adminNotes?: string;
  adminRating?: number;
  createdAt: string;
}

export default function AdminTestResultsScreen() {
  const [assessments, setAssessments] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSubmission | null>(null);

  // In-App Video Player State
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');

  // Evaluation Form inside modal
  const [reviewStatus, setReviewStatus] = useState<string>('submitted');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [savingReview, setSavingReview] = useState<boolean>(false);

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/assessments');
      setAssessments(res.data || []);
    } catch (err: any) {
      console.error('Error fetching assessments:', err);
      Alert.alert('Error', 'Failed to fetch candidate assessment submissions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const openEvaluationModal = (item: AssessmentSubmission) => {
    setSelectedAssessment(item);
    setReviewStatus(item.status || 'submitted');
    setReviewNotes(item.adminNotes || '');
    setReviewRating(item.adminRating || 0);
  };

  const handleSaveEvaluation = async () => {
    if (!selectedAssessment) return;
    setSavingReview(true);
    try {
      const res = await api.put(`/assessments/${selectedAssessment._id}/review`, {
        status: reviewStatus,
        adminNotes: reviewNotes,
        adminRating: reviewRating,
      });

      Alert.alert('Success 🎉', 'Candidate evaluation updated successfully!');
      setAssessments((prev) =>
        prev.map((a) => (a._id === selectedAssessment._id ? { ...a, ...res.data.assessment } : a))
      );
      setSelectedAssessment(null);
    } catch (err: any) {
      console.error('Error saving evaluation:', err);
      const msg = err.response?.data?.message || 'Failed to save evaluation.';
      Alert.alert('Error', msg);
    } finally {
      setSavingReview(false);
    }
  };

  const filtered = assessments.filter((a) => {
    const cand = a.candidate || {};
    const name = `${cand.firstName || ''} ${cand.lastName || ''}`.toLowerCase();
    const email = (cand.email || '').toLowerCase();
    const phone = cand.phone || cand.personalDetails?.phone || '';
    const q = searchTerm.toLowerCase();

    const matchesSearch = name.includes(q) || email.includes(q) || phone.includes(q);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Shortlisted' };
      case 'under_review': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Under Review' };
      case 'rejected': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Rejected' };
      default: return { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Submitted' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filters Header */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search candidate name, email, phone..."
            placeholderTextColor="#94a3b8"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'rejected', label: 'Rejected' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, statusFilter === f.id && styles.filterChipActive]}
              onPress={() => setStatusFilter(f.id)}
            >
              <Text style={[styles.filterChipText, statusFilter === f.id && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Submissions List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#034b71" />
          <Text style={styles.loadingText}>Loading Candidate Test Results...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchAssessments();
          }}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="clipboard-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Submissions Found</Text>
              <Text style={styles.emptySubtitle}>No candidate tests match your search criteria.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const cand = item.candidate || {};
            const candName = `${cand.firstName || 'Candidate'} ${cand.lastName || ''}`.trim();
            const statusStyle = getStatusColor(item.status);

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{candName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.candidateName}>{candName}</Text>
                    <Text style={styles.candidateEmail}>{cand.email || 'No email'}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>MCQ Score</Text>
                    <Text style={styles.statVal}>{item.mcqScore} / {item.totalMcqQuestions || 2}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Questions</Text>
                    <Text style={styles.statVal}>{item.answers?.length || 0} Total</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Rating</Text>
                    <Text style={styles.statVal}>{item.adminRating ? `★ ${item.adminRating}/5` : 'Not Rated'}</Text>
                  </View>
                </View>

                {item.adminNotes ? (
                  <View style={styles.notesPreview}>
                    <Text style={styles.notesPreviewLabel}>Admin Notes:</Text>
                    <Text style={styles.notesPreviewText} numberOfLines={2}>{item.adminNotes}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={() => openEvaluationModal(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="eye" size={16} color="#ffffff" />
                  <Text style={styles.reviewBtnText}>Evaluate & View Responses</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* Evaluation & Responses Modal */}
      <Modal
        visible={!!selectedAssessment}
        animationType="slide"
        onRequestClose={() => setSelectedAssessment(null)}
      >
        {selectedAssessment && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {selectedAssessment.candidate?.firstName} {selectedAssessment.candidate?.lastName}
                </Text>
                <Text style={styles.modalSubtitle}>{selectedAssessment.candidate?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAssessment(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Score Overview */}
              <View style={styles.scoreOverview}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreNum}>{selectedAssessment.mcqScore} / {selectedAssessment.totalMcqQuestions || 2}</Text>
                  <Text style={styles.scoreText}>MCQ Score</Text>
                </View>
                <View style={styles.candDetails}>
                  <Text style={styles.detailItem}>📞 {selectedAssessment.candidate?.phone || 'N/A'}</Text>
                  <Text style={styles.detailItem}>
                    📅 Submitted: {new Date(selectedAssessment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Question & Answer Responses */}
              <Text style={styles.sectionHeading}>Candidate Responses</Text>
              {selectedAssessment.answers?.map((ans, idx) => (
                <View key={idx} style={styles.answerCard}>
                  <View style={styles.answerHeader}>
                    <Text style={styles.questionNum}>Q{idx + 1} • {ans.type.toUpperCase()}</Text>
                    {ans.type === 'mcq' && (
                      <Text style={[styles.mcqTag, ans.isCorrect ? styles.tagCorrect : styles.tagIncorrect]}>
                        {ans.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.questionText}>{ans.questionText}</Text>

                  <View style={styles.answerBody}>
                    <Text style={styles.answerLabel}>Submitted Answer:</Text>
                    {ans.type === 'video' || ans.type === 'audio' ? (
                      <TouchableOpacity
                        style={styles.mediaLinkBtn}
                        onPress={() => {
                          if (ans.candidateAnswer && (ans.candidateAnswer.startsWith('http') || ans.candidateAnswer.startsWith('/uploads'))) {
                            const fullUrl = ans.candidateAnswer.startsWith('http')
                              ? ans.candidateAnswer
                              : `https://fastcareer.onrender.com${ans.candidateAnswer}`;
                            setSelectedVideoUrl(fullUrl);
                            setSelectedVideoTitle(`Q${idx + 1} • ${ans.type === 'video' ? 'Video Answer' : 'Voice Audio'} (${selectedAssessment.candidate?.firstName || ''} ${selectedAssessment.candidate?.lastName || ''})`);
                          } else {
                            Alert.alert('Media Response', ans.candidateAnswer || 'No media link found');
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name={ans.type === 'video' ? 'play-circle' : 'volume-high'} size={22} color="#034b71" />
                        <Text style={styles.mediaLinkText}>
                          Play {ans.type === 'video' ? 'Video Recording' : 'Voice Audio'} In-App ▶
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.textAnswer}>{ans.candidateAnswer || 'No response provided'}</Text>
                    )}
                  </View>
                </View>
              ))}

              {/* Admin Evaluation Form */}
              <View style={styles.evalCard}>
                <Text style={styles.sectionHeading}>Admin Evaluation & Decision</Text>

                <Text style={styles.inputLabel}>Evaluation Status</Text>
                <View style={styles.statusPickerRow}>
                  {[
                    { id: 'submitted', label: 'Submitted' },
                    { id: 'under_review', label: 'Under Review' },
                    { id: 'shortlisted', label: 'Shortlist 🎉' },
                    { id: 'rejected', label: 'Reject' },
                  ].map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.statusPill, reviewStatus === s.id && styles.statusPillActive]}
                      onPress={() => setReviewStatus(s.id)}
                    >
                      <Text style={[styles.statusPillText, reviewStatus === s.id && styles.statusPillTextActive]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { marginTop: 14 }]}>Admin Rating (1 to 5 Stars)</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setReviewRating(star)} style={{ padding: 4 }}>
                      <Ionicons
                        name={star <= reviewRating ? 'star' : 'star-outline'}
                        size={28}
                        color={star <= reviewRating ? '#eab308' : '#cbd5e1'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { marginTop: 14 }]}>Admin Notes & Feedback</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline
                  numberOfLines={4}
                  placeholder="e.g. Excellent communication skills, strong grasp on IFRS and Audit standards."
                  placeholderTextColor="#94a3b8"
                  value={reviewNotes}
                  onChangeText={setReviewNotes}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[styles.saveEvalBtn, savingReview && styles.disabledBtn]}
                  onPress={handleSaveEvaluation}
                  disabled={savingReview}
                  activeOpacity={0.8}
                >
                  {savingReview ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.saveEvalBtnText}>Save Evaluation Decision</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* ─── In-App Video Player Modal ────────────────────────────────────────── */}
      <Modal
        visible={!!selectedVideoUrl}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setSelectedVideoUrl(null)}
      >
        <SafeAreaView style={styles.videoPlayerContainer}>
          <View style={styles.videoPlayerHeader}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.videoPlayerTitle} numberOfLines={1}>{selectedVideoTitle || 'Candidate Video Recording'}</Text>
              <Text style={styles.videoPlayerSub}>FAST Careers In-App Player</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedVideoUrl(null)} style={styles.videoCloseBtn}>
              <Ionicons name="close" size={26} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoWrapper}>
            {selectedVideoUrl ? (
              <WebView
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body, html {
                            width: 100%;
                            height: 100%;
                            background-color: #000000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                          }
                          video {
                            width: 100vw;
                            height: 100vh;
                            max-height: 100%;
                            object-fit: contain;
                          }
                        </style>
                      </head>
                      <body>
                        <video 
                          controls 
                          autoplay 
                          playsinline 
                          webkit-playsinline
                          controlsList="nodownload"
                          src="${selectedVideoUrl}"
                        >
                          Your browser does not support playing this video.
                        </video>
                      </body>
                    </html>
                  `
                }}
                style={styles.webviewVideo}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
              />
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: { backgroundColor: '#ffffff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 12, height: 42 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0f172a' },
  filterScroll: { marginTop: 10, flexDirection: 'row' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  filterChipActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  filterChipText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  filterChipTextActive: { color: '#ffffff', fontWeight: 'bold' },
  listContent: { padding: 14, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#034b71', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  candidateName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  candidateEmail: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, marginVertical: 12, justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#64748b' },
  statVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  notesPreview: { backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#fef08a', borderRadius: 8, padding: 8, marginBottom: 12 },
  notesPreviewLabel: { fontSize: 10, fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase' },
  notesPreviewText: { fontSize: 12, color: '#713f12', marginTop: 2 },
  reviewBtn: { flexDirection: 'row', backgroundColor: '#034b71', borderRadius: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', gap: 6 },
  reviewBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 13, color: '#64748b' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
  modalContainer: { flex: 1, backgroundColor: '#f8fafc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  modalSubtitle: { fontSize: 12, color: '#64748b' },
  closeBtn: { padding: 4 },
  modalContent: { padding: 16, paddingBottom: 50 },
  scoreOverview: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  scoreBadge: { backgroundColor: '#e0f2fe', borderRadius: 10, padding: 12, alignItems: 'center', marginRight: 16 },
  scoreNum: { fontSize: 18, fontWeight: 'bold', color: '#034b71' },
  scoreText: { fontSize: 11, color: '#0284c7', fontWeight: '600' },
  candDetails: { flex: 1 },
  detailItem: { fontSize: 12, color: '#475569', marginBottom: 4 },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  answerCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  answerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  questionNum: { fontSize: 11, fontWeight: 'bold', color: '#034b71', textTransform: 'uppercase' },
  mcqTag: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagCorrect: { backgroundColor: '#ecfdf5', color: '#059669' },
  tagIncorrect: { backgroundColor: '#fef2f2', color: '#dc2626' },
  questionText: { fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  answerBody: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 10 },
  answerLabel: { fontSize: 11, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  textAnswer: { fontSize: 13, color: '#0f172a' },
  mediaLinkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', borderRadius: 10, padding: 12, gap: 10 },
  mediaLinkText: { fontSize: 13, fontWeight: 'bold', color: '#034b71' },
  evalCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 8 },
  statusPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  statusPillActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  statusPillText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  statusPillTextActive: { color: '#ffffff', fontWeight: 'bold' },
  starRow: { flexDirection: 'row', gap: 6 },
  notesInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 13, color: '#0f172a', minHeight: 80, marginTop: 6 },
  saveEvalBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  saveEvalBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#94a3b8' },

  // Video Player Styles
  videoPlayerContainer: { flex: 1, backgroundColor: '#000000' },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  videoPlayerTitle: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  videoPlayerSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  videoCloseBtn: { padding: 4 },
  videoWrapper: { flex: 1, backgroundColor: '#000000' },
  webviewVideo: { flex: 1, backgroundColor: '#000000' },
});
