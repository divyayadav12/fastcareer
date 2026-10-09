import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PASS_OUT_ATTEMPTS = [
  { attempt: 'May 2024', count: '20,446', pct: '100%', color: '#2563eb' },
  { attempt: 'Nov 2024', count: '11,500', pct: '56%', color: '#4f46e5' },
  { attempt: 'May 2025', count: '14,247', pct: '70%', color: '#7c3aed' },
  { attempt: 'Sep 2025', count: '11,466', pct: '56%', color: '#d97706' },
  { attempt: 'Jan 2026', count: '7,590', pct: '37%', color: '#e11d48' },
  { attempt: 'May 2026', count: '7,931', pct: '39%', color: '#034b71', isCurrent: true },
];

const COMPARATIVE_DATA = [
  {
    parameter: 'Delivery Mode',
    icai: 'Physical Mode Only. Candidates divided across separate city centers.',
    fast: 'Physical (Mumbai & Delhi) + Pan-India Centralized Virtual Campus on Zoom/Teams.',
  },
  {
    parameter: 'Candidate Pool Access',
    icai: 'Divided city-wise; recruiter must attend each city individually.',
    fast: 'All India CA Pool in One Go! Candidates apply from all regions without city barriers.',
  },
  {
    parameter: 'Pricing & Commercials',
    icai: 'Fixed Cost Model — Pay upfront to participate, regardless of joining.',
    fast: 'Variable Model — Pay ONLY if candidate joins. No fixed fees, zero venue costs.',
  },
  {
    parameter: 'Participation Ratio',
    icai: 'Standard registration format with limited pre-drive filtering.',
    fast: '40% to 60% of newly qualified CAs + All Top 50 AIR Rankers.',
  },
  {
    parameter: 'Shortlisting & Follow-up',
    icai: 'Company handles raw lists and post-offer processes independently.',
    fast: 'Pre-screened Excel database after recruiter phone calls + post-offer joining follow-ups.',
  },
];

export default function PlacementResultsScreen({ navigation }: any) {
  const handleContactDrive = () => {
    Linking.openURL('tel:918839250427').catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.tagPill}>
          <Ionicons name="sparkles" size={13} color="#fde047" />
          <Text style={styles.tagPillText}>FAST Campus Placement Drives</Text>
        </View>
        <Text style={styles.heroTitle}>Pan-India Chartered Accountant Placement Drive Results</Text>
        <Text style={styles.heroSub}>
          Connecting top corporate recruiters, Big 4 accounting firms, and high-growth MNCs with qualified CAs and AIR rankers.
        </Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,500+</Text>
            <Text style={styles.statLabel}>CAs Placed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>350+</Text>
            <Text style={styles.statLabel}>Top Recruiters</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₹12.5 LPA</Text>
            <Text style={styles.statLabel}>Avg Package</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₹36 LPA</Text>
            <Text style={styles.statLabel}>Highest CTC</Text>
          </View>
        </View>
      </View>

      {/* Comparative Analysis Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-compare-outline" size={18} color="#034b71" />
          <Text style={styles.sectionTitle}>FAST Drive vs Other Placement Drives</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Why India's top corporates choose FAST Careers for their CA campus hiring:
        </Text>

        {COMPARATIVE_DATA.map((item, idx) => (
          <View key={idx} style={styles.compCard}>
            <Text style={styles.paramTitle}>{item.parameter}</Text>
            <View style={styles.compRow}>
              <View style={styles.compColStandard}>
                <Text style={styles.compColHeader}>Standard Drives</Text>
                <Text style={styles.compColBody}>{item.icai}</Text>
              </View>
              <View style={styles.compColFast}>
                <Text style={styles.compColFastHeader}>FAST Careers Model ★</Text>
                <Text style={styles.compColFastBody}>{item.fast}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Batch Supply & Trend */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart-outline" size={18} color="#034b71" />
          <Text style={styles.sectionTitle}>Newly Qualified CA Supply by Attempt</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Track nationwide newly qualified CA passing volumes across examination terms:
        </Text>

        <View style={styles.trendCard}>
          {PASS_OUT_ATTEMPTS.map((attempt, i) => (
            <View key={i} style={styles.trendRow}>
              <View style={styles.trendLeft}>
                <Text style={[styles.trendAttempt, attempt.isCurrent && styles.trendAttemptCurrent]}>
                  {attempt.attempt} {attempt.isCurrent ? '(Current Batch)' : ''}
                </Text>
                <Text style={styles.trendCount}>{attempt.count} Qualified CAs</Text>
              </View>
              <View style={styles.barOuter}>
                <View style={[styles.barInner, { width: attempt.pct as any, backgroundColor: attempt.color }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recruitment Drive CTA */}
      <View style={styles.ctaCard}>
        <Ionicons name="business" size={32} color="#034b71" style={{ marginBottom: 8 }} />
        <Text style={styles.ctaTitle}>Participate in Upcoming Placement Drive</Text>
        <Text style={styles.ctaSub}>
          Are you hiring Chartered Accountants or looking to get placed in top MNCs? Contact our campus drive coordinators.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContactDrive} activeOpacity={0.8}>
          <Ionicons name="call" size={16} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.ctaBtnText}>Call Drive Coordinator (8839250427)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  heroBanner: {
    backgroundColor: '#034b71',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 10,
  },
  tagPillText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff', lineHeight: 26, marginBottom: 8 },
  heroSub: { fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 18, marginBottom: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  statLabel: { fontSize: 11, color: '#bae6fd', marginTop: 2, fontWeight: '500' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  sectionSubtitle: { fontSize: 12.5, color: '#64748b', marginBottom: 12, lineHeight: 17 },

  compCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  paramTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  compRow: { flexDirection: 'row', gap: 10 },
  compColStandard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  compColHeader: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 },
  compColBody: { fontSize: 12, color: '#475569', lineHeight: 16 },
  compColFast: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  compColFastHeader: { fontSize: 11, fontWeight: '700', color: '#059669', textTransform: 'uppercase', marginBottom: 4 },
  compColFastBody: { fontSize: 12, color: '#065f46', fontWeight: '500', lineHeight: 16 },

  trendCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 14,
  },
  trendRow: { gap: 6 },
  trendLeft: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendAttempt: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  trendAttemptCurrent: { color: '#034b71', fontWeight: '800' },
  trendCount: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  barOuter: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  barInner: { height: '100%', borderRadius: 4 },

  ctaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  ctaTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  ctaSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#034b71',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
