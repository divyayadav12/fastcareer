import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, TextInput, Modal, Alert, RefreshControl,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function AdminCompaniesScreen({ navigation }: any) {
  const { user } = useSelector((state: any) => state.auth);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role === 'employee') {
      Alert.alert('Permission Notice', 'Employee accounts do not have permission to manage companies.', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
      ]);
    }
  }, [user, navigation]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: 'Company@123',
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await api.get('/users/employers');
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      Alert.alert('Error', 'Failed to load registered companies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanies();
  };

  const handleCreateCompany = async () => {
    if (!form.firstName.trim() || !form.companyName.trim() || !form.email.trim() || !form.password) {
      Alert.alert('Missing Fields', 'Please fill in Company Name, HR Name, Login Email, and Password.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/users', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'employer',
      });

      Alert.alert('Success 🎉', `Company "${form.companyName}" registered successfully!`);
      setForm({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        password: 'Company@123',
      });
      setModalVisible(false);
      fetchCompanies();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create employer account.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return companies;
    return companies.filter(c => {
      const cName = (c.companyName || '').toLowerCase();
      const hrName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      return cName.includes(q) || hrName.includes(q) || email.includes(q);
    });
  }, [companies, searchQuery]);

  const renderCompany = ({ item }: { item: any }) => {
    const displayName = item.companyName || (item.firstName ? `${item.firstName} ${item.lastName || ''}`.trim() : 'Registered Company');
    const hrName = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'HR Representative';
    const initial = (displayName.charAt(0) || 'C').toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarTxt}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.companyName} numberOfLines={1}>{displayName}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={13} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.hrText}>HR: {hrName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={13} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.emailText}>{item.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Registered: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active Partner'}
          </Text>
          <View style={styles.partnerPill}>
            <Ionicons name="shield-checkmark" size={12} color="#034b71" />
            <Text style={styles.partnerText}>Recruiter</Text>
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
            placeholder="Search company or HR representative..."
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
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Add Company</Text>
        </TouchableOpacity>
      </View>

      {/* Counter Row */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredCompanies.length} Registered Employer{filteredCompanies.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Main List */}
      {loading ? (
        <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filteredCompanies}
          renderItem={renderCompany}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={56} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No companies found</Text>
              <Text style={styles.emptySub}>
                Tap "+ Add Company" to create and onboard a new employer account.
              </Text>
            </View>
          }
        />
      )}

      {/* ─── Add Company Modal ─────────────────────────────── */}
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
                  <Ionicons name="business" size={20} color="#034b71" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Register New Company</Text>
                  <Text style={styles.modalSub}>Create partner employer account credentials</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Company Name */}
            <Text style={styles.inputLabel}>Company Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tata Consultancy Services / Big 4 Firm"
              placeholderTextColor="#94a3b8"
              value={form.companyName}
              onChangeText={t => setForm({ ...form, companyName: t })}
            />

            {/* HR Representative Names */}
            <View style={styles.nameRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>HR First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rajesh"
                  placeholderTextColor="#94a3b8"
                  value={form.firstName}
                  onChangeText={t => setForm({ ...form, firstName: t })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>HR Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kumar"
                  placeholderTextColor="#94a3b8"
                  value={form.lastName}
                  onChangeText={t => setForm({ ...form, lastName: t })}
                />
              </View>
            </View>

            {/* Login Email */}
            <Text style={styles.inputLabel}>Login Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. hr@company.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={t => setForm({ ...form, email: t })}
            />

            {/* Password */}
            <Text style={styles.inputLabel}>Temporary Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Default: Company@123"
              placeholderTextColor="#94a3b8"
              value={form.password}
              onChangeText={t => setForm({ ...form, password: t })}
            />

            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#034b71" style={{ marginRight: 6 }} />
              <Text style={styles.infoBannerText}>
                The employer can log in using these credentials to post jobs and review shortlisted candidate profiles.
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
                onPress={handleCreateCompany}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.saveBtnText}>Register Company</Text>
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
    borderRadius: 12,
    backgroundColor: '#e6f0f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  avatarTxt: { fontSize: 18, fontWeight: 'bold', color: '#034b71' },
  companyName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: { fontSize: 10, fontWeight: '700', color: '#16a34a' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  hrText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  emailText: { fontSize: 12, color: '#64748b' },
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
  partnerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  partnerText: { fontSize: 11, fontWeight: '700', color: '#034b71' },
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
