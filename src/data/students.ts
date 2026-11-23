export interface Student {
  id: number;
  name: string;
  year?: number;
  monthDay: string; // "MM-DD"
  month: number;    // 1 - 12
  day: number;      // 1 - 31
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatBirthday(monthDay: string): string {
  const [mStr, dStr] = monthDay.split('-');
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  const monthName = MONTH_NAMES[m - 1] || '';
  return `${monthName} ${d}`;
}

export function formatOrdinal(day: number): string {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) return `${day}st`;
  if (j === 2 && k !== 12) return `${day}nd`;
  if (j === 3 && k !== 13) return `${day}rd`;
  return `${day}th`;
}

export function getZodiacSign(month: number, day: number): { sign: string; symbol: string } {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', symbol: '♒' };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: 'Pisces', symbol: '♓' };
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', symbol: '♈' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', symbol: '♉' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', symbol: '♊' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', symbol: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', symbol: '♌' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', symbol: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', symbol: '♎' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', symbol: '♏' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', symbol: '♐' };
  return { sign: 'Capricorn', symbol: '♑' };
}

// 54 students exactly matching the provided official HICT 23/24 response sheet
export const STUDENTS_DATA: Student[] = [
  { id: 1, name: 'Pruthuvi', year: 2003, monthDay: '04-12', month: 4, day: 12 },
  { id: 2, name: 'Supun', year: 2003, monthDay: '11-17', month: 11, day: 17 },
  { id: 3, name: 'Sathsara', year: 2003, monthDay: '06-20', month: 6, day: 20 },
  { id: 4, name: 'Sithum', year: 2003, monthDay: '07-21', month: 7, day: 21 },
  { id: 5, name: 'Dilshani', year: 2003, monthDay: '07-22', month: 7, day: 22 },
  { id: 6, name: 'Nilupul', year: 2003, monthDay: '11-06', month: 11, day: 6 },
  { id: 7, name: 'Shamika', year: 2003, monthDay: '12-09', month: 12, day: 9 },
  { id: 8, name: 'Nimna', year: 2004, monthDay: '01-02', month: 1, day: 2 },
  { id: 9, name: 'Karththik', year: 2004, monthDay: '01-09', month: 1, day: 9 },
  { id: 10, name: 'Karishpraveen', year: 2004, monthDay: '01-23', month: 1, day: 23 },
  { id: 11, name: 'Vathanatheeba', year: 2004, monthDay: '01-31', month: 1, day: 31 },
  { id: 12, name: 'Dilani', year: 2004, monthDay: '03-29', month: 3, day: 29 },
  { id: 13, name: 'Kavin', year: 2004, monthDay: '04-04', month: 4, day: 4 },
  { id: 14, name: 'Thilina', year: 2004, monthDay: '04-07', month: 4, day: 7 },
  { id: 15, name: 'Uthpala', year: 2004, monthDay: '04-30', month: 4, day: 30 },
  { id: 16, name: 'Pranavi', year: 2004, monthDay: '05-01', month: 5, day: 1 },
  { id: 17, name: 'Upamal', year: 2004, monthDay: '05-07', month: 5, day: 7 },
  { id: 18, name: 'Tharindya', year: 2004, monthDay: '06-17', month: 6, day: 17 },
  { id: 19, name: 'Anjani', year: 2004, monthDay: '06-24', month: 6, day: 24 },
  { id: 20, name: 'Kanishka', year: 2004, monthDay: '07-14', month: 7, day: 14 },
  { id: 21, name: 'Ravindi', year: 2004, monthDay: '07-19', month: 7, day: 19 },
  { id: 22, name: 'Ridma', year: 2004, monthDay: '07-24', month: 7, day: 24 },
  { id: 23, name: 'Nethma', year: 2004, monthDay: '07-24', month: 7, day: 24 },
  { id: 24, name: 'Saubhagya', year: 2004, monthDay: '08-03', month: 8, day: 3 },
  { id: 25, name: 'Abisha', year: 2004, monthDay: '08-04', month: 8, day: 4 },
  { id: 26, name: 'Budween', year: 2004, monthDay: '08-09', month: 8, day: 9 },
  { id: 27, name: 'Sathusha', year: 2004, monthDay: '08-31', month: 8, day: 31 },
  { id: 28, name: 'Nimsara', year: 2004, monthDay: '09-01', month: 9, day: 1 },
  { id: 29, name: 'Rashmi', year: 2004, monthDay: '09-05', month: 9, day: 5 },
  { id: 30, name: 'Ruwanka', year: 2004, monthDay: '09-18', month: 9, day: 18 },
  { id: 31, name: 'Rosmin', year: 2004, monthDay: '09-23', month: 9, day: 23 },
  { id: 32, name: 'Nafla', year: 2004, monthDay: '09-26', month: 9, day: 26 },
  { id: 33, name: 'Amna', year: 2004, monthDay: '10-02', month: 10, day: 2 },
  { id: 34, name: 'Malshan', year: 2004, monthDay: '10-03', month: 10, day: 3 },
  { id: 35, name: 'Baheeja', year: 2004, monthDay: '10-03', month: 10, day: 3 },
  { id: 36, name: 'Semini', year: 2004, monthDay: '10-18', month: 10, day: 18 },
  { id: 37, name: 'Dilith', year: 2004, monthDay: '10-21', month: 10, day: 21 },
  { id: 38, name: 'Dananjaya', year: 2004, monthDay: '11-03', month: 11, day: 3 },
  { id: 39, name: 'Lashani', year: 2004, monthDay: '11-24', month: 11, day: 24 },
  { id: 40, name: 'Dishmi', year: 2004, monthDay: '12-08', month: 12, day: 8 },
  { id: 41, name: 'Dewmith', year: 2004, monthDay: '12-09', month: 12, day: 9 },
  { id: 42, name: 'Hasitha', year: 2004, monthDay: '12-23', month: 12, day: 23 },
  { id: 43, name: 'Sayuni', year: 2004, monthDay: '01-03', month: 1, day: 3 },
  { id: 44, name: 'Yasitha', year: 2004, monthDay: '01-08', month: 1, day: 8 },
  { id: 45, name: 'Yomal', year: 2004, monthDay: '01-09', month: 1, day: 9 },
  { id: 46, name: 'Maleesha', year: 2004, monthDay: '02-13', month: 2, day: 13 },
  { id: 47, name: 'Ruwashi', year: 2004, monthDay: '03-10', month: 3, day: 10 },
  { id: 48, name: 'Swathi', year: 2004, monthDay: '05-25', month: 5, day: 25 },
  { id: 49, name: 'Malsha', year: 2004, monthDay: '05-27', month: 5, day: 27 },
  { id: 50, name: 'Rathurshana', year: 2004, monthDay: '07-27', month: 7, day: 27 },
  { id: 51, name: 'Inshaf', year: 2004, monthDay: '11-02', month: 11, day: 2 },
  { id: 52, name: 'Ranidu', year: 2004, monthDay: '10-19', month: 10, day: 19 },
  { id: 53, name: 'Lakith', year: 2003, monthDay: '06-17', month: 6, day: 17 },
  { id: 54, name: 'Shanika', year: 2004, monthDay: '07-15', month: 7, day: 15 },
];

