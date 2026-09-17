import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootState } from '../store';

export default function EmployerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({ jobs: 0, apps: 0, candidates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes, candRes] = await Promise.all([
          api.get('/jobs/employer'),
          api.get('/applications/employer'),
          api.get('/users/candidates')
        ]);
        
        setStats({
          jobs: jobsRes.data.length || 0,
          apps: appsRes.data.length || 0,
          candidates: candRes.data.length || 0
        });
      } catch (err) {
        console.error("Error fetching employer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#034b71" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 20) }]}>
          <Image
            source={require('../../assets/fast_logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {user?.firstName}</Text>
          <Text style={styles.subtitleText}>Here is your recruitment overview</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={24} color="#034b71" />
            <Text style={styles.statNumber}>{stats.jobs}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#16a34a" />
            <Text style={styles.statNumber}>{stats.apps}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#9333ea" />
            <Text style={styles.statNumber}>{stats.candidates}</Text>
            <Text style={styles.statLabel}>Candidates</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLogo: { width: 140, height: 44, marginBottom: 12 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitleText: { fontSize: 14, color: '#64748b', marginTop: 4 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  statCard: { 
    backgroundColor: '#fff', 
    width: '48%', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginTop: 10 },
  statLabel: { fontSize: 14, color: '#64748b', marginTop: 4 }
});
