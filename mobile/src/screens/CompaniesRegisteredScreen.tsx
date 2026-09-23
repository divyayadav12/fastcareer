import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TOP_RECRUITERS, RecruiterCompany } from '../data/recruitersData';

export default function CompaniesRegisteredScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Big 4 & Consulting',
    'FMCG & Retail',
    'Banking & Finance',
    'Conglomerates & Industrial',
    'Hospitality & Services',
  ];

  const filtered = TOP_RECRUITERS.filter((company) => {
    const matchesCategory = selectedCategory === 'All' || company.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      company.name.toLowerCase().includes(q) ||
      company.shortName.toLowerCase().includes(q) ||
      company.location.toLowerCase().includes(q) ||
      company.tagline.toLowerCase().includes(q) ||
      company.hiringRoles.some(r => r.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ITC, HUL, Tata, PwC, Deloitte..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Companies List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Companies Found</Text>
            <Text style={styles.emptySubtitle}>Try changing your search terms or category filter.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>{item.shortName.slice(0, 3)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <View style={styles.openingsBadge}>
                <Text style={styles.openingsText}>{item.openings} Openings</Text>
              </View>
            </View>

            <Text style={styles.tagline}>{item.tagline}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>

            {/* Hiring Roles Tags */}
            <View style={styles.rolesRow}>
              {item.hiringRoles.map((role, idx) => (
                <View key={idx} style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{role}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.viewJobsBtn}
              onPress={() => navigation.navigate('Jobs')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewJobsBtnText}>View Open Positions</Text>
              <Ionicons name="arrow-forward" size={14} color="#034b71" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  searchHeader: { backgroundColor: '#ffffff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 12, height: 42 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0f172a' },
  categoryScroll: { marginTop: 10, flexDirection: 'row' },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  catChipActive: { backgroundColor: '#034b71', borderColor: '#034b71' },
  catChipText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  catChipTextActive: { color: '#ffffff', fontWeight: 'bold' },
  listContent: { padding: 14, paddingBottom: 30 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#034b71', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  categoryText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  openingsBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#a7f3d0' },
  openingsText: { color: '#059669', fontSize: 11, fontWeight: '700' },
  tagline: { fontSize: 12, color: '#334155', marginTop: 10, fontStyle: 'italic', lineHeight: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  rolesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  roleTag: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleTagText: { fontSize: 11, color: '#475569' },
  viewJobsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f2fe', borderRadius: 8, paddingVertical: 8, marginTop: 12, gap: 4 },
  viewJobsBtnText: { fontSize: 12, fontWeight: 'bold', color: '#034b71' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 }
});
