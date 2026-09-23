import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ShareJobScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    industry: 'Finance',
    companyName: '',
    jobDescription: '',
    location: '',
    region: 'North',
    noOfPost: '1',
    concernedPerson: '',
    mobileNo: '',
    emailId: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!formData.companyName.trim() || !formData.jobDescription.trim() || !formData.location.trim() || !formData.concernedPerson.trim() || !formData.mobileNo.trim()) {
      Alert.alert('Required Fields', 'Please fill in Company Name, Job Description, Location, Contact Person, and Mobile Number.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/shared-jobs', formData);
      Alert.alert(
        'Opportunity Shared! 🚀',
        'Thank you for sharing this opening with the CA community! Our admin team will verify and list it for candidates.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setFormData({
        industry: 'Finance',
        companyName: '',
        jobDescription: '',
        location: '',
        region: 'North',
        noOfPost: '1',
        concernedPerson: '',
        mobileNo: '',
        emailId: ''
      });
    } catch (err: any) {
      console.error('Share job error:', err);
      const msg = err.response?.data?.message || 'Unable to submit job opportunity. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="share-social" size={28} color="#034b71" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Share Job Opportunities</Text>
          <Text style={styles.bannerSubtitle}>
            Know of an opening in your company or network? Post the details to help fellow Chartered Accountants.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Industry Sector *</Text>
        <View style={styles.pillRow}>
          {['Finance', 'Audit', 'Taxation', 'IT/ITeS', 'Banking', 'Manufacturing'].map((ind) => (
            <TouchableOpacity
              key={ind}
              style={[styles.npPill, formData.industry === ind && styles.npPillActive]}
              onPress={() => setFormData({ ...formData, industry: ind })}
            >
              <Text style={[styles.npPillText, formData.industry === ind && styles.npPillTextActive]}>{ind}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ernst & Young / Reliance"
          placeholderTextColor="#94a3b8"
          value={formData.companyName}
          onChangeText={(v) => setFormData({ ...formData, companyName: v })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Location / City *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai / Delhi"
              placeholderTextColor="#94a3b8"
              value={formData.location}
              onChangeText={(v) => setFormData({ ...formData, location: v })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>No. of Vacancies</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.noOfPost}
              onChangeText={(v) => setFormData({ ...formData, noOfPost: v })}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Job Description & Requirements *</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Describe role responsibilities, experience needed, qualification (CA Fresher / 1-3 yrs exp)."
          placeholderTextColor="#94a3b8"
          value={formData.jobDescription}
          onChangeText={(v) => setFormData({ ...formData, jobDescription: v })}
          textAlignVertical="top"
        />

        <Text style={styles.sectionDivider}>HR / Hiring Contact Details</Text>

        <Text style={styles.inputLabel}>Concerned Person Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Priya (HR Manager)"
          placeholderTextColor="#94a3b8"
          value={formData.concernedPerson}
          onChangeText={(v) => setFormData({ ...formData, concernedPerson: v })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Mobile / WhatsApp *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={formData.mobileNo}
              onChangeText={(v) => setFormData({ ...formData, mobileNo: v })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Official Email</Text>
            <TextInput
              style={styles.input}
              placeholder="hr@company.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.emailId}
              onChangeText={(v) => setFormData({ ...formData, emailId: v })}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Post & Share Opening</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  banner: { flexDirection: 'row', backgroundColor: '#e0f2fe', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
  bannerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#034b71' },
  bannerSubtitle: { fontSize: 12, color: '#0284c7', marginTop: 4, lineHeight: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0f172a' },
  row: { flexDirection: 'row', gap: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  npPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  npPillActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  npPillText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  npPillTextActive: { color: '#ffffff', fontWeight: 'bold' },
  textArea: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14, color: '#0f172a', minHeight: 90, marginTop: 4 },
  sectionDivider: { fontSize: 14, fontWeight: 'bold', color: '#034b71', marginTop: 20, marginBottom: 4, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  submitBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 22 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
