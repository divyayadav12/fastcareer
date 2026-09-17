import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ARTICLESHIP_TYPES, CA_FIRMS, ALL_CITIES, MONTHS, YEARS, NATURE_OF_WORK } from '../../utils/constants';

export const Step3Articleship = ({ caPortfolio, setCaPortfolio }: any) => {
  const addFirm = () => {
    setCaPortfolio({
      ...caPortfolio,
      articleships: [...(caPortfolio.articleships || []), { type: 'Articleship', firmName: '', city: '', noOfPartners: '2', noOfMonths: '0' }]
    });
  };

  const removeFirm = (index: number) => {
    const newArticleships = [...(caPortfolio.articleships || [])];
    newArticleships.splice(index, 1);
    setCaPortfolio({ ...caPortfolio, articleships: newArticleships });
  };

  const updateFirm = (index: number, field: string, value: any) => {
    const newArticleships = [...(caPortfolio.articleships || [])];
    newArticleships[index][field] = value;
    setCaPortfolio({ ...caPortfolio, articleships: newArticleships });
  };

  const totalMonths = (caPortfolio.articleships || []).reduce((acc: number, curr: any) => acc + (parseInt(curr.noOfMonths) || 0), 0);

  const toggleNatureOfWork = (work: string) => {
    let currentWorks = caPortfolio.natureOfWork ? caPortfolio.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
    if (currentWorks.includes(work)) {
      currentWorks = currentWorks.filter((w: string) => w !== work);
    } else {
      currentWorks.push(work);
    }
    setCaPortfolio({ ...caPortfolio, natureOfWork: currentWorks.join(', ') });
  };

  const isWorkSelected = (work: string) => {
    const currentWorks = caPortfolio.natureOfWork ? caPortfolio.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
    return currentWorks.includes(work);
  };

  const renderToggle = (label: string, field: string) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleGroup}>
        <TouchableOpacity 
          style={[styles.toggleBtn, caPortfolio[field] === 'Yes' && styles.toggleBtnActive]} 
          onPress={() => setCaPortfolio({...caPortfolio, [field]: 'Yes'})}
        >
          <Text style={[styles.toggleBtnText, caPortfolio[field] === 'Yes' && styles.toggleBtnTextActive]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, caPortfolio[field] === 'No' && styles.toggleBtnActive]} 
          onPress={() => setCaPortfolio({...caPortfolio, [field]: 'No'})}
        >
          <Text style={[styles.toggleBtnText, caPortfolio[field] === 'No' && styles.toggleBtnTextActive]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {(caPortfolio.articleships || []).map((firm: any, index: number) => (
        <View style={styles.card} key={index}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Firm #{index + 1}</Text>
            {index > 0 && (
              <TouchableOpacity onPress={() => removeFirm(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={firm.type} onValueChange={(val) => updateFirm(index, 'type', val)}>
              {ARTICLESHIP_TYPES.map(t => <Picker.Item key={t} label={t} value={t} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Firm Name</Text>
          <TextInput style={styles.input} value={firm.firmName} onChangeText={(val) => updateFirm(index, 'firmName', val)} placeholder="Enter firm name" />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={firm.city} onChangeText={(val) => updateFirm(index, 'city', val)} placeholder="Enter city" />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Partners</Text>
              <TextInput style={styles.input} value={firm.noOfPartners} onChangeText={(val) => updateFirm(index, 'noOfPartners', val)} keyboardType="numeric" />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Months</Text>
              <TextInput style={styles.input} value={firm.noOfMonths} onChangeText={(val) => updateFirm(index, 'noOfMonths', val)} keyboardType="numeric" />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addFirm}>
        <Text style={styles.addButtonText}>+ Add another firm / training</Text>
      </TouchableOpacity>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Articleship Summary</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{totalMonths} Months</Text></View>
        </View>

        <Text style={styles.label}>Completion Date / Due Date</Text>
        <View style={styles.row}>
          <View style={[styles.col, styles.pickerContainer]}>
            <Picker selectedValue={caPortfolio.articleshipCompletionDateMonth} onValueChange={(val) => setCaPortfolio({...caPortfolio, articleshipCompletionDateMonth: val})}>
              <Picker.Item label="Month" value="" />
              {MONTHS.map(m => <Picker.Item key={m} label={m} value={m} />)}
            </Picker>
          </View>
          <View style={[styles.col, styles.pickerContainer]}>
            <Picker selectedValue={caPortfolio.articleshipCompletionDateYear} onValueChange={(val) => setCaPortfolio({...caPortfolio, articleshipCompletionDateYear: val})}>
              <Picker.Item label="Year" value="" />
              {YEARS.map(y => <Picker.Item key={y} label={y} value={y} />)}
            </Picker>
          </View>
        </View>

        {renderToggle('GMCS Program Completed?', 'gmcsCompleted')}
        {renderToggle('Industrial Trainee (last 12m)?', 'industrialTrainee')}
        {renderToggle('Done Listed Company Work?', 'listedCompanyWork')}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Nature of Work</Text>
        <View style={styles.workGrid}>
          {NATURE_OF_WORK.map((work) => {
            const selected = isWorkSelected(work);
            return (
              <TouchableOpacity key={work} style={[styles.workBadge, selected && styles.workBadgeSelected]} onPress={() => toggleNatureOfWork(work)}>
                <Text style={[styles.workBadgeText, selected && styles.workBadgeTextSelected]}>{work}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
  removeText: { color: '#ef4444', fontWeight: 'bold' },
  
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0f172a', marginBottom: 12 },
  pickerContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 12, height: 50, overflow: 'hidden', justifyContent: 'center' },
  
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  
  addButton: { backgroundColor: '#e6f0f6', borderWidth: 1, borderColor: '#b2d1e5', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 24, borderStyle: 'dashed' },
  addButtonText: { color: '#034b71', fontWeight: 'bold' },
  
  summaryCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 12, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  badge: { backgroundColor: '#e6f0f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  badgeText: { color: '#034b71', fontWeight: 'bold', fontSize: 12 },
  
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginRight: 10,
    lineHeight: 18,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 2,
    width: 96,
  },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#034b71', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 1, elevation: 1 },
  toggleBtnText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  toggleBtnTextActive: { color: '#ffffff', fontWeight: 'bold' },

  workGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  workBadge: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  workBadgeSelected: { backgroundColor: '#034b71', borderColor: '#034b71' },
  workBadgeText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  workBadgeTextSelected: { color: '#ffffff' }
});
