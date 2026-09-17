import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';

export default function AdminSettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => dispatch(logout()) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={40} color="#034b71" />
        <Text style={styles.title}>System Settings</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={() => Alert.alert("Coming Soon", "System configuration is available on web.")}>
          <Ionicons name="construct" size={20} color="#64748b" />
          <Text style={styles.itemText}>Platform Configuration</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item} onPress={() => Alert.alert("Coming Soon", "Security logs are available on web.")}>
          <Ionicons name="shield-checkmark" size={20} color="#64748b" />
          <Text style={styles.itemText}>Security Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={[styles.itemText, {color: '#ef4444'}]}>Logout from Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginTop: 10 },
  section: { marginTop: 20, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemText: { fontSize: 16, color: '#334155', marginLeft: 16, fontWeight: '500' }
});
