import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, StatusBar, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootState } from '../store';

export default function EmployerDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({ jobs: 0, apps: 0, candidates: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, appsRes, candRes] = await Promise.all([
        api.get('/jobs/employer').catch(() => ({ data: [] })),
        api.get('/applications/employer').catch(() => ({ data: [] })),
        api.get('/users/candidates').catch(() => ({ data: [] }))
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#034b71" />
      </View>
    );
  }

  const quickActions = [
    { label: 'Post / Manage Jobs', icon: 'briefcase', color: '#034b71', bg: '#e0f2fe', route: 'EmployerJobs' },
    { label: 'Candidate Applications', icon: 'document-text', color: '#10b981', bg: '#ecfdf5', route: 'EmployerApps' },
    { label: 'Browse CA Talent', icon: 'people', color: '#8b5cf6', bg: '#f5f3ff', route: 'EmployerCandidates' },
    { label: 'Company Profile', icon: 'business', color: '#f59e0b', bg: '#fffbeb', route: 'EmployerProfile' },
    { label: 'Billing & Plans', icon: 'card', color: '#ec4899', bg: '#fdf2f8', route: 'EmployerBilling' },
    { label: 'Platform Submissions', icon: 'folder-open', color: '#0284c7', bg: '#f0f9ff', route: 'EmployerPlatformData' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 20) }]}>
          <Image
            source={require('../../assets/fast_logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {user?.firstName || 'Recruiter'}</Text>
          <Text style={styles.subtitleText}>Corporate Recruitment & Placement Workspace</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('EmployerJobs')} activeOpacity={0.8}>
            <Ionicons name="briefcase" size={24} color="#034b71" />
            <Text style={styles.statNumber}>{stats.jobs}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('EmployerApps')} activeOpacity={0.8}>
            <Ionicons name="document-text" size={24} color="#16a34a" />
            <Text style={styles.statNumber}>{stats.apps}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('EmployerCandidates')} activeOpacity={0.8}>
            <Ionicons name="people" size={24} color="#9333ea" />
            <Text style={styles.statNumber}>{stats.candidates}</Text>
            <Text style={styles.statLabel}>CA Candidates</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recruitment Tools & Settings</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
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
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  subtitleText: { fontSize: 13, color: '#64748b', marginTop: 4 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, justifyContent: 'space-between' },
  statCard: { 
    backgroundColor: '#fff', 
    width: '31%', 
    padding: 14, 
    borderRadius: 14, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1
  },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#1e293b' }
});
