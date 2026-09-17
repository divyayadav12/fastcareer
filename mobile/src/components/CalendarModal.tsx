import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarModalProps {
  visible: boolean;
  value?: string; // YYYY-MM-DD
  onClose: () => void;
  onSelectDate: (date: string) => void;
  title?: string;
  minYear?: number;
  maxYear?: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarModal({
  visible,
  value,
  onClose,
  onSelectDate,
  title = 'Select Date of Birth',
  minYear = 1960,
  maxYear = new Date().getFullYear(),
}: CalendarModalProps) {
  // Parse initial date or default to ~23 years ago for DOB
  const initialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return { year: y, month: m - 1, day: d };
    }
    const defaultYear = new Date().getFullYear() - 23;
    return { year: defaultYear, month: 0, day: 1 };
  }, [value, visible]);

  const [currentYear, setCurrentYear] = useState(initialDate.year);
  const [currentMonth, setCurrentMonth] = useState(initialDate.month);
  const [selectedDay, setSelectedDay] = useState<number | null>(
    value ? initialDate.day : null
  );

  // Toggle between calendar view and Year/Month jump picker
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

  useEffect(() => {
    if (visible) {
      setCurrentYear(initialDate.year);
      setCurrentMonth(initialDate.month);
      setSelectedDay(value ? initialDate.day : null);
      setViewMode('calendar');
    }
  }, [visible, initialDate, value]);

  // Generate days in current month
  const calendarDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    const days: (number | null)[] = [];
    // Padding before the 1st day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days 1 to totalDays
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > minYear) {
        setCurrentYear(y => y - 1);
        setCurrentMonth(11);
      }
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < maxYear) {
        setCurrentYear(y => y + 1);
        setCurrentMonth(0);
      }
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${mStr}-${dStr}`;
    onSelectDate(formatted);
    onClose();
  };

  const yearsList = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar" size={20} color="#034b71" style={{ marginRight: 8 }} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Month & Year Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.navArrow}
              onPress={handlePrevMonth}
              disabled={viewMode !== 'calendar'}
            >
              <Ionicons name="chevron-back" size={20} color={viewMode === 'calendar' ? '#0f172a' : '#cbd5e1'} />
            </TouchableOpacity>

            <View style={styles.navCenter}>
              <TouchableOpacity
                style={[styles.jumpBtn, viewMode === 'month' && styles.jumpBtnActive]}
                onPress={() => setViewMode(v => (v === 'month' ? 'calendar' : 'month'))}
              >
                <Text style={[styles.navMonth, viewMode === 'month' && styles.jumpTextActive]}>
                  {MONTH_NAMES[currentMonth]}
                </Text>
                <Ionicons
                  name={viewMode === 'month' ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={viewMode === 'month' ? '#034b71' : '#64748b'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.jumpBtn, viewMode === 'year' && styles.jumpBtnActive]}
                onPress={() => setViewMode(v => (v === 'year' ? 'calendar' : 'year'))}
              >
                <Text style={[styles.navYear, viewMode === 'year' && styles.jumpTextActive]}>
                  {currentYear}
                </Text>
                <Ionicons
                  name={viewMode === 'year' ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={viewMode === 'year' ? '#034b71' : '#64748b'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.navArrow}
              onPress={handleNextMonth}
              disabled={viewMode !== 'calendar'}
            >
              <Ionicons name="chevron-forward" size={20} color={viewMode === 'calendar' ? '#0f172a' : '#cbd5e1'} />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          {viewMode === 'calendar' && (
            <View style={styles.calendarContainer}>
              {/* Weekday headers */}
              <View style={styles.weekRow}>
                {WEEKDAYS.map((wd, i) => (
                  <Text key={i} style={[styles.weekDayText, (i === 0 || i === 6) && styles.weekendText]}>
                    {wd}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <View key={`empty-${idx}`} style={styles.dayCell} />;
                  }

                  const isSelected =
                    selectedDay === day &&
                    currentMonth === initialDate.month &&
                    currentYear === initialDate.year;

                  const isToday =
                    day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear();

                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.dayCell,
                        isSelected && styles.selectedDayCell,
                        isToday && !isSelected && styles.todayCell,
                      ]}
                      onPress={() => handleDayPress(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.selectedDayText,
                          isToday && !isSelected && styles.todayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Month Selector Grid */}
          {viewMode === 'month' && (
            <View style={styles.monthGrid}>
              {MONTH_SHORT.map((mName, idx) => {
                const isCur = idx === currentMonth;
                return (
                  <TouchableOpacity
                    key={mName}
                    style={[styles.monthCard, isCur && styles.monthCardActive]}
                    onPress={() => {
                      setCurrentMonth(idx);
                      setViewMode('calendar');
                    }}
                  >
                    <Text style={[styles.monthCardText, isCur && styles.monthCardTextActive]}>
                      {mName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Year Selector Scroll */}
          {viewMode === 'year' && (
            <ScrollView style={styles.yearScroll} showsVerticalScrollIndicator={true}>
              <View style={styles.yearGrid}>
                {yearsList.map(yr => {
                  const isCur = yr === currentYear;
                  return (
                    <TouchableOpacity
                      key={yr}
                      style={[styles.yearCard, isCur && styles.yearCardActive]}
                      onPress={() => {
                        setCurrentYear(yr);
                        setViewMode('calendar');
                      }}
                    >
                      <Text style={[styles.yearCardText, isCur && styles.yearCardTextActive]}>
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            {value ? (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  onSelectDate('');
                  onClose();
                }}
              >
                <Text style={styles.clearBtnText}>Clear Date</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navCenter: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  jumpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  jumpBtnActive: {
    backgroundColor: '#e6f0f6',
    borderWidth: 1,
    borderColor: '#b2d1e5',
  },
  navMonth: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  navYear: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  jumpTextActive: {
    color: '#034b71',
  },
  calendarContainer: {
    marginTop: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  weekDayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  weekendText: {
    color: '#ef4444',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 19,
  },
  dayText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  selectedDayCell: {
    backgroundColor: '#034b71',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: '#034b71',
  },
  todayText: {
    color: '#034b71',
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  monthCard: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  monthCardActive: {
    backgroundColor: '#034b71',
    borderColor: '#034b71',
  },
  monthCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  monthCardTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  yearScroll: {
    maxHeight: 220,
    marginVertical: 10,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  yearCard: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  yearCardActive: {
    backgroundColor: '#034b71',
    borderColor: '#034b71',
  },
  yearCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  yearCardTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
});
