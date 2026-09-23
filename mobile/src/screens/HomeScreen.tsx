import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function HomeScreen({ navigation }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Finance', 'Accounting', 'Compliance', 'Tech'];

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [fetchJobs])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const title = (job.title || '').toLowerCase();
    const company = (job.company || '').toLowerCase();
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || title.includes(term) || company.includes(term);
    const matchesCategory = categoryFilter === 'All' || (job.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderJobCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.jobCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      {item.isHot && (
        <View style={styles.hotBadge}>
          <Text style={styles.hotText}>HOT JOB</Text>
        </View>
      )}
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.company}</Text>

      <View style={styles.tagRow}>
        {item.location ? <View style={styles.tag}><Text style={styles.tagText}>{item.location}</Text></View> : null}
        {item.type ? <View style={styles.tag}><Text style={styles.tagText}>{item.type}</Text></View> : null}
        {item.salaryRange ? <View style={styles.tag}><Text style={styles.tagText}>{item.salaryRange}</Text></View> : null}
      </View>

      {item.description ? (
        <Text style={styles.jobDescription} numberOfLines={2}>{item.description}</Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.postedAt}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.postedAt || 'Recently')}
        </Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate('JobDetails', { job: item })}
        >
          <Text style={styles.applyText}>View & Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search job title or company..."
          placeholderTextColor="#94a3b8"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBadge, categoryFilter === cat && styles.categoryBadgeActive]}
              onPress={() => setCategoryFilter(cat)}
            >
              <Text style={[styles.categoryText, categoryFilter === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item._id || item.id || String(Math.random())}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListHeaderComponent={
            <View style={styles.listHeaderWrapper}>
              {/* FAST Selection Candidate Test Card */}
              <TouchableOpacity
                style={styles.fastSelectionCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('FastSelection')}
              >
                <View style={styles.fastSelectionTopRow}>
                  <View style={styles.fastSelectionIconCircle}>
                    <Ionicons name="flash" size={20} color="#f59e0b" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.fastSelectionTitle}>FAST Selection Online Test</Text>
                      <View style={styles.livePill}>
                        <Text style={styles.livePillText}>LIVE ⚡</Text>
                      </View>
                    </View>
                    <Text style={styles.fastSelectionDesc}>
                      Take the verified candidate assessment & get fast-tracked for top CA & Finance interviews.
                    </Text>
                  </View>
                </View>

                <View style={styles.fastSelectionActionRow}>
                  <View style={styles.fastSelectionFeatures}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#38bdf8" />
                      <Text style={styles.featureItemText}>6 Questions</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#38bdf8" />
                      <Text style={styles.featureItemText}>Video Pitch</Text>
                    </View>
                  </View>
                  <View style={styles.takeTestBtn}>
                    <Text style={styles.takeTestBtnText}>Give Test</Text>
                    <Ionicons name="arrow-forward" size={15} color="#034b71" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Results Count Header */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#94a3b8', fontSize: 15 }}>No jobs found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  searchSection: { backgroundColor: '#ffffff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  searchInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#0f172a', marginBottom: 12 },
  categoryScroll: { flexDirection: 'row' },
  categoryBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  categoryBadgeActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  categoryText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  categoryTextActive: { color: '#ffffff' },

  listContainer: { padding: 16, paddingBottom: 40 },
  listHeaderWrapper: { marginBottom: 8 },

  /* Fast Selection Banner */
  fastSelectionCard: {
    backgroundColor: '#022c43',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#034b71',
    shadowColor: '#022c43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  fastSelectionTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fastSelectionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#074266',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastSelectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 6,
  },
  livePill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  livePillText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fastSelectionDesc: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 17,
    marginTop: 4,
  },
  fastSelectionActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#074266',
  },
  fastSelectionFeatures: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureItemText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  takeTestBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  takeTestBtnText: {
    color: '#034b71',
    fontWeight: 'bold',
    fontSize: 13,
  },

  resultsHeader: { paddingTop: 8, paddingBottom: 4 },
  resultsText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },

  jobCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0', position: 'relative' },
  hotBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  hotText: { color: '#ef4444', fontSize: 10, fontWeight: 'bold' },
  
  jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, paddingRight: 60 },
  jobCompany: { fontSize: 14, color: '#034b71', fontWeight: '600', marginBottom: 12 },
  
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  tagText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  
  jobDescription: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  postedAt: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  applyButton: { backgroundColor: '#034b71', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  applyText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
