import React, { useState, useMemo } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Platform, FlatList, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { ALL_CITIES } from '../utils/constants';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Noida', 'Gurugram'
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const CATEGORIES = ['Finance', 'Accounting', 'Taxation', 'Audit', 'Advisory', 'Compliance', 'Tech', 'Other'];

const SALARY_RANGES = [
  '₹5,000 - ₹10,000 / month',
  '₹10,000 - ₹20,000 / month',
  '₹20,000 - ₹50,000 / month',
  '₹3LPA - ₹5LPA',
  '₹5LPA - ₹10LPA',
  '₹10LPA - ₹15LPA',
  '₹15LPA - ₹25LPA',
  '₹25LPA+',
  'Not Disclosed'
];

export default function CreateJobModal({ visible, onClose, onSuccess, initialCompany = '' }: any) {
  const [formData, setFormData] = useState({
    title: '',
    company: initialCompany,
    location: '',
    type: 'Full-time',
    category: 'Finance',
    salaryRange: '',
    description: '',
    requirements: '',
    responsibilities: ''
  });
  const [loading, setLoading] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [salaryModalVisible, setSalaryModalVisible] = useState(false);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase();
    if (!q) return ALL_CITIES;
    return ALL_CITIES.filter(c => c.toLowerCase().includes(q));
  }, [citySearchQuery]);

  const selectCity = (city: string) => {
    setFormData(prev => ({ ...prev, location: city }));
    setCityModalVisible(false);
    setCitySearchQuery('');
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.company.trim() || !formData.location.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Job Title, Company, Location, Description).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements ? formData.requirements.split('\n').map(r => r.trim()).filter(Boolean) : [],
        responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : []
      };

      await api.post('/jobs', payload);
      Alert.alert('Success 🎉', 'Job created successfully!');
      onSuccess();
      onClose();
      setFormData({
        title: '',
        company: initialCompany,
        location: '',
        type: 'Full-time',
        category: 'Finance',
        salaryRange: '',
        description: '',
        requirements: '',
        responsibilities: ''
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Could not create job. Please check all fields.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Job</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Job Title */}
        <Text style={styles.label}>Job Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={t => setFormData({ ...formData, title: t })}
          placeholder="e.g. Senior Chartered Accountant"
          placeholderTextColor="#94a3b8"
        />

        {/* Company Name */}
        <Text style={styles.label}>Company *</Text>
        <TextInput
          style={styles.input}
          value={formData.company}
          onChangeText={t => setFormData({ ...formData, company: t })}
          placeholder="e.g. FAST Careers Ltd."
          placeholderTextColor="#94a3b8"
        />

        {/* Location (City Dropdown / Searchable Selector) */}
        <Text style={styles.label}>Location (City) *</Text>
        <TouchableOpacity
          style={styles.citySelector}
          onPress={() => setCityModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons
              name="location-outline"
              size={18}
              color={formData.location ? '#034b71' : '#94a3b8'}
              style={{ marginRight: 8 }}
            />
            <Text style={formData.location ? styles.citySelectedText : styles.cityPlaceholderText}>
              {formData.location || 'Select City from list...'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Job Type & Category */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Job Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {JOB_TYPES.map(jt => (
                  <TouchableOpacity
                    key={jt}
                    style={[styles.miniChip, formData.type === jt && styles.miniChipActive]}
                    onPress={() => setFormData({ ...formData, type: jt })}
                  >
                    <Text style={[styles.miniChipText, formData.type === jt && styles.miniChipTextActive]}>
                      {jt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.miniChip, formData.category === cat && styles.miniChipActive]}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <Text style={[styles.miniChipText, formData.category === cat && styles.miniChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Salary Range Dropdown */}
        <Text style={styles.label}>Salary / Stipend</Text>
        <TouchableOpacity
          style={styles.citySelector}
          onPress={() => setSalaryModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons
              name="cash-outline"
              size={18}
              color={formData.salaryRange ? '#10b981' : '#94a3b8'}
              style={{ marginRight: 8 }}
            />
            <Text style={formData.salaryRange ? styles.citySelectedText : styles.cityPlaceholderText}>
              {formData.salaryRange || 'Select Salary / Stipend...'}
            </Text>
          </View>
          {formData.salaryRange ? (
            <TouchableOpacity
              onPress={() => setFormData(prev => ({ ...prev, salaryRange: '' }))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 6 }}
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
          <Ionicons name="chevron-down" size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={t => setFormData({ ...formData, description: t })}
          placeholder="Provide a detailed job description..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Requirements */}
        <Text style={styles.label}>Requirements (One per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.requirements}
          onChangeText={t => setFormData({ ...formData, requirements: t })}
          placeholder="Qualified CA with 3+ years experience&#10;Experience in Statutory Audit&#10;Strong communication skills"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Responsibilities */}
        <Text style={styles.label}>Responsibilities (One per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.responsibilities}
          onChangeText={t => setFormData({ ...formData, responsibilities: t })}
          placeholder="Lead financial reporting and compliance&#10;Coordinate with external auditors&#10;Manage junior accounting team"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Post Job</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ─── Searchable City Selector Modal ─────────────────────────────── */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setCityModalVisible(false);
          setCitySearchQuery('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select Job Location</Text>
              <Text style={styles.modalSubtitle}>Select valid city for candidate matching</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCityModalVisible(false);
                setCitySearchQuery('');
              }}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.modalSearchBox}>
            <Ionicons name="search" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search city (e.g. Mumbai, Delhi, Bengaluru, Pune...)"
              placeholderTextColor="#94a3b8"
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              autoFocus={true}
              clearButtonMode="while-editing"
            />
            {citySearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Popular Cities Chips (when not searching) */}
          {!citySearchQuery.trim() && (
            <View style={styles.popularSection}>
              <Text style={styles.sectionHeader}>Popular Cities</Text>
              <View style={styles.popularGrid}>
                {POPULAR_CITIES.slice(0, 12).map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[styles.popularChip, formData.location === city && styles.popularChipActive]}
                    onPress={() => selectCity(city)}
                  >
                    <Text style={[styles.popularChipText, formData.location === city && styles.popularChipTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.sectionHeader, { marginTop: 16 }]}>All Cities (A-Z)</Text>
            </View>
          )}

          {/* Cities List */}
          <FlatList
            data={filteredCities}
            keyExtractor={(item, index) => `${item}-${index}`}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={25}
            maxToRenderPerBatch={30}
            windowSize={7}
            renderItem={({ item }) => {
              const isSelected = formData.location === item;
              return (
                <TouchableOpacity
                  style={[styles.cityRow, isSelected && styles.cityRowSelected]}
                  onPress={() => selectCity(item)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={isSelected ? '#034b71' : '#94a3b8'}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                      {item}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#034b71" />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={40} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No cities found matching "{citySearchQuery}"</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </SafeAreaView>
      </Modal>

      {/* ─── Salary Range Selector Modal ─────────────────────────────── */}
      <Modal
        visible={salaryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSalaryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSalaryModalVisible(false)}
        >
          <View style={styles.salaryModalContent}>
            <View style={styles.salaryModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="cash-outline" size={20} color="#034b71" />
                <Text style={styles.salaryModalTitle}>Select Salary / Stipend</Text>
              </View>
              <TouchableOpacity onPress={() => setSalaryModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {SALARY_RANGES.map((range) => {
                const isSelected = formData.salaryRange === range;
                return (
                  <TouchableOpacity
                    key={range}
                    style={[styles.salaryOption, isSelected && styles.salaryOptionSelected]}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, salaryRange: range }));
                      setSalaryModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.salaryOptionText, isSelected && styles.salaryOptionTextSelected]}>
                      {range}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#034b71" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  closeBtn: { padding: 5 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 8,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  citySelectedText: { fontSize: 15, color: '#0f172a', fontWeight: '500' },
  cityPlaceholderText: { fontSize: 15, color: '#94a3b8' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '100%' },
  miniChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  miniChipActive: {
    backgroundColor: '#034b71',
    borderColor: '#034b71',
  },
  miniChipText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  miniChipTextActive: { color: '#ffffff' },
  textArea: { height: 90 },
  submitBtn: {
    backgroundColor: '#034b71',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  modalSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  modalCloseBtn: { padding: 4 },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalSearchInput: { flex: 1, fontSize: 15, color: '#0f172a' },
  popularSection: { paddingHorizontal: 16, paddingBottom: 8 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  popularChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  popularChipActive: { backgroundColor: '#e6f0f6', borderColor: '#034b71' },
  popularChipText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  popularChipTextActive: { color: '#034b71', fontWeight: 'bold' },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  cityRowSelected: { backgroundColor: '#e6f0f6' },
  cityName: { fontSize: 15, color: '#1e293b' },
  cityNameSelected: { color: '#034b71', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 14, color: '#64748b', marginTop: 12, textAlign: 'center' },

  // Salary Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  salaryModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingBottom: 28,
    maxHeight: '75%',
  },
  salaryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  salaryModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  salaryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  salaryOptionSelected: {
    backgroundColor: '#e6f0f6',
  },
  salaryOptionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  salaryOptionTextSelected: {
    color: '#034b71',
    fontWeight: 'bold',
  },
});
