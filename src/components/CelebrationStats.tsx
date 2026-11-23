import React from 'react';
import { Student } from '../data/students';
import { Users, PartyPopper, Calendar, Award } from 'lucide-react';

interface CelebrationStatsProps {
  students: Student[];
  nextUpcoming: Student;
  isToday: boolean;
}

export const CelebrationStats: React.FC<CelebrationStatsProps> = ({
  students,
  nextUpcoming,
  isToday,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const thisMonthCount = students.filter((s) => s.month === currentMonth).length;

  return (
    <div className="w-full mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
      {/* Stat 1 */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
            {students.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Batch Students</div>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
          <PartyPopper className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-white truncate max-w-[130px]">
            {nextUpcoming.name}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {isToday ? 'Celebrating Today!' : 'Next Up'}
          </div>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
            {thisMonthCount}
          </div>
          <div className="text-xs text-slate-400 font-medium">This Month</div>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base sm:text-lg font-bold text-white">
            HICT 23/24
          </div>
          <div className="text-xs text-slate-400 font-medium">Official Batch</div>
        </div>
      </div>
    </div>
  );
};
