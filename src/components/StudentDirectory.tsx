import React, { useState, useMemo } from 'react';
import { Student, MONTH_NAMES_SHORT } from '../data/students';
import { sortStudentsUpcomingOrder, sortStudentsCalendarOrder } from '../utils/birthdayCalculator';
import { StudentCard } from './StudentCard';
import { Search, Calendar, Sparkles, Filter, X } from 'lucide-react';

interface StudentDirectoryProps {
  students: Student[];
  nextUpcomingIds: number[];
  todayIds: number[];
  onOpenLightbox: (student: Student) => void;
  posterMap?: Record<number, string>;
}

type SortMode = 'upcoming' | 'calendar';

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  nextUpcomingIds,
  todayIds,
  onOpenLightbox,
  posterMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('upcoming');

  // Month counts calculation
  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) counts[i] = 0;
    students.forEach((s) => {
      counts[s.month] = (counts[s.month] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    // 1. Sort base list according to selected mode
    const baseList =
      sortMode === 'upcoming'
        ? sortStudentsUpcomingOrder(students)
        : sortStudentsCalendarOrder(students);

    // 2. Filter by search query and month
    return baseList.filter((s) => {
      // Month filter
      if (selectedMonth !== 'all' && s.month !== selectedMonth) {
        return false;
      }

      // Search filter (by name or student number)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesId = s.id.toString() === query.replace('#', '');
        return matchesName || matchesId;
      }

      return true;
    });
  }, [students, sortMode, selectedMonth, searchQuery]);

  return (
    <section className="w-full mt-12 sm:mt-16 text-left">
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BATCH 23/24 ROSTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All Students&apos; Birthdays
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Displaying {filteredStudents.length} of {students.length} students · 1:1 Birthday Posters (54 Students)
          </p>
        </div>

        {/* View and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Switcher (Segmented Control) */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setSortMode('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                sortMode === 'upcoming'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming First</span>
            </button>
            <button
              onClick={() => setSortMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                sortMode === 'calendar'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jan &ndash; Dec Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-3">
        {/* Search Input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll number (#1)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Month Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedMonth === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Months ({students.length})
          </button>

          {MONTH_NAMES_SHORT.map((mName, index) => {
            const mNum = index + 1;
            const count = monthCounts[mNum] || 0;
            return (
              <button
                key={mName}
                onClick={() => setSelectedMonth(mNum)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMonth === mNum
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{mName}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Student Cards: 2 posts per row on mobile, responsive grid on desktop */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isNextUpcoming={nextUpcomingIds.includes(student.id)}
              isToday={todayIds.includes(student.id)}
              customBlobUrl={posterMap ? posterMap[student.id] : undefined}
              onOpenLightbox={onOpenLightbox}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto mb-3 flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No students match your filter</h3>
          <p className="text-xs text-slate-400 mb-4">
            Try adjusting your search query or select &quot;All Months&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMonth('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};
