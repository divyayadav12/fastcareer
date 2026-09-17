import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CandidateMenuScreen({ navigation }: any) {
  const sections = [
    {
      title: "Profile & Jobs",
      items: [
        { name: "Update Profile", icon: "person", route: "Profile" },
        { name: "Job Fair Available", icon: "business", feature: true },
        { name: "Current Openings", icon: "briefcase", route: "Jobs" }
      ]
    },
    {
      title: "Resume & Downloads",
      items: [
        { name: "Resume Downloads", icon: "download", feature: true },
        { name: "Resume Print (Site)", icon: "print", feature: true },
        { name: "IMP Downloads", icon: "document-text", feature: true }
      ]
    },
    {
      title: "Community & Feedback",
      items: [
        { name: "Feel it Say it", icon: "chatbubble-ellipses", feature: true },
        { name: "Refer to a Friend", icon: "share-social", feature: true },
        { name: "Companies Registered", icon: "business", feature: true }
      ]
    },
    {
      title: "Career Actions",
      items: [
        { name: "Want to Change a Job?", icon: "refresh", feature: true },
        { name: "Share Job Opportunities", icon: "share", feature: true },
        { name: "Placement History", icon: "time", route: "MyApps" }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {sections.map((sec, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          <View style={styles.card}>
            {sec.items.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.item, i === sec.items.length - 1 && styles.noBorder]}
                onPress={() => {
                  if (item.route) navigation.navigate(item.route);
                  else navigation.navigate('CandidateFeature', { title: item.name });
                }}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name={item.icon as any} size={20} color="#64748b" />
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
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, marginLeft: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  noBorder: { borderBottomWidth: 0 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 15, color: '#334155', marginLeft: 12, fontWeight: '500' }
});
