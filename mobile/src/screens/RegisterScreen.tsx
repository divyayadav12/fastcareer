import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal, FlatList, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAwareLayout from '../components/KeyboardAwareLayout';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';
import * as DocumentPicker from 'expo-document-picker';
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

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('candidate');
  
  // New Candidate Fields
  const [phone, setPhone] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [workStatus, setWorkStatus] = useState('fresher');
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // City Picker Modal State
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError) {
      Alert.alert('Error', message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      Alert.alert('Success', 'Registration successful!');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, dispatch]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setResumeFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (role === 'candidate') {
      if (!phone || !currentCity) {
        Alert.alert('Error', 'Please fill in mobile number and city');
        return;
      }
    }

    let uploadedResumeUrl = '';
    if (resumeFile) {
      const formData = new FormData();
      formData.append('resume', {
        uri: resumeFile.uri,
        name: resumeFile.name || 'resume.pdf',
        type: resumeFile.mimeType || 'application/pdf',
      } as any);

      try {
        setIsUploading(true);
        const uploadRes = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedResumeUrl = uploadRes.data.url || uploadRes.data.resumeUrl || '';
      } catch (err: any) {
        console.warn('Resume upload to /upload failed, trying /users/upload-resume...', err?.message);
        try {
          const fbRes = await api.post('/users/upload-resume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          uploadedResumeUrl = fbRes.data.url || fbRes.data.resumeUrl || '';
        } catch (fbErr) {
          console.error('Resume upload failed:', fbErr);
          Alert.alert('Warning', 'Resume upload failed, continuing with registration.');
        }
      } finally {
        setIsUploading(false);
      }
    }

    dispatch(
      register({
        firstName,
        lastName,
        email,
        password,
        role: role as 'candidate' | 'employer',
        ...(role === 'candidate' && {
          phone,
          currentCity,
          isFresherCA: workStatus === 'fresher',
          resumeUrl: uploadedResumeUrl,
        }),
      })
    );
  };

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase();
    if (!q) return ALL_CITIES;
    return ALL_CITIES.filter(c => c.toLowerCase().includes(q));
  }, [citySearchQuery]);

  const selectCity = (city: string) => {
    setCurrentCity(city);
    setCityModalVisible(false);
    setCitySearchQuery('');
  };

  return (
    <KeyboardAwareLayout contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/fast_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join FAST Careers today!</Text>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <TouchableOpacity style={[styles.roleBtn, role === 'candidate' && styles.roleBtnActive]} onPress={() => setRole('candidate')}>
          <Text style={[styles.roleBtnText, role === 'candidate' && styles.roleBtnTextActive]}>Candidate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleBtn, role === 'employer' && styles.roleBtnActive]} onPress={() => setRole('employer')}>
          <Text style={[styles.roleBtnText, role === 'employer' && styles.roleBtnTextActive]}>Employer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]} onPress={() => setRole('admin')}>
          <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnTextActive]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="e.g. Rahul" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="e.g. Sharma" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="name@example.com"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Create a password"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {role === 'candidate' && (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number <Text style={{color: 'red'}}>*</Text></Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="e.g. 9876543210" />
          </View>

          {/* Searchable City Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current City <Text style={{color: 'red'}}>*</Text></Text>
            <TouchableOpacity
              style={styles.citySelectorBox}
              onPress={() => setCityModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Ionicons name="location-outline" size={18} color={currentCity ? '#034b71' : '#94a3b8'} style={{ marginRight: 8 }} />
                <Text style={currentCity ? styles.citySelectedText : styles.cityPlaceholderText}>
                  {currentCity || 'Select your city'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Work Status <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.workStatusContainer}>
              <TouchableOpacity style={[styles.workBtn, workStatus === 'fresher' && styles.workBtnActive]} onPress={() => setWorkStatus('fresher')}>
                <Text style={workStatus === 'fresher' ? styles.workTextActive : styles.workText}>Fresher</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.workBtn, workStatus === 'experienced' && styles.workBtnActive]} onPress={() => setWorkStatus('experienced')}>
                <Text style={workStatus === 'experienced' ? styles.workTextActive : styles.workText}>Experienced</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Resume (Optional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={32} color="#64748b" style={{marginBottom: 8}}/>
              <Text style={styles.uploadText}>{resumeFile ? resumeFile.name : 'Tap to upload PDF/DOC'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading || isUploading}>
        {(isLoading || isUploading) ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
      </TouchableOpacity>

      {/* ─── Searchable City Modal ─────────────────────────────────────────── */}
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
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select City</Text>
              <Text style={styles.modalSubtitle}>Search from 4,000+ Indian cities</Text>
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

          {/* Search Input */}
          <View style={styles.modalSearchBox}>
            <Ionicons name="search" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Type city name (e.g. Pune, Jaipur, Indore...)"
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

          {/* Popular Cities (shown when no search query) */}
          {!citySearchQuery.trim() && (
            <View style={styles.popularSection}>
              <Text style={styles.sectionHeader}>Popular Cities</Text>
              <View style={styles.popularGrid}>
                {POPULAR_CITIES.slice(0, 12).map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[styles.popularChip, currentCity === city && styles.popularChipActive]}
                    onPress={() => selectCity(city)}
                  >
                    <Text style={[styles.popularChipText, currentCity === city && styles.popularChipTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.sectionHeader, { marginTop: 16 }]}>All Cities (A-Z)</Text>
            </View>
          )}

          {/* List of All Cities */}
          <FlatList
            data={filteredCities}
            keyExtractor={(item, index) => `${item}-${index}`}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={25}
            maxToRenderPerBatch={30}
            windowSize={7}
            renderItem={({ item }) => {
              const isSelected = currentCity === item;
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
                <TouchableOpacity
                  style={styles.useCustomBtn}
                  onPress={() => selectCity(citySearchQuery.trim())}
                >
                  <Text style={styles.useCustomText}>Use "{citySearchQuery.trim()}" as city</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </SafeAreaView>
      </Modal>
    </KeyboardAwareLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 210,
    height: 65,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 20, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12 },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#0f172a' },
  eyeIcon: { padding: 12 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#0f172a' },
  
  // Searchable City Box
  citySelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  citySelectedText: { fontSize: 16, color: '#0f172a', fontWeight: '500' },
  cityPlaceholderText: { fontSize: 16, color: '#94a3b8' },

  roleContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 8, padding: 4, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  roleBtnActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  roleBtnText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  roleBtnTextActive: { color: '#034b71' },
  workStatusContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  workBtn: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  workBtnActive: { borderColor: '#034b71', backgroundColor: '#e6f0f6' },
  workText: { color: '#64748b', fontWeight: '500' },
  workTextActive: { color: '#034b71', fontWeight: 'bold' },
  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 12, padding: 20, alignItems: 'center', backgroundColor: '#f1f5f9' },
  uploadText: { color: '#334155', fontWeight: '500' },
  button: { backgroundColor: '#034b71', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  linkContainer: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#64748b', fontSize: 14 },
  linkBold: { color: '#034b71', fontWeight: 'bold' },

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
  sectionHeader: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
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
  useCustomBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e6f0f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#034b71',
  },
  useCustomText: { fontSize: 14, color: '#034b71', fontWeight: '600' },
});
