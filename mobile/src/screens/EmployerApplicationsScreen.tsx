import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { viewResume, downloadResume } from '../utils/fileHelper';

export default function EmployerApplicationsScreen() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications/employer');
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return '#16a34a';
      case 'rejected': return '#dc2626';
      default: return '#034b71';
    }
  };

  const renderApp = ({ item }: any) => {
    const candidateName = `${item.candidate?.firstName || 'Candidate'} ${item.candidate?.lastName || ''}`.trim();
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.candidateName}>{candidateName}</Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{item.candidate?.email}</Text>
        
        <View style={styles.jobBox}>
          <Text style={styles.jobLabel}>Applied for:</Text>
          <Text style={styles.jobTitle}>{item.job?.title}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.resumeBtn, !item.resumeUrl && styles.disabledBtn]} 
            onPress={() => item.resumeUrl ? viewResume(item.resumeUrl) : null}
            disabled={!item.resumeUrl}
          >
            <Ionicons name="eye" size={16} color={item.resumeUrl ? "#fff" : "#94a3b8"} />
            <Text style={[styles.resumeText, !item.resumeUrl && styles.disabledText]}>
              {item.resumeUrl ? "View Resume" : "Not Available"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.resumeBtn, styles.downloadBtn, !item.resumeUrl && styles.disabledBtn]} 
            onPress={() => {
              if (item.resumeUrl) {
                downloadResume(item.resumeUrl, candidateName, (status) => setDownloadingId(status ? item._id : null));
              }
            }}
            disabled={!item.resumeUrl || downloadingId === item._id}
          >
            {downloadingId === item._id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download" size={16} color={item.resumeUrl ? "#fff" : "#94a3b8"} />
            )}
            <Text style={[styles.resumeText, !item.resumeUrl && styles.disabledText]}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={applications}
          renderItem={renderApp}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No applications received yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  candidateName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  status: { fontSize: 12, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 12 },
  jobBox: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 8, marginBottom: 12 },
  jobLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase' },
  jobTitle: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  resumeBtn: { flex: 1, backgroundColor: '#034b71', flexDirection: 'row', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  downloadBtn: { backgroundColor: '#10b981' },
  disabledBtn: { backgroundColor: '#e2e8f0' },
  resumeText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  disabledText: { color: '#94a3b8' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#64748b' }
});
