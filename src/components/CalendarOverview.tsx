import React from 'react';
import { Student, MONTH_NAMES } from '../data/students';
import { CalendarDays, Users } from 'lucide-react';

interface CalendarOverviewProps {
  students: Student[];
}

export const CalendarOverview: React.FC<CalendarOverviewProps> = ({ students }) => {
  const currentMonth = new Date().getMonth() + 1;

  // Group students by month
  const groupedByMonth = React.useMemo(() => {
    const map: Record<number, Student[]> = {};
    for (let m = 1; m <= 12; m++) map[m] = [];
    students.forEach((s) => {
      map[s.month].push(s);
    });
    // Sort each month's students by day
    for (let m = 1; m <= 12; m++) {
      map[m].sort((a, b) => a.day - b.day);
    }
    return map;
  }, [students]);

  return (
    <section id="calendar-overview" className="w-full mt-16 text-left">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase mb-1">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>ANNUAL OVERVIEW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Batch Birthday Calendar by Month
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore all 12 calendar months and view who celebrates together.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MONTH_NAMES.map((monthName, idx) => {
          const monthNum = idx + 1;
          const monthStudents = groupedByMonth[monthNum] || [];
          const isThisMonth = currentMonth === monthNum;

          return (
            <div
              key={monthName}
              className={`p-4 rounded-2xl glass-card border transition-all ${
                isThisMonth
                  ? 'border-amber-500/40 bg-amber-950/15 ring-1 ring-amber-500/30'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{monthName}</h3>
                  {isThisMonth && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-400" />
                  <span>{monthStudents.length}</span>
                </span>
              </div>

              {monthStudents.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {monthStudents.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 transition-colors"
                    >
                      <span className="text-slate-200 font-medium truncate max-w-[140px]">
                        {s.name}
                      </span>
                      <span className="text-amber-300/90 font-mono text-[11px] shrink-0">
                        {monthName.slice(0, 3)} {s.day}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 italic">
                  No birthdays this month
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
