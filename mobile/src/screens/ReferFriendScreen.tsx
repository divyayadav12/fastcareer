import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';
import * as DocumentPicker from 'expo-document-picker';

export default function ReferFriendScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    friendName: '',
    friendEmail: '',
    friendPhone: '',
    relation: 'Batchmate'
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const referralCode = `FAST${(user?._id || user?.id || 'CA').slice(-4).toUpperCase()}`;
  const referralText = `Hey! Join FAST Careers to get placed at Top Big 4s, FMCG & Fortune 500 companies. Use my referral code ${referralCode} or register here: https://fastcareer.onrender.com/register`;

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedFile(res.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: referralText,
        title: 'Refer a Friend to FAST Careers'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(referralText)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(referralText)}`);
      }
    }).catch(() => {
      Share.share({ message: referralText });
    });
  };

  const handleSubmit = async () => {
    if (!formData.friendName.trim() || !formData.friendEmail.trim() || !formData.friendPhone.trim()) {
      Alert.alert('Required Fields', 'Please fill in your friend\'s full name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('friendName', formData.friendName);
      data.append('friendEmail', formData.friendEmail);
      data.append('friendPhone', formData.friendPhone);
      data.append('relation', formData.relation);

      if (selectedFile) {
        data.append('resume', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || 'application/pdf',
        } as any);
      }

      await api.post('/candidate/referrals', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert(
        'Referral Submitted! 🎉',
        `Thank you for referring ${formData.friendName}! Our placement team will contact them with relevant opportunities.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setFormData({ friendName: '', friendEmail: '', friendPhone: '', relation: 'Batchmate' });
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Referral submit error:', err);
      const msg = err.response?.data?.message || 'Failed to submit referral. Please check details and try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Reward Promo Banner */}
      <View style={styles.rewardBanner}>
        <View style={styles.rewardIcon}>
          <Ionicons name="gift" size={28} color="#034b71" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rewardTitle}>Earn up to ₹10,000 per Placement!</Text>
          <Text style={styles.rewardSubtitle}>
            When your referred CA friend gets successfully placed through FAST Careers, you receive referral rewards.
          </Text>
        </View>
      </View>

      {/* Quick Share Buttons */}
      <View style={styles.quickShareCard}>
        <Text style={styles.sectionHeader}>Instant Share</Text>
        <Text style={styles.codeText}>Your Referral Code: <Text style={styles.codeHighlight}>{referralCode}</Text></Text>
        <View style={styles.shareButtonsRow}>
          <TouchableOpacity style={styles.waBtn} onPress={handleWhatsAppShare} activeOpacity={0.8}>
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nativeShareBtn} onPress={handleShareApp} activeOpacity={0.8}>
            <Ionicons name="share-social" size={18} color="#034b71" />
            <Text style={styles.nativeShareBtnText}>Share Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Direct Referral Form */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Or Submit Friend's Profile Directly</Text>

        <Text style={styles.inputLabel}>Friend's Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. CA Rohan Sharma"
          placeholderTextColor="#94a3b8"
          value={formData.friendName}
          onChangeText={(v) => setFormData({ ...formData, friendName: v })}
        />

        <Text style={styles.inputLabel}>Friend's Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. rohan.ca@gmail.com"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.friendEmail}
          onChangeText={(v) => setFormData({ ...formData, friendEmail: v })}
        />

        <Text style={styles.inputLabel}>Friend's Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 9876543210"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={formData.friendPhone}
          onChangeText={(v) => setFormData({ ...formData, friendPhone: v })}
        />

        <Text style={styles.inputLabel}>Relationship</Text>
        <View style={styles.relationRow}>
          {['Batchmate', 'Colleague', 'Friend', 'Family'].map((rel) => (
            <TouchableOpacity
              key={rel}
              style={[styles.relPill, formData.relation === rel && styles.relPillActive]}
              onPress={() => setFormData({ ...formData, relation: rel })}
            >
              <Text style={[styles.relPillText, formData.relation === rel && styles.relPillTextActive]}>{rel}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Attach Resume (Optional)</Text>
        <TouchableOpacity style={styles.filePicker} onPress={handlePickDocument} activeOpacity={0.8}>
          <Ionicons name={selectedFile ? "document-attach" : "cloud-upload-outline"} size={22} color="#034b71" />
          <Text style={styles.filePickerText} numberOfLines={1}>
            {selectedFile ? selectedFile.name : "Select PDF/Docx File"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Referral Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  rewardBanner: { flexDirection: 'row', backgroundColor: '#e0f2fe', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
  rewardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rewardTitle: { fontSize: 14, fontWeight: 'bold', color: '#034b71' },
  rewardSubtitle: { fontSize: 12, color: '#0284c7', marginTop: 4, lineHeight: 16 },
  quickShareCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  codeText: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  codeHighlight: { fontWeight: 'bold', color: '#034b71', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  shareButtonsRow: { flexDirection: 'row', gap: 10 },
  waBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 6 },
  nativeShareBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 6 },
  shareBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  nativeShareBtnText: { color: '#034b71', fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0f172a' },
  relationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  relPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  relPillActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  relPillText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  relPillTextActive: { color: '#ffffff', fontWeight: 'bold' },
  filePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderStyle: 'dashed', borderRadius: 10, padding: 12, gap: 10, marginTop: 4 },
  filePickerText: { fontSize: 13, color: '#034b71', fontWeight: '500', flex: 1 },
  submitBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
