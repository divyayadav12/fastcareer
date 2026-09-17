import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Step5Review = ({ personal, caPortfolio, qualifications, experienceInfo, setStep, user }: any) => {

  const DataItem = ({ label, value }: { label: string, value: any }) => (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value || '-'}</Text>
    </View>
  );

  const Section = ({ title, step, children }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => setStep(step)}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Section title="Personal Details" step={1}>
        <DataItem label="Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`} />
        <DataItem label="Email" value={user?.email} />
        <DataItem label="Phone" value={personal?.phone} />
        <DataItem label="Gender & Marital Status" value={`${personal?.gender}, ${personal?.maritalStatus}`} />
        <DataItem label="Date of Birth" value={personal?.dateOfBirth} />
        <DataItem label="Current Location" value={`${personal?.currentCity}, ${personal?.currentState}`} />
      </Section>

      <Section title="CA Qualification" step={2}>
        <DataItem label="Fresher CA" value={caPortfolio?.isFresherCA ? 'Yes' : 'No'} />
        <View style={styles.nestedCard}>
          <Text style={styles.nestedTitle}>CA Inter</Text>
          <Text style={styles.nestedText}>Group I: {caPortfolio?.caInter?.group1Month} {caPortfolio?.caInter?.group1Year}</Text>
          <Text style={styles.nestedText}>Group II: {caPortfolio?.caInter?.group2Month} {caPortfolio?.caInter?.group2Year}</Text>
        </View>
        <View style={styles.nestedCard}>
          <Text style={styles.nestedTitle}>CA Final</Text>
          <Text style={styles.nestedText}>Group I: {caPortfolio?.caFinal?.group1Month} {caPortfolio?.caFinal?.group1Year}</Text>
          <Text style={styles.nestedText}>Group II: {caPortfolio?.caFinal?.group2Month} {caPortfolio?.caFinal?.group2Year}</Text>
        </View>
      </Section>

      <Section title="Articleship" step={3}>
        <DataItem label="Completion Date" value={`${caPortfolio?.articleshipCompletionDateMonth} ${caPortfolio?.articleshipCompletionDateYear}`} />
        <DataItem label="Nature of Work" value={caPortfolio?.natureOfWork} />
      </Section>

      <Section title="Education & Experience" step={4}>
        <DataItem label="Graduation" value={`${qualifications?.graduation?.type} - ${qualifications?.graduation?.college} (${qualifications?.graduation?.percentage}%)`} />
        <DataItem label="Class XII" value={`${qualifications?.class12?.percentage}% (${qualifications?.class12?.year})`} />
        
        <View style={{ marginTop: 12 }}>
          <DataItem label="Experienced Candidate" value={experienceInfo?.isExperienced ? 'Yes' : 'No'} />
          {experienceInfo?.isExperienced && (
            <>
              <DataItem label="Current Company" value={experienceInfo?.currentCompanyName} />
              <DataItem label="Designation" value={experienceInfo?.currentDesignation} />
              <DataItem label="Current CTC" value={experienceInfo?.currentCTC} />
            </>
          )}
        </View>
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  editBtn: { backgroundColor: '#e6f0f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  editBtnText: { color: '#034b71', fontSize: 12, fontWeight: 'bold' },
  
  cardContent: { flexDirection: 'row', flexWrap: 'wrap' },
  
  dataItem: { width: '50%', marginBottom: 12, paddingRight: 8 },
  dataLabel: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 },
  dataValue: { fontSize: 13, color: '#0f172a', fontWeight: '500' },

  nestedCard: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', marginBottom: 8 },
  nestedTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 4 },
  nestedText: { fontSize: 13, color: '#0f172a' }
});
