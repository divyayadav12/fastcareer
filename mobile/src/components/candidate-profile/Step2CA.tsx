import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ATTEMPTS, CA_EXAM_MONTHS, YEARS } from '../../utils/constants';

export const Step2CA = ({ caPortfolio, setCaPortfolio }: any) => {

  const handleGroupLogic = (exam: string, field: string, value: any) => {
    let newData = { ...caPortfolio[exam], [field]: value };
    
    if (field === 'bothGroups1stAttempt' && value === true) {
      newData.group1Attempts = '1';
      newData.group2Attempts = '1';
      if (newData.group1Month) newData.group2Month = newData.group1Month;
      if (newData.group1Year) newData.group2Year = newData.group1Year;
      if (newData.group1Month) newData.completionSessionMonth = newData.group1Month;
      if (newData.group1Year) newData.completionSessionYear = newData.group1Year;
    }
    
    if (newData.bothGroups1stAttempt) {
      if (field === 'group1Month') {
        newData.group2Month = value;
        newData.completionSessionMonth = value;
      }
      if (field === 'group1Year') {
        newData.group2Year = value;
        newData.completionSessionYear = value;
      }
    }

    setCaPortfolio({ ...caPortfolio, [exam]: newData });
  };

  const renderExamCard = (examKey: string, title: string) => {
    const data = caPortfolio[examKey] || {};
    
    return (
      <View style={styles.card} key={examKey}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Both Groups - 1st Attempt</Text>
            <Switch 
              value={data.bothGroups1stAttempt || false}
              onValueChange={(val) => handleGroupLogic(examKey, 'bothGroups1stAttempt', val)}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={data.bothGroups1stAttempt ? '#034b71' : '#f8fafc'}
            />
          </View>
        </View>

        {/* Group 1 */}
        <View style={styles.groupSection}>
          <Text style={styles.groupTitle}>Group I</Text>
          <Text style={styles.label}>Attempts</Text>
          <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
            <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.group1Attempts} onValueChange={(val) => handleGroupLogic(examKey, 'group1Attempts', val)}>
              <Picker.Item label="Attempts" value="" />
              {ATTEMPTS.map(a => <Picker.Item key={a} label={a} value={a} />)}
            </Picker>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Month</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={data.group1Month} onValueChange={(val) => handleGroupLogic(examKey, 'group1Month', val)}>
                  <Picker.Item label="Month" value="" />
                  {CA_EXAM_MONTHS.map(m => <Picker.Item key={m} label={m} value={m} />)}
                </Picker>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Year</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={data.group1Year} onValueChange={(val) => handleGroupLogic(examKey, 'group1Year', val)}>
                  <Picker.Item label="Year" value="" />
                  {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Group 2 */}
        <View style={styles.groupSection}>
          <Text style={styles.groupTitle}>Group II</Text>
          <Text style={styles.label}>Attempts</Text>
          <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
            <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.group2Attempts} onValueChange={(val) => handleGroupLogic(examKey, 'group2Attempts', val)}>
              <Picker.Item label="Attempts" value="" />
              {ATTEMPTS.map(a => <Picker.Item key={a} label={a} value={a} />)}
            </Picker>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Month</Text>
              <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
                <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.group2Month} onValueChange={(val) => handleGroupLogic(examKey, 'group2Month', val)}>
                  <Picker.Item label="Month" value="" />
                  {CA_EXAM_MONTHS.map(m => <Picker.Item key={m} label={m} value={m} />)}
                </Picker>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Year</Text>
              <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
                <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.group2Year} onValueChange={(val) => handleGroupLogic(examKey, 'group2Year', val)}>
                  <Picker.Item label="Year" value="" />
                  {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Ranker & Completion */}
        <View style={styles.footerSection}>
          <Text style={styles.label}>Ranker</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={data.ranker || 'No'} onValueChange={(val) => handleGroupLogic(examKey, 'ranker', val)}>
              <Picker.Item label="No" value="No" />
              <Picker.Item label="Yes" value="Yes" />
            </Picker>
          </View>
          
          <Text style={styles.label}>Completion Session</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
                <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.completionSessionMonth} onValueChange={(val) => handleGroupLogic(examKey, 'completionSessionMonth', val)}>
                  <Picker.Item label="Month" value="" />
                  {CA_EXAM_MONTHS.map(m => <Picker.Item key={m} label={m} value={m} />)}
                </Picker>
              </View>
            </View>
            <View style={styles.col}>
              <View style={[styles.pickerContainer, data.bothGroups1stAttempt && styles.disabledContainer]}>
                <Picker enabled={!data.bothGroups1stAttempt} selectedValue={data.completionSessionYear} onValueChange={(val) => handleGroupLogic(examKey, 'completionSessionYear', val)}>
                  <Picker.Item label="Year" value="" />
                  {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.switchLabelBold}>Tick if Fresher CA</Text>
        <Switch 
          value={caPortfolio.isFresherCA || false} 
          onValueChange={(val) => setCaPortfolio({...caPortfolio, isFresherCA: val})} 
          trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
          thumbColor={caPortfolio.isFresherCA ? '#034b71' : '#f8fafc'}
        />
      </View>

      {renderExamCard('caFinal', 'CA Final')}
      {renderExamCard('caIntermediate', 'CA Intermediate / IPCC')}
      {renderExamCard('caFoundation', 'CA Foundation / CPT')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e6f0f6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#b2d1e5', marginBottom: 20 },
  switchLabelBold: { fontSize: 14, fontWeight: 'bold', color: '#034b71' },
  
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  cardHeader: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 12, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, justifyContent: 'space-between' },
  switchLabel: { flex: 1, fontSize: 13, color: '#334155', fontWeight: '600', marginRight: 8 },
  
  groupSection: { marginBottom: 16 },
  groupTitle: { fontSize: 14, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4 },
  
  pickerContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 12, height: 50, overflow: 'hidden', justifyContent: 'center' },
  disabledContainer: { backgroundColor: '#e2e8f0', opacity: 0.7 },
  
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  
  footerSection: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginTop: 8 }
});