export const GOOGLE_DRIVE_FOLDER_ID = '1mQSG7yatDCVt7GwaOqN6g765_UhKX2KQ';
export const GOOGLE_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1mQSG7yatDCVt7GwaOqN6g765_UhKX2KQ?usp=sharing';

// Direct Google Drive CDN URLs extracted from user's live Drive folder
export const GOOGLE_DRIVE_POSTER_IMAGE_MAP: Record<number, string> = {
  1: 'https://lh3.googleusercontent.com/d/1h0uYfr8ykZwruT5ghbLiBtYNU2bh9z0k=w1080',
  2: 'https://lh3.googleusercontent.com/d/1VbQY_-KZyYc3ykIHLSoxlnMqQod_itQq=w1080',
  3: 'https://lh3.googleusercontent.com/d/1wzDog6KZS_QjOVVc2ijZGGOgxjRcmXkq=w1080',
  4: 'https://lh3.googleusercontent.com/d/1Qfx9TQWKJYt0Z9vJB6JkevyulZi0lzwL=w1080',
  5: 'https://lh3.googleusercontent.com/d/1Xxu744vgT9wWzt_iJHjPC9tBxYo587fj=w1080',
  6: 'https://lh3.googleusercontent.com/d/1tDgWkBeTwhcP7I2SHORPCRK0VGCeR-3R=w1080',
  7: 'https://lh3.googleusercontent.com/d/1O96GAmythAv_UAum4PxNE3djXlPaDzCJ=w1080',
  8: 'https://lh3.googleusercontent.com/d/1LLhWD2DWQ2Xl3Dvpte7t0osol0QUnYNq=w1080',
  9: 'https://lh3.googleusercontent.com/d/1qWVTlNqqvXOGE94Lq5iI453OJpN1wYkl=w1080',
  10: 'https://lh3.googleusercontent.com/d/1nLki2OpZqdQvxfi7RLHlQ0etyutLQciD=w1080',
  11: 'https://lh3.googleusercontent.com/d/1JyNlM1kQCc4Pqp8ZDFGyZq9l6xYf5-kt=w1080',
  12: 'https://lh3.googleusercontent.com/d/1wuWA2y9hPlvggbF-MPXmC1jOF-n04VI6=w1080',
  13: 'https://lh3.googleusercontent.com/d/1hOrRZrgLiA7acMD89O3xSPaRP6Qv8z5p=w1080',
  14: 'https://lh3.googleusercontent.com/d/1wyy7u_A1UKwqsHW8iJjrOHCjr31zlxlH=w1080',
  15: 'https://lh3.googleusercontent.com/d/1yINqvLJhbQqYMjtBhXc3115tuMbumiia=w1080',
  16: 'https://lh3.googleusercontent.com/d/1ClYeByQUa7mMRgzhQSnEHTZpNZ1uwWkO=w1080',
  17: 'https://lh3.googleusercontent.com/d/10k5GuWwccrrGYcn8U75fi2B2Xvkw0sX0=w1080',
  18: 'https://lh3.googleusercontent.com/d/1BPp_qSQy_85XQYHaWKr2JupVZx5zLMKl=w1080',
  19: 'https://lh3.googleusercontent.com/d/1CuPDgZm0Kr4auSq782ncjviChdFj2J-U=w1080',
  20: 'https://lh3.googleusercontent.com/d/16dWxeXEHFUfOyKVRZTIHIOhAwndIWe5Z=w1080',
  21: 'https://lh3.googleusercontent.com/d/1F0-aUQU-bLf_bNo2JafjGDuQQCGVHU_D=w1080',
  22: 'https://lh3.googleusercontent.com/d/1r6B7CGIpIHGQUBttVeUfj1ieboX1zTik=w1080',
  23: 'https://lh3.googleusercontent.com/d/1B-wVCRgefeEDmZYSA6iAdivCOXXSC11o=w1080',
  24: 'https://lh3.googleusercontent.com/d/1brvLkwJaqPJLwuI3SsjYL7iKASsdRCXC=w1080',
  25: 'https://lh3.googleusercontent.com/d/1nNGsTyB2IvYlCAD0R2zoXfgUy73Odact=w1080',
  26: 'https://lh3.googleusercontent.com/d/1poZnwu9ya1TNLXg5lKml2ITCgw0hFu1H=w1080',
  27: 'https://lh3.googleusercontent.com/d/1NJZts_iSaMX_Onq7-Rd1uNswlJPjbuKO=w1080',
  28: 'https://lh3.googleusercontent.com/d/1G1cXbwUcRt_45dICY0E-XTCc3u_W_-85=w1080',
  29: 'https://lh3.googleusercontent.com/d/1u3YbBcvbRLJu22dMs43ix-aWs2EGkkKc=w1080',
  30: 'https://lh3.googleusercontent.com/d/16tXeh0vMuYJpq4rb3U5aM5F3Ke-eowAP=w1080',
  31: 'https://lh3.googleusercontent.com/d/1M4ykkwoe5QPZi4NbStk1Ga-2egS-YFOg=w1080',
  32: 'https://lh3.googleusercontent.com/d/1dpr-MUJcvstBazxu6-hajBUX0KbBEH68=w1080',
  33: 'https://lh3.googleusercontent.com/d/1JsiUWxV7cpmVsIKzHKtyLHxdwBgM4IOZ=w1080',
  34: 'https://lh3.googleusercontent.com/d/1dOl_loKgtugMaqIH0QZGFnfLpRUPasUX=w1080',
  35: 'https://lh3.googleusercontent.com/d/1H-68Az4trxKWNeYJkwAuMB8T42HXwGfx=w1080',
  36: 'https://lh3.googleusercontent.com/d/1oX18ncI-CXsY3pZlrdU89y5jRJkg7wHc=w1080',
  37: 'https://lh3.googleusercontent.com/d/1aZBtn8BGqBkhULD8A5ktmgT-BtW7Xsvv=w1080',
  38: 'https://lh3.googleusercontent.com/d/1TfkgWQzOmu6FOMginurz5NUThK5E3mNu=w1080',
  39: 'https://lh3.googleusercontent.com/d/11nk6zF4UoLOKPHZNy2QpVtec4BKc55Jw=w1080',
  40: 'https://lh3.googleusercontent.com/d/1QOhDapv0lhqoddtn81uJFZgl_LaLwVVE=w1080',
  41: 'https://lh3.googleusercontent.com/d/1ob7MHiNUUzihXqFVWs_3S7wSUmy3exU0=w1080',
  42: 'https://lh3.googleusercontent.com/d/1kA7ohhYCVWaBMmFn1B_lsbfuLZk8OmYY=w1080',
  43: 'https://lh3.googleusercontent.com/d/1lCcDelcZYOUB9WBI3-SKJcelz4yWXjHz=w1080',
  44: 'https://lh3.googleusercontent.com/d/16ghMmJweUHawWMJ32-4paB9SZjKuG7bh=w1080',
  45: 'https://lh3.googleusercontent.com/d/105tE4SU4Qq2wc4VqMgIzxYJ4dHnjG1QG=w1080',
  46: 'https://lh3.googleusercontent.com/d/1Ck9sXSED1TJlGd6QbXWmMRmuN-2qdFX_=w1080',
  47: 'https://lh3.googleusercontent.com/d/1Gy8fbD7AmYj987VkOiJn9yk0-5jfmP17=w1080',
  48: 'https://lh3.googleusercontent.com/d/1lZsvMx-4I0H5KcNM0QkuWpozM74-smtX=w1080',
  49: 'https://lh3.googleusercontent.com/d/1Ny2XZ2IGGc1Zbh3IgFHG0934IstGpy7G=w1080',
  50: 'https://lh3.googleusercontent.com/d/1Rq7avzCPwDWa0J7-UTx7tL0gempxo7Al=w1080',
  51: 'https://lh3.googleusercontent.com/d/11wdJc2V0rscGgSlWp-tnr-ecCUFlGIL3=w1080',
  52: 'https://lh3.googleusercontent.com/d/1t3jkzC4Xunp3UxtHFb-mnSUQlZgsJGQN=w1080',
  53: 'https://lh3.googleusercontent.com/d/1RAI3cWJ9NSYuVhh997A3veli9MTdwJAU=w1080',
  54: 'https://lh3.googleusercontent.com/d/1IlIGKIQOzeEd8lblmEZYA6XG_41s3wnx=w1080',
};

