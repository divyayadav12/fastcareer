import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function EmployerPlatformDataScreen() {
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'referrals' | 'jobchanges' | 'sharedjobs'>('feedbacks');
  const [data, setData] = useState<{
    feedbacks: any[];
    referrals: any[];
    jobchanges: any[];
    sharedjobs: any[];
  }>({
    feedbacks: [],
    referrals: [],
    jobchanges: [],
    sharedjobs: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      const [fbRes, refRes, jcRes, sjRes] = await Promise.all([
        api.get('/candidate/feedback').catch(() => ({ data: [] })),
        api.get('/candidate/referrals').catch(() => ({ data: [] })),
        api.get('/candidate/job-change').catch(() => ({ data: [] })),
        api.get('/shared-jobs').catch(() => ({ data: [] }))
      ]);

      setData({
        feedbacks: fbRes.data || [],
        referrals: refRes.data || [],
        jobchanges: jcRes.data || [],
        sharedjobs: sjRes.data || []
      });
    } catch (err) {
      console.error('Platform data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const tabs = [
    { id: 'feedbacks', label: 'Feedbacks', count: data.feedbacks.length, icon: 'chatbubble-ellipses' },
    { id: 'referrals', label: 'Referrals', count: data.referrals.length, icon: 'gift' },
    { id: 'jobchanges', label: 'Job Change', count: data.jobchanges.length, icon: 'refresh' },
    { id: 'sharedjobs', label: 'Shared Jobs', count: data.sharedjobs.length, icon: 'share-social' }
  ];

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? '#ffffff' : '#64748b'}
              />
              <Text style={[styles.tabBtnText, activeTab === tab.id && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.badge, activeTab === tab.id ? styles.badgeActive : styles.badgeInactive]}>
                <Text style={[styles.badgeText, activeTab === tab.id ? styles.badgeTextActive : styles.badgeTextInactive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#034b71" />
          <Text style={styles.loadingText}>Loading Platform Data...</Text>
        </View>
      ) : (
        <FlatList
          data={data[activeTab]}
          keyExtractor={(item, idx) => item._id || idx.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Ionicons name="folder-open-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Records Found</Text>
              <Text style={styles.emptySub}>No candidate submissions under {activeTab}.</Text>
            </View>
          }
          renderItem={({ item }) => {
            if (activeTab === 'feedbacks') {
              return (
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardName}>{item.user?.firstName || 'Candidate'}</Text>
                    <Text style={styles.ratingText}>★ {item.rating || 5} / 5</Text>
                  </View>
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.dateText}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Text>
                </View>
              );
            }
            if (activeTab === 'referrals') {
              return (
                <View style={styles.card}>
                  <Text style={styles.cardName}>{item.friendName}</Text>
                  <Text style={styles.subText}>✉ {item.friendEmail} | 📞 {item.friendPhone}</Text>
                  <Text style={styles.relationText}>Referred By: {item.user?.firstName || 'Candidate'} ({item.relation || 'Colleague'})</Text>
                </View>
              );
            }
            if (activeTab === 'jobchanges') {
              return (
                <View style={styles.card}>
                  <Text style={styles.cardName}>{item.user?.firstName || 'Confidential CA'}</Text>
                  <Text style={styles.subText}>Current: {item.currentCompany} ({item.currentDesignation})</Text>
                  <Text style={styles.subText}>CTC: {item.currentCTC} LPA → Expected: {item.expectedCTC} LPA</Text>
                  <Text style={styles.reasonText}>Notice Period: {item.noticePeriod || '30 Days'}</Text>
                </View>
              );
            }
            // sharedjobs
            return (
              <View style={styles.card}>
                <Text style={styles.cardName}>{item.companyName} ({item.industry})</Text>
                <Text style={styles.subText}>Location: {item.location} • {item.noOfPost || 1} Vacancy</Text>
                <Text style={styles.messageText}>{item.jobDescription}</Text>
                <Text style={styles.subText}>HR Contact: {item.concernedPerson} ({item.mobileNo})</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  tabBar: { backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8, gap: 6 },
  tabBtnActive: { backgroundColor: '#034b71' },
  tabBtnText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  tabBtnTextActive: { color: '#ffffff' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeInactive: { backgroundColor: '#e2e8f0' },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  badgeTextActive: { color: '#ffffff' },
  badgeTextInactive: { color: '#64748b' },
  listContent: { padding: 14, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: '#d97706' },
  subText: { fontSize: 12, color: '#475569', marginTop: 2 },
  messageText: { fontSize: 13, color: '#334155', marginVertical: 6, lineHeight: 18 },
  relationText: { fontSize: 12, color: '#034b71', fontWeight: '600', marginTop: 4 },
  reasonText: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 4 },
  dateText: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 13, color: '#64748b' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 }
});
