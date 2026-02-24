// 출처: WHO World Report on Disability 2023, ILO, OECD Employment Outlook
// 전세계 장애인 추계 기준: WHO 2023 (~16% of world population = 약 13억 명)

// ── 지역별 장애인 현황 ─────────────────────────────────────────────
export interface RegionData {
  region: string;
  regionEn: string;
  population: number;      // 인구 (백만 명)
  disabled: number;        // 장애인 수 (백만 명)
  disabilityRate: number;  // 장애 비율 (%)
  employmentRate: number;  // 장애인 고용률 (%)
  color: string;
}

export const regionData: RegionData[] = [
  { region: '동아시아·태평양',    regionEn: 'East Asia & Pacific',         population: 2297, disabled: 363, disabilityRate: 15.8, employmentRate: 40, color: '#3b82f6' },
  { region: '남아시아',           regionEn: 'South Asia',                  population: 1901, disabled: 346, disabilityRate: 18.2, employmentRate: 28, color: '#f59e0b' },
  { region: '사하라이남 아프리카', regionEn: 'Sub-Saharan Africa',          population: 1098, disabled: 168, disabilityRate: 15.3, employmentRate: 22, color: '#10b981' },
  { region: '유럽·중앙아시아',    regionEn: 'Europe & Central Asia',       population: 899,  disabled: 143, disabilityRate: 15.9, employmentRate: 45, color: '#8b5cf6' },
  { region: '중동·북아프리카',    regionEn: 'Middle East & North Africa',  population: 572,  disabled: 107, disabilityRate: 18.7, employmentRate: 20, color: '#ec4899' },
  { region: '라틴아메리카·카리브', regionEn: 'Latin America & Caribbean',  population: 663,  disabled: 106, disabilityRate: 16.0, employmentRate: 35, color: '#f97316' },
  { region: '북아메리카',         regionEn: 'North America',               population: 372,  disabled: 71,  disabilityRate: 19.1, employmentRate: 45, color: '#06b6d4' },
];

// ── 전세계 장애 유형별 분포 (WHO GBD 2023 기준) ───────────────────
// YLD(Years Lived with Disability) 비중 적용, 총 13억 명 기준 추계
export interface GlobalDisabilityType {
  name: string;
  count: number;  // 백만 명
  pct: number;    // %
  color: string;
  desc: string;
}

export const globalDisabilityTypes: GlobalDisabilityType[] = [
  { name: '정신·행동 장애',   count: 332, pct: 25.5, color: '#ef4444', desc: '우울증·조울증·조현병·약물 관련 등' },
  { name: '근골격계 장애',    count: 290, pct: 22.3, color: '#3b82f6', desc: '이동 장애·관절·척추 질환 등' },
  { name: '감각기관 장애',    count: 146, pct: 11.2, color: '#8b5cf6', desc: '시각·청각·전정기관 장애' },
  { name: '신경계 장애',      count: 134, pct: 10.3, color: '#f59e0b', desc: '치매·간질·파킨슨·뇌졸중 후유증 등' },
  { name: '심혈관 장애',      count: 65,  pct: 5.0,  color: '#f43f5e', desc: '심장질환·혈관 장애' },
  { name: '호흡기 장애',      count: 60,  pct: 4.6,  color: '#84cc16', desc: 'COPD·천식·만성 호흡기 질환' },
  { name: '당뇨·내분비 장애', count: 42,  pct: 3.2,  color: '#fb923c', desc: '당뇨 합병증 등' },
  { name: '기타',             count: 231, pct: 17.9, color: '#94a3b8', desc: '소화계·암·선천성·외상 후유증 등' },
];

// ── 국가별 장애인 고용률 (OECD + 주요국, 최근 연도 기준) ──────────
export interface CountryEmployment {
  country: string;    // 한글
  countryEn: string;  // 영문
  region: string;
  employmentRate: number; // 장애인 고용률 (%)
  hasQuota: boolean;      // 의무고용제 시행 여부
  color: string;
}

