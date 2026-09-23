import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CandidateMenuScreen({ navigation }: any) {
  const sections = [
    {
      title: "Profile & Career Openings",
      items: [
        { name: "Update 5-Step Profile", icon: "person", route: "Profile" },
        { name: "Job Fair & Campus Drives", icon: "business", route: "JobFair" },
        { name: "Current Openings", icon: "briefcase", route: "Jobs" },
        { name: "My Applied Jobs", icon: "document-text", route: "MyApps" }
      ]
    },
    {
      title: "Resume & Downloads",
      items: [
        { name: "View / Print My Resume", icon: "eye", route: "ResumeView" },
        { name: "Download Resume Templates", icon: "download", route: "ResumeDownloads" },
        { name: "Important Guides & Downloads", icon: "document-text", route: "ImpDownloads" }
      ]
    },
    {
      title: "Community & Feedback",
      items: [
        { name: "Feel it, Say it! (Feedback)", icon: "chatbubble-ellipses", route: "Feedback" },
        { name: "Refer to a Friend (Earn Rewards)", icon: "gift", route: "ReferFriend" },
        { name: "Registered Companies & Big 4s", icon: "business", route: "CompaniesRegistered" }
      ]
    },
    {
      title: "Career Actions",
      items: [
        { name: "Want to Change a Job? (Discreet)", icon: "refresh-circle", route: "WantToChangeJob" },
        { name: "Share Job Opportunities", icon: "share-social", route: "ShareJob" },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sections.map((sec, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          <View style={styles.card}>
            {sec.items.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.item, i === sec.items.length - 1 && styles.noBorder]}
                onPress={() => {
                  if (item.route) {
                    navigation.navigate(item.route);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon as any} size={18} color="#034b71" />
                  </View>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 8, marginLeft: 6, letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  noBorder: { borderBottomWidth: 0 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemText: { fontSize: 14, color: '#1e293b', fontWeight: '600', flex: 1 }
});
