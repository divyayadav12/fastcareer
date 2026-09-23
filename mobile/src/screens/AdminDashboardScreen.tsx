import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl, Image, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../services/api';

export default function AdminDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: any) => state.auth);
  const [stats, setStats] = useState({ candidates: 0, jobs: 0, applications: 0 });
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [candRes, jobRes, appRes] = await Promise.all([
        api.get('/users/candidates'),
        api.get('/jobs'),
        api.get('/applications').catch(() => ({ data: [] })),
      ]);
      setStats({
        candidates: candRes.data.length || 0,
        jobs: jobRes.data.length || 0,
        applications: appRes.data.length || 0,
      });
      // Show latest 5
      setRecentCandidates(candRes.data.slice(0, 5));
      setRecentJobs(jobRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color="#034b71" />
        <Text style={s.loaderTxt}>Loading dashboard...</Text>
      </View>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#034b71" />
      <ScrollView
        style={s.cont}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#034b71']} />}
      >
        {/* ── Top Hero Banner (FAST CAREERS Admin Workspace) ── */}
        <View style={[s.hero, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          {/* Workspace Brand Bar */}
          <View style={s.brandBar}>
            <View style={s.brandLeft}>
              <View style={s.brandLogo}>
                <Image
                  source={require('../../assets/fast_logo.png')}
                  style={s.brandLogoImg}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={s.brandTitle}>FAST CAREERS</Text>
                <Text style={s.brandSub}>Admin Workspace</Text>
              </View>
            </View>
            <TouchableOpacity
              style={s.bellBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Apps')}
            >
              <Ionicons name="notifications-outline" size={20} color="#ffffff" />
              <View style={s.bellDot} />
            </TouchableOpacity>
          </View>

          {/* User Greeting & Profile */}
          <View style={s.userRow}>
            <View style={s.userLeft}>
              <View style={s.userNameRow}>
                <Text style={s.userName}>{user?.firstName || 'Admin'}</Text>
                <Text style={s.waveEmoji}>👋</Text>
                <View style={s.roleBadge}>
                  <Text style={s.roleBadgeText}>Super Admin</Text>
                </View>
              </View>
              <Text style={s.greetingSub}>
                {greeting}! You have {stats.applications || 0} new applications.
              </Text>
            </View>

            <View style={s.avatarContainer}>
              <View style={s.avatarBox}>
                <Text style={s.avatarText}>
                  {((user?.firstName?.[0] || 'N') + (user?.lastName?.[0] || 'U')).toUpperCase()}
                </Text>
              </View>
              <View style={s.verifyBadge}>
                <Ionicons name="checkmark" size={11} color="#ffffff" />
              </View>
            </View>
          </View>

          <View style={s.circle1} />
          <View style={s.circle2} />
        </View>

        {/* ── Overlapping Stats Row ── */}
        <View style={s.statsRow}>
          {/* Total Candidates Card */}
          <TouchableOpacity
            style={s.statCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Candidates')}
          >
            <View style={s.cardTopRow}>
              <View style={[s.statIconBox, { backgroundColor: '#e6f0f6' }]}>
                <Ionicons name="people-outline" size={20} color="#034b71" />
              </View>
              <View style={s.growthBadge}>
                <Text style={s.growthBadgeText}>+12.5%</Text>
              </View>
            </View>
            <Text style={s.statNum}>{stats.candidates}</Text>
            <Text style={s.statLabel}>Total Candidates</Text>
            <View style={s.linkRow}>
              <Text style={s.statLinkText}>View candidates</Text>
              <Ionicons name="chevron-forward" size={13} color="#034b71" />
            </View>
          </TouchableOpacity>

          {/* Active Jobs Card */}
          <TouchableOpacity
            style={s.statCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Jobs')}
          >
            <View style={s.cardTopRow}>
              <View style={[s.statIconBox, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="briefcase-outline" size={20} color="#10b981" />
              </View>
              <View style={[s.growthBadge, { backgroundColor: '#e6f0f6' }]}>
                <Text style={[s.growthBadgeText, { color: '#034b71' }]}>+3 new</Text>
              </View>
            </View>
            <Text style={s.statNum}>{stats.jobs}</Text>
            <Text style={s.statLabel}>Active Jobs</Text>
            <View style={s.linkRow}>
              <Text style={[s.statLinkText, { color: '#10b981' }]}>Manage jobs</Text>
              <Ionicons name="chevron-forward" size={13} color="#10b981" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Quick Actions (4 Cards in 1 Row) ── */}
        <View style={s.section}>
          <Text style={s.secTitle}>Quick Actions</Text>
          <View style={s.actionsGrid}>
            {[
              {
                icon: 'people-outline',
                label: 'Candidates',
                color: '#034b71',
                bg: '#e6f0f6',
                route: 'Candidates',
              },
              {
                icon: 'briefcase-outline',
                label: 'Jobs',
                color: '#10b981',
                bg: '#ecfdf5',
                route: 'Jobs',
              },
              {
                icon: 'document-text-outline',
                label: stats.applications ? `Apps (${stats.applications})` : 'Apps',
                color: '#f59e0b',
                bg: '#fffbeb',
                route: 'Apps',
              },
              {
                icon: 'ribbon-outline',
                label: 'Test Results',
                color: '#ec4899',
                bg: '#fdf2f8',
                route: 'TestResults',
              },
              {
                icon: 'settings-outline',
                label: 'Settings',
                color: '#8b5cf6',
                bg: '#f5f3ff',
                route: 'Settings',
              },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={s.actionCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[s.actionIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={s.actionLabel} numberOfLines={1}>{item.label}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* ── Recent Candidates (Clickable) ── */}
      <View style={s.section}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.secTitle}>Recent Candidates</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Candidates')}>
            <Text style={s.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>
        <View style={s.listCard}>
          {recentCandidates.length === 0 ? (
            <Text style={s.emptyTxt}>No candidates yet</Text>
          ) : (
            recentCandidates.map((c, i) => (
              <TouchableOpacity
                key={c._id}
                style={[s.listItem, i === recentCandidates.length - 1 && s.lastItem]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Candidates')}
              >
                <View style={s.listAvatar}>
                  <Text style={s.listAvatarTxt}>
                    {(c.firstName?.[0] || 'C').toUpperCase()}
                    {(c.lastName?.[0] || '').toUpperCase()}
                  </Text>
                </View>
                <View style={s.listInfo}>
                  <Text style={s.listName}>{c.firstName} {c.lastName}</Text>
                  <Text style={s.listSub} numberOfLines={1}>{c.email}</Text>
                </View>
                <View style={[s.badge, c.resumeUrl ? s.badgeGreen : s.badgeGray]}>
                  <Text style={[s.badgeTxt, c.resumeUrl ? s.badgeTxtG : s.badgeTxtDef]}>
                    {c.resumeUrl ? 'Resume ✓' : 'No CV'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* ── Recent Jobs Posted (Clickable) ── */}
      <View style={[s.section, { marginBottom: 30 }]}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.secTitle}>Recent Jobs Posted</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={s.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>
        <View style={s.listCard}>
          {recentJobs.length === 0 ? (
            <Text style={s.emptyTxt}>No jobs posted yet</Text>
          ) : (
            recentJobs.map((j, i) => (
              <TouchableOpacity
                key={j._id}
                style={[s.listItem, i === recentJobs.length - 1 && s.lastItem]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Jobs')}
              >
                <View style={[s.listAvatar, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="briefcase-outline" size={18} color="#10b981" />
                </View>
                <View style={s.listInfo}>
                  <Text style={s.listName}>{j.title}</Text>
                  <Text style={s.listSub} numberOfLines={1}>
                    {j.company} {j.location ? `· ${j.location}` : ''}
                  </Text>
                </View>
                <View style={[s.badge, s.badgeBlue]}>
                  <Text style={s.badgeTxtBlue}>{j.type || 'Full-time'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#034b71' },
  cont: { flex: 1, backgroundColor: '#f8fafc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loaderTxt: { marginTop: 12, color: '#64748b', fontSize: 14 },

  // Hero
  hero: {
    backgroundColor: '#034b71',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  brandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 2,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 48,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 3,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  brandLogoImg: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  brandSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 1,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 1.5,
    borderColor: '#034b71',
  },

  // User Row
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  userLeft: {
    flex: 1,
    marginRight: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  waveEmoji: {
    fontSize: 18,
    marginLeft: 6,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  greetingSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12.5,
    marginTop: 6,
    fontWeight: '400',
    lineHeight: 17,
  },

  // Avatar Box
  avatarContainer: {
    position: 'relative',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fde047',
    shadowColor: '#fde047',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verifyBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#034b71',
  },

  circle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -60,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -20,
  },

  // Overlapping Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -32,
    gap: 12,
    zIndex: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  growthBadgeText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '700',
  },
  statNum: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 14,
  },
  statLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },
  linkRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#034b71',
    marginRight: 3,
  },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  viewAllLink: { fontSize: 13, color: '#034b71', fontWeight: 'bold', marginBottom: 12 },

  // Quick Actions (4 in 1 Row)
  actionsGrid: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: { fontSize: 11, fontWeight: '600', color: '#334155', textAlign: 'center' },

  // Lists
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastItem: { borderBottomWidth: 0 },
  listAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e6f0f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listAvatarTxt: { fontSize: 13, fontWeight: 'bold', color: '#034b71' },
  listInfo: { flex: 1 },
  listName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  listSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeGreen: { backgroundColor: '#ecfdf5' },
  badgeGray: { backgroundColor: '#f1f5f9' },
  badgeBlue: { backgroundColor: '#e6f0f6' },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  badgeTxtG: { color: '#10b981' },
  badgeTxtDef: { color: '#94a3b8' },
  badgeTxtBlue: { color: '#034b71', fontSize: 11, fontWeight: '600' },
  emptyTxt: { textAlign: 'center', color: '#94a3b8', padding: 24, fontSize: 14 },
});
