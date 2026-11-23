import { Student } from '../data/students';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isToday: boolean;
  nextBirthdayDate: Date;
}

export function calculateCountdown(student: Student, now: Date = new Date()): CountdownTime {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  const isToday = currentMonth === student.month && currentDay === student.day;

  // Determine next birthday timestamp
  let targetYear = currentYear;
  if (!isToday) {
    if (
      student.month < currentMonth ||
      (student.month === currentMonth && student.day < currentDay)
    ) {
      targetYear = currentYear + 1;
    }
  }

  // Target is midnight start of the birthday
  const nextBirthdayDate = new Date(targetYear, student.month - 1, student.day, 0, 0, 0, 0);

  // If today is their birthday, target countdown until midnight at end of the day
  let targetMs = nextBirthdayDate.getTime();
  if (isToday) {
    const endOfToday = new Date(currentYear, student.month - 1, student.day, 23, 59, 59, 999);
    targetMs = endOfToday.getTime();
  }

  const diffMs = Math.max(0, targetMs - now.getTime());
  const days = isToday ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
    isToday,
    nextBirthdayDate,
  };
}

/**
 * Returns the student(s) whose birthday is coming next.
 * If today is someone's birthday, they are returned with isToday = true.
 */
export function getNextUpcomingStudents(students: Student[], now: Date = new Date()): {
  primary: Student;
  allNext: Student[];
  isToday: boolean;
} {
  if (students.length === 0) {
    throw new Error('Students array is empty');
  }

  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Check if anyone has birthday today
  const todayStudents = students.filter(
    (s) => s.month === currentMonth && s.day === currentDay
  );

  if (todayStudents.length > 0) {
    return {
      primary: todayStudents[0],
      allNext: todayStudents,
      isToday: true,
    };
  }

  // Calculate days away for all students (1 to 365)
  const mapped = students.map((s) => {
    let dayDiff = 0;
    const nowTime = now.getTime();
    const currentYear = now.getFullYear();

    let targetYear = currentYear;
    if (
      s.month < currentMonth ||
      (s.month === currentMonth && s.day < currentDay)
    ) {
      targetYear = currentYear + 1;
    }

    const targetDate = new Date(targetYear, s.month - 1, s.day, 0, 0, 0, 0);
    const diffMs = targetDate.getTime() - nowTime;

    return {
      student: s,
      diffMs,
      targetDate,
    };
  });

  // Sort by smallest positive diffMs
  mapped.sort((a, b) => a.diffMs - b.diffMs);

  const nearestDiff = mapped[0].diffMs;
  // All students with the same nearest birthday (e.g. sharing the same day)
  const allNext = mapped
    .filter((m) => Math.abs(m.diffMs - nearestDiff) < 1000 * 60 * 60 * 12)
    .map((m) => m.student);

  return {
    primary: mapped[0].student,
    allNext,
    isToday: false,
  };
}

/**
 * Sort students chronologically starting from today's date through 365 days
 */
export function sortStudentsUpcomingOrder(students: Student[], now: Date = new Date()): Student[] {
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  return [...students].sort((a, b) => {
    const isTodayA = a.month === currentMonth && a.day === currentDay;
    const isTodayB = b.month === currentMonth && b.day === currentDay;
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;

    let targetYearA = currentYear;
    if (a.month < currentMonth || (a.month === currentMonth && a.day < currentDay)) {
      targetYearA = currentYear + 1;
    }
    const dateA = new Date(targetYearA, a.month - 1, a.day).getTime();

    let targetYearB = currentYear;
    if (b.month < currentMonth || (b.month === currentMonth && b.day < currentDay)) {
      targetYearB = currentYear + 1;
    }
    const dateB = new Date(targetYearB, b.month - 1, b.day).getTime();

    if (dateA !== dateB) return dateA - dateB;
    return a.id - b.id;
  });
}

/**
 * Sort students strictly by calendar month and day (Jan 1 to Dec 31)
 */
export function sortStudentsCalendarOrder(students: Student[]): Student[] {
  return [...students].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    if (a.day !== b.day) return a.day - b.day;
    return a.id - b.id;
  });
}
