import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TemplateItem {
  id: number;
  name: string;
  type: string;
  size: string;
  style: string;
  atsScore: string;
  url: string;
}

export default function ResumeDownloadsScreen({ navigation }: any) {
  const templates: TemplateItem[] = [
    {
      id: 1,
      name: "Chartered Accountant Fresher Standard",
      type: "DOCX",
      size: "1.2 MB",
      style: "ICAI Standard & Modern",
      atsScore: "98% ATS Score",
      url: "https://fastcareer.onrender.com/templates/ca_fresher_template.docx"
    },
    {
      id: 2,
      name: "Big 4 Articleship & Statutory Audit Special",
      type: "DOCX",
      size: "1.5 MB",
      style: "Audit, Assurance & Tax",
      atsScore: "96% ATS Score",
      url: "https://fastcareer.onrender.com/templates/audit_specialist_template.docx"
    },
    {
      id: 3,
      name: "Corporate Finance & FP&A Specialist",
      type: "DOCX",
      size: "1.1 MB",
      style: "Executive & Metric-Driven",
      atsScore: "95% ATS Score",
      url: "https://fastcareer.onrender.com/templates/fpa_corporate_finance.docx"
    },
    {
      id: 4,
      name: "Investment Banking & M&A Associate",
      type: "DOCX",
      size: "1.4 MB",
      style: "Financial Modeling & Deals",
      atsScore: "97% ATS Score",
      url: "https://fastcareer.onrender.com/templates/investment_banking_ca.docx"
    }
  ];

  const handleDownload = (t: TemplateItem) => {
    Alert.alert(
      "Download Template",
      `Template: ${t.name} (${t.size})\n\nWould you like to open or share this resume template?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Share / Open Template",
          onPress: () => {
            Share.share({
              title: t.name,
              message: `Download this ATS-compliant CA Resume Template (${t.name}): ${t.url}`,
              url: t.url
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* View My Generated Resume CTA */}
      <TouchableOpacity
        style={styles.myResumeCard}
        onPress={() => navigation.navigate('ResumeView')}
        activeOpacity={0.85}
      >
        <View style={styles.myResumeIcon}>
          <Ionicons name="eye" size={24} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.myResumeTitle}>View My FAST Careers Resume</Text>
          <Text style={styles.myResumeSubtitle}>Preview your auto-formatted CA profile resume ready for employers.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Curated Resume Templates</Text>
        <Text style={styles.headerSubtitle}>
          Download professional ATS-friendly resume templates specially crafted for CAs and Finance Professionals.
        </Text>
      </View>

      {templates.map((tpl) => (
        <View key={tpl.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{tpl.type}</Text>
            </View>
            <View style={styles.atsBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#10b981" />
              <Text style={styles.atsBadgeText}>{tpl.atsScore}</Text>
            </View>
          </View>

          <Text style={styles.tplName}>{tpl.name}</Text>
          <Text style={styles.tplStyle}>Design: {tpl.style}</Text>

          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => handleDownload(tpl)}
            activeOpacity={0.8}
          >
            <Ionicons name="download" size={16} color="#ffffff" />
            <Text style={styles.downloadBtnText}>Download Template ({tpl.size})</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 36 },
  myResumeCard: { flexDirection: 'row', backgroundColor: '#034b71', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 20, elevation: 3 },
  myResumeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  myResumeTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff' },
  myResumeSubtitle: { fontSize: 11, color: '#bae6fd', marginTop: 2 },
  header: { marginBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeBadgeText: { color: '#034b71', fontSize: 11, fontWeight: '700' },
  atsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  atsBadgeText: { color: '#059669', fontSize: 11, fontWeight: '700' },
  tplName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  tplStyle: { fontSize: 12, color: '#64748b', marginTop: 4, marginBottom: 14 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#034b71', borderRadius: 10, paddingVertical: 11, gap: 8 },
  downloadBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' }
});
