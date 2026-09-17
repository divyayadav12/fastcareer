import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function MyApplicationsScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApps = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await api.get(`/applications/candidate/${user._id}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching my applications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Refetch every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchApps();
    }, [fetchApps])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchApps();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied': return '#034b71';
      case 'reviewing': return '#eab308';
      case 'shortlisted': return '#16a34a';
      case 'interviewed': return '#9333ea';
      case 'rejected': return '#dc2626';
      case 'hired': return '#10b981';
      default: return '#64748b';
    }
  };

  const renderApp = ({ item }: any) => {
    const job = item.job || {};
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.jobTitle} numberOfLines={1}>{job.title || 'Job Title'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{(item.status || 'Applied').toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>{job.company || 'Company'}</Text>
        
        <View style={styles.tagsContainer}>
          {job.location ? (
            <View style={styles.tagItem}>
              <Ionicons name="location-outline" size={13} color="#64748b" />
              <Text style={styles.tagText}>{job.location}</Text>
            </View>
          ) : null}
          {job.type ? (
            <View style={styles.tagItem}>
              <Ionicons name="briefcase-outline" size={13} color="#64748b" />
              <Text style={styles.tagText}>{job.type}</Text>
            </View>
          ) : null}
          {job.salaryRange ? (
            <View style={styles.tagItem}>
              <Ionicons name="cash-outline" size={13} color="#10b981" />
              <Text style={[styles.tagText, { color: '#059669', fontWeight: '600' }]}>{job.salaryRange}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={13} color="#94a3b8" />
            <Text style={styles.dateText}>
              Applied {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'recently'}
            </Text>
          </View>
          <Text style={styles.applicationId}>ID: #{item._id ? item._id.slice(-6).toUpperCase() : ''}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.subtitle}>
          {applications.length} {applications.length === 1 ? 'application' : 'applications'} submitted
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 60 }} />
      ) : (
        <FlatList 
          data={applications}
          renderItem={renderApp}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={56} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>You haven't applied to any jobs yet</Text>
              <Text style={styles.emptySubtitle}>Explore open positions and submit your application with 1 tap!</Text>
              <TouchableOpacity 
                style={styles.exploreBtn} 
                onPress={() => navigation.navigate('Jobs')}
              >
                <Ionicons name="search" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.exploreBtnText}>Browse Open Jobs</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 },
  companyName: { fontSize: 14, color: '#034b71', fontWeight: '600', marginTop: 4, marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#ffffff' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4
  },
  tagText: { fontSize: 12, color: '#475569' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  dateText: { fontSize: 12, color: '#94a3b8', marginLeft: 4 },
  applicationId: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#034b71',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10
  },
  exploreBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});
