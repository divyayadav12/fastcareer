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
import api, { API_BASE_URL, uploadFileApi } from '../services/api';
import { ALL_CITIES } from '../utils/constants';
import { parseResumeDocument } from '../utils/resumeParser';

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
  
  // Candidate Specific Fields
  const [phone, setPhone] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [workStatus, setWorkStatus] = useState('fresher');
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedFields, setScannedFields] = useState<string[]>([]);

  // City Picker Modal State
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError) {
      Alert.alert('Registration Error', message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      Alert.alert('Success 🎉', 'Account created successfully! Welcome to FAST Careers.');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, dispatch]);

  // Intelligent Resume Parsing for Mobile
  const parseResumeInfo = (fileName: string) => {
    const extracted: string[] = [];
    const cleanName = fileName.replace(/\.[^/.]+$/, ""); // strip extension
    
    // Check for email pattern
    const emailMatch = cleanName.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !email) {
      setEmail(emailMatch[0].toLowerCase());
      extracted.push('Email');
    }

    // Check for phone number (10 digits)
    const phoneMatch = cleanName.match(/(?:\+91|0)?[6-9]\d{9}/);
    if (phoneMatch && !phone) {
      setPhone(phoneMatch[0].replace(/\D/g, '').slice(-10));
      extracted.push('Phone');
    }

    // Check for city match in popular cities
    const lowerClean = cleanName.toLowerCase();
    for (const city of POPULAR_CITIES) {
      if (lowerClean.includes(city.toLowerCase())) {
        if (!currentCity) {
          setCurrentCity(city);
          extracted.push('City');
        }
        break;
      }
    }

    // Check for experience / fresher
    if (lowerClean.includes('fresher')) {
      setWorkStatus('fresher');
      extracted.push('Fresher Status');
    } else if (lowerClean.includes('exp') || lowerClean.includes('senior') || lowerClean.includes('manager')) {
      setWorkStatus('experienced');
      extracted.push('Experienced Status');
    }

    // Extract name from words
    const ignoreWords = new Set([
      'resume', 'cv', 'curriculum', 'vitae', 'biodata', 'profile', 'final', 'ca',
      'pdf', 'docx', 'doc', 'updated', 'latest', 'new', 'ca_final', 'ca_inter',
      'chartered', 'accountant', 'fresher', 'experienced', 'draft', 'copy'
    ]);

    const words = cleanName
      .replace(/[_-]/g, ' ')
      .replace(/[0-9+()@.]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !ignoreWords.has(w.toLowerCase()));

    if (words.length >= 2) {
      if (!firstName) {
        setFirstName(words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase());
        extracted.push('First Name');
      }
      if (!lastName) {
        setLastName(words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase());
        extracted.push('Last Name');
      }
    } else if (words.length === 1 && !firstName) {
      setFirstName(words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase());
      extracted.push('First Name');
    }

    return extracted;
  };

  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setResumeFile(file);
        setIsScanning(true);

        const extractedList: string[] = [];

        // 1. Deep local parsing
        try {
          const parsed = await parseResumeDocument(file);
          if (parsed.firstName) {
            setFirstName(parsed.firstName);
            extractedList.push('First Name');
          }
          if (parsed.lastName) {
            setLastName(parsed.lastName);
            extractedList.push('Last Name');
          }
          if (parsed.email) {
            setEmail(parsed.email);
            extractedList.push('Email');
          }
          if (parsed.phone) {
            setPhone(parsed.phone);
            extractedList.push('Phone');
          }
          if (parsed.city) {
            setCurrentCity(parsed.city);
            extractedList.push('City');
          }
          if (parsed.workStatus) {
            setWorkStatus(parsed.workStatus);
            extractedList.push('Work Status');
          }
        } catch (e) {
          console.warn('Local file parser warning:', e);
        }

        // 2. Upload to Cloud & Deep server extraction
        try {
          const uploadRes = await uploadFileApi(file, 'resume');
          if (uploadRes) {
            const cloudUrl = uploadRes.url || uploadRes.resumeUrl || '';
            if (cloudUrl) {
              setUploadedResumeUrl(cloudUrl);
            }
            if (uploadRes.parsedData) {
              const sp = uploadRes.parsedData;
              if (sp.email) {
                setEmail(sp.email);
                if (!extractedList.includes('Email')) extractedList.push('Email');
              }
              if (sp.phone) {
                setPhone(sp.phone);
                if (!extractedList.includes('Phone')) extractedList.push('Phone');
              }
              if (sp.city) {
                setCurrentCity(sp.city);
                if (!extractedList.includes('City')) extractedList.push('City');
              }
              if (sp.firstName) {
                setFirstName(sp.firstName);
                if (!extractedList.includes('First Name')) extractedList.push('First Name');
              }
              if (sp.lastName) {
                setLastName(sp.lastName);
                if (!extractedList.includes('Last Name')) extractedList.push('Last Name');
              }
              if (sp.workStatus) {
                setWorkStatus(sp.workStatus);
                if (!extractedList.includes('Work Status')) extractedList.push('Work Status');
              }
            }
          }
        } catch (serverErr) {
          console.warn('Cloud upload warning:', serverErr);
        }

        setScannedFields(extractedList);
        setIsScanning(false);

        if (extractedList.length > 0) {
          Alert.alert(
            '⚡ Resume Auto-Filled & Attached!',
            `Auto-populated: ${extractedList.join(', ')}.\n\nPlease review details and set a password to register.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Resume Attached 📄', 'Resume attached successfully! Please complete your details below.');
        }
      }
    } catch (err) {
      console.log('Error picking document:', err);
      setIsScanning(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in First Name, Last Name, Email, and Password.');
      return;
    }

    if (role === 'candidate') {
      if (!phone || !currentCity) {
        Alert.alert('Candidate Info Required', 'Please enter your Mobile Number and select your City.');
        return;
      }
    }

    let finalResumeUrl = uploadedResumeUrl;
    if (!finalResumeUrl && resumeFile) {
      try {
        setIsUploading(true);
        const uploadRes = await uploadFileApi(resumeFile, 'resume');
        if (uploadRes) {
          finalResumeUrl = uploadRes.url || uploadRes.resumeUrl || '';
        }
      } catch (err) {
        console.warn('Registration upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }

    dispatch(
      register({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        password,
        role: role as 'candidate' | 'employer',
        ...(role === 'candidate' && {
          phone: phone.trim(),
          currentCity,
          isFresherCA: workStatus === 'fresher',
          resumeUrl: finalResumeUrl,
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
      {/* Brand Header */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/fast_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join FAST Careers today!</Text>

      {/* Role Selection Tabs */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'candidate' && styles.roleBtnActive]}
          onPress={() => setRole('candidate')}
          activeOpacity={0.8}
        >
          <Text style={[styles.roleBtnText, role === 'candidate' && styles.roleBtnTextActive]}>Candidate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'employer' && styles.roleBtnActive]}
          onPress={() => setRole('employer')}
          activeOpacity={0.8}
        >
          <Text style={[styles.roleBtnText, role === 'employer' && styles.roleBtnTextActive]}>Employer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
          onPress={() => setRole('admin')}
          activeOpacity={0.8}
        >
          <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnTextActive]}>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* ─── RESUME AUTO-FILL CARD AT TOP (CANDIDATE MODE) ─── */}
      {role === 'candidate' && (
        <View style={styles.resumeUploadSection}>
          <TouchableOpacity
            style={[styles.resumeCard, resumeFile ? styles.resumeCardFilled : styles.resumeCardEmpty]}
            onPress={pickDocument}
            activeOpacity={0.85}
          >
            {resumeFile ? (
              <View style={styles.resumeFilledContent}>
                <View style={styles.resumeIconBox}>
                  <Ionicons name="document-text" size={26} color="#034b71" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.autoFilledBadge}>
                    <Ionicons name="sparkles" size={11} color="#059669" />
                    <Text style={styles.autoFilledBadgeText}>Auto-Fill Active</Text>
                  </View>
                  <Text style={styles.resumeFileName} numberOfLines={1}>{resumeFile.name}</Text>
                  <Text style={styles.resumeFileSize}>
                    {resumeFile.size ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'PDF / DOCX'} • Tap to change
                  </Text>
                </View>
                <View style={styles.changeCvBtn}>
                  <Text style={styles.changeCvText}>Change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.resumeEmptyContent}>
                <View style={styles.sparkleBadge}>
                  <Ionicons name="sparkles" size={12} color="#034b71" />
                  <Text style={styles.sparkleBadgeText}>Auto-Fill Form in 1-Click</Text>
                </View>
                <View style={styles.uploadPromptRow}>
                  <Ionicons name="cloud-upload" size={22} color="#034b71" />
                  <Text style={styles.uploadPromptTitle}>Upload Resume to Auto-Fill Registration</Text>
                </View>
                <Text style={styles.uploadPromptSub}>
                  Select your PDF or DOCX file. We will instantly extract and fill your Name, Contact, and City details.
                </Text>
                <View style={styles.browseCvBtn}>
                  <Text style={styles.browseCvText}>Browse Resume (PDF / DOCX)</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* First Name & Last Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="e.g. Rahul"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="e.g. Sharma"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Email Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="name@example.com"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Min. 6 characters"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Candidate Details (Phone, City, Work Status) */}
      {role === 'candidate' && (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Searchable City Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current City <Text style={{ color: 'red' }}>*</Text></Text>
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

          {/* Work Status (Fresher vs Experienced) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Work Status <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.workStatusContainer}>
              <TouchableOpacity
                style={[styles.workBtn, workStatus === 'fresher' && styles.workBtnActive]}
                onPress={() => setWorkStatus('fresher')}
              >
                <Text style={workStatus === 'fresher' ? styles.workTextActive : styles.workText}>Fresher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.workBtn, workStatus === 'experienced' && styles.workBtnActive]}
                onPress={() => setWorkStatus('experienced')}
              >
                <Text style={workStatus === 'experienced' ? styles.workTextActive : styles.workText}>Experienced</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Register Submit Button */}
      <TouchableOpacity
        style={[styles.button, (isLoading || isUploading) && styles.disabledButton]}
        onPress={handleRegister}
        disabled={isLoading || isUploading}
        activeOpacity={0.8}
      >
        {(isLoading || isUploading) ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register Now</Text>
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

          <View style={styles.modalSearchContainer}>
            <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Type city name (e.g. Mumbai, Delhi, Indore)..."
              placeholderTextColor="#94a3b8"
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              autoFocus
            />
            {citySearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.cityItem, currentCity === item && styles.cityItemActive]}
                onPress={() => selectCity(item)}
              >
                <Ionicons
                  name={currentCity === item ? 'checkmark-circle' : 'location-outline'}
                  size={18}
                  color={currentCity === item ? '#034b71' : '#94a3b8'}
                  style={{ marginRight: 12 }}
                />
                <Text style={[styles.cityItemText, currentCity === item && styles.cityItemTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </KeyboardAwareLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 160,
    height: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleBtnActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roleBtnText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 13,
  },
  roleBtnTextActive: {
    color: '#034b71',
    fontWeight: 'bold',
  },
  resumeUploadSection: {
    marginBottom: 18,
  },
  resumeCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  resumeCardEmpty: {
    backgroundColor: '#f0f9ff',
    borderColor: '#38bdf8',
    borderStyle: 'dashed',
  },
  resumeCardFilled: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    borderStyle: 'solid',
  },
  resumeEmptyContent: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
    marginBottom: 8,
  },
  sparkleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#034b71',
  },
  uploadPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  uploadPromptTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  uploadPromptSub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  browseCvBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#034b71',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  browseCvText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#034b71',
  },
  resumeFilledContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resumeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFilledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#d1fae5',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  autoFilledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },
  resumeFileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  resumeFileSize: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  changeCvBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  changeCvText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    fontSize: 14,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeIcon: {
    padding: 12,
  },
  citySelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  citySelectedText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  cityPlaceholderText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  workStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  workBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  workBtnActive: {
    borderColor: '#034b71',
    backgroundColor: '#e0f2fe',
  },
  workText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 13,
  },
  workTextActive: {
    color: '#034b71',
    fontWeight: 'bold',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#034b71',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingBottom: 20,
  },
  linkText: {
    color: '#64748b',
    fontSize: 13,
  },
  linkBold: {
    color: '#034b71',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  cityItemActive: {
    backgroundColor: '#f0f9ff',
  },
  cityItemText: {
    fontSize: 14,
    color: '#334155',
  },
  cityItemTextActive: {
    color: '#034b71',
    fontWeight: 'bold',
  },
});
