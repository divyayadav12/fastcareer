import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DownloadItem {
  id: number;
  name: string;
  desc: string;
  type: string;
  size: string;
  category: string;
  url: string;
}

export default function ImpDownloadsScreen() {
  const documents: DownloadItem[] = [
    {
      id: 1,
      name: "CA Campus Interview Master Guide",
      desc: "Top 50 frequently asked technical & HR questions for Big 4 and Corporate placements.",
      type: "PDF",
      size: "2.4 MB",
      category: "Interview Prep",
      url: "https://fastcareer.onrender.com/resources/ca_campus_interview_guide.pdf"
    },
    {
      id: 2,
      name: "Chartered Accountant Salary Benchmarks 2026",
      desc: "Comprehensive CTC breakdowns across FMCG, Banking, Consulting and IT sectors.",
      type: "PDF",
      size: "1.8 MB",
      category: "Market Data",
      url: "https://fastcareer.onrender.com/resources/ca_salary_report_2026.pdf"
    },
    {
      id: 3,
      name: "Big 4 Articleship & Fresher CA Case Studies",
      desc: "Real-world statutory audit, taxation, and M&A advisory interview case solutions.",
      type: "PDF",
      size: "3.2 MB",
      category: "Case Studies",
      url: "https://fastcareer.onrender.com/resources/big4_case_studies.pdf"
    },
    {
      id: 4,
      name: "Financial Modeling & Valuation Handbook",
      desc: "Practical Excel formulas, DCF modeling templates, and ratios for FP&A roles.",
      type: "PDF",
      size: "4.5 MB",
      category: "Technical Prep",
      url: "https://fastcareer.onrender.com/resources/financial_modeling_handbook.pdf"
    }
  ];

  const handleDownload = (doc: DownloadItem) => {
    Alert.alert(
      "Download Resource",
      `Resource: ${doc.name} (${doc.size})\n\nWould you like to open or share this study material?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Share / Open Link",
          onPress: () => {
            Share.share({
              title: doc.name,
              message: `Check out this CA Resource from FAST Careers: ${doc.name} - ${doc.url}`,
              url: doc.url
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Important Downloads & Guides</Text>
        <Text style={styles.headerSubtitle}>
          Access verified CA interview handbooks, salary benchmarks, and case studies curated by FAST Careers.
        </Text>
      </View>

      {documents.map((doc) => (
        <View key={doc.id} style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="document-text" size={26} color="#ef4444" />
          </View>
          <View style={styles.details}>
            <View style={styles.badgeRow}>
              <Text style={styles.categoryBadge}>{doc.category}</Text>
              <Text style={styles.sizeText}>{doc.type} • {doc.size}</Text>
            </View>
            <Text style={styles.docTitle}>{doc.name}</Text>
            <Text style={styles.docDesc}>{doc.desc}</Text>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleDownload(doc)}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={16} color="#034b71" />
              <Text style={styles.downloadBtnText}>Download Resource</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 36 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 18 },
  card: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  details: { flex: 1 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  categoryBadge: { fontSize: 10, fontWeight: '700', color: '#034b71', backgroundColor: '#e0f2fe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  sizeText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  docTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  docDesc: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 16 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginTop: 12, alignSelf: 'flex-start', gap: 6 },
  downloadBtnText: { fontSize: 12, fontWeight: '700', color: '#034b71' }
});
