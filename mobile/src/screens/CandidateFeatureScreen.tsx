import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CandidateFeatureScreen({ route }: any) {
  const { title } = route.params || { title: "Feature" };

  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={60} color="#cbd5e1" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>This feature is currently available on the full FAST Careers web portal.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginTop: 16, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 12, textAlign: 'center', lineHeight: 22 }
});
