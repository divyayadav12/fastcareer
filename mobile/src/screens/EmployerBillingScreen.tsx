import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmployerBillingScreen() {
  const plans = [
    {
      id: 'starter',
      name: 'Starter Recruiter',
      price: '₹9,999 / mo',
      credits: '10 Job Posts',
      features: [
        '10 Active Job Listings',
        'Direct Candidate WhatsApp / Phone Access',
        'Standard Email Support',
        '30-Day Listing Validity'
      ],
      popular: false
    },
    {
      id: 'growth',
      name: 'Corporate Growth',
      price: '₹24,999 / mo',
      credits: 'Unlimited Candidates',
      features: [
        'Unlimited Active Job Listings',
        'Verified CA Candidate Search & Filters',
        'Candidate Fast-Track Video & Audio Screening',
        'Dedicated Account Manager',
        'Custom Campus Drive Support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Big 4 / MNC',
      price: 'Custom Annual',
      credits: 'Pan-India Hiring',
      features: [
        'Unlimited CA Freshers & Experienced Hires',
        'Customized Placement Day Onsite Support',
        'Priority Candidate Shortlisting',
        'API & ATS Integration Support'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (plan: any) => {
    Alert.alert(
      `Upgrade to ${plan.name}`,
      `Selected Plan: ${plan.name} (${plan.price})\n\nOur Corporate Partnerships team will connect with you to activate credits.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Activation',
          onPress: () => {
            Alert.alert('Request Sent 🚀', `Thank you! Our relationship manager will contact your HR team within 2 hours.`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Subscription Card */}
      <View style={styles.activePlanCard}>
        <View style={styles.activePlanTop}>
          <View>
            <Text style={styles.activePlanLabel}>Current Plan</Text>
            <Text style={styles.activePlanName}>Corporate Free Trial</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>
        <Text style={styles.creditsText}>Available Candidate Searches: Unlimited</Text>
        <Text style={styles.creditsSub}>Valid for next 14 days</Text>
      </View>

      <Text style={styles.sectionHeading}>Upgrade Recruitment Plans</Text>

      {plans.map((plan) => (
        <View key={plan.id} style={[styles.planCard, plan.popular && styles.planCardPopular]}>
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>★ MOST POPULAR</Text>
            </View>
          )}

          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planCredits}>Includes: {plan.credits}</Text>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {plan.features.map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.chooseBtn, plan.popular && styles.chooseBtnPopular]}
            onPress={() => handleSelectPlan(plan)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chooseBtnText, plan.popular && styles.chooseBtnTextPopular]}>
              {plan.popular ? 'Upgrade to Growth Plan' : 'Select Plan'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  activePlanCard: { backgroundColor: '#034b71', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 },
  activePlanTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activePlanLabel: { fontSize: 12, color: '#bae6fd', textTransform: 'uppercase', fontWeight: '700' },
  activePlanName: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 2 },
  activeBadge: { backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activeBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  creditsText: { fontSize: 13, color: '#e0f2fe', marginTop: 12, fontWeight: '600' },
  creditsSub: { fontSize: 11, color: '#bae6fd', marginTop: 2 },
  sectionHeading: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', marginBottom: 14 },
  planCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  planCardPopular: { borderColor: '#034b71', borderWidth: 2, backgroundColor: '#f0f9ff' },
  popularBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: '#034b71', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  popularBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  planName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  planPrice: { fontSize: 22, fontWeight: 'bold', color: '#034b71', marginTop: 4 },
  planCredits: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 14 },
  featuresList: { gap: 10, marginBottom: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: '#334155', flex: 1 },
  chooseBtn: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  chooseBtnPopular: { backgroundColor: '#034b71', borderColor: '#034b71' },
  chooseBtnText: { color: '#034b71', fontSize: 14, fontWeight: 'bold' },
  chooseBtnTextPopular: { color: '#ffffff' }
});
