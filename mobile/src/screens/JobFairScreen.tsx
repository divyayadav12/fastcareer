import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface JobFair {
  id: number;
  title: string;
  date: string;
  location: string;
  companies: number;
  attendees: string;
  status: 'Upcoming' | 'Registration Open' | 'Ongoing';
}

export default function JobFairScreen() {
  const [registeredFairs, setRegisteredFairs] = useState<number[]>([]);

  const fairs: JobFair[] = [
    {
      id: 1,
      title: "Tech Career Expo 2026",
      date: "October 15, 2026",
      location: "Mumbai Exhibition Center",
      companies: 50,
      attendees: "2000+",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Finance & Banking Job Fair",
      date: "November 5, 2026",
      location: "Delhi Convention Hub",
      companies: 35,
      attendees: "1500+",
      status: "Registration Open"
    },
    {
      id: 3,
      title: "Virtual Startup Hiring Drive",
      date: "September 20, 2026",
      location: "Online (Zoom)",
      companies: 120,
      attendees: "5000+",
      status: "Ongoing"
    },
    {
      id: 4,
      title: "Pan-India Chartered Accountant Drive",
      date: "December 12, 2026",
      location: "Bengaluru Trade Center",
      companies: 80,
      attendees: "3500+",
      status: "Registration Open"
    }
  ];

  const handleRegister = (fair: JobFair) => {
    if (registeredFairs.includes(fair.id)) {
      Alert.alert("Already Registered", `You have already registered for ${fair.title}. Our team will send the entry pass to your email.`);
      return;
    }

    Alert.alert(
      "Confirm Registration",
      `Would you like to register for "${fair.title}" on ${fair.date} at ${fair.location}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Register Now",
          onPress: () => {
            setRegisteredFairs(prev => [...prev, fair.id]);
            Alert.alert("Success 🎉", `You are successfully registered for ${fair.title}! Entry passes will be emailed 48 hours prior.`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Fairs & Campus Drives</Text>
        <Text style={styles.headerSubtitle}>Discover and register for upcoming career events and mass hiring drives.</Text>
      </View>

      {fairs.map((fair) => {
        const isRegistered = registeredFairs.includes(fair.id);
        return (
          <View key={fair.id} style={styles.card}>
            <View style={styles.banner}>
              <Text style={styles.cardTitle}>{fair.title}</Text>
              <View style={[styles.badge, fair.status === 'Ongoing' ? styles.badgeOngoing : styles.badgeUpcoming]}>
                <Text style={styles.badgeText}>{fair.status}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#034b71" />
                <Text style={styles.infoText}>{fair.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#034b71" />
                <Text style={styles.infoText}>{fair.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={18} color="#034b71" />
                <Text style={styles.infoText}>{fair.companies} Top Companies Participating</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={18} color="#034b71" />
                <Text style={styles.infoText}>{fair.attendees} Candidates Expected</Text>
              </View>

              <TouchableOpacity
                style={[styles.registerBtn, isRegistered && styles.registeredBtn]}
                onPress={() => handleRegister(fair)}
                activeOpacity={0.8}
              >
                <Text style={[styles.registerBtnText, isRegistered && styles.registeredBtnText]}>
                  {isRegistered ? "✓ Registered" : "Register Now →"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 36 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  banner: { backgroundColor: '#034b71', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeUpcoming: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeOngoing: { backgroundColor: '#10b981' },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 10, fontWeight: '500' },
  registerBtn: { backgroundColor: '#034b71', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  registeredBtn: { backgroundColor: '#e0f2fe', borderWidth: 1, borderColor: '#38bdf8' },
  registerBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  registeredBtnText: { color: '#0369a1' }
});
