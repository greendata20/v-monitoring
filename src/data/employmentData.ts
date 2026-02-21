// 출처: 한국장애인고용공단(KEAD) 장애인 경제활동 실태조사 (2025년 기준)
// 2022년 실측 기준, 항목별 연평균 증감률 적용 추계
// https://www.kead.or.kr
//
// [주요 추계 근거]
// 취업자 수   : 유형별 1.8~5.5%/yr 증가 (지원 정책 강화)
// 시도별      : 전체 ~2%/yr 성장
// 민간기업 고용장애인: ~3.6%/yr (의무고용 강화 효과)
// 공공기관    : ~3.0%/yr
// 고용부담금  : ~4.2%/yr 증가 (기초액 인상 + 미달 기업 증가)

export interface EmploymentByType {
  id: string;
  name: string;
  color: string;
  employed: number;       // 취업자 수
  employmentRate: number; // 고용률 (KEAD 실태조사 기준, %)
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

// 장애 유형별 취업현황 (2025년 추계)
// 고용률은 KEAD 실태조사 방식(경제활동 참가 기반) 적용
export const employmentByType: EmploymentByType[] = [
  { id: 'limb',         name: '지체장애',      color: '#3b82f6', employed: 307200, employmentRate: 26.3, category: '신체적' },
  { id: 'hearing',      name: '청각장애',       color: '#06b6d4', employed: 156300, employmentRate: 35.9, category: '신체적' },
  { id: 'intellectual', name: '지적장애',       color: '#10b981', employed: 112900, employmentRate: 48.5, category: '정신적' },
  { id: 'visual',       name: '시각장애',       color: '#8b5cf6', employed: 66700,  employmentRate: 26.3, category: '신체적' },
  { id: 'brain',        name: '뇌병변장애',     color: '#f59e0b', employed: 33500,  employmentRate: 13.3, category: '신체적' },
  { id: 'mental',       name: '정신장애',       color: '#ef4444', employed: 24700,  employmentRate: 23.3, category: '정신적' },
  { id: 'kidney',       name: '신장장애',       color: '#f97316', employed: 11800,  employmentRate: 10.6, category: '신체적' },
  { id: 'speech',       name: '언어장애',       color: '#14b8a6', employed: 8600,   employmentRate: 40.2, category: '신체적' },
  { id: 'autism',       name: '자폐성장애',     color: '#ec4899', employed: 8800,   employmentRate: 19.9, category: '정신적' },
  { id: 'stoma',        name: '장루·요루장애',  color: '#6366f1', employed: 5100,   employmentRate: 32.1, category: '신체적' },
  { id: 'epilepsy',     name: '뇌전증장애',     color: '#fb923c', employed: 2200,   employmentRate: 30.6, category: '정신적' },
  { id: 'liver',        name: '간장애',         color: '#a78bfa', employed: 2900,   employmentRate: 26.9, category: '신체적' },
  { id: 'face',         name: '안면장애',       color: '#94a3b8', employed: 1000,   employmentRate: 34.5, category: '신체적' },
  { id: 'respiratory',  name: '호흡기장애',     color: '#84cc16', employed: 1600,   employmentRate: 14.7, category: '신체적' },
  { id: 'heart',        name: '심장장애',       color: '#f43f5e', employed: 800,    employmentRate: 16.3, category: '신체적' },
];

// 시도별 장애인 취업현황 (2025년 추계, 2022년 대비 ~5% 성장)
export const employmentByRegion: EmploymentByRegion[] = [
  { region: '경기',   short: '경기', employed: 183200, employmentRate: 36.4 },
  { region: '서울',   short: '서울', employed: 155600, employmentRate: 33.8 },
  { region: '경남',   short: '경남', employed: 54900,  employmentRate: 39.0 },
  { region: '부산',   short: '부산', employed: 49100,  employmentRate: 35.7 },
  { region: '경북',   short: '경북', employed: 44200,  employmentRate: 37.8 },
  { region: '충남',   short: '충남', employed: 40800,  employmentRate: 40.8 },
  { region: '인천',   short: '인천', employed: 39400,  employmentRate: 35.4 },
  { region: '전남',   short: '전남', employed: 35500,  employmentRate: 39.5 },
  { region: '전북',   short: '전북', employed: 32800,  employmentRate: 38.2 },
  { region: '대구',   short: '대구', employed: 31600,  employmentRate: 34.5 },
  { region: '충북',   short: '충북', employed: 30900,  employmentRate: 41.2 },
  { region: '강원',   short: '강원', employed: 25900,  employmentRate: 38.5 },
  { region: '광주',   short: '광주', employed: 21900,  employmentRate: 36.2 },
  { region: '대전',   short: '대전', employed: 20200,  employmentRate: 34.3 },
  { region: '울산',   short: '울산', employed: 16600,  employmentRate: 39.9 },
  { region: '제주',   short: '제주', employed: 11000,  employmentRate: 43.0 },
  { region: '세종',   short: '세종', employed: 4400,   employmentRate: 44.5 },
];

// 사업체 유형별 장애인 고용 현황 (2025년 추계)
// 집계 고용률 = employed / totalWorkers * 100 으로 계산
export const sectorData: SectorData[] = [
  {
    sector: '민간기업\n(50인 이상)',
    employed: 210000,
    totalWorkers: 6678000,
    color: '#3b82f6',
  },
  {
    sector: '공공기관',
    employed: 40600,
    totalWorkers: 1122000,
    color: '#10b981',
  },
  {
    sector: '국가·지방\n자치단체',
    employed: 49600,
    totalWorkers: 1492000,
    color: '#8b5cf6',
  },
];

// 고용부담금 현황 (2025년 추계, 출처: KEAD)
// - 민간기업: 상시근로자 50인 이상 사업체 의무 적용
// - 공공기관: 공공기관운영법상 기관 적용
// - 국가·지자체: 고용부담금 면제 (장애인고용촉진법 제33조)
export const levyData: LevyData[] = [
  {
    sector: '민간기업 (50인 이상)',
    color: '#3b82f6',
    totalObligated: 33800,
    zeroHired: 10400,
    levyAmount: 8050,
    levyApplicable: true,
  },
  {
    sector: '공공기관',
    color: '#10b981',
    totalObligated: 356,
    zeroHired: 6,
    levyAmount: 103,
    levyApplicable: true,
  },
];

// 연도별 고용부담금 추이 (억 원, 2017~2025)
// 2023~2025: 민간 ~4.2%/yr, 공공 ~5%/yr 증가 추계
export const levyYearlyData: LevyYearlyData[] = [
  { year: 2017, private: 5420, public: 61 },
  { year: 2018, private: 5780, public: 67 },
  { year: 2019, private: 6150, public: 72 },
  { year: 2020, private: 6480, public: 78 },
  { year: 2021, private: 6830, public: 84 },
  { year: 2022, private: 7120, public: 89 },
  { year: 2023, private: 7420, public: 93 },
  { year: 2024, private: 7730, public: 98 },
  { year: 2025, private: 8050, public: 103 },
];

// 연도별 의무고용 사업체 고용 장애인 수 추이 (2017~2025)
// 2023~2025: 민간 ~3.6%/yr, 공공 ~3.0%/yr, 국가 ~2.7%/yr 증가 추계
export const sectorYearlyTrend: SectorYearlyTrend[] = [
  { year: 2017, private: 157400, public: 30100, government: 39200 },
  { year: 2018, private: 163200, public: 31800, government: 40500 },
  { year: 2019, private: 170100, public: 33400, government: 42100 },
  { year: 2020, private: 175600, public: 34900, government: 43200 },
  { year: 2021, private: 182400, public: 36100, government: 44600 },
  { year: 2022, private: 189000, public: 37200, government: 45800 },
  { year: 2023, private: 195800, public: 38300, government: 47000 },
  { year: 2024, private: 202900, public: 39400, government: 48300 },
  { year: 2025, private: 210000, public: 40600, government: 49600 },
];

export const EMPLOYMENT_YEAR = 2025;
export const TOTAL_EMPLOYED = employmentByType.reduce((s, d) => s + d.employed, 0);
