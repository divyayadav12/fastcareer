import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function FeedbackScreen({ navigation }: any) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating (1 to 5) for your experience.');
      return;
    }
    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your comments or suggestions.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/candidate/feedback', {
        rating,
        message: feedback
      });
      Alert.alert(
        'Thank You! 🎉',
        'Your feedback has been submitted successfully. We appreciate your valuable suggestions to improve FAST Careers.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setRating(0);
      setFeedback('');
    } catch (err: any) {
      console.error('Feedback error:', err);
      const msg = err.response?.data?.message || 'Unable to submit feedback right now. Please try again.';
      Alert.alert('Submission Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses" size={32} color="#034b71" />
          </View>
          <Text style={styles.title}>Feel it, Say it!</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us continuously improve and build the best placement platform for Chartered Accountants.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Rate your overall experience</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? "#eab308" : "#cbd5e1"}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingLabel}>
              {rating === 5 ? "⭐⭐⭐⭐⭐ Outstanding!" :
               rating === 4 ? "⭐⭐⭐⭐ Very Good" :
               rating === 3 ? "⭐⭐⭐ Good" :
               rating === 2 ? "⭐⭐ Needs Improvement" : "⭐ Poor"}
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Tell us more about your experience</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            placeholder="What did you like? What features or services can we improve?"
            placeholderTextColor="#94a3b8"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, (rating === 0 || !feedback.trim() || submitting) && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={rating === 0 || !feedback.trim() || submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Feedback</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  headerBox: { alignItems: 'center', marginVertical: 12, paddingHorizontal: 12 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 10 },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 8 },
  starBtn: { padding: 4 },
  ratingLabel: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#034b71', marginTop: 4 },
  textArea: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 14, fontSize: 14, color: '#0f172a', minHeight: 110, marginTop: 4 },
  submitBtn: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
