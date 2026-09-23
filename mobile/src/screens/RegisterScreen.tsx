import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal, FlatList, Image, ScrollView
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

const MONTHS = ['Jan', 'May', 'Sep', 'Nov'];
const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
const ATTEMPTS = ['1', '2', '3', '4', '5+'];
const RANKER_OPTIONS = ['No', 'Top 1-10', 'Top 11-50'];

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  
  // Candidate Specific Fields
  const [phone, setPhone] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [workStatus, setWorkStatus] = useState<'fresher' | 'experienced'>('fresher');
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedFields, setScannedFields] = useState<string[]>([]);

  // CA Final Examination State
  const [caFinal, setCaFinal] = useState({
    bothGroups1stAttempt: false,
    group1Attempts: '1',
    group1Month: 'May',
    group1Year: '2023',
    group2Attempts: '1',
    group2Month: 'May',
    group2Year: '2023',
    ranker: 'No',
    completionSessionMonth: 'May',
    completionSessionYear: '2023',
  });

  const handleCaFinalChange = (field: string, value: any) => {
    setCaFinal(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'bothGroups1stAttempt' && value === true) {
        next.group1Attempts = '1';
        next.group2Attempts = '1';
        if (next.group1Month) next.group2Month = next.group1Month;
        if (next.group1Year) next.group2Year = next.group1Year;
        if (next.group1Month) next.completionSessionMonth = next.group1Month;
        if (next.group1Year) next.completionSessionYear = next.group1Year;
      }
      if (next.bothGroups1stAttempt) {
        if (field === 'group1Month') {
          next.group2Month = value;
          next.completionSessionMonth = value;
        }
        if (field === 'group1Year') {
          next.group2Year = value;
          next.completionSessionYear = value;
        }
      }
      return next;
    });
  };

  // City Picker Modal State
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // Generic Dropdown Modal State (for Attempts, Months, Years, Ranker)
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerOnSelect, setPickerOnSelect] = useState<(val: string) => void>(() => () => {});

  const openPicker = (title: string, options: string[], onSelect: (val: string) => void) => {
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerOnSelect(() => onSelect);
    setPickerModalVisible(true);
  };

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
          if (parsed.linkedinUrl) {
            setLinkedinUrl(parsed.linkedinUrl);
            extractedList.push('LinkedIn');
          }
          if (parsed.workStatus) {
            setWorkStatus(parsed.workStatus);
            extractedList.push('Work Status');
          }
          if (parsed.bothGroups1stAttempt !== undefined) {
            handleCaFinalChange('bothGroups1stAttempt', parsed.bothGroups1stAttempt);
            extractedList.push('CA Attempts');
          }
          if (parsed.completionSessionMonth) {
            handleCaFinalChange('completionSessionMonth', parsed.completionSessionMonth);
          }
          if (parsed.completionSessionYear) {
            handleCaFinalChange('completionSessionYear', parsed.completionSessionYear);
            extractedList.push('CA Final Year');
          }
        } catch (e) {
          console.warn('Local parser warning:', e);
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
              if (sp.email && !email) {
                setEmail(sp.email);
                if (!extractedList.includes('Email')) extractedList.push('Email');
              }
              if (sp.phone && !phone) {
                setPhone(sp.phone);
                if (!extractedList.includes('Phone')) extractedList.push('Phone');
              }
              if (sp.city && !currentCity) {
                setCurrentCity(sp.city);
                if (!extractedList.includes('City')) extractedList.push('City');
              }
              if (sp.firstName && !firstName) {
                setFirstName(sp.firstName);
                if (!extractedList.includes('First Name')) extractedList.push('First Name');
              }
              if (sp.lastName && !lastName) {
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
        linkedinUrl: linkedinUrl.trim(),
        ...(role === 'candidate' && {
          phone: phone.trim(),
          currentCity,
          isFresherCA: workStatus === 'fresher',
          resumeUrl: finalResumeUrl,
          caFinal: {
            bothGroups1stAttempt: caFinal.bothGroups1stAttempt,
            group1Attempts: caFinal.group1Attempts || '1',
            group1Month: caFinal.group1Month || 'May',
            group1Year: caFinal.group1Year || '2023',
            group2Attempts: caFinal.group2Attempts || '1',
            group2Month: caFinal.group2Month || 'May',
            group2Year: caFinal.group2Year || '2023',
            ranker: caFinal.ranker || 'No',
            completionSessionMonth: caFinal.completionSessionMonth || 'May',
            completionSessionYear: caFinal.completionSessionYear || '2023',
          },
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
          <Ionicons name="school-outline" size={16} color={role === 'candidate' ? '#034b71' : '#64748b'} style={{ marginRight: 6 }} />
          <Text style={[styles.roleBtnText, role === 'candidate' && styles.roleBtnTextActive]}>Candidate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'employer' && styles.roleBtnActive]}
          onPress={() => setRole('employer')}
          activeOpacity={0.8}
        >
          <Ionicons name="business-outline" size={16} color={role === 'employer' ? '#034b71' : '#64748b'} style={{ marginRight: 6 }} />
          <Text style={[styles.roleBtnText, role === 'employer' && styles.roleBtnTextActive]}>Employer</Text>
        </TouchableOpacity>
      </View>

      {/* ─── 1-Click Resume Auto-Fill Box (Candidate Mode) ────────────────────────── */}
      {role === 'candidate' && (
        <View style={styles.resumeBoxWrapper}>
          <TouchableOpacity
            style={[styles.resumeDropBox, isScanning && styles.resumeDropBoxScanning, resumeFile && styles.resumeDropBoxAttached]}
            onPress={pickDocument}
            activeOpacity={0.85}
          >
            {isScanning ? (
              <View style={styles.resumeScanningContent}>
                <ActivityIndicator size="small" color="#034b71" style={{ marginBottom: 6 }} />
                <Text style={styles.resumeScanningTitle}>Scanning resume & auto-filling form...</Text>
                <Text style={styles.resumeScanningSub}>Extracting Name, Contact, City, LinkedIn & CA Final info</Text>
              </View>
            ) : resumeFile ? (
              <View style={styles.resumeAttachedRow}>
                <View style={styles.resumeIconBox}>
                  <Ionicons name="document-text" size={24} color="#034b71" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.autoFilledBadge}>
                    <Ionicons name="sparkles" size={11} color="#059669" />
                    <Text style={styles.autoFilledBadgeText}>Auto-Fill Active</Text>
                  </View>
                  <Text style={styles.resumeFileName} numberOfLines={1}>{resumeFile.name}</Text>
                  <Text style={styles.resumeFileSize}>
                    {scannedFields.length > 0 ? `✓ Extracted: ${scannedFields.join(', ')}` : 'Tap to change CV'}
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
                  <Text style={styles.uploadPromptTitle}>Upload Resume to Auto-Fill</Text>
                </View>
                <Text style={styles.uploadPromptSub}>
                  Select your PDF or DOCX file. We will extract your Name, Email, Phone, City & CA details.
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
      <View style={styles.rowInputs}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Rahul"
            placeholderTextColor="#94a3b8"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Sharma"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Work / Personal Email *</Text>
        <View style={styles.iconInputContainer}>
          <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.iconInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="name@example.com"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Mobile Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number {role === 'candidate' && <Text style={{ color: 'red' }}>*</Text>}</Text>
        <View style={styles.phoneInputRow}>
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="9876543210"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Create Password *</Text>
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

      {/* Current Location City */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current City {role === 'candidate' && <Text style={{ color: 'red' }}>*</Text>}</Text>
        <TouchableOpacity
          style={styles.citySelectorBox}
          onPress={() => setCityModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="location-outline" size={18} color={currentCity ? '#034b71' : '#94a3b8'} style={{ marginRight: 8 }} />
            <Text style={currentCity ? styles.citySelectedText : styles.cityPlaceholderText}>
              {currentCity || 'Select Primary City'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* LinkedIn Profile URL (Optional) */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>LinkedIn Profile URL</Text>
          <Text style={styles.optionalText}>Optional</Text>
        </View>
        <View style={styles.iconInputContainer}>
          <Ionicons name="logo-linkedin" size={18} color="#0077b5" style={styles.inputIcon} />
          <TextInput
            style={styles.iconInput}
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            autoCapitalize="none"
            placeholder="https://www.linkedin.com/in/username"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Candidate Career Stage & CA Final Card */}
      {role === 'candidate' && (
        <>
          {/* Work Status (Fresher vs Experienced) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Career Stage & Qualification *</Text>
            <View style={styles.workStatusContainer}>
              <TouchableOpacity
                style={[styles.workCard, workStatus === 'experienced' && styles.workCardActive]}
                onPress={() => setWorkStatus('experienced')}
                activeOpacity={0.8}
              >
                <View style={styles.workCardHeader}>
                  <Ionicons name="briefcase-outline" size={20} color={workStatus === 'experienced' ? '#034b71' : '#64748b'} />
                  <Ionicons
                    name={workStatus === 'experienced' ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={workStatus === 'experienced' ? '#034b71' : '#cbd5e1'}
                  />
                </View>
                <Text style={styles.workCardTitle}>Experienced CA</Text>
                <Text style={styles.workCardSub}>Post-qualification exp.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.workCard, workStatus === 'fresher' && styles.workCardActive]}
                onPress={() => setWorkStatus('fresher')}
                activeOpacity={0.8}
              >
                <View style={styles.workCardHeader}>
                  <Ionicons name="school-outline" size={20} color={workStatus === 'fresher' ? '#034b71' : '#64748b'} />
                  <Ionicons
                    name={workStatus === 'fresher' ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={workStatus === 'fresher' ? '#034b71' : '#cbd5e1'}
                  />
                </View>
                <Text style={styles.workCardTitle}>Fresher / Semi-CA</Text>
                <Text style={styles.workCardSub}>Recent pass / Articleship</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── CA Final Examination Details Card ───────────────────────── */}
          <View style={styles.caCard}>
            <View style={styles.caCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="ribbon-outline" size={20} color="#034b71" style={{ marginRight: 6 }} />
                <Text style={styles.caCardTitle}>CA Final Qualification Details *</Text>
              </View>
            </View>

            {/* Both Groups 1st Attempt Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => handleCaFinalChange('bothGroups1stAttempt', !caFinal.bothGroups1stAttempt)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={caFinal.bothGroups1stAttempt ? 'checkbox' : 'square-outline'}
                size={22}
                color={caFinal.bothGroups1stAttempt ? '#034b71' : '#94a3b8'}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.checkboxLabel}>Both Groups - 1st Attempt</Text>
            </TouchableOpacity>

            {/* Group I Details */}
            <View style={styles.groupSubCard}>
              <Text style={styles.groupSubTitle}>Group I</Text>
              <View style={styles.caSelectRow}>
                {/* Attempts */}
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.subFieldLabel}>Attempts</Text>
                  <TouchableOpacity
                    style={[styles.dropdownBtn, caFinal.bothGroups1stAttempt && styles.dropdownDisabled]}
                    disabled={caFinal.bothGroups1stAttempt}
                    onPress={() => openPicker('Group 1 Attempts', ATTEMPTS, (v) => handleCaFinalChange('group1Attempts', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group1Attempts}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Month */}
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.subFieldLabel}>Month</Text>
                  <TouchableOpacity
                    style={styles.dropdownBtn}
                    onPress={() => openPicker('Group 1 Month', MONTHS, (v) => handleCaFinalChange('group1Month', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group1Month}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Year */}
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.subFieldLabel}>Year</Text>
                  <TouchableOpacity
                    style={styles.dropdownBtn}
                    onPress={() => openPicker('Group 1 Year', YEARS, (v) => handleCaFinalChange('group1Year', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group1Year}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Group II Details */}
            <View style={styles.groupSubCard}>
              <Text style={styles.groupSubTitle}>Group II</Text>
              <View style={styles.caSelectRow}>
                {/* Attempts */}
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.subFieldLabel}>Attempts</Text>
                  <TouchableOpacity
                    style={[styles.dropdownBtn, caFinal.bothGroups1stAttempt && styles.dropdownDisabled]}
                    disabled={caFinal.bothGroups1stAttempt}
                    onPress={() => openPicker('Group 2 Attempts', ATTEMPTS, (v) => handleCaFinalChange('group2Attempts', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group2Attempts}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Month */}
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.subFieldLabel}>Month</Text>
                  <TouchableOpacity
                    style={[styles.dropdownBtn, caFinal.bothGroups1stAttempt && styles.dropdownDisabled]}
                    disabled={caFinal.bothGroups1stAttempt}
                    onPress={() => openPicker('Group 2 Month', MONTHS, (v) => handleCaFinalChange('group2Month', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group2Month}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Year */}
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.subFieldLabel}>Year</Text>
                  <TouchableOpacity
                    style={[styles.dropdownBtn, caFinal.bothGroups1stAttempt && styles.dropdownDisabled]}
                    disabled={caFinal.bothGroups1stAttempt}
                    onPress={() => openPicker('Group 2 Year', YEARS, (v) => handleCaFinalChange('group2Year', v))}
                  >
                    <Text style={styles.dropdownBtnText}>{caFinal.group2Year}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ranker & Completion Session */}
            <View style={styles.caSelectRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.subFieldLabel}>Ranker</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => openPicker('All India Ranker', RANKER_OPTIONS, (v) => handleCaFinalChange('ranker', v))}
                >
                  <Text style={styles.dropdownBtnText}>{caFinal.ranker}</Text>
                  <Ionicons name="chevron-down" size={14} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.subFieldLabel}>Completion Session</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => openPicker('Completion Session Year', YEARS, (v) => handleCaFinalChange('completionSessionYear', v))}
                >
                  <Text style={styles.dropdownBtnText}>{caFinal.completionSessionMonth} {caFinal.completionSessionYear}</Text>
                  <Ionicons name="chevron-down" size={14} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
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

      {/* ─── Generic Option Picker Modal (Attempts, Months, Years, Ranker) ── */}
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.pickerBackdrop}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.pickerDialog}>
            <Text style={styles.pickerDialogTitle}>{pickerTitle}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {pickerOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.pickerOptionRow}
                  onPress={() => {
                    pickerOnSelect(opt);
                    setPickerModalVisible(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAwareLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 150,
    height: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  roleBtnTextActive: {
    color: '#034b71',
    fontWeight: '700',
  },
  resumeBoxWrapper: {
    marginBottom: 16,
  },
  resumeDropBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 14,
  },
  resumeDropBoxScanning: {
    borderColor: '#3b82f6',
    backgroundColor: '#e0f2fe',
  },
  resumeDropBoxAttached: {
    borderStyle: 'solid',
    borderColor: '#34d399',
    backgroundColor: '#ecfdf5',
  },
  resumeEmptyContent: {
    alignItems: 'center',
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  sparkleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#034b71',
    marginLeft: 4,
  },
  uploadPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  uploadPromptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 6,
  },
  uploadPromptSub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 15,
  },
  browseCvBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  browseCvText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#034b71',
  },
  resumeScanningContent: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  resumeScanningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#034b71',
  },
  resumeScanningSub: {
    fontSize: 11,
    color: '#0284c7',
    marginTop: 2,
  },
  resumeAttachedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  autoFilledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginBottom: 2,
  },
  autoFilledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 3,
  },
  resumeFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  resumeFileSize: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  changeCvBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 6,
  },
  changeCvText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  optionalText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 8,
  },
  iconInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  phoneInputRow: {
    flexDirection: 'row',
  },
  phonePrefix: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  phonePrefixText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeIcon: {
    padding: 4,
  },
  citySelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#fff',
  },
  cityPlaceholderText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  citySelectedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  workStatusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  workCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff',
  },
  workCardActive: {
    borderColor: '#034b71',
    backgroundColor: '#f0f9ff',
  },
  workCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  workCardSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  caCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  caCardHeader: {
    marginBottom: 10,
  },
  caCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#034b71',
  },
  groupSubCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  groupSubTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  caSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subFieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  dropdownDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  dropdownBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#034b71',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  cityItemActive: {
    backgroundColor: '#f0f9ff',
  },
  cityItemText: {
    fontSize: 13,
    color: '#334155',
  },
  cityItemTextActive: {
    color: '#034b71',
    fontWeight: '700',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerDialog: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerDialogTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  pickerOptionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
});