export const countryEmployment: CountryEmployment[] = [
  { country: '스위스',      countryEn: 'Switzerland',     region: '유럽', employmentRate: 65, hasQuota: false, color: '#10b981' },
  { country: '스웨덴',      countryEn: 'Sweden',          region: '유럽', employmentRate: 62, hasQuota: false, color: '#10b981' },
  { country: '캐나다',      countryEn: 'Canada',          region: '북미', employmentRate: 61, hasQuota: false, color: '#06b6d4' },
  { country: '아이슬란드',  countryEn: 'Iceland',         region: '유럽', employmentRate: 60, hasQuota: false, color: '#10b981' },
  { country: '노르웨이',    countryEn: 'Norway',          region: '유럽', employmentRate: 57, hasQuota: false, color: '#10b981' },
  { country: '영국',        countryEn: 'United Kingdom',  region: '유럽', employmentRate: 54, hasQuota: false, color: '#10b981' },
  { country: '일본',        countryEn: 'Japan',           region: '아시아', employmentRate: 53, hasQuota: true, color: '#f59e0b' },
  { country: '덴마크',      countryEn: 'Denmark',         region: '유럽', employmentRate: 52, hasQuota: false, color: '#10b981' },
  { country: '호주',        countryEn: 'Australia',       region: '오세아니아', employmentRate: 52, hasQuota: false, color: '#06b6d4' },
  { country: '네덜란드',    countryEn: 'Netherlands',     region: '유럽', employmentRate: 50, hasQuota: false, color: '#10b981' },
  { country: '핀란드',      countryEn: 'Finland',         region: '유럽', employmentRate: 49, hasQuota: false, color: '#10b981' },
  { country: '이스라엘',    countryEn: 'Israel',          region: '중동', employmentRate: 47, hasQuota: false, color: '#f97316' },
  { country: '라트비아',    countryEn: 'Latvia',          region: '유럽', employmentRate: 47, hasQuota: true,  color: '#f59e0b' },
  { country: '독일',        countryEn: 'Germany',         region: '유럽', employmentRate: 46, hasQuota: true,  color: '#f59e0b' },
  { country: '에스토니아',  countryEn: 'Estonia',         region: '유럽', employmentRate: 46, hasQuota: true,  color: '#f59e0b' },
  { country: '리투아니아',  countryEn: 'Lithuania',       region: '유럽', employmentRate: 46, hasQuota: true,  color: '#f59e0b' },
  { country: '프랑스',      countryEn: 'France',          region: '유럽', employmentRate: 44, hasQuota: true,  color: '#f59e0b' },
  { country: '포르투갈',    countryEn: 'Portugal',        region: '유럽', employmentRate: 43, hasQuota: true,  color: '#f59e0b' },
  { country: '오스트리아',  countryEn: 'Austria',         region: '유럽', employmentRate: 42, hasQuota: true,  color: '#f59e0b' },
  { country: '벨기에',      countryEn: 'Belgium',         region: '유럽', employmentRate: 41, hasQuota: true,  color: '#f59e0b' },
  { country: '룩셈부르크',  countryEn: 'Luxembourg',      region: '유럽', employmentRate: 39, hasQuota: true,  color: '#f59e0b' },
  { country: '미국',        countryEn: 'USA',             region: '북미', employmentRate: 37, hasQuota: false, color: '#06b6d4' },
  { country: '한국',        countryEn: 'South Korea',     region: '아시아', employmentRate: 37, hasQuota: true, color: '#ef4444' },
  { country: '슬로바키아',  countryEn: 'Slovakia',        region: '유럽', employmentRate: 37, hasQuota: true,  color: '#f59e0b' },
  { country: '칠레',        countryEn: 'Chile',           region: '남미', employmentRate: 36, hasQuota: false, color: '#f97316' },
  { country: '체코',        countryEn: 'Czech Republic',  region: '유럽', employmentRate: 36, hasQuota: true,  color: '#f59e0b' },
  { country: '헝가리',      countryEn: 'Hungary',         region: '유럽', employmentRate: 34, hasQuota: true,  color: '#f59e0b' },
  { country: '스페인',      countryEn: 'Spain',           region: '유럽', employmentRate: 33, hasQuota: true,  color: '#f59e0b' },
  { country: '튀르키예',    countryEn: 'Turkey',          region: '유럽', employmentRate: 32, hasQuota: true,  color: '#f59e0b' },
  { country: '폴란드',      countryEn: 'Poland',          region: '유럽', employmentRate: 31, hasQuota: true,  color: '#f59e0b' },
  { country: '이탈리아',    countryEn: 'Italy',           region: '유럽', employmentRate: 31, hasQuota: true,  color: '#f59e0b' },
  { country: '그리스',      countryEn: 'Greece',          region: '유럽', employmentRate: 27, hasQuota: true,  color: '#f59e0b' },
];

