import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLLEGES, YEARS, BOARDS, PREFERRED_CAMPUS_CITIES, ALL_CITIES } from '../../utils/constants';

export const Step4EducationExperience = ({ qualifications, setQualifications, experienceInfo, setExperienceInfo, personal, setPersonal }: any) => {

  const renderToggle = (value: string, onSelect: (val: string) => void, option1: string, option2: string) => (
    <View style={styles.toggleGroup}>
      <TouchableOpacity 
        style={[styles.toggleBtn, value === option1 && styles.toggleBtnActive]} 
        onPress={() => onSelect(option1)}
      >
        <Text style={[styles.toggleBtnText, value === option1 && styles.toggleBtnTextActive]}>{option1}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleBtn, value === option2 && styles.toggleBtnActive]} 
        onPress={() => onSelect(option2)}
      >
        <Text style={[styles.toggleBtnText, value === option2 && styles.toggleBtnTextActive]}>{option2}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Education Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Graduation & Other Qualification</Text>
        </View>

        <Text style={styles.label}>Whether Completed</Text>
        {renderToggle(
          qualifications.graduation?.completed || 'No/Pursuing',
          (val) => setQualifications({...qualifications, graduation: {...qualifications.graduation, completed: val}}),
          'Yes', 'No/Pursuing'
        )}

        <Text style={[styles.label, {marginTop: 12}]}>Type</Text>
        {renderToggle(
          qualifications.graduation?.type || 'REGULAR',
          (val) => setQualifications({...qualifications, graduation: {...qualifications.graduation, type: val}}),
          'REGULAR', 'CORRESPONDENCE'
        )}

        <Text style={[styles.label, {marginTop: 12}]}>College Name</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={qualifications.graduation?.college} onValueChange={(val) => setQualifications({...qualifications, graduation: {...qualifications.graduation, college: val}})}>
            <Picker.Item label="Select College" value="" />
            {COLLEGES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        {qualifications.graduation?.completed === 'Yes' && (
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Passing Year</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={qualifications.graduation?.yearOfCompletion} onValueChange={(val) => setQualifications({...qualifications, graduation: {...qualifications.graduation, yearOfCompletion: val}})}>
                  <Picker.Item label="Year" value="" />
                  {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
                </Picker>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>% (Avg of 3 yrs)</Text>
              <TextInput style={styles.input} value={qualifications.graduation?.percentage} onChangeText={(val) => setQualifications({...qualifications, graduation: {...qualifications.graduation, percentage: val}})} placeholder="e.g. 75.5" keyboardType="numeric" />
            </View>
          </View>
        )}
      </View>

      <View style={styles.row}>
        {/* Class 12 */}
        <View style={[styles.card, styles.col]}>
          <Text style={styles.cardTitle}>Class XII</Text>
          <Text style={styles.label}>Percentage (%)</Text>
          <TextInput style={styles.input} value={qualifications.class12?.percentage} onChangeText={(val) => setQualifications({...qualifications, class12: {...qualifications.class12, percentage: val}})} placeholder="e.g. 85" keyboardType="numeric" />
          
          <Text style={styles.label}>Passing Year</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={qualifications.class12?.year} onValueChange={(val) => setQualifications({...qualifications, class12: {...qualifications.class12, year: val}})}>
              {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
            </Picker>
          </View>
          
          <Text style={styles.label}>Board</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={qualifications.class12?.board} onValueChange={(val) => setQualifications({...qualifications, class12: {...qualifications.class12, board: val}})}>
              <Picker.Item label="Select" value="" />
              {BOARDS.map(b => <Picker.Item key={b} label={b} value={b} />)}
            </Picker>
          </View>
        </View>

        {/* Class 10 */}
        <View style={[styles.card, styles.col]}>
          <Text style={styles.cardTitle}>Class X</Text>
          <Text style={styles.label}>Percentage (%)</Text>
          <TextInput style={styles.input} value={qualifications.class10?.percentage} onChangeText={(val) => setQualifications({...qualifications, class10: {...qualifications.class10, percentage: val}})} placeholder="e.g. 90" keyboardType="numeric" />
          
          <Text style={styles.label}>Passing Year</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={qualifications.class10?.year} onValueChange={(val) => setQualifications({...qualifications, class10: {...qualifications.class10, year: val}})}>
              {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
            </Picker>
          </View>
          
          <Text style={styles.label}>Board</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={qualifications.class10?.board} onValueChange={(val) => setQualifications({...qualifications, class10: {...qualifications.class10, board: val}})}>
              <Picker.Item label="Select" value="" />
              {BOARDS.map(b => <Picker.Item key={b} label={b} value={b} />)}
            </Picker>
          </View>
        </View>
      </View>

      {/* Experience Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Experience Details</Text>
        </View>
        
        <Text style={styles.label}>Are you an experienced candidate?</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity 
            style={[styles.toggleBtn, experienceInfo.isExperienced === true && styles.toggleBtnActive]} 
            onPress={() => setExperienceInfo({...experienceInfo, isExperienced: true})}
          >
            <Text style={[styles.toggleBtnText, experienceInfo.isExperienced === true && styles.toggleBtnTextActive]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, experienceInfo.isExperienced === false && styles.toggleBtnActive]} 
            onPress={() => setExperienceInfo({...experienceInfo, isExperienced: false})}
          >
            <Text style={[styles.toggleBtnText, experienceInfo.isExperienced === false && styles.toggleBtnTextActive]}>No</Text>
          </TouchableOpacity>
        </View>

        {experienceInfo.isExperienced && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.label}>Total Experience (Years/Months)</Text>
            <TextInput style={styles.input} value={experienceInfo.experienceYears} onChangeText={(val) => setExperienceInfo({...experienceInfo, experienceYears: val})} placeholder="e.g. 2.5 years" />
            
            <Text style={styles.label}>Current Company</Text>
            <TextInput style={styles.input} value={experienceInfo.currentCompanyName} onChangeText={(val) => setExperienceInfo({...experienceInfo, currentCompanyName: val})} placeholder="Company name" />
            
            <Text style={styles.label}>Current Designation</Text>
            <TextInput style={styles.input} value={experienceInfo.currentDesignation} onChangeText={(val) => setExperienceInfo({...experienceInfo, currentDesignation: val})} placeholder="Your role" />
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Current CTC</Text>
                <TextInput style={styles.input} value={experienceInfo.currentCTC} onChangeText={(val) => setExperienceInfo({...experienceInfo, currentCTC: val})} placeholder="e.g. 10 LPA" />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Expected CTC</Text>
                <TextInput style={styles.input} value={experienceInfo.expectedCTC} onChangeText={(val) => setExperienceInfo({...experienceInfo, expectedCTC: val})} placeholder="e.g. 15 LPA" />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Preferences Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Placement Preferences</Text>
        </View>
        <Text style={styles.label}>Preferred Campus City</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={personal.preferredCampusCity} onValueChange={(val) => setPersonal({...personal, preferredCampusCity: val})}>
            <Picker.Item label="Select City" value="" />
            {PREFERRED_CAMPUS_CITIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0f172a', marginBottom: 12 },
  pickerContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 12, height: 50, overflow: 'hidden', justifyContent: 'center' },
  
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  
  toggleGroup: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 8, padding: 2 },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  toggleBtnText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  toggleBtnTextActive: { color: '#034b71' },
});
