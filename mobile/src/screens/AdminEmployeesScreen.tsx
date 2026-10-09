import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, TextInput, Modal, Alert, RefreshControl,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function AdminEmployeesScreen({ navigation }: any) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Employee@123',
    phone: '',
    designation: 'Staff / Recruiter',
  });

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get('/users/employees');
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      Alert.alert('Error', 'Failed to load employee roster.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const handleCreateEmployee = async () => {
    if (!form.firstName.trim() || !form.email.trim() || !form.password) {
      Alert.alert('Missing Fields', 'Please fill in First Name, Email, and Password.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/users/employees', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        designation: form.designation.trim() || 'Staff / Recruiter',
      });

      Alert.alert('Success 🎉', `Employee account for "${form.firstName}" created successfully!`);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: 'Employee@123',
        phone: '',
        designation: 'Staff / Recruiter',
      });
      setModalVisible(false);
      fetchEmployees();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to register employee.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    Alert.alert(
      'Remove Employee',
      `Are you sure you want to remove employee "${name}"? They will lose access to the staff portal.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(id);
            try {
              await api.delete(`/users/employees/${id}`);
              Alert.alert('Success', `Employee "${name}" removed.`);
              setEmployees(prev => prev.filter(e => e._id !== id));
            } catch (err: any) {
              Alert.alert('Error', 'Failed to delete employee account.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter(emp => {
      const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const desig = (emp.headline || emp.designation || '').toLowerCase();
      return fullName.includes(q) || email.includes(q) || desig.includes(q);
    });
  }, [employees, searchQuery]);

  const renderEmployee = ({ item }: { item: any }) => {
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Employee';
    const desig = item.headline || item.designation || 'Staff / Recruiter';
    const initial = (item.firstName?.charAt(0) || 'E').toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarTxt}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.employeeName} numberOfLines={1}>{fullName}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteEmployee(item._id, fullName)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.deleteBtn}
              >
                {deletingId === item._id ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Ionicons name="trash-outline" size={17} color="#ef4444" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{desig}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={13} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.emailText}>{item.email}</Text>
            </View>

            {item.phone ? (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={13} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.phoneText}>{item.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Joined: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Staff Member'}
          </Text>
          <View style={styles.permissionPill}>
            <Ionicons name="lock-closed-outline" size={11} color="#6366f1" />
            <Text style={styles.permissionText}>Staff Permissions</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Action & Search Bar */}
      <View style={styles.headerBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employee by name, email, or role..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="person-add" size={18} color="#ffffff" />
          <Text style={styles.addBtnText}>Add Staff</Text>
        </TouchableOpacity>
      </View>

      {/* Counter Row */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredEmployees.length} Internal Staff Member{filteredEmployees.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Main List */}
      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployee}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={56} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No internal staff found</Text>
              <Text style={styles.emptySub}>
                Tap "+ Add Staff" to register a recruiter or operations team member account.
              </Text>
            </View>
          }
        />
      )}

      {/* ─── Add Employee Modal ─────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalIconBox}>
                  <Ionicons name="person-add" size={20} color="#034b71" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Register New Employee</Text>
                  <Text style={styles.modalSub}>Create staff credentials for recruiter or coordinator</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Employee First & Last Name */}
            <View style={styles.nameRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul"
                  placeholderTextColor="#94a3b8"
                  value={form.firstName}
                  onChangeText={t => setForm({ ...form, firstName: t })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sharma"
                  placeholderTextColor="#94a3b8"
                  value={form.lastName}
                  onChangeText={t => setForm({ ...form, lastName: t })}
                />
              </View>
            </View>

            {/* Email */}
            <Text style={styles.inputLabel}>Staff Login Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. rahul.sharma@fastcareers.in"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={t => setForm({ ...form, email: t })}
            />

            {/* Password */}
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Default: Employee@123"
              placeholderTextColor="#94a3b8"
              value={form.password}
              onChangeText={t => setForm({ ...form, password: t })}
            />

            {/* Phone */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={t => setForm({ ...form, phone: t })}
            />

            {/* Designation / Role */}
            <Text style={styles.inputLabel}>Designation / Role Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Recruiter / Operations Lead"
              placeholderTextColor="#94a3b8"
              value={form.designation}
              onChangeText={t => setForm({ ...form, designation: t })}
            />

            <View style={styles.infoBanner}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#034b71" style={{ marginRight: 6 }} />
              <Text style={styles.infoBannerText}>
                Employees can view candidate databases, manage jobs, download resumes, and review placement results, but cannot add companies or delete other staff.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleCreateEmployee}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.saveBtnText}>Register Employee</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBar: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#034b71',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  counterRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  counterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  avatarTxt: { fontSize: 17, fontWeight: 'bold', color: '#4338ca' },
  employeeName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 },
  deleteBtn: { padding: 4 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 3,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  roleBadgeText: { fontSize: 11, fontWeight: '600', color: '#1d4ed8' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  emailText: { fontSize: 12, color: '#64748b' },
  phoneText: { fontSize: 12, color: '#64748b' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateText: { fontSize: 11, color: '#94a3b8' },
  permissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  permissionText: { fontSize: 11, fontWeight: '600', color: '#6366f1' },
  emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 },

  // Modal
  modalScroll: { flex: 1, backgroundColor: '#f8fafc' },
  modalContent: { padding: 20, paddingBottom: 40 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e6f0f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  modalSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  closeBtn: { padding: 4 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },
  nameRow: { flexDirection: 'row' },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#e6f0f6',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  infoBannerText: { fontSize: 12, color: '#034b71', flex: 1, lineHeight: 17 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  saveBtn: {
    flex: 2,
    backgroundColor: '#034b71',
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
