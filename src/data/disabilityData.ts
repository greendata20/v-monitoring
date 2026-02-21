// 출처: 보건복지부 등록장애인 현황 (2025년 기준)
// 2022년 실측 기준, 유형별 연평균 증감률 적용 추계
// https://www.mohw.go.kr / 장애인정책과
//
// [주요 증감 근거]
// 지체장애   : -0.3%/yr  (고령 비율 증가에도 등록 비중 감소 추세)
// 청각장애   : +1.2%/yr  (고령화로 난청 인구 증가)
// 신장장애   : +2.8%/yr  (만성신부전·투석 환자 증가)
// 자폐성장애 : +4.5%/yr  (진단 기준 확대 및 인식 향상)
// 지적장애   : +2.0%/yr  (발달장애 조기 발굴 확대)
// 정신장애   : +0.7%/yr  (정신질환 치료 후 등록 완만 증가)
// 언어·호흡기·간·심장: -0.8~-1.2%/yr (의료기술 발전으로 감소)

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

// 2025년 장애 유형별 등록 인원 추계 (단위: 명)
export const disabilityTypes: DisabilityType[] = [
  { id: 'limb',         name: '지체장애',      count: 1168000, color: '#3b82f6', category: '신체적' },
  { id: 'hearing',      name: '청각장애',       count: 435500,  color: '#06b6d4', category: '신체적' },
  { id: 'visual',       name: '시각장애',       count: 254000,  color: '#8b5cf6', category: '신체적' },
  { id: 'brain',        name: '뇌병변장애',     count: 252300,  color: '#f59e0b', category: '신체적' },
  { id: 'intellectual', name: '지적장애',       count: 232800,  color: '#10b981', category: '정신적' },
  { id: 'mental',       name: '정신장애',       count: 106100,  color: '#ef4444', category: '정신적' },
  { id: 'kidney',       name: '신장장애',       count: 111200,  color: '#f97316', category: '신체적' },
  { id: 'autism',       name: '자폐성장애',     count: 44200,   color: '#ec4899', category: '정신적' },
  { id: 'speech',       name: '언어장애',       count: 21400,   color: '#14b8a6', category: '신체적' },
  { id: 'stoma',        name: '장루·요루장애',  count: 15900,   color: '#6366f1', category: '신체적' },
  { id: 'respiratory',  name: '호흡기장애',     count: 10900,   color: '#84cc16', category: '신체적' },
  { id: 'liver',        name: '간장애',         count: 10800,   color: '#a78bfa', category: '신체적' },
  { id: 'epilepsy',     name: '뇌전증장애',     count: 7200,    color: '#fb923c', category: '정신적' },
  { id: 'heart',        name: '심장장애',       count: 4900,    color: '#f43f5e', category: '신체적' },
  { id: 'face',         name: '안면장애',       count: 2900,    color: '#94a3b8', category: '신체적' },
];

// 연도별 등록장애인 수 추이 (2016~2025)
// 2023~2025: 2020~2022 연평균 증가분(약 9,900명/년) 감소 추세 적용 추계
export const yearlyTrend: YearlyData[] = [
  { year: 2016, total: 2511051, physical: 2193484, mental: 317567 },
  { year: 2017, total: 2545637, physical: 2218289, mental: 327348 },
  { year: 2018, total: 2585876, physical: 2250765, mental: 335111 },
  { year: 2019, total: 2618918, physical: 2276832, mental: 342086 },
  { year: 2020, total: 2633026, physical: 2286093, mental: 346933 },
  { year: 2021, total: 2644700, physical: 2295148, mental: 349552 },
  { year: 2022, total: 2652860, physical: 2302154, mental: 350706 },
  { year: 2023, total: 2661900, physical: 2308900, mental: 353000 },
  { year: 2024, total: 2670400, physical: 2315300, mental: 355100 },
  { year: 2025, total: 2678100, physical: 2321300, mental: 356800 },
];

// 성별 장애 유형별 현황 (2025년 추계, 주요 유형)
export const genderData: GenderData[] = [
  { type: '지체장애',   male: 672000, female: 496000 },
  { type: '청각장애',   male: 221000, female: 214500 },
  { type: '시각장애',   male: 141000, female: 113000 },
  { type: '뇌병변장애', male: 125000, female: 127300 },
  { type: '지적장애',   male: 135300, female: 97500  },
  { type: '정신장애',   male: 61500,  female: 44600  },
  { type: '신장장애',   male: 73300,  female: 37900  },
];

// 기준 연도
export const DATA_YEAR = 2025;
export const TOTAL = disabilityTypes.reduce((sum, d) => sum + d.count, 0);
