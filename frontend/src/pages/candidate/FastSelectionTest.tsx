import React, { useState, useEffect, useRef } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Zap, 
  CheckCircle2, 
  Mic, 
  Square, 
  RotateCcw, 
  Play, 
  Pause, 
  Clock, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Award, 
  AlertCircle,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface QuestionDef {
  id: number;
  type: 'mcq' | 'typing' | 'audio';
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
    type: 'audio',
    category: 'Personal Introduction & Pitch (Voice Recording - Max 3 Mins)',
    title: 'Please record your spoken voice answer introducing yourself, summarizing your CA journey/attempts, key strengths in Finance & Audit, and why you are the best fit for top tier roles.',
    subtitle: 'Press Start Recording to begin. You have up to 3 minutes. You can stop early or it will automatically stop at 3:00.'
  },
  {
    id: 6,
    type: 'audio',
    category: 'Technical Articulation (Voice Recording - Max 3 Mins)',
    title: 'Explain in your own words the concept and impact of Deferred Tax Asset (DTA) vs Deferred Tax Liability (DTL) on financial statements, OR explain any recent significant amendment in the Income Tax Act / GST that you find important.',
    subtitle: 'Press Start Recording to articulate your technical explanation clearly. Max duration: 3 minutes.'
  }
];

export const FastSelectionTest = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [existingAssessment, setExistingAssessment] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Form State for the 6 answers
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: ''
  });

  // Audio recording state for Q5 and Q6
  const [recordingForQ, setRecordingForQ] = useState<number | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobs, setAudioBlobs] = useState<Record<number, Blob | null>>({ 5: null, 6: null });
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({ 5: '', 6: '' });
  const [audioDurations, setAudioDurations] = useState<Record<number, number>>({ 5: 0, 6: 0 });
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch candidate's previous submission if any
  useEffect(() => {
    const fetchMyAssessment = async () => {
      setLoadingExisting(true);
      try {
        const res = await api.get('/assessments/my');
        if (res.data) {
          setExistingAssessment(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch existing assessment:', err);
      } finally {
        setLoadingExisting(false);
      }
    };
    if (user) {
      fetchMyAssessment();
    }
  }, [user]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start audio recording for a question
  const startRecording = async (qId: number) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Microphone access is not supported by your browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const localPreviewUrl = URL.createObjectURL(audioBlob);

        setAudioBlobs(prev => ({ ...prev, [qId]: audioBlob }));
        setAudioUrls(prev => ({ ...prev, [qId]: localPreviewUrl }));
        setAudioDurations(prev => ({ ...prev, [qId]: recordingSecondsRef.current }));

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      setRecordingForQ(qId);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;

      mediaRecorder.start(250); // collect 250ms chunks

      // Start 3-minute (180s) timer countdown
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          const next = prev + 1;
          recordingSecondsRef.current = next;
          if (next >= 180) {
            // Auto-stop at 3 minutes (180s)
            stopRecording(qId);
            toast('3-minute time limit reached. Recording finished!', { icon: '⏰' });
          }
          return next;
        });
      }, 1000);

      toast.success(`Recording started for Question ${qId}. Speak clearly!`);
    } catch (err: any) {
      console.error('Microphone permission denied or error:', err);
      toast.error('Could not access microphone. Please allow microphone permission in your browser.');
    }
  };

  const recordingSecondsRef = useRef(0);

  // Stop audio recording
  const stopRecording = (qId: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setRecordingForQ(null);
    toast.success(`Recording stopped for Question ${qId}. You can listen back below.`);
  };

  // Re-record audio
  const handleRerecord = (qId: number) => {
    if (window.confirm('Do you want to discard this recording and record again?')) {
      setAudioBlobs(prev => ({ ...prev, [qId]: null }));
      setAudioUrls(prev => ({ ...prev, [qId]: '' }));
      setAudioDurations(prev => ({ ...prev, [qId]: 0 }));
      setAnswers(prev => ({ ...prev, [qId]: '' }));
      setRecordingSeconds(0);
    }
  };

  // Upload an audio blob to server
  const uploadAudioBlob = async (blob: Blob, qId: number): Promise<string> => {
    const formData = new FormData();
    const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
    formData.append('audio', blob, `question_${qId}_audio.${ext}`);

    const res = await api.post('/assessments/upload-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.audioUrl;
  };

  // Submit the full assessment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation for MCQs
    if (!answers[1]) {
      toast.error('Please answer Question 1 (MCQ).');
      return;
    }
    if (!answers[2]) {
      toast.error('Please answer Question 2 (MCQ).');
      return;
    }

    // 2. Validation for Written Answers
    if (!answers[3] || answers[3].trim().length < 15) {
      toast.error('Please provide a complete written answer for Question 3.');
      return;
    }
    if (!answers[4] || answers[4].trim().length < 15) {
      toast.error('Please provide a complete written answer for Question 4.');
      return;
    }

    // 3. Validation for Audio Questions
    if (!audioBlobs[5] && !answers[5]) {
      toast.error('Please record your voice answer for Question 5 (Max 3 Mins).');
      return;
    }
    if (!audioBlobs[6] && !answers[6]) {
      toast.error('Please record your voice answer for Question 6 (Max 3 Mins).');
      return;
    }

    // If currently recording, stop it first
    if (recordingForQ) {
      stopRecording(recordingForQ);
    }

    setSubmitting(true);
    try {
      // Step A: Upload voice recordings to server / Cloudinary
      setUploadingAudio(true);
      let q5AudioUrl = answers[5];
      let q6AudioUrl = answers[6];

      if (audioBlobs[5]) {
        toast.loading('Uploading voice answer 1 of 2...', { id: 'upload-audio-toast' });
        q5AudioUrl = await uploadAudioBlob(audioBlobs[5], 5);
      }

      if (audioBlobs[6]) {
        toast.loading('Uploading voice answer 2 of 2...', { id: 'upload-audio-toast' });
        q6AudioUrl = await uploadAudioBlob(audioBlobs[6], 6);
      }
      toast.dismiss('upload-audio-toast');
      setUploadingAudio(false);

      // Step B: Submit all 6 answers
      const payloadAnswers = [
        {
          questionId: 1,
          questionText: QUESTIONS[0].title,
          type: 'mcq',
          candidateAnswer: answers[1]
        },
        {
          questionId: 2,
          questionText: QUESTIONS[1].title,
          type: 'mcq',
          candidateAnswer: answers[2]
        },
        {
          questionId: 3,
          questionText: QUESTIONS[2].title,
          type: 'typing',
          candidateAnswer: answers[3]
        },
        {
          questionId: 4,
          questionText: QUESTIONS[3].title,
          type: 'typing',
          candidateAnswer: answers[4]
        },
        {
          questionId: 5,
          questionText: QUESTIONS[4].title,
          type: 'audio',
          candidateAnswer: q5AudioUrl,
          audioDurationSeconds: audioDurations[5] || 0
        },
        {
          questionId: 6,
          questionText: QUESTIONS[5].title,
          type: 'audio',
          candidateAnswer: q6AudioUrl,
          audioDurationSeconds: audioDurations[6] || 0
        }
      ];

      const res = await api.post('/assessments/submit', { answers: payloadAnswers });
      toast.success('Assessment submitted successfully! Fast-track evaluation initiated.');
      setExistingAssessment(res.data.assessment);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      toast.error(err.response?.data?.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingAudio(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                Fast-Track Shortlisting
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Candidate Fast Selection Assessment
              </h1>
              <p className="text-blue-100/80 text-sm mt-2 max-w-xl leading-relaxed">
                Demonstrate your technical expertise and communication proficiency. 
                Complete 6 quick questions (2 MCQs, 2 Typing, 2 Voice Recordings) to get shortlisted ahead of others.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0 min-w-[150px]">
              <div className="text-xs font-semibold text-blue-200 uppercase">Assessment Structure</div>
              <div className="text-2xl font-black text-white mt-1">6 Questions</div>
              <div className="text-xs text-blue-200 mt-1">2 MCQ • 2 Text • 2 Audio</div>
            </div>
          </div>
        </div>

        {/* Existing Submission Banner */}
        {loadingExisting ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Checking assessment status...</p>
          </div>
        ) : existingAssessment ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Award size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-emerald-900 text-base">
                    Fast Selection Test Submitted!
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-emerald-200 text-emerald-800">
                    {existingAssessment.status}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Submitted on {new Date(existingAssessment.createdAt).toLocaleDateString()} • MCQ Score: <strong>{existingAssessment.mcqScore} / {existingAssessment.totalMcqQuestions || 2}</strong>
                </p>
                {existingAssessment.adminNotes && (
                  <div className="mt-2 text-xs bg-white/80 border border-emerald-300/60 p-2.5 rounded-lg text-emerald-900">
                    <strong>Admin Feedback:</strong> {existingAssessment.adminNotes}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Do you want to re-take the assessment? Your previous answers will be updated.')) {
                  setExistingAssessment(null);
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Re-take Assessment
            </button>
          </div>
        ) : null}

        {/* Assessment Form */}
        {!existingAssessment && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: MCQs (Q1 & Q2) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                <HelpCircle size={18} />
                Part 1: Multiple Choice Questions (2 Questions)
              </div>

              <div className="space-y-8">
                {QUESTIONS.slice(0, 2).map((q) => (
                  <div key={q.id} className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">{q.category}</span>
                        <h4 className="font-bold text-gray-900 text-sm mt-0.5">{q.title}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 pl-8">
                      {q.options?.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <label
                            key={optIdx}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-primary/5 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary'
                                : 'bg-gray-50/60 border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question_${q.id}`}
                              value={opt}
                              checked={isSelected}
                              onChange={() => {}}
                              className="text-primary focus:ring-primary h-4 w-4 shrink-0"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Typing / Written Questions (Q3 & Q4) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                <FileText size={18} />
                Part 2: Written / Descriptive Questions (2 Questions)
              </div>

              <div className="space-y-8">
                {QUESTIONS.slice(2, 4).map((q) => (
                  <div key={q.id} className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">{q.category}</span>
                        <h4 className="font-bold text-gray-900 text-sm mt-0.5">{q.title}</h4>
                      </div>
                    </div>

                    <div className="pl-8">
                      <textarea
                        rows={4}
                        required
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.placeholder}
                        className="w-full p-4 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
                      />
                      <div className="text-right text-xs text-gray-400 mt-1">
                        {(answers[q.id] || '').trim().split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Audio Recording Questions (Q5 & Q6) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <Mic size={18} />
                  Part 3: Spoken Voice Recording Questions (2 Questions)
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1">
                  <Clock size={12} /> Max 3 Mins Each
                </span>
              </div>

              <div className="space-y-8">
                {QUESTIONS.slice(4, 6).map((q) => {
                  const isRecordingThis = recordingForQ === q.id;
                  const hasRecorded = !!audioUrls[q.id];

                  return (
                    <div key={q.id} className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {q.id}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase">{q.category}</span>
                          <h4 className="font-bold text-gray-900 text-sm mt-0.5">{q.title}</h4>
                          {q.subtitle && <p className="text-xs text-gray-500 mt-1">{q.subtitle}</p>}
                        </div>
                      </div>

                      {/* Audio Controller Card */}
                      <div className="pl-8">
                        <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 space-y-4">
                          
                          {/* Live Recording State */}
                          {isRecordingThis ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                              <div className="flex items-center gap-3">
                                <span className="w-3.5 h-3.5 bg-red-600 rounded-full animate-ping"></span>
                                <div>
                                  <div className="text-sm font-bold text-red-900">Recording Spoken Voice...</div>
                                  <div className="text-xs text-red-600">Auto-stops at 03:00 (or press stop when done)</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-lg font-mono font-black text-red-700">
                                  {formatTime(recordingSeconds)} / 03:00
                                </div>
                                <button
                                  type="button"
                                  onClick={() => stopRecording(q.id)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                                >
                                  <Square size={14} /> Stop Recording
                                </button>
                              </div>
                            </div>
                          ) : hasRecorded ? (
                            /* Recorded State with Playback */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={20} />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-emerald-900">Voice Recording Saved!</div>
                                  <div className="text-xs text-emerald-700">
                                    Duration: {formatTime(audioDurations[q.id] || 0)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <audio controls src={audioUrls[q.id]} className="h-9 max-w-[220px] sm:max-w-[260px]" />
                                <button
                                  type="button"
                                  onClick={() => handleRerecord(q.id)}
                                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                  title="Record Again"
                                >
                                  <RotateCcw size={13} /> Re-record
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Initial Ready to Record State */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                                  <Volume2 size={20} />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-800">Ready to Record Voice Answer</div>
                                  <div className="text-xs text-gray-500">Ensure microphone permission is granted. Max 3 minutes.</div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => startRecording(q.id)}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                              >
                                <Mic size={16} /> Start Recording
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>All answers and voice recordings will be securely evaluated by the recruitment team.</span>
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingAudio || recordingForQ !== null}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {uploadingAudio ? 'Uploading Voice Recordings...' : 'Submitting Assessment...'}
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit Fast Selection Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </CandidateLayout>
  );
};
