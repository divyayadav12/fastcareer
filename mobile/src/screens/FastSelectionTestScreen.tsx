import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { uploadFileApi } from '../services/api';
import * as DocumentPicker from 'expo-document-picker';

interface QuestionDef {
  id: number;
  type: 'mcq' | 'typing' | 'video';
  category: string;
  title: string;
  subtitle?: string;
  options?: string[];
  placeholder?: string;
}

const QUESTIONS: QuestionDef[] = [
  {
    id: 1,
    type: 'mcq',
    category: 'Core Accounting & Ind AS',
    title: 'Under Ind AS 115 / AS 9, when should revenue from contracts with customers be recognized?',
    options: [
      'When the commercial sales invoice is raised',
      'When performance obligation is satisfied and control is transferred to the customer',
      'When cash payment is received and credited to the bank account',
      'At the end of the quarterly or annual reporting period'
    ]
  },
  {
    id: 2,
    type: 'mcq',
    category: 'Taxation & Statutory Compliance',
    title: 'Under GST Law, what is the statutory due date for filing monthly return GSTR-3B for regular taxpayers having aggregate turnover above ₹5 Crores?',
    options: [
      '10th of the succeeding month',
      '20th of the succeeding month',
      'Last day of the calendar month',
      '15th of the quarter ending month'
    ]
  },
  {
    id: 3,
    type: 'typing',
    category: 'Audit & Assurance (Written)',
    title: 'Briefly outline the key substantive audit procedures you would perform to verify the existence, completeness, and valuation of year-end closing inventory.',
    placeholder: 'Explain physical stock count attendance, cut-off testing, comparing cost vs NRV (lower of cost and net realizable value), checking slow-moving or damaged goods provisions...'
  },
  {
    id: 4,
    type: 'typing',
    category: 'Articleship & Work Experience (Written)',
    title: 'Describe a challenging situation in your articleship or professional work (e.g., tight statutory audit deadline, tax reconciliation variance, or handling an issue with a senior/client) and how you handled it.',
    placeholder: 'Detail the problem, your analysis, the collaborative steps you took, and the positive outcome achieved...'
  },
  {
    id: 5,
    type: 'video',
    category: 'Personal Introduction & Pitch (Video Recording / Response)',
    title: 'Record/upload your video answer introducing yourself, summarizing your CA journey/attempts, key strengths in Finance & Audit, and why you are the best fit for top tier roles.',
    subtitle: 'Upload or record a 1-3 minute video response introducing your strengths and achievements.'
  },
  {
    id: 6,
    type: 'video',
    category: 'Technical Articulation (Video Recording / Response)',
    title: 'Explain in your own words the concept and impact of Deferred Tax Asset (DTA) vs Deferred Tax Liability (DTL) on financial statements, OR explain any recent significant amendment in the Income Tax Act / GST that you find important.',
    subtitle: 'Present your technical explanation clearly in video format (1-3 minutes).'
  }
];