export function extractDriveFileId(url?: string): string | null {
  if (!url) return null;
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) return lh3Match[1];
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];
  const proxyMatch = url.match(/\/api\/drive-image\/([a-zA-Z0-9_-]+)/);
  if (proxyMatch) return proxyMatch[1];
  return null;
}

// Runtime dynamic cache updated via Google Drive live sync
let runtimeDynamicDriveMap: Record<number, string> = {};

export function updateDynamicDriveImages(map: Record<number, string>) {
  runtimeDynamicDriveMap = { ...runtimeDynamicDriveMap, ...map };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('hict_drive_image_map', JSON.stringify(runtimeDynamicDriveMap));
    } catch {
      // ignore
    }
  }
}

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('hict_drive_image_map');
    if (saved) {
      runtimeDynamicDriveMap = JSON.parse(saved);
    }
  } catch {
    // ignore
  }
}

const BASE_PATH = import.meta.env.BASE_URL || '/';

// Local fallback mapping in case Google CDN has temporary network issues
export const LOCAL_POSTER_IMAGE_MAP: Record<number, string> = {
  1: `${BASE_PATH}posters/1.png`,
  2: `${BASE_PATH}posters/2.png`,
  3: `${BASE_PATH}posters/3.png`,
  4: `${BASE_PATH}posters/4.png`,
  5: `${BASE_PATH}posters/5.jpeg`,
  6: `${BASE_PATH}posters/6.png`,
  7: `${BASE_PATH}posters/7.png`,
  8: `${BASE_PATH}posters/8.png`,
  9: `${BASE_PATH}posters/9.png`,
  10: `${BASE_PATH}posters/10.png`,
  11: `${BASE_PATH}posters/11.png`,
  12: `${BASE_PATH}posters/12.png`,
  13: `${BASE_PATH}posters/13.png`,
  14: `${BASE_PATH}posters/14.png`,
  15: `${BASE_PATH}posters/15.png`,
  16: `${BASE_PATH}posters/16.png`,
  17: `${BASE_PATH}posters/17.png`,
  18: `${BASE_PATH}posters/18.png`,
  19: `${BASE_PATH}posters/19.png`,
  20: `${BASE_PATH}posters/20.png`,
  21: `${BASE_PATH}posters/21.png`,
  22: `${BASE_PATH}posters/22.png`,
  23: `${BASE_PATH}posters/23.png`,
  24: `${BASE_PATH}posters/24.png`,
  25: `${BASE_PATH}posters/25.png`,
  26: `${BASE_PATH}posters/26.png`,
  27: `${BASE_PATH}posters/27.png`,
  28: `${BASE_PATH}posters/28.png`,
  29: `${BASE_PATH}posters/29.png`,
  30: `${BASE_PATH}posters/30.png`,
  31: `${BASE_PATH}posters/31.png`,
  32: `${BASE_PATH}posters/32.jpg`,
  33: `${BASE_PATH}posters/33.png`,
  34: `${BASE_PATH}posters/34.png`,
  35: `${BASE_PATH}posters/35.jpg`,
  36: `${BASE_PATH}posters/36.png`,
  37: `${BASE_PATH}posters/37.png`,
  38: `${BASE_PATH}posters/38.jpeg`,
  39: `${BASE_PATH}posters/39.png`,
  40: `${BASE_PATH}posters/40.png`,
  41: `${BASE_PATH}posters/41.png`,
  42: `${BASE_PATH}posters/42.png`,
  43: `${BASE_PATH}posters/43.png`,
  44: `${BASE_PATH}posters/44.jpeg`,
  45: `${BASE_PATH}posters/45.png`,
  46: `${BASE_PATH}posters/46.jpeg`,
  47: `${BASE_PATH}posters/47.jpg`,
  48: `${BASE_PATH}posters/48.png`,
  49: `${BASE_PATH}posters/49.png`,
  50: `${BASE_PATH}posters/50.jpeg`,
  51: `${BASE_PATH}posters/51.jpg`,
  52: `${BASE_PATH}posters/52.jpg`,
  53: `${BASE_PATH}posters/53.jpg`,
  54: `${BASE_PATH}posters/54.jpeg`,
};

// Aliased for backwards compatibility
export const STUDENT_POSTER_IMAGE_MAP = GOOGLE_DRIVE_POSTER_IMAGE_MAP;

export function getStudentPosterUrl(studentId: number): string {
  // 1. Dynamic sync from Google Drive
  if (runtimeDynamicDriveMap[studentId]) {
    return runtimeDynamicDriveMap[studentId];
  }
  // 2. Direct Google Drive CDN link
  if (GOOGLE_DRIVE_POSTER_IMAGE_MAP[studentId]) {
    return GOOGLE_DRIVE_POSTER_IMAGE_MAP[studentId];
  }
  // 3. Local fallback
  return LOCAL_POSTER_IMAGE_MAP[studentId] || `${BASE_PATH}posters/${studentId}.png`;
}

export function getStudentDriveFileId(studentId: number): string | null {
  return (
    extractDriveFileId(runtimeDynamicDriveMap[studentId]) ||
    extractDriveFileId(GOOGLE_DRIVE_POSTER_IMAGE_MAP[studentId])
  );
}
