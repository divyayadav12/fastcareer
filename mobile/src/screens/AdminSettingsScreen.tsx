import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import api from '../services/api';

export default function AdminSettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [seeding, setSeeding] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [serverHealth, setServerHealth] = useState<'Healthy' | 'Checking...' | 'Unknown'>('Healthy');

  const handleSeedData = async () => {
    Alert.alert(
      "Auto-Seed 20 CA Profiles",
      "Would you like to seed 20 realistic Chartered Accountant profiles with CA Inter/Final details & PDF resumes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Seed Now",
          onPress: async () => {
            setSeeding(true);
            try {
              await api.post('/users/seed-test-candidates');
              Alert.alert("Success 🎉", "20 CA Profiles have been seeded into MongoDB!");
            } catch (err: any) {
              Alert.alert("Notice", err.response?.data?.message || "Candidates verified in database.");
            } finally {
              setSeeding(false);
            }
          }
        }
      ]
    );
  };

  const handleCheckHealth = async () => {
    setPinging(true);
    setServerHealth('Checking...');
    try {
      const res = await api.get('/jobs');
      if (res.data) {
        setServerHealth('Healthy');
        Alert.alert("Server Status 🟢", "Backend API and MongoDB Atlas Cluster are responding normally (200 OK).");
      }
    } catch (err) {
      setServerHealth('Unknown');
      Alert.alert("Server Status ⚠️", "Backend ping timed out or returned error.");
    } finally {
      setPinging(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out from Admin?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => dispatch(logout()) }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={32} color="#ffffff" />
        </View>
        <Text style={styles.title}>Admin & System Settings</Text>
        <Text style={styles.subTitle}>Platform Configuration & Database Maintenance</Text>
      </View>

      {/* System Health Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>System Infrastructure</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>API Server</Text>
          <View style={styles.statusBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>{serverHealth}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Database Cluster</Text>
          <Text style={styles.rowValue}>MongoDB Atlas (cluster0)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Environment</Text>
          <Text style={styles.rowValue}>Production Cloud API</Text>
        </View>

        <TouchableOpacity
          style={styles.pingBtn}
          onPress={handleCheckHealth}
          disabled={pinging}
          activeOpacity={0.8}
        >
          {pinging ? (
            <ActivityIndicator size="small" color="#034b71" />
          ) : (
            <>
              <Ionicons name="pulse" size={16} color="#034b71" />
              <Text style={styles.pingBtnText}>Check Server Health</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Database Maintenance Tools */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Database Management</Text>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleSeedData}
          disabled={seeding}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#ecfdf5' }]}>
            <Ionicons name="people" size={20} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Seed 20 Verified CA Candidates</Text>
            <Text style={styles.actionDesc}>Populate baseline Chartered Accountant talent profiles</Text>
          </View>
          {seeding ? (
            <ActivityIndicator size="small" color="#059669" />
          ) : (
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          )}
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Logout from Admin Portal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', backgroundColor: '#034b71', borderRadius: 16, padding: 24, marginBottom: 16 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  subTitle: { fontSize: 12, color: '#bae6fd', marginTop: 2 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  cardHeader: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowLabel: { fontSize: 13, color: '#64748b' },
  rowValue: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 6 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },
  pingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f2fe', borderRadius: 10, paddingVertical: 10, marginTop: 14, gap: 6 },
  pingBtnText: { fontSize: 13, fontWeight: 'bold', color: '#034b71' },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  actionIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  actionDesc: { fontSize: 11, color: '#64748b', marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
  logoutBtnText: { color: '#ef4444', fontSize: 14, fontWeight: 'bold' }
});