export default function FastSelectionTestScreen({ navigation }: any) {
  const [existingAssessment, setExistingAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Answers state
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: ''
  });

  const [videoFiles, setVideoFiles] = useState<Record<number, any>>({ 5: null, 6: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchExisting = async () => {
    try {
      const res = await api.get('/assessments/my-assessment');
      if (res.data) {
        setExistingAssessment(res.data);
      }
    } catch (err) {
      // Not taken yet or 404 is normal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExisting();
  }, []);

  const handlePickVideo = async (qId: number) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/quicktime', 'video/*', 'audio/*'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setVideoFiles(prev => ({ ...prev, [qId]: file }));
        setAnswers(prev => ({ ...prev, [qId]: file.name || 'Video Response Attached' }));
        Alert.alert('Video Attached 📹', `${file.name} attached for Question ${qId}.`);
      }
    } catch (err) {
      console.log('Error picking video:', err);
    }
  };

  const handleSubmit = async () => {
    // Check if MCQs and written questions are answered
    if (!answers[1] || !answers[2]) {
      Alert.alert('Incomplete MCQs', 'Please answer Question 1 and Question 2.');
      return;
    }
    if (!answers[3]?.trim() || !answers[4]?.trim()) {
      Alert.alert('Incomplete Written Questions', 'Please write your answers for Question 3 and Question 4.');
      return;
    }

    setSubmitting(true);
    try {
      let mcqScore = 0;
      // Q1 correct answer
      if (answers[1] === 'When performance obligation is satisfied and control is transferred to the customer') {
        mcqScore += 1;
      }
      // Q2 correct answer
      if (answers[2] === '20th of the succeeding month') {
        mcqScore += 1;
      }

      // Upload videos if attached
      let q5Answer = answers[5] || 'Video response pending';
      let q6Answer = answers[6] || 'Video response pending';

      for (const qId of [5, 6]) {
        const file = videoFiles[qId];
        if (file) {
          try {
            const uploadRes = await uploadFileApi(file, 'resume');
            const uploadedUrl = uploadRes?.url || uploadRes?.resumeUrl || file.name;
            if (qId === 5) q5Answer = uploadedUrl;
            if (qId === 6) q6Answer = uploadedUrl;
          } catch (uploadErr) {
            console.warn(`Video upload for Q${qId} skipped fallback`);
          }
        }
      }

      const formattedAnswers = QUESTIONS.map(q => {
        let candidateAnswer = answers[q.id] || '';
        let isCorrect = undefined;

        if (q.id === 1) {
          isCorrect = answers[1] === 'When performance obligation is satisfied and control is transferred to the customer';
        } else if (q.id === 2) {
          isCorrect = answers[2] === '20th of the succeeding month';
        } else if (q.id === 5) {
          candidateAnswer = q5Answer;
        } else if (q.id === 6) {
          candidateAnswer = q6Answer;
        }

        return {
          questionId: q.id,
          questionText: q.title,
          type: q.type,
          candidateAnswer,
          isCorrect
        };
      });

      const res = await api.post('/assessments', {
        answers: formattedAnswers,
        mcqScore,
        totalMcqQuestions: 2
      });

      Alert.alert(
        'Assessment Submitted! 🎉',
        'Congratulations! Your Fast Selection Assessment has been submitted. FAST Careers placement team and partner Big 4 recruiters will review your responses.',
        [{ text: 'View Status', onPress: () => fetchExisting() }]
      );
      setExistingAssessment(res.data?.assessment || { status: 'submitted', mcqScore });
    } catch (err: any) {
      console.error('Assessment submit error:', err);
      const msg = err.response?.data?.message || 'Unable to submit assessment. Please check details and try again.';
      Alert.alert('Submission Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#034b71" />
        <Text style={styles.loadingText}>Loading Assessment Portal...</Text>
      </View>
    );
  }

  // If already submitted, display status dashboard card
  if (existingAssessment) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.statusHero}>
          <View style={styles.heroIconBox}>
            <Ionicons name="ribbon" size={36} color="#034b71" />
          </View>
          <Text style={styles.heroTitle}>Fast Selection Assessment</Text>
          <Text style={styles.heroSubtitle}>Your screening evaluation has been successfully submitted.</Text>

          <View style={styles.statusPill}>
            <Ionicons
              name={
                existingAssessment.status === 'shortlisted' ? 'checkmark-circle' :
                existingAssessment.status === 'rejected' ? 'close-circle' : 'time'
              }
              size={18}
              color={
                existingAssessment.status === 'shortlisted' ? '#059669' :
                existingAssessment.status === 'rejected' ? '#dc2626' : '#d97706'
              }
            />
            <Text style={styles.statusPillText}>
              Status: {existingAssessment.status?.toUpperCase() || 'SUBMITTED'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Assessment Performance</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreVal}>{existingAssessment.mcqScore || 0} / 2</Text>
              <Text style={styles.scoreLabel}>MCQ Score</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreVal}>
                {existingAssessment.adminRating ? `★ ${existingAssessment.adminRating}/5` : 'Under Review'}
              </Text>
              <Text style={styles.scoreLabel}>Evaluator Rating</Text>
            </View>
          </View>

          {existingAssessment.adminNotes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Recruiter / Admin Notes:</Text>
              <Text style={styles.notesContent}>{existingAssessment.adminNotes}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => {
              Alert.alert(
                'Retake Assessment',
                'Would you like to re-answer the questions and submit an updated assessment?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Retake Now', onPress: () => setExistingAssessment(null) }
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color="#034b71" />
            <Text style={styles.retakeBtnText}>Retake Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Test Introduction Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <View style={styles.fastTag}>
            <Ionicons name="flash" size={12} color="#034b71" />
            <Text style={styles.fastTagText}>Fast-Track Hiring Screening</Text>
          </View>
        </View>
        <Text style={styles.bannerTitle}>Fast Selection Screening Test</Text>
        <Text style={styles.bannerDesc}>
          Complete this 6-question CA aptitude & video screening test to fast-track your profile directly to shortlisted corporate interview rounds.
        </Text>
      </View>

      {/* Questions Form */}
      {QUESTIONS.map((q, idx) => (
        <View key={q.id} style={styles.questionCard}>
          <View style={styles.qHeader}>
            <Text style={styles.qNum}>QUESTION {q.id} OF 6</Text>
            <Text style={styles.qCat}>{q.category}</Text>
          </View>

          <Text style={styles.qTitle}>{q.title}</Text>
          {q.subtitle && <Text style={styles.qSub}>{q.subtitle}</Text>}

          {/* MCQ Options */}
          {q.type === 'mcq' && q.options && (
            <View style={styles.optionsList}>
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === opt;
                return (
                  <TouchableOpacity
                    key={optIdx}
                    style={[styles.optBtn, isSelected && styles.optBtnSelected]}
                    onPress={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInnerDot} />}
                    </View>
                    <Text style={[styles.optText, isSelected && styles.optTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Written Typing Input */}
          {q.type === 'typing' && (
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={5}
              placeholder={q.placeholder || 'Type your detailed response here...'}
              placeholderTextColor="#94a3b8"
              value={answers[q.id]}
              onChangeText={(text) => setAnswers(prev => ({ ...prev, [q.id]: text }))}
              textAlignVertical="top"
            />
          )}

          {/* Video Attachment / Recording */}
          {q.type === 'video' && (
            <View style={styles.videoBox}>
              <TouchableOpacity
                style={[styles.attachVideoBtn, videoFiles[q.id] && styles.attachVideoBtnFilled]}
                onPress={() => handlePickVideo(q.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={videoFiles[q.id] ? 'videocam' : 'cloud-upload'}
                  size={24}
                  color={videoFiles[q.id] ? '#059669' : '#034b71'}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.videoBtnTitle}>
                    {videoFiles[q.id] ? videoFiles[q.id].name : 'Upload / Attach Video Response'}
                  </Text>
                  <Text style={styles.videoBtnSub}>
                    {videoFiles[q.id] ? '✓ Video attached • Tap to change' : 'Select MP4 / MOV video from your phone'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Submit Assessment Button */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitBtnText}>Submit Complete Assessment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { fontSize: 13, color: '#64748b', marginTop: 12 },
  banner: { backgroundColor: '#034b71', borderRadius: 16, padding: 18, marginBottom: 16, elevation: 2 },
  bannerTop: { flexDirection: 'row', marginBottom: 8 },
  fastTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, gap: 4 },
  fastTagText: { fontSize: 10, fontWeight: 'bold', color: '#034b71' },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  bannerDesc: { fontSize: 12, color: '#bae6fd', marginTop: 6, lineHeight: 17 },
  questionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qNum: { fontSize: 11, fontWeight: 'bold', color: '#034b71' },
  qCat: { fontSize: 10, fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  qTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', lineHeight: 20 },
  qSub: { fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
  optionsList: { marginTop: 12, gap: 8 },
  optBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  optBtnSelected: { borderColor: '#034b71', backgroundColor: '#f0f9ff' },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioCircleSelected: { borderColor: '#034b71' },
  radioInnerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#034b71' },
  optText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
  optTextSelected: { color: '#034b71', fontWeight: 'bold' },
  textArea: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 13, color: '#0f172a', minHeight: 90, marginTop: 12 },
  videoBox: { marginTop: 12 },
  attachVideoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderWidth: 1.5, borderColor: '#38bdf8', borderStyle: 'dashed', borderRadius: 12, padding: 14 },
  attachVideoBtnFilled: { backgroundColor: '#ecfdf5', borderColor: '#10b981', borderStyle: 'solid' },
  videoBtnTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  videoBtnSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  submitBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  statusHero: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  heroIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  heroSubtitle: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4 },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  statusPillText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  scoreBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  scoreVal: { fontSize: 16, fontWeight: 'bold', color: '#034b71' },
  scoreLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },
  notesBox: { backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#fef08a', borderRadius: 10, padding: 12, marginBottom: 14 },
  notesTitle: { fontSize: 11, fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase' },
  notesContent: { fontSize: 13, color: '#713f12', marginTop: 4 },
  retakeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderRadius: 10, paddingVertical: 10, gap: 6 },
  retakeBtnText: { fontSize: 13, fontWeight: 'bold', color: '#034b71' }
});
