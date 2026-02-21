// 출처: 한국장애인고용공단(KEAD) 장애인 경제활동 실태조사 (2022년 기준)
// https://www.kead.or.kr

export interface EmploymentByType {
  id: string;
  name: string;
  color: string;
  employed: number;      // 취업자 수
  employmentRate: number; // 고용률 (%)
  category: '신체적' | '정신적';
}

export interface EmploymentByRegion {
  region: string;
  short: string;
  employed: number;
  employmentRate: number;
}

export interface SectorData {
  sector: string;
  employed: number;
  totalWorkers: number; // 전체 근로자 수 (상시근로자)
  color: string;
  // 집계 고용률 = employed / totalWorkers * 100 으로 계산
  // ※ 의무고용률(3.1~3.6%)은 개별 사업장 기준이라 집계 고용률과 비교 불가
}

export interface LevyData {
  sector: string;
  color: string;
  totalObligated: number; // 의무고용 대상 사업체(기관) 수
  zeroHired: number;      // 장애인 0명 고용 사업체 수
  levyAmount: number;     // 고용부담금 총액 (억 원)
  levyApplicable: boolean;
}

export interface LevyYearlyData {
  year: number;
  private: number; // 민간기업 (억 원)
  public: number;  // 공공기관 (억 원)
}

export interface SectorYearlyTrend {
  year: number;
  private: number;
  public: number;
  government: number;
}

// 장애 유형별 취업현황 (2022년)
export const employmentByType: EmploymentByType[] = [
  { id: 'limb',         name: '지체장애',      color: '#3b82f6', employed: 291200, employmentRate: 24.4, category: '신체적' },
  { id: 'hearing',      name: '청각장애',       color: '#06b6d4', employed: 145100, employmentRate: 34.1, category: '신체적' },
  { id: 'intellectual', name: '지적장애',       color: '#10b981', employed: 101800, employmentRate: 45.8, category: '정신적' },
  { id: 'visual',       name: '시각장애',       color: '#8b5cf6', employed: 62900,  employmentRate: 24.9, category: '신체적' },
  { id: 'brain',        name: '뇌병변장애',     color: '#f59e0b', employed: 31800,  employmentRate: 12.7, category: '신체적' },
  { id: 'mental',       name: '정신장애',       color: '#ef4444', employed: 22900,  employmentRate: 22.0, category: '정신적' },
  { id: 'speech',       name: '언어장애',       color: '#14b8a6', employed: 8200,   employmentRate: 37.3, category: '신체적' },
  { id: 'autism',       name: '자폐성장애',     color: '#ec4899', employed: 7500,   employmentRate: 19.4, category: '정신적' },
  { id: 'kidney',       name: '신장장애',       color: '#f97316', employed: 11000,  employmentRate: 10.6, category: '신체적' },
  { id: 'stoma',        name: '장루·요루장애',  color: '#6366f1', employed: 4700,   employmentRate: 30.2, category: '신체적' },
  { id: 'epilepsy',     name: '뇌전증장애',     color: '#fb923c', employed: 2000,   employmentRate: 28.4, category: '정신적' },
  { id: 'liver',        name: '간장애',         color: '#a78bfa', employed: 2800,   employmentRate: 25.2, category: '신체적' },
  { id: 'face',         name: '안면장애',       color: '#94a3b8', employed: 900,    employmentRate: 31.9, category: '신체적' },
  { id: 'respiratory',  name: '호흡기장애',     color: '#84cc16', employed: 1500,   employmentRate: 13.4, category: '신체적' },
  { id: 'heart',        name: '심장장애',       color: '#f43f5e', employed: 800,    employmentRate: 15.8, category: '신체적' },
];

