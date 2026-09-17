import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
        </Text>
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

  resultsHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  resultsText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },

  listContainer: { padding: 16, paddingBottom: 40 },
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
