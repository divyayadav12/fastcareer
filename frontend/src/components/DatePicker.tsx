import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  locale?: string;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  showClearButton?: boolean;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  name,
  id,
  onChange,
  minDate,
  maxDate = new Date(), // default maxDate is today
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  placeholder = "Select date",
  disabled = false,
  required = false,
  readOnly = false,
  error,
  helperText,
  label,
  locale = "en-IN",
  autoFocus = false,
  closeOnSelect = true,
  showClearButton = true,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
  const selectedDate = value !== undefined ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const [yearSearch, setYearSearch] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const yearSearchRef = useRef<HTMLInputElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setView('calendar');
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Sync currentMonth when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(selectedDate || new Date());
      setView('calendar');
    }
  }, [isOpen]); // REMOVED selectedDate FROM DEPENDENCIES to prevent parent re-renders from hijacking the view

  // Focus year input when switching to year view
  useEffect(() => {
    if (view === 'year' && yearSearchRef.current) {
      yearSearchRef.current.focus();
    }
  }, [view]);

  // Date manipulation helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > maxDate) return true;
    if (minDate && date < minDate) return true;
    if (date.getFullYear() < minYear) return true;
    if (date.getFullYear() > maxYear) return true;
    return false;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateDisabled(newDate)) return;

    if (value === undefined) setInternalValue(newDate);
    if (onChange) onChange(newDate);
    
    if (closeOnSelect) {
      setIsOpen(false);
      setView('calendar');
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    let firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Mon=0, Sun=6

    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="p-2"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      const isToday = isSameDay(date, today);
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDateSelect(d); }}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSelected ? 'bg-blue-600 text-white font-bold' : ''}
            ${!isSelected && isToday ? 'bg-blue-50 text-blue-600 font-bold' : ''}
            ${!isSelected && !isToday && !disabled ? 'hover:bg-gray-100 text-gray-700' : ''}
            ${disabled ? 'text-gray-300 cursor-not-allowed opacity-50' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
            <div key={day} className="text-xs font-semibold text-gray-400 py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {days}
        </div>
      </div>
    );
  };

  const renderMonthSelector = () => {
    return (
      <div className="grid grid-cols-3 gap-2 p-3">
        {MONTHS.map((m, i) => (
          <button
            key={m}
            type="button"
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              setCurrentMonth(new Date(currentMonth.getFullYear(), i, 1));
              setView('calendar'); // Back to calendar for faster day selection
            }}
            className={`p-2 rounded text-sm hover:bg-gray-100 transition-colors
              ${currentMonth.getMonth() === i ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}
            `}
          >
            {m}
          </button>
        ))}
      </div>
    );
  };

  const renderYearSelector = () => {
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).reverse();
    const filteredYears = years.filter(y => y.toString().includes(yearSearch));

    return (
      <div className="flex flex-col h-64">
        <div className="p-3 border-b border-gray-100 relative">
          <Search className="w-4 h-4 absolute left-6 top-6 text-gray-400" />
          <input
            ref={yearSearchRef}
            type="text"
            value={yearSearch}
            onChange={e => setYearSearch(e.target.value)}
            placeholder="Search year..."
            aria-label="Search year"
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredYears.length > 0) {
                e.preventDefault();
                setCurrentMonth(new Date(filteredYears[0], currentMonth.getMonth(), 1));
                setView('month');
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1" ref={yearListRef}>
          {filteredYears.map(y => (
            <button
              key={y}
              type="button"
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                setCurrentMonth(new Date(y, currentMonth.getMonth(), 1));
                setView('month');
              }}
              className={`w-full text-left px-4 py-2 rounded text-sm transition-colors
                ${currentMonth.getFullYear() === y ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {y}
            </button>
          ))}
          {filteredYears.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">No years found</div>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        className={`relative flex items-center w-full px-4 py-2 bg-white border rounded-lg cursor-pointer transition-colors
          ${error ? 'border-red-500 focus-within:ring-red-200' : 'border-gray-200 focus-within:ring-primary/20 focus-within:border-primary'}
          ${disabled || readOnly ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'}
        `}
        onClick={(e) => {
          e.preventDefault(); e.stopPropagation();
          if (!disabled && !readOnly) setIsOpen(!isOpen);
        }}
        tabIndex={disabled || readOnly ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !readOnly) {
            e.preventDefault(); e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className={`flex-1 ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </div>
        
        {showClearButton && selectedDate && !disabled && !readOnly && (
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full z-10 relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (value === undefined) setInternalValue(null);
              if (onChange) onChange(null);
            }}
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Calendar className="w-5 h-5 text-gray-400 ml-2" />
        
        {/* Hidden input for form submission */}
        <input 
          type="hidden" 
          name={name} 
          id={id} 
          value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} 
        />
      </div>

      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
             role="dialog" aria-label="Date picker">
          
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevMonth(); }} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2 py-1 flex items-center gap-1 font-semibold text-gray-800 hover:bg-gray-100 rounded transition-colors"
                onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setView(view === 'month' ? 'calendar' : 'month');
                }}
              >
                {MONTHS[currentMonth.getMonth()]}
                <ChevronDown className={`w-4 h-4 text-gray-500`} />
              </button>
              <button
                type="button"
                className="px-2 py-1 flex items-center gap-1 font-semibold text-gray-800 hover:bg-gray-100 rounded transition-colors"
                onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setView(view === 'year' ? 'calendar' : 'year');
                  setYearSearch('');
                }}
              >
                {currentMonth.getFullYear()}
                <ChevronDown className={`w-4 h-4 text-gray-500`} />
              </button>
            </div>
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextMonth(); }} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight className="w-5 h-5" /></button>
          </div>

          {view === 'calendar' && renderCalendar()}
          {view === 'month' && renderMonthSelector()}
          {view === 'year' && renderYearSelector()}

        </div>
      )}
    </div>
  );
};
