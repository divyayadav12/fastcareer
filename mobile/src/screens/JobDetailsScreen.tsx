import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';

export default function JobDetailsScreen({ route, navigation }: any) {
  const { job } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const targetJobId = job?._id || job?.id;
    const checkApplied = async () => {
      if (!user?._id || !targetJobId) return;
      try {
        const res = await api.get(`/applications/candidate/${user._id}`);
        const applied = (res.data || []).some((app: any) => {
          const appJobId = app.job?._id || app.job;
          return String(appJobId) === String(targetJobId);
        });
        if (applied) setHasApplied(true);
      } catch (err) {
        console.log('Error checking application status:', err);
      }
    };
    checkApplied();
  }, [user, job]);

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to apply for this job.');
      return;
    }

    const isProfileComplete = Boolean(
      user?.profileCompleted ||
      user?.qualifications?.graduation?.courseName ||
      user?.qualifications?.graduation?.completed
    );

    if (!isProfileComplete) {
      Alert.alert(
        'Profile Incomplete',
        'Job apply karne ke liye pehle apna profile complete karein.',
        [
          { text: 'Go to Profile', onPress: () => navigation.navigate('Profile') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    const targetJobId = job?._id || job?.id;
    if (!targetJobId) {
      Alert.alert('Error', 'Invalid job details. Please try again from the jobs list.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/applications/${targetJobId}`, {
        existingResumeUrl: user.resumeUrl || '',
      });
      setHasApplied(true);
      Alert.alert(
        'Application Submitted! 🎉', 
        `You have successfully applied for the position of ${job.title} at ${job.company}.`,
        [
          { text: 'View My Applications', onPress: () => navigation.navigate('MyApps') },
          { text: 'OK' }
        ]
      );
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to submit application. Please try again.';
      if (msg.toLowerCase().includes('already applied')) {
        setHasApplied(true);
      }
      Alert.alert('Notice', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {job.isHot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotText}>HOT JOB</Text>
            </View>
          )}
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>{job.company}</Text>

          <View style={styles.tagRow}>
            {job.location ? <View style={styles.tag}><Text style={styles.tagText}>{job.location}</Text></View> : null}
            {job.type ? <View style={styles.tag}><Text style={styles.tagText}>{job.type}</Text></View> : null}
            {job.salaryRange ? <View style={styles.tag}><Text style={styles.tagText}>{job.salaryRange}</Text></View> : null}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.descriptionText}>{job.description || 'No description provided.'}</Text>

          {job.requirements && job.requirements.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Requirements</Text>
              {job.requirements.map((req: string, index: number) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{req}</Text>
                </View>
              ))}
            </>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Key Responsibilities</Text>
              {job.responsibilities.map((resp: string, index: number) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{resp}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.applyButton, (hasApplied || isSubmitting) && styles.applyButtonDisabled]} 
          onPress={handleApply}
          disabled={hasApplied || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.applyButtonText}>{hasApplied ? 'Applied ✓' : 'Apply Now'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8 },
  backButtonText: { color: '#0f172a', fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  
  hotBadge: { alignSelf: 'flex-start', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fecaca', marginBottom: 12 },
  hotText: { color: '#ef4444', fontSize: 10, fontWeight: 'bold' },
  
  jobTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  jobCompany: { fontSize: 16, color: '#034b71', fontWeight: '600', marginBottom: 16 },
  
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  tagText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  descriptionText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  bulletRow: { flexDirection: 'row', marginBottom: 8 },
  bullet: { fontSize: 16, color: '#034b71', marginRight: 8, lineHeight: 20 },
  bulletText: { fontSize: 14, color: '#475569', flex: 1, lineHeight: 20 },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', elevation: 8 },
  applyButton: { backgroundColor: '#034b71', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  applyButtonDisabled: { backgroundColor: '#10b981' },
  applyButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
