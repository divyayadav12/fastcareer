import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function WantToChangeJobScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    currentCompany: '',
    currentDesignation: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '30 Days',
    reason: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!formData.currentCompany.trim() || !formData.currentDesignation.trim() || !formData.currentCTC.trim() || !formData.expectedCTC.trim()) {
      Alert.alert('Required Fields', 'Please provide your current company, designation, current CTC, and expected CTC.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/candidate/job-change', formData);
      Alert.alert(
        'Request Submitted! 🤝',
        'Your confidential job change request has been recorded. Our Senior Executive Placement team will review and contact you discreetly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setFormData({
        currentCompany: '',
        currentDesignation: '',
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: '30 Days',
        reason: ''
      });
    } catch (err: any) {
      console.error('Job change request error:', err);
      const msg = err.response?.data?.message || 'Unable to submit job change request. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="refresh-circle" size={32} color="#034b71" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Confidential Career Transition</Text>
          <Text style={styles.bannerSubtitle}>
            Looking for growth or a domain switch? We keep your profile completely discreet from your current employer.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Current Employer / Company *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. KPMG / ABC Corp"
          placeholderTextColor="#94a3b8"
          value={formData.currentCompany}
          onChangeText={(v) => setFormData({ ...formData, currentCompany: v })}
        />

        <Text style={styles.inputLabel}>Current Designation *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Senior Associate - Internal Audit"
          placeholderTextColor="#94a3b8"
          value={formData.currentDesignation}
          onChangeText={(v) => setFormData({ ...formData, currentDesignation: v })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Current CTC (₹ LPA) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 12"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.currentCTC}
              onChangeText={(v) => setFormData({ ...formData, currentCTC: v })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Expected CTC (₹ LPA) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 16"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.expectedCTC}
              onChangeText={(v) => setFormData({ ...formData, expectedCTC: v })}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Notice Period</Text>
        <View style={styles.pillRow}>
          {['Immediate', '15 Days', '30 Days', '60 Days', '90 Days'].map((np) => (
            <TouchableOpacity
              key={np}
              style={[styles.npPill, formData.noticePeriod === np && styles.npPillActive]}
              onPress={() => setFormData({ ...formData, noticePeriod: np })}
            >
              <Text style={[styles.npPillText, formData.noticePeriod === np && styles.npPillTextActive]}>{np}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Primary Reason for Switch / Preferences</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          placeholder="e.g. Looking for FP&A or Investment Banking roles in Mumbai / Remote."
          placeholderTextColor="#94a3b8"
          value={formData.reason}
          onChangeText={(v) => setFormData({ ...formData, reason: v })}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Confidential Request</Text>
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
  textArea: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14, color: '#0f172a', minHeight: 80, marginTop: 4 },
  submitBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