// ── 의무고용제 시행 국가 상세 ─────────────────────────────────────
export interface QuotaCountry {
  country: string;
  countryEn: string;
  region: string;
  quotaRate: string;        // 의무고용률 (문자열, 범위 표현 가능)
  quotaRateNum: number;     // 정렬용 숫자 (최대값)
  companySizeMin: number;   // 적용 최소 인원
  system: '부담금' | '의무' | '정부만';
  lawYear: number;          // 제도 시행 연도
  note: string;
  color: string;
}

export const quotaCountries: QuotaCountry[] = [
  { country: '이탈리아',     countryEn: 'Italy',          region: '유럽',   quotaRate: '7%',     quotaRateNum: 7.0, companySizeMin: 15,   system: '의무',   lawYear: 1999, note: '15인 이상: 1명, 36인↑: 2명, 50인↑: 7%', color: '#ef4444' },
  { country: '프랑스',       countryEn: 'France',         region: '유럽',   quotaRate: '6%',     quotaRateNum: 6.0, companySizeMin: 20,   system: '부담금', lawYear: 1987, note: 'OETH 체계, 부담금 or 장애인 고용·훈련 투자 중 선택', color: '#f97316' },
  { country: '폴란드',       countryEn: 'Poland',         region: '유럽',   quotaRate: '6%',     quotaRateNum: 6.0, companySizeMin: 25,   system: '부담금', lawYear: 1997, note: 'PFRON 기금 납부, 달성 시 감면 혜택', color: '#f97316' },
  { country: '독일',         countryEn: 'Germany',        region: '유럽',   quotaRate: '5%',     quotaRateNum: 5.0, companySizeMin: 20,   system: '부담금', lawYear: 1974, note: 'SchwbG → SGB IX, 미달 시 월 Ausgleichsabgabe 납부', color: '#fb923c' },
  { country: '헝가리',       countryEn: 'Hungary',        region: '유럽',   quotaRate: '5%',     quotaRateNum: 5.0, companySizeMin: 25,   system: '부담금', lawYear: 1991, note: '부담금 납부 또는 장애인 업체 제품 구매로 대체 가능', color: '#fb923c' },
  { country: '오스트리아',   countryEn: 'Austria',        region: '유럽',   quotaRate: '4%',     quotaRateNum: 4.0, companySizeMin: 25,   system: '부담금', lawYear: 1970, note: '미달 인원당 월 Ausgleichstaxe 부과', color: '#f59e0b' },
  { country: '체코',         countryEn: 'Czech Republic', region: '유럽',   quotaRate: '4%',     quotaRateNum: 4.0, companySizeMin: 25,   system: '부담금', lawYear: 1991, note: '고용·제품 구매·부담금 납부 중 대체 이행 가능', color: '#f59e0b' },
  { country: '인도',         countryEn: 'India',          region: '아시아', quotaRate: '4%',     quotaRateNum: 4.0, companySizeMin: 0,    system: '정부만', lawYear: 1995, note: '정부·공공기관만 적용, 민간은 권고 수준', color: '#f59e0b' },
  { country: '한국',         countryEn: 'South Korea',    region: '아시아', quotaRate: '3.1~3.6%', quotaRateNum: 3.6, companySizeMin: 50,  system: '부담금', lawYear: 1990, note: '민간 3.1%(50인↑), 공공·국가 3.6%, 미달 시 부담금', color: '#ef4444' },
  { country: '튀르키예',     countryEn: 'Turkey',         region: '유럽',   quotaRate: '3%',     quotaRateNum: 3.0, companySizeMin: 50,   system: '의무',   lawYear: 2003, note: '민간 50인↑ 3%, 공공 4%, 위반 시 벌금', color: '#10b981' },
  { country: '일본',         countryEn: 'Japan',          region: '아시아', quotaRate: '2.7%',   quotaRateNum: 2.7, companySizeMin: 44,   system: '부담금', lawYear: 1976, note: '2024년 2.5%→2.7%로 상향, 부담금·조성금 체계', color: '#8b5cf6' },
  { country: '스페인',       countryEn: 'Spain',          region: '유럽',   quotaRate: '2%',     quotaRateNum: 2.0, companySizeMin: 50,   system: '의무',   lawYear: 1982, note: 'LISMI → LGDPD, 장애인 업체 구매로 대체 가능', color: '#06b6d4' },
  { country: '브라질',       countryEn: 'Brazil',         region: '남미',   quotaRate: '2~5%',   quotaRateNum: 5.0, companySizeMin: 100,  system: '의무',   lawYear: 1991, note: '100인: 2%, 200인: 3%, 500인: 4%, 1000인↑: 5%', color: '#06b6d4' },
  { country: '중국',         countryEn: 'China',          region: '아시아', quotaRate: '1.5%',   quotaRateNum: 1.5, companySizeMin: 0,    system: '부담금', lawYear: 1991, note: '성(省)별 0.6~1.7% 차이, 보장기금 납부', color: '#a78bfa' },
];

