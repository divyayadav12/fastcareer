import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X, MapPin, Check } from 'lucide-react';
import { TOP_CA_CITIES, ARTICLESHIP_CITIES } from '../utils/constants';

interface CityDropdownInputProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

export const CityDropdownInput: React.FC<CityDropdownInputProps> = ({
  value,
  onChange,
  placeholder = 'City where articleship done',
  required = false,
  className = '',
  inputClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered list
  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return ARTICLESHIP_CITIES.slice(0, 80);
    }
    return ARTICLESHIP_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 80);
  }, [searchQuery]);

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Clickable input trigger */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full px-3 py-2 border rounded-xl flex items-center justify-between cursor-pointer bg-white transition-all text-xs sm:text-sm ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
            : 'border-slate-200 hover:border-slate-300'
        } ${inputClassName}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin size={15} className={value ? 'text-blue-600 shrink-0' : 'text-slate-400 shrink-0'} />
          <span className={`block truncate ${value ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
            {value || placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-1.5">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={15}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
          />
        </div>
      </div>

      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          tabIndex={-1}
          value={value}
          onChange={() => {}}
          required={required}
          className="opacity-0 absolute inset-x-0 bottom-0 h-0 pointer-events-none"
        />
      )}

      {/* Floating Dropdown Menu (ONLY visible when opened) */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[280px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search bar inside dropdown */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type city name..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Top CA Hub Cities (Quick Select inside dropdown) */}
          {!searchQuery.trim() && (
            <div className="p-2.5 border-b border-slate-100 bg-white">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Top CA Cities / Hubs</span>
                <span className="text-[9px] text-slate-400 font-normal">Quick Select</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {TOP_CA_CITIES.slice(0, 14).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                      value === city
                        ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom city option if user typed something not matching exactly */}
          {searchQuery.trim() && !filteredCities.some(c => c.toLowerCase() === searchQuery.trim().toLowerCase()) && (
            <div className="p-1 border-b border-slate-100 bg-blue-50/40">
              <button
                type="button"
                onClick={() => handleSelect(searchQuery.trim())}
                className="w-full px-3 py-1.5 text-left text-xs text-blue-600 hover:bg-blue-100/60 rounded-lg font-medium flex items-center justify-between transition-colors"
              >
                <span>Use &quot;{searchQuery.trim()}&quot;</span>
                <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700">Custom City</span>
              </button>
            </div>
          )}

          {/* Scrollable List of Cities */}
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
            <div className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10 flex justify-between items-center">
              <span>{searchQuery.trim() ? 'Search Results' : 'All Cities (Top Hubs First)'}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {filteredCities.length} cities
              </span>
            </div>

            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = value === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50/70 transition-colors ${
                      isSelected ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className={isSelected ? 'text-blue-600' : 'text-slate-300'} />
                      {city}
                    </span>
                    {isSelected && <Check size={13} className="text-blue-600 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No matching city found.
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchQuery.trim())}
                    className="block mx-auto mt-2 text-blue-600 hover:underline font-medium"
                  >
                    Select &quot;{searchQuery.trim()}&quot; as custom city
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
