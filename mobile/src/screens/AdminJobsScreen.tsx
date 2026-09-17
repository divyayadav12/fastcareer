import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import CreateJobModal from '../components/CreateJobModal';

export default function AdminJobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Job", "Are you sure you want to delete this job globally?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await api.delete(`/jobs/${id}`);
            fetchJobs();
          } catch (e) {
            Alert.alert("Error", "Could not delete job.");
          }
      }}
    ]);
  };

  const renderJob = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <View style={styles.detailsRow}>
        <Ionicons name="location-outline" size={14} color="#64748b" />
        <Text style={styles.detailsText}>{item.location}</Text>
        <Ionicons name="briefcase-outline" size={14} color="#64748b" style={{ marginLeft: 10 }} />
        <Text style={styles.detailsText}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CreateJobModal visible={showModal} onClose={() => setShowModal(false)} onSuccess={fetchJobs} />
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b' }}>Jobs</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>New Job</Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 50 }} /> : (
        <FlatList data={jobs} renderItem={renderJob} keyExtractor={i => i._id} contentContainerStyle={styles.list} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#034b71', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  company: { fontSize: 14, color: '#034b71', fontWeight: '500', marginBottom: 8 },
  detailsRow: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
});
