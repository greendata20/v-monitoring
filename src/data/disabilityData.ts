// 출처: 보건복지부 등록장애인 현황 (2022년 기준)
// https://www.mohw.go.kr / 장애인정책과

export interface DisabilityType {
  id: string;
  name: string;
  count: number;
  color: string;
  category: '신체적' | '정신적';
}

export interface YearlyData {
  year: number;
  total: number;
  physical: number;
  mental: number;
}

export interface GenderData {
  type: string;
  male: number;
  female: number;
}

// 2022년 장애 유형별 등록 인원 (단위: 명)
export const disabilityTypes: DisabilityType[] = [
  { id: 'limb',        name: '지체장애',      count: 1194403, color: '#3b82f6', category: '신체적' },
  { id: 'hearing',     name: '청각장애',      count: 425073,  color: '#06b6d4', category: '신체적' },
  { id: 'visual',      name: '시각장애',      count: 252779,  color: '#8b5cf6', category: '신체적' },
  { id: 'brain',       name: '뇌병변장애',    count: 250790,  color: '#f59e0b', category: '신체적' },
  { id: 'intellectual',name: '지적장애',      count: 222178,  color: '#10b981', category: '정신적' },
  { id: 'mental',      name: '정신장애',      count: 103967,  color: '#ef4444', category: '정신적' },
  { id: 'kidney',      name: '신장장애',      count: 103921,  color: '#f97316', category: '신체적' },
  { id: 'autism',      name: '자폐성장애',    count: 38763,   color: '#ec4899', category: '정신적' },
  { id: 'stoma',       name: '장루·요루장애', count: 15545,   color: '#6366f1', category: '신체적' },
  { id: 'speech',      name: '언어장애',      count: 22011,   color: '#14b8a6', category: '신체적' },
  { id: 'respiratory', name: '호흡기장애',    count: 11224,   color: '#84cc16', category: '신체적' },
  { id: 'liver',       name: '간장애',        count: 11117,   color: '#a78bfa', category: '신체적' },
  { id: 'epilepsy',    name: '뇌전증장애',    count: 7033,    color: '#fb923c', category: '정신적' },
  { id: 'heart',       name: '심장장애',      count: 5057,    color: '#f43f5e', category: '신체적' },
  { id: 'face',        name: '안면장애',      count: 2820,    color: '#94a3b8', category: '신체적' },
];

// 연도별 등록장애인 수 추이 (2016~2022)
export const yearlyTrend: YearlyData[] = [
  { year: 2016, total: 2511051, physical: 2193484, mental: 317567 },
  { year: 2017, total: 2545637, physical: 2218289, mental: 327348 },
  { year: 2018, total: 2585876, physical: 2250765, mental: 335111 },
  { year: 2019, total: 2618918, physical: 2276832, mental: 342086 },
  { year: 2020, total: 2633026, physical: 2286093, mental: 346933 },
  { year: 2021, total: 2644700, physical: 2295148, mental: 349552 },
  { year: 2022, total: 2652860, physical: 2302154, mental: 350706 },
];

// 성별 장애 유형별 현황 (2022년, 주요 유형)
export const genderData: GenderData[] = [
  { type: '지체장애',   male: 687432, female: 506971 },
  { type: '청각장애',   male: 216487, female: 208586 },
  { type: '시각장애',   male: 139827, female: 112952 },
  { type: '뇌병변장애', male: 124563, female: 126227 },
  { type: '지적장애',   male: 128934, female: 93244  },
  { type: '정신장애',   male: 60241,  female: 43726  },
  { type: '신장장애',   male: 68453,  female: 35468  },
];

// 기준 연도
export const DATA_YEAR = 2022;
export const TOTAL = disabilityTypes.reduce((sum, d) => sum + d.count, 0);
