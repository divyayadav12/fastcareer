import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, TextInput, Modal, ScrollView, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { viewResume } from '../utils/fileHelper';
import CandidateDetailsModal from '../components/CandidateDetailsModal';
import CalendarModal from '../components/CalendarModal';
import { STATES, STATE_CITY_MAP, ALL_CITIES } from '../utils/constants';

// ─── Constants ────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'
];
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL = ['Unmarried', 'Married'];
const YES_NO = ['Yes', 'No'];
const ATTEMPTS = ['1','2','3','4','5','6+'];
const FIRM_TYPES = ['Big4', 'Medium', 'Small'];
const GRAD_TYPES = ['REGULAR', 'CORRESPONDENCE'];
const CA_PASS_MONTHS = ['May', 'November'];
const YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));

// ─── Filters Interface ─────────────────────────────────────────────────────────
interface Filters {
  search: string;
  email: string;
  state: string;
  city: string;
  gender: string;
  maritalStatus: string;
  course: string;
  gradCompleted: string;
  gradType: string;
  hasResume: string;

  // CA Inter
  fresherCA: string;
  inter1stAttempt: string;
  interGroup1Attempts: string;
  interGroup2Attempts: string;
  interRanker: string;

  // CA Final
  final1stAttempt: string;
  finalGroup1Attempts: string;
  finalGroup2Attempts: string;
  finalRanker: string;
  finalPassMonth: string;
  finalPassYear: string;

  // Articleship & others
  big4: string;
  firmType: string;
  gmcs: string;
  industrialTrainee: string;
  listedCompany: string;

  registeredFrom: string;
  registeredTo: string;
}

const EMPTY: Filters = {
  search: '', email: '', state: '', city: '', gender: '', maritalStatus: '',
  course: '', gradCompleted: '', gradType: '', hasResume: '',
  fresherCA: '',
  inter1stAttempt: '', interGroup1Attempts: '', interGroup2Attempts: '', interRanker: '',
  final1stAttempt: '', finalGroup1Attempts: '', finalGroup2Attempts: '', finalRanker: '',
  finalPassMonth: '', finalPassYear: '',
  big4: '', firmType: '', gmcs: '', industrialTrainee: '', listedCompany: '',
  registeredFrom: '', registeredTo: '',
};

// ─── Helper Components ─────────────────────────────────────────────────────────
function Pill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <View style={s.pill}>
      <Text style={s.pillText} numberOfLines={1}>{label}</Text>
      <TouchableOpacity
        onPress={onClear}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{ marginLeft: 6 }}
      >
        <Ionicons name="close-circle" size={16} color="#034b71" />
      </TouchableOpacity>
    </View>
  );
}

