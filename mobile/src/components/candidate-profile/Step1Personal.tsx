import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { STATES, STATE_CITY_MAP } from '../../utils/constants';
import CalendarModal from '../CalendarModal';

interface Step1Props {
  personal: any;
  setPersonal: React.Dispatch<React.SetStateAction<any>>;
  user: any;
  resumeUrl: string;
  handleFileUpload: (file: any) => void;
  uploading: boolean;
}

export const Step1Personal: React.FC<Step1Props> = ({ personal, setPersonal, user, resumeUrl, handleFileUpload, uploading }) => {
  const [dobModalVisible, setDobModalVisible] = useState(false);

  React.useEffect(() => {
    const defaultPhone = user?.phone || user?.personalDetails?.phone;
    if (!personal.phone && defaultPhone) {
      setPersonal((prev: any) => ({ ...prev, phone: defaultPhone }));
    }
    const defaultCity = user?.personalDetails?.currentCity;
    if (!personal.currentCity && defaultCity) {
      setPersonal((prev: any) => ({ ...prev, currentCity: defaultCity }));
    }
  }, [user?.phone, user?.personalDetails?.phone, user?.personalDetails?.currentCity]);

  const handleSameAsCurrent = (value: boolean) => {
    setPersonal((prev: any) => {
      const newState = { ...prev, permanentAddressSameAsCurrent: value };
      if (value) {
        newState.permanentAddress = prev.currentAddress;
        newState.permanentState = prev.currentState;
        newState.permanentCity = prev.currentCity;
      }
      return newState;
    });
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleFileUpload(result.assets[0]);
      }
    } catch (err) {
      console.log('Document picker error:', err);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Resume Upload */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resume Upload *</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument} disabled={uploading}>
          {uploading ? <ActivityIndicator color="#034b71" /> : <Text style={styles.uploadButtonText}>{resumeUrl ? 'Change Resume' : 'Choose File'}</Text>}
        </TouchableOpacity>
        {resumeUrl && <Text style={styles.successText}>✓ Resume Uploaded</Text>}
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>First Name</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user?.firstName || ''} editable={false} />
        
        <Text style={styles.label}>Last Name</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user?.lastName || ''} editable={false} />

        <Text style={styles.label}>Email Id</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user?.email || ''} editable={false} />

        <Text style={styles.label}>Mobile No. *</Text>
        <TextInput 
          style={styles.input} 
          value={personal.phone || user?.phone || user?.personalDetails?.phone || ''} 
          onChangeText={(text) => setPersonal({...personal, phone: text.replace(/\D/g, '')})} 
          keyboardType="numeric" 
          placeholder="e.g. 9876543210"
        />

        <Text style={styles.label}>Date of Birth (YYYY-MM-DD) *</Text>
        <TouchableOpacity 
          style={styles.datePickerInput}
          activeOpacity={0.75}
          onPress={() => setDobModalVisible(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#034b71" style={{ marginRight: 10 }} />
          <Text style={[styles.datePickerText, !personal.dateOfBirth && styles.datePickerPlaceholder]}>
            {personal.dateOfBirth || 'Select Date of Birth'}
          </Text>
          {personal.dateOfBirth ? (
            <TouchableOpacity 
              onPress={() => setPersonal((prev: any) => ({ ...prev, dateOfBirth: '' }))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-down" size={16} color="#94a3b8" />
          )}
        </TouchableOpacity>

        <CalendarModal
          visible={dobModalVisible}
          value={personal.dateOfBirth}
          title="Select Date of Birth"
          onClose={() => setDobModalVisible(false)}
          onSelectDate={(selectedDate) => setPersonal((prev: any) => ({ ...prev, dateOfBirth: selectedDate }))}
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.gender}
            onValueChange={(val) => setPersonal({...personal, gender: val})}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Marital Status *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.maritalStatus}
            onValueChange={(val) => setPersonal({...personal, maritalStatus: val})}
          >
            <Picker.Item label="Unmarried" value="Unmarried" />
            <Picker.Item label="Married" value="Married" />
          </Picker>
        </View>
      </View>

      {/* Current Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Address</Text>
        
        <Text style={styles.label}>Street Address *</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={personal.currentAddress} 
          onChangeText={(text) => {
            setPersonal({...personal, currentAddress: text});
            if(personal.permanentAddressSameAsCurrent) setPersonal((p: any) => ({...p, permanentAddress: text}));
          }} 
          multiline 
        />

        <Text style={styles.label}>State *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.currentState}
            onValueChange={(val) => {
              setPersonal({...personal, currentState: val, currentCity: ''});
              if(personal.permanentAddressSameAsCurrent) setPersonal((p: any) => ({...p, permanentState: val, permanentCity: ''}));
            }}
          >
            <Picker.Item label="Select State" value="" />
            {STATES.map(s => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>
        </View>

        <Text style={styles.label}>City *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.currentCity}
            enabled={!!personal.currentState}
            onValueChange={(val) => {
              setPersonal({...personal, currentCity: val});
              if(personal.permanentAddressSameAsCurrent) setPersonal((p: any) => ({...p, permanentCity: val}));
            }}
          >
            <Picker.Item label="Select City" value="" />
            {(STATE_CITY_MAP[personal.currentState] || []).map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
      </View>

      {/* Permanent Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permanent Address</Text>
        
        <TouchableOpacity 
          style={styles.sameAsCard}
          onPress={() => handleSameAsCurrent(!personal.permanentAddressSameAsCurrent)}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.sameAsTitle}>Same as Current Address</Text>
            <Text style={styles.sameAsSubtitle}>Auto-fill with current street, state & city</Text>
          </View>
          <Switch 
            value={personal.permanentAddressSameAsCurrent} 
            onValueChange={handleSameAsCurrent} 
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={personal.permanentAddressSameAsCurrent ? '#034b71' : '#f8fafc'}
          />
        </TouchableOpacity>
        
        <Text style={styles.label}>Street Address *</Text>
        <TextInput 
          style={[styles.input, styles.textArea, personal.permanentAddressSameAsCurrent && styles.inputDisabled]} 
          value={personal.permanentAddress} 
          onChangeText={(text) => setPersonal({...personal, permanentAddress: text})} 
          editable={!personal.permanentAddressSameAsCurrent}
          multiline 
        />

        <Text style={styles.label}>State *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.permanentState}
            enabled={!personal.permanentAddressSameAsCurrent}
            onValueChange={(val) => setPersonal({...personal, permanentState: val, permanentCity: ''})}
          >
            <Picker.Item label="Select State" value="" />
            {STATES.map(s => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>
        </View>

        <Text style={styles.label}>City *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personal.permanentCity}
            enabled={!!personal.permanentState && !personal.permanentAddressSameAsCurrent}
            onValueChange={(val) => setPersonal({...personal, permanentCity: val})}
          >
            <Picker.Item label="Select City" value="" />
            {(STATE_CITY_MAP[personal.permanentState] || []).map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 8 },
  sameAsCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  sameAsTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  sameAsSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0f172a', marginBottom: 16 },
  datePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  datePickerText: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  datePickerPlaceholder: {
    color: '#94a3b8',
    fontWeight: 'normal',
  },
  inputDisabled: { backgroundColor: '#e2e8f0', color: '#64748b' },
  textArea: { height: 80, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  uploadButton: { backgroundColor: '#e6f0f6', borderWidth: 1, borderColor: '#b2d1e5', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  uploadButtonText: { color: '#034b71', fontWeight: 'bold' },
  successText: { color: '#22c55e', fontSize: 12, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
});