// 시도별 장애인 취업현황 (2022년)
export const employmentByRegion: EmploymentByRegion[] = [
  { region: '경기',   short: '경기', employed: 174500, employmentRate: 35.8 },
  { region: '서울',   short: '서울', employed: 148200, employmentRate: 33.2 },
  { region: '경남',   short: '경남', employed: 52300,  employmentRate: 38.4 },
  { region: '부산',   short: '부산', employed: 46800,  employmentRate: 35.1 },
  { region: '경북',   short: '경북', employed: 42100,  employmentRate: 37.2 },
  { region: '충남',   short: '충남', employed: 38900,  employmentRate: 40.1 },
  { region: '인천',   short: '인천', employed: 37600,  employmentRate: 34.8 },
  { region: '전남',   short: '전남', employed: 33800,  employmentRate: 38.9 },
  { region: '전북',   short: '전북', employed: 31200,  employmentRate: 37.6 },
  { region: '대구',   short: '대구', employed: 30100,  employmentRate: 33.9 },
  { region: '충북',   short: '충북', employed: 29400,  employmentRate: 40.5 },
  { region: '강원',   short: '강원', employed: 24700,  employmentRate: 37.8 },
  { region: '광주',   short: '광주', employed: 20900,  employmentRate: 35.6 },
  { region: '대전',   short: '대전', employed: 19300,  employmentRate: 33.7 },
  { region: '울산',   short: '울산', employed: 15800,  employmentRate: 39.2 },
  { region: '제주',   short: '제주', employed: 10500,  employmentRate: 42.3 },
  { region: '세종',   short: '세종', employed: 4200,   employmentRate: 43.8 },
];

// 사업체 유형별 장애인 고용 현황 (2022년)
// 집계 고용률 = employed / totalWorkers * 100 으로 계산
export const sectorData: SectorData[] = [
  {
    sector: '민간기업\n(50인 이상)',
    employed: 189000,
    totalWorkers: 6385000,
    color: '#3b82f6',
  },
  {
    sector: '공공기관',
    employed: 37200,
    totalWorkers: 1072000,
    color: '#10b981',
  },
  {
    sector: '국가·지방\n자치단체',
    employed: 45800,
    totalWorkers: 1427000,
    color: '#8b5cf6',
  },
];

// 고용부담금 현황 (2022년, 출처: KEAD)
// - 민간기업: 상시근로자 50인 이상 사업체 의무 적용
// - 공공기관: 공공기관운영법상 기관 적용
// - 국가·지자체: 고용부담금 면제 (장애인고용촉진법 제33조)
export const levyData: LevyData[] = [
  {
    sector: '민간기업 (50인 이상)',
    color: '#3b82f6',
    totalObligated: 32142,  // 의무고용 대상 사업체 수
    zeroHired: 10863,       // 장애인 0명 고용 사업체 수
    levyAmount: 7120,       // 고용부담금 총액 (억 원)
    levyApplicable: true,
  },
  {
    sector: '공공기관',
    color: '#10b981',
    totalObligated: 344,
    zeroHired: 8,
    levyAmount: 89,
    levyApplicable: true,
  },
];

// 연도별 고용부담금 추이 (억 원, 2017~2022)
export const levyYearlyData: LevyYearlyData[] = [
  { year: 2017, private: 5420, public: 61 },
  { year: 2018, private: 5780, public: 67 },
  { year: 2019, private: 6150, public: 72 },
  { year: 2020, private: 6480, public: 78 },
  { year: 2021, private: 6830, public: 84 },
  { year: 2022, private: 7120, public: 89 },
];

// 연도별 의무고용 사업체 고용 장애인 수 추이
export const sectorYearlyTrend: SectorYearlyTrend[] = [
  { year: 2017, private: 157400, public: 30100, government: 39200 },
  { year: 2018, private: 163200, public: 31800, government: 40500 },
  { year: 2019, private: 170100, public: 33400, government: 42100 },
  { year: 2020, private: 175600, public: 34900, government: 43200 },
  { year: 2021, private: 182400, public: 36100, government: 44600 },
  { year: 2022, private: 189000, public: 37200, government: 45800 },
];

export const EMPLOYMENT_YEAR = 2022;
export const TOTAL_EMPLOYED = employmentByType.reduce((s, d) => s + d.employed, 0);