function SelectModal({ label, options, value, onChange, searchable = false }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(q));
  }, [options, query, searchable]);

  return (
    <View style={s.fg}>
      <Text style={s.fl}>{label}</Text>
      <TouchableOpacity style={s.sel} onPress={() => { setQuery(''); setOpen(true); }}>
        <Text style={[s.selTxt, !value && { color: '#94a3b8' }]}>{value || 'All'}</Text>
        <Ionicons name="chevron-down" size={15} color="#64748b" />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.ov} onPress={() => setOpen(false)}>
          <View style={s.pb}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b' }}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {searchable && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <TextInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={query}
                  onChangeText={setQuery}
                  style={{ backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#e2e8f0', color: '#0f172a' }}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            )}
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 350 }}>
              <TouchableOpacity style={s.pi} onPress={() => { onChange(''); setOpen(false); }}>
                <Text style={[s.pit, !value && s.pia]}>All</Text>
              </TouchableOpacity>
              {filteredOptions.map(opt => (
                <TouchableOpacity key={opt} style={s.pi} onPress={() => { onChange(opt); setOpen(false); }}>
                  <Text style={[s.pit, value === opt && s.pia]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function FilterText({ label, placeholder, value, onChange, keyboardType = 'default' }: any) {
  return (
    <View style={s.fg}>
      <Text style={s.fl}>{label}</Text>
      <TextInput
        style={s.fi}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || ''}
        keyboardType={keyboardType}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

function FilterDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={s.fg}>
      <Text style={s.fl}>{label}</Text>
      <TouchableOpacity style={s.sel} onPress={() => setModalVisible(true)} activeOpacity={0.75}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name="calendar-outline" size={16} color="#034b71" style={{ marginRight: 8 }} />
          <Text style={[s.selTxt, !value && { color: '#94a3b8' }]}>
            {value || 'Select Date'}
          </Text>
        </View>
        {value ? (
          <TouchableOpacity onPress={() => onChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-down" size={15} color="#64748b" />
        )}
      </TouchableOpacity>
      <CalendarModal
        visible={modalVisible}
        value={value}
        title={label}
        onClose={() => setModalVisible(false)}
        onSelectDate={(selected) => onChange(selected)}
      />
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function CandidatesFilterScreen() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [filters, setFilters] = useState<Filters>({ ...EMPTY });
  const [temp, setTemp] = useState<Filters>({ ...EMPTY });
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const stateOptions = useMemo(() => (STATES && STATES.length > 0 ? STATES : INDIAN_STATES), []);

  const cityOptions = useMemo(() => {
    if (temp.state && STATE_CITY_MAP[temp.state]) {
      return STATE_CITY_MAP[temp.state];
    }
    return ALL_CITIES;
  }, [temp.state]);

  const set = useCallback((k: keyof Filters) => (v: string) =>
    setTemp(p => ({ ...p, [k]: v })), []);

  useEffect(() => {
    api.get('/users/candidates')
      .then(r => setCandidates(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = useMemo(() =>
    Object.entries(filters).filter(([k, v]) => k !== 'search' && v !== '').length, [filters]);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const fn = `${c.firstName} ${c.lastName}`.toLowerCase();
      const em = (c.email || '').toLowerCase();
      const city = (c.personalDetails?.currentCity || '').toLowerCase();
      const course = (c.qualifications?.graduation?.courseName || '').toLowerCase();
      const s = filters.search.toLowerCase();

      if (s && !fn.includes(s) && !em.includes(s) && !city.includes(s) && !course.includes(s)) return false;
      if (filters.email && !em.includes(filters.email.toLowerCase())) return false;
      if (filters.state && c.personalDetails?.currentState !== filters.state) return false;
      if (filters.city && !city.includes(filters.city.toLowerCase())) return false;
      if (filters.gender && c.personalDetails?.gender !== filters.gender) return false;
      if (filters.maritalStatus && c.personalDetails?.maritalStatus !== filters.maritalStatus) return false;
      if (filters.course && !course.includes(filters.course.toLowerCase())) return false;
      if (filters.gradCompleted && c.qualifications?.graduation?.completed !== filters.gradCompleted) return false;
      if (filters.gradType && c.qualifications?.graduation?.type !== filters.gradType) return false;
      if (filters.hasResume === 'Yes' && !c.resumeUrl) return false;
      if (filters.hasResume === 'No' && c.resumeUrl) return false;

      const isFresher = c.caPortfolio?.isFresherCA ? 'Yes' : 'No';
      if (filters.fresherCA && isFresher !== filters.fresherCA) return false;

      const inter1st = c.caPortfolio?.caInter?.bothGroups1stAttempt ? 'Yes' : 'No';
      if (filters.inter1stAttempt && inter1st !== filters.inter1stAttempt) return false;
      if (filters.interGroup1Attempts && c.caPortfolio?.caInter?.group1Attempts !== filters.interGroup1Attempts) return false;
      if (filters.interGroup2Attempts && c.caPortfolio?.caInter?.group2Attempts !== filters.interGroup2Attempts) return false;
      if (filters.interRanker && c.caPortfolio?.caInter?.ranker !== filters.interRanker) return false;

      const final1st = c.caPortfolio?.caFinal?.bothGroups1stAttempt ? 'Yes' : 'No';
      if (filters.final1stAttempt && final1st !== filters.final1stAttempt) return false;
      if (filters.finalGroup1Attempts && c.caPortfolio?.caFinal?.group1Attempts !== filters.finalGroup1Attempts) return false;
      if (filters.finalGroup2Attempts && c.caPortfolio?.caFinal?.group2Attempts !== filters.finalGroup2Attempts) return false;
      if (filters.finalRanker && c.caPortfolio?.caFinal?.ranker !== filters.finalRanker) return false;
      if (filters.finalPassMonth && c.caPortfolio?.caFinal?.completionSessionMonth !== filters.finalPassMonth) return false;
      if (filters.finalPassYear && c.caPortfolio?.caFinal?.completionSessionYear !== filters.finalPassYear) return false;

      const big4Val = (c.caPortfolio?.big4Articleship && c.caPortfolio.big4Articleship !== 'No' && c.caPortfolio.big4Articleship !== 'none' && c.caPortfolio.big4Articleship !== '') ? 'Yes' : 'No';
      if (filters.big4 && big4Val !== filters.big4) return false;

      const hasFirmType = c.caPortfolio?.articleships?.some((a: any) => a.firmType === filters.firmType);
      if (filters.firmType && !hasFirmType) return false;

      if (filters.gmcs && c.caPortfolio?.gmcsCompleted !== filters.gmcs) return false;
      if (filters.industrialTrainee && c.caPortfolio?.industrialTrainee !== filters.industrialTrainee) return false;
      if (filters.listedCompany && c.caPortfolio?.listedCompanyWork !== filters.listedCompany) return false;

      if (filters.registeredFrom || filters.registeredTo) {
        const d = new Date(c.createdAt);
        if (filters.registeredFrom && d < new Date(filters.registeredFrom)) return false;
        if (filters.registeredTo) {
          const to = new Date(filters.registeredTo);
          to.setHours(23, 59, 59, 999);
          if (d > to) return false;
        }
      }

      return true;
    });
  }, [candidates, filters]);

  const applyFilters = () => {
    setFilters({ ...temp });
    setShowPanel(false);
  };

  const clearAll = () => { setFilters({ ...EMPTY }); setTemp({ ...EMPTY }); };

  const activePills = useMemo(() => {
    const pills: { label: string; key: keyof Filters }[] = [];
    const map: Partial<Record<keyof Filters, string>> = {
      state: 'State', city: 'City', email: 'Email', gender: 'Gender',
      maritalStatus: 'Marital', course: 'Course', gradCompleted: 'Grad',
      gradType: 'Grad Type', hasResume: 'Resume', fresherCA: 'Fresher CA',
      inter1stAttempt: 'Inter 1st', interGroup1Attempts: 'Inter G1', interGroup2Attempts: 'Inter G2',
      interRanker: 'Inter Ranker', final1stAttempt: 'Final 1st', finalGroup1Attempts: 'Final G1',
      finalGroup2Attempts: 'Final G2', finalRanker: 'Final Ranker', finalPassMonth: 'Pass Month',
      finalPassYear: 'Pass Year', big4: 'Big4', firmType: 'Firm', gmcs: 'GMCS',
      industrialTrainee: 'Ind. Trainee', listedCompany: 'Listed Co.', registeredFrom: 'From', registeredTo: 'To',
    };
    Object.entries(filters).forEach(([k, v]) => {
      if (k !== 'search' && v && map[k as keyof Filters]) {
        pills.push({ label: `${map[k as keyof Filters]}: ${v}`, key: k as keyof Filters });
      }
    });
    return pills;
  }, [filters]);

  const renderCandidate = ({ item }: any) => (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.85}
      onPress={() => {
        setSelectedCandidate(item);
        setDetailModalVisible(true);
      }}
    >
      <View style={s.chead}>
        <View style={s.av}>
          <Text style={s.avt}>{item.firstName?.[0]}{item.lastName?.[0]}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={s.name}>{item.firstName} {item.lastName}</Text>
            <View style={s.viewPill}>
              <Text style={s.viewPillText}>View Details</Text>
              <Ionicons name="chevron-forward" size={12} color="#034b71" />
            </View>
          </View>
          <Text style={s.email}>{item.email}</Text>
        </View>
      </View>
      {(item.personalDetails?.currentCity || item.personalDetails?.currentState) && (
        <View style={s.tag}>
          <Ionicons name="location-outline" size={13} color="#64748b" />
          <Text style={s.tagT}> {[item.personalDetails?.currentCity, item.personalDetails?.currentState].filter(Boolean).join(', ')}</Text>
        </View>
      )}
      {item.personalDetails?.gender && (
        <View style={s.tag}>
          <Ionicons name="person-outline" size={13} color="#64748b" />
          <Text style={s.tagT}> {item.personalDetails.gender}{item.personalDetails?.maritalStatus ? ` · ${item.personalDetails.maritalStatus}` : ''}</Text>
        </View>
      )}
      {item.qualifications?.graduation?.courseName && (
        <View style={s.tag}>
          <Ionicons name="school-outline" size={13} color="#64748b" />
          <Text style={s.tagT}> {item.qualifications.graduation.courseName}</Text>
        </View>
      )}
      {item.caPortfolio?.isFresherCA !== undefined && (
        <View style={s.tag}>
          <Ionicons name="ribbon-outline" size={13} color="#64748b" />
          <Text style={s.tagT}> {item.caPortfolio.isFresherCA ? 'Fresher CA' : 'Experienced CA'}</Text>
        </View>
      )}
      <View style={s.cfoot}>
        <Text style={s.date}>Joined: {new Date(item.createdAt).toLocaleDateString()}</Text>
        {item.resumeUrl ? (
          <TouchableOpacity style={s.rb} onPress={() => viewResume(item.resumeUrl)}>
            <Ionicons name="document-text-outline" size={14} color="#034b71" />
            <Text style={s.rl}> View Resume</Text>
          </TouchableOpacity>
        ) : <Text style={s.nr}>No Resume</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.cont}>
      {/* Search + Filter Button */}
      <View style={s.srow}>
        <View style={s.sbox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={s.sinp}
            placeholder="Search name, email, city, course..."
            value={filters.search}
            onChangeText={t => setFilters(p => ({ ...p, search: t }))}
            placeholderTextColor="#94a3b8"
          />
          {filters.search ? <TouchableOpacity onPress={() => setFilters(p => ({ ...p, search: '' }))}><Ionicons name="close" size={18} color="#94a3b8" /></TouchableOpacity> : null}
        </View>
        <TouchableOpacity
          style={[s.fbtn, activeCount > 0 && s.fbtnA]}
          onPress={() => { setTemp({ ...filters }); setShowPanel(true); }}
        >
          <Ionicons name="options" size={20} color={activeCount > 0 ? '#fff' : '#034b71'} />
          {activeCount > 0 && <Text style={s.fc}>{activeCount}</Text>}
        </TouchableOpacity>
      </View>

      {/* Active Filter Pills */}
      {activePills.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.prow}
          contentContainerStyle={s.prowContent}
        >
          {activePills.map(({ label, key }) => (
            <Pill key={key} label={label} onClear={() => setFilters(p => ({ ...p, [key]: '' }))} />
          ))}
          <TouchableOpacity onPress={clearAll} style={s.ca} activeOpacity={0.7}>
            <Text style={s.cat}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Text style={s.rc}>{filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found</Text>

      {loading
        ? <ActivityIndicator size="large" color="#034b71" style={{ marginTop: 50 }} />
        : (
          <FlatList
            data={filtered}
            renderItem={renderCandidate}
            keyExtractor={i => i._id}
            contentContainerStyle={s.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={s.empty}>
                <Ionicons name="people-outline" size={48} color="#cbd5e1" />
                <Text style={s.emptyT}>No candidates match your filters</Text>
              </View>
            }
          />
        )
      }

      {/* ─── Filter Panel Modal ────────────────────────────────────────────── */}
      <Modal visible={showPanel} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPanel(false)}>
        <View style={s.fmod}>
          <View style={s.fmh}>
            <Text style={s.fmt}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setShowPanel(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.fsc} contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">

            {/* ── Basic ── */}
            <Text style={s.sec}>Basic Information</Text>
            <FilterText label="Email" placeholder="e.g. name@example.com" value={temp.email} onChange={set('email')} />
            <SelectModal
              label="State"
              options={stateOptions}
              value={temp.state}
              onChange={(v) => setTemp(p => ({ ...p, state: v, city: '' }))}
              searchable
            />
            <SelectModal
              label="City"
              options={cityOptions}
              value={temp.city}
              onChange={set('city')}
              searchable
            />
            <SelectModal label="Gender" options={GENDERS} value={temp.gender} onChange={set('gender')} />
            <SelectModal label="Marital Status" options={MARITAL} value={temp.maritalStatus} onChange={set('maritalStatus')} />

            {/* ── Education ── */}
            <Text style={s.sec}>Education</Text>
            <FilterText label="Course / Degree" placeholder="e.g. B.Com" value={temp.course} onChange={set('course')} />
            <SelectModal label="Graduation Completed" options={['Yes', 'No/Pursuing']} value={temp.gradCompleted} onChange={set('gradCompleted')} />
            <SelectModal label="Graduation Type" options={GRAD_TYPES} value={temp.gradType} onChange={set('gradType')} />

            {/* ── CA Inter ── */}
            <Text style={s.sec}>CA Inter</Text>
            <SelectModal label="Fresher CA" options={YES_NO} value={temp.fresherCA} onChange={set('fresherCA')} />
            <SelectModal label="Both Groups (1st Attempt)" options={YES_NO} value={temp.inter1stAttempt} onChange={set('inter1stAttempt')} />
            <SelectModal label="Group 1 Attempts" options={ATTEMPTS} value={temp.interGroup1Attempts} onChange={set('interGroup1Attempts')} />
            <SelectModal label="Group 2 Attempts" options={ATTEMPTS} value={temp.interGroup2Attempts} onChange={set('interGroup2Attempts')} />
            <SelectModal label="Ranker" options={YES_NO} value={temp.interRanker} onChange={set('interRanker')} />

            {/* ── CA Final ── */}
            <Text style={s.sec}>CA Final</Text>
            <SelectModal label="Both Groups (1st Attempt)" options={YES_NO} value={temp.final1stAttempt} onChange={set('final1stAttempt')} />
            <SelectModal label="Group 1 Attempts" options={ATTEMPTS} value={temp.finalGroup1Attempts} onChange={set('finalGroup1Attempts')} />
            <SelectModal label="Group 2 Attempts" options={ATTEMPTS} value={temp.finalGroup2Attempts} onChange={set('finalGroup2Attempts')} />
            <SelectModal label="Ranker" options={YES_NO} value={temp.finalRanker} onChange={set('finalRanker')} />
            <SelectModal label="Passing Month (Batch)" options={CA_PASS_MONTHS} value={temp.finalPassMonth} onChange={set('finalPassMonth')} />
            <FilterText label="Passing Year" placeholder="e.g. 2024" value={temp.finalPassYear} onChange={set('finalPassYear')} keyboardType="numeric" />

            {/* ── Articleship ── */}
            <Text style={s.sec}>Articleship</Text>
            <SelectModal label="Articleship Firm Type" options={FIRM_TYPES} value={temp.firmType} onChange={set('firmType')} />
            <SelectModal label="Big 4 Articleship (Anytime)" options={YES_NO} value={temp.big4} onChange={set('big4')} />
            <SelectModal label="GMCS Completed" options={YES_NO} value={temp.gmcs} onChange={set('gmcs')} />
            <SelectModal label="Industrial Trainee" options={YES_NO} value={temp.industrialTrainee} onChange={set('industrialTrainee')} />
            <SelectModal label="Listed Company Work" options={YES_NO} value={temp.listedCompany} onChange={set('listedCompany')} />

            {/* ── Resume ── */}
            <Text style={s.sec}>Resume & Registration</Text>
            <SelectModal label="Has Resume" options={YES_NO} value={temp.hasResume} onChange={set('hasResume')} />
            <FilterDate label="Registered From" value={temp.registeredFrom} onChange={set('registeredFrom')} />
            <FilterDate label="Registered To" value={temp.registeredTo} onChange={set('registeredTo')} />

          </ScrollView>

          <View style={s.fa}>
            <TouchableOpacity style={s.cb} onPress={() => setTemp({ ...EMPTY })}>
              <Text style={s.cbt}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.ab} onPress={applyFilters}>
              <Text style={s.abt}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CandidateDetailsModal
        visible={detailModalVisible}
        candidate={selectedCandidate}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedCandidate(null);
        }}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  cont: { flex: 1, backgroundColor: '#f8fafc' },
  srow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  sbox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  sinp: { flex: 1, fontSize: 14, color: '#0f172a' },
  fbtn: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#034b71', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 4 },
  fbtnA: { backgroundColor: '#034b71' },
  fc: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  prow: { marginHorizontal: 12, marginBottom: 8, maxHeight: 40 },
  prowContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingRight: 12 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0f6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8, borderWidth: 1, borderColor: '#b2d1e5' },
  pillText: { fontSize: 12, color: '#034b71', fontWeight: '600', includeFontPadding: false },
  ca: { paddingHorizontal: 8, paddingVertical: 5, justifyContent: 'center', alignItems: 'center' },
  cat: { color: '#ef4444', fontSize: 12, fontWeight: '600', includeFontPadding: false },
  rc: { fontSize: 12, fontWeight: '500', color: '#64748b', paddingHorizontal: 16, marginBottom: 8 },
  list: { padding: 12, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  chead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  av: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6f0f6', alignItems: 'center', justifyContent: 'center' },
  avt: { fontWeight: 'bold', color: '#034b71', fontSize: 15 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  viewPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  viewPillText: { fontSize: 11, fontWeight: '600', color: '#034b71', marginRight: 2 },
  email: { fontSize: 12, color: '#64748b' },
  tag: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  tagT: { fontSize: 12, color: '#64748b' },
  cfoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  date: { fontSize: 11, color: '#94a3b8' },
  rb: { flexDirection: 'row', alignItems: 'center' },
  rl: { fontSize: 13, fontWeight: 'bold', color: '#034b71' },
  nr: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyT: { color: '#94a3b8', marginTop: 12, fontSize: 15 },

  // Filter Modal
  fmod: { flex: 1, backgroundColor: '#f8fafc' },
  fmh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff' },
  fmt: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  fsc: { flex: 1, padding: 16 },
  sec: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  fa: { flexDirection: 'row', padding: 14, gap: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  cb: { flex: 1, padding: 13, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  cbt: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  ab: { flex: 2, padding: 13, borderRadius: 8, backgroundColor: '#034b71', alignItems: 'center' },
  abt: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // Shared form
  fg: { marginBottom: 14 },
  fl: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  fi: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0f172a' },
  sel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11 },
  selTxt: { fontSize: 14, color: '#0f172a' },
  ov: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  pb: { backgroundColor: '#fff', borderRadius: 16, width: '82%', maxHeight: '70%', overflow: 'hidden' },
  pt: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  pi: { paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  pit: { fontSize: 14, color: '#334155' },
  pia: { color: '#034b71', fontWeight: 'bold' },
});