// ── 의무고용제 미시행국 (차별금지법 방식) ─────────────────────────
export interface NonQuotaCountry {
  country: string;
  countryEn: string;
  region: string;
  law: string;
  lawYear: number;
  approach: string;
}

export const nonQuotaCountries: NonQuotaCountry[] = [
  { country: '미국',       countryEn: 'USA',           region: '북미',   law: 'ADA (Americans with Disabilities Act)',      lawYear: 1990, approach: '차별금지·합리적 편의 제공 의무' },
  { country: '영국',       countryEn: 'United Kingdom', region: '유럽',  law: 'Equality Act',                               lawYear: 2010, approach: '차별금지, 긍정적 행동(positive action) 권장' },
  { country: '캐나다',     countryEn: 'Canada',         region: '북미',  law: 'Employment Equity Act',                      lawYear: 1986, approach: '고용형평법, 자발적 고용계획 수립 의무' },
  { country: '호주',       countryEn: 'Australia',      region: '오세아니아', law: 'Disability Discrimination Act',          lawYear: 1992, approach: '차별금지, 합리적 조정 의무' },
  { country: '스웨덴',     countryEn: 'Sweden',         region: '유럽',  law: 'Discrimination Act',                         lawYear: 2008, approach: '차별금지·능동적 조치(aktiva åtgärder) 의무' },
  { country: '노르웨이',   countryEn: 'Norway',         region: '유럽',  law: 'Equality and Anti-Discrimination Act',       lawYear: 2018, approach: '차별금지·합리적 편의 의무, 공공조달 우선' },
  { country: '덴마크',     countryEn: 'Denmark',        region: '유럽',  law: 'Act on Prohibition of Discrimination',       lawYear: 2004, approach: '차별금지, 보조금·임금보조 제도 병행' },
  { country: '네덜란드',   countryEn: 'Netherlands',    region: '유럽',  law: 'Participation Act + Quota (목표제)',          lawYear: 2015, approach: '목표 미달 시 한시적 쿼터 발동 가능한 혼합형' },
  { country: '스위스',     countryEn: 'Switzerland',    region: '유럽',  law: 'Disability Equality Act (BehiG)',             lawYear: 2004, approach: '차별금지, 공공 부문 합리적 편의 의무' },
  { country: '뉴질랜드',   countryEn: 'New Zealand',    region: '오세아니아', law: 'Human Rights Act',                      lawYear: 1993, approach: '차별금지, 장애인 고용전략 자발적 이행' },
];

// ── 요약 상수 ─────────────────────────────────────────────────────
export const GLOBAL_TOTAL_DISABLED = 1300;  // 백만 명
export const GLOBAL_DISABILITY_RATE = 16.0; // %
export const GLOBAL_DATA_YEAR = 2026;
export const OECD_AVG_EMPLOYMENT_RATE = 47; // %
