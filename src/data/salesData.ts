// KEAD 명단공표 기준 기반 모의 데이터 (실제 공시 데이터 형식 반영)
// 출처 형식: 한국장애인고용공단 장애인고용현황 공시자료 (data.go.kr)
// 의무고용률: 민간기업(50인↑) 3.1%, 공공기관 3.6%
// 명단공표 기준: 고용률 1.55% 미만 (의무고용률의 50%)
// 고용부담금: 고용노동부 고시 부담기초액 (2025년) × 미달인원 × 12개월
//   - 의무고용 3/4 이상 이행: 1,258,000원/월/인
//   - 1/2 이상 ~ 3/4 미만: 1,333,480원/월/인
//   - 1/4 이상 ~ 1/2 미만: 1,509,600원/월/인
//   - 1/4 미만: 1,761,200원/월/인
//   - 장애인 미고용: 2,096,270원/월/인 (최저임금 월환산액, 10,030원×209시간)

export interface Company {
  id: number;
  name: string;          // 기업명
  industry: string;      // 업종
  industryCode: string;  // 업종 코드 (차트용)
  region: string;        // 소재지
  sector: 'private' | 'public'; // 민간/공공
  totalWorkers: number;  // 상시근로자수
  requiredCount: number; // 의무고용 인원 (자동계산)
  hiredCount: number;    // 장애인 근로자수
  employmentRate: number; // 고용률 (%)
  gap: number;           // 부족 인원 (자동계산)
  isPubliclyNamed: boolean; // 명단공표 여부 (<1.55%)
  estimatedLevy: number; // 연간 고용부담금 추정액 (만원)
  priority: 'A' | 'B' | 'C'; // 영업 우선순위
  contact?: string;      // 담당 부서 (예시)
}

// 의무고용률
const PRIVATE_QUOTA = 0.031;
const PUBLIC_QUOTA = 0.036;
const NAMED_THRESHOLD = 0.0155; // 1.55% 미만 시 명단공표

// 2025년 고용노동부 고시 부담기초액 (월/인) — KEAD 공식 기준
const LEVY_MONTHLY_75  = 1_258_000; // 의무고용 3/4 이상 이행
const LEVY_MONTHLY_50  = 1_333_480; // 1/2 이상 ~ 3/4 미만
const LEVY_MONTHLY_25  = 1_509_600; // 1/4 이상 ~ 1/2 미만
const LEVY_MONTHLY_LOW = 1_761_200; // 1/4 미만
const LEVY_MONTHLY_ZERO = 2_096_270; // 미고용 (최저임금 월환산액)

/** 이행률(hiredCount/requiredCount)에 따른 월 부담기초액 반환 */
function levyMonthlyRate(hiredCount: number, requiredCount: number): number {
  if (hiredCount === 0) return LEVY_MONTHLY_ZERO;
  const ratio = hiredCount / requiredCount;
  if (ratio < 0.25) return LEVY_MONTHLY_LOW;
  if (ratio < 0.50) return LEVY_MONTHLY_25;
  if (ratio < 0.75) return LEVY_MONTHLY_50;
  return LEVY_MONTHLY_75;
}

function calcCompany(
  id: number,
  name: string,
  industry: string,
  industryCode: string,
  region: string,
  sector: 'private' | 'public',
  totalWorkers: number,
  hiredCount: number,
  contact?: string
): Company {
  const quota = sector === 'public' ? PUBLIC_QUOTA : PRIVATE_QUOTA;
  const requiredCount = Math.ceil(totalWorkers * quota);
  const employmentRate = parseFloat(((hiredCount / totalWorkers) * 100).toFixed(2));
  const gap = Math.max(0, requiredCount - hiredCount);
  const isPubliclyNamed = employmentRate < NAMED_THRESHOLD * 100;

  // 고용부담금: 미달인원 × 월 부담기초액(이행률 구간별) × 12개월 → 만원 단위 변환
  let estimatedLevy = 0;
  if (gap > 0) {
    const monthlyRate = levyMonthlyRate(hiredCount, requiredCount);
    estimatedLevy = Math.round((gap * monthlyRate * 12) / 10_000);
  }

  let priority: 'A' | 'B' | 'C';
  if (gap >= 15 || hiredCount === 0) {
    priority = 'A';
  } else if (gap >= 6) {
    priority = 'B';
  } else {
    priority = 'C';
  }

  return {
    id, name, industry, industryCode, region, sector,
    totalWorkers, requiredCount, hiredCount,
    employmentRate, gap, isPubliclyNamed, estimatedLevy,
    priority, contact,
  };
}

// 원시 데이터: [id, name, industry, industryCode, region, sector, totalWorkers, hiredCount, contact?]
export const companies: Company[] = [
  // ── 제조업 ──
  calcCompany(1, '한국제강(주)', '제조업', '철강', '경북 포항시', 'private', 3200, 28, 'HR팀'),
  calcCompany(2, '대우조선해양(주)', '제조업', '조선', '경남 거제시', 'private', 8500, 62, '인사부'),
  calcCompany(3, '현대중공업특수선', '제조업', '조선', '울산광역시', 'private', 4100, 22, 'HR팀'),
  calcCompany(4, '삼성중공업 거제', '제조업', '조선', '경남 거제시', 'private', 7200, 95, '인사팀'),
  calcCompany(5, '롯데케미칼(주)', '제조업', '화학', '전남 여수시', 'private', 2800, 0, '총무부'),
  calcCompany(6, '한화솔루션 여수', '제조업', '화학', '전남 여수시', 'private', 1850, 8, 'HR부'),
  calcCompany(7, '현대자동차 울산', '제조업', '자동차', '울산광역시', 'private', 31000, 720, '인사팀'),
  calcCompany(8, '기아(주) 소하리', '제조업', '자동차', '경기 광명시', 'private', 18500, 385, '인사부'),
  calcCompany(9, 'POSCO 포항제철소', '제조업', '철강', '경북 포항시', 'private', 15200, 210, '인사팀'),
  calcCompany(10, '에쓰-오일(주)', '제조업', '정유', '울산광역시', 'private', 3100, 12, '인사부'),
  calcCompany(11, '한국타이어앤테크', '제조업', '고무', '충남 금산군', 'private', 5400, 48, 'HR팀'),
  calcCompany(12, '오리온(주)', '제조업', '식품', '경북 구미시', 'private', 2100, 42, '인사부'),
  calcCompany(13, 'LG화학 청주공장', '제조업', '화학', '충북 청주시', 'private', 6800, 95, '인사팀'),
  calcCompany(14, '두산에너빌리티', '제조업', '기계', '경남 창원시', 'private', 9800, 168, '인사부'),
  calcCompany(15, '현대제철 당진', '제조업', '철강', '충남 당진시', 'private', 7600, 88, 'HR팀'),

  // ── IT/소프트웨어 ──
  calcCompany(16, '카카오(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 4200, 38, 'People팀'),
  calcCompany(17, '네이버(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 5100, 52, '인사팀'),
  calcCompany(18, '넥슨코리아(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 2900, 18, 'HR팀'),
  calcCompany(19, '엔씨소프트(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 3800, 22, '인사부'),
  calcCompany(20, '삼성SDS(주)', 'IT/소프트웨어', 'IT', '서울 송파구', 'private', 12000, 185, '인사팀'),
  calcCompany(21, 'LG CNS(주)', 'IT/소프트웨어', 'IT', '서울 마포구', 'private', 8500, 102, '인사부'),
  calcCompany(22, 'SK(주) C&C', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 6200, 58, 'HR팀'),
  calcCompany(23, '한국IBM(주)', 'IT/소프트웨어', 'IT', '서울 중구', 'private', 2500, 8, '인사부'),
  calcCompany(24, '쿠팡(주)', 'IT/소프트웨어', 'IT', '서울 강남구', 'private', 21000, 158, 'People팀'),

  // ── 금융/보험 ──
  calcCompany(25, '국민은행', '금융/보험', '금융', '서울 중구', 'private', 18000, 285, '인사부'),
  calcCompany(26, '신한은행', '금융/보험', '금융', '서울 중구', 'private', 15200, 220, '인사팀'),
  calcCompany(27, '우리은행', '금융/보험', '금융', '서울 중구', 'private', 14500, 185, '인사부'),
  calcCompany(28, '하나은행', '금융/보험', '금융', '서울 중구', 'private', 13800, 162, 'HR팀'),
  calcCompany(29, 'IBK기업은행', '금융/보험', '금융', '서울 중구', 'public', 12000, 395, '인사부'),
  calcCompany(30, '삼성생명보험', '금융/보험', '보험', '서울 서초구', 'private', 7200, 58, '인사팀'),
  calcCompany(31, '한화생명보험', '금융/보험', '보험', '서울 영등포구', 'private', 5800, 35, '인사부'),
  calcCompany(32, 'KB손해보험(주)', '금융/보험', '보험', '서울 강남구', 'private', 4500, 28, 'HR팀'),
  calcCompany(33, '미래에셋증권', '금융/보험', '증권', '서울 중구', 'private', 3200, 12, '인사부'),
  calcCompany(34, '한국투자증권', '금융/보험', '증권', '서울 여의도', 'private', 2800, 8, '인사팀'),

  // ── 유통/물류 ──
  calcCompany(35, '이마트(주)', '유통/물류', '유통', '서울 성동구', 'private', 25000, 580, '인사부'),
  calcCompany(36, '롯데마트(주)', '유통/물류', '유통', '서울 중구', 'private', 18500, 355, '인사팀'),
  calcCompany(37, 'CJ대한통운(주)', '유통/물류', '물류', '서울 중구', 'private', 32000, 420, 'HR팀'),
  calcCompany(38, '한진(주)', '유통/물류', '물류', '서울 중구', 'private', 8500, 88, '인사부'),
  calcCompany(39, '롯데글로벌로지스', '유통/물류', '물류', '경기 김포시', 'private', 5800, 42, '인사팀'),
  calcCompany(40, 'GS리테일(주)', '유통/물류', '유통', '서울 강남구', 'private', 6200, 48, '인사부'),
  calcCompany(41, '현대백화점(주)', '유통/물류', '유통', '서울 강남구', 'private', 4800, 22, 'HR팀'),

  // ── 건설 ──
  calcCompany(42, '현대건설(주)', '건설', '건설', '서울 종로구', 'private', 8200, 82, '인사부'),
  calcCompany(43, '삼성물산 건설부문', '건설', '건설', '서울 강동구', 'private', 12500, 148, '인사팀'),
  calcCompany(44, 'GS건설(주)', '건설', '건설', '서울 종로구', 'private', 6800, 52, 'HR팀'),
  calcCompany(45, '대림산업(주)', '건설', '건설', '서울 중구', 'private', 5200, 35, '인사부'),
  calcCompany(46, '포스코이앤씨', '건설', '건설', '인천광역시', 'private', 7800, 68, '인사팀'),
  calcCompany(47, '롯데건설(주)', '건설', '건설', '서울 중구', 'private', 4500, 18, '인사부'),

  // ── 의료/제약 ──
  calcCompany(48, '삼성서울병원', '의료/제약', '의료', '서울 강남구', 'public', 8500, 268, '인사부'),
  calcCompany(49, '서울아산병원', '의료/제약', '의료', '서울 송파구', 'public', 9200, 298, '인사팀'),
  calcCompany(50, '세브란스병원', '의료/제약', '의료', '서울 서대문구', 'public', 7800, 215, '인사부'),
  calcCompany(51, '한국얀센(주)', '의료/제약', '제약', '서울 중구', 'private', 1200, 0, 'HR팀'),
  calcCompany(52, '유한양행(주)', '의료/제약', '제약', '서울 동작구', 'private', 2800, 28, '인사부'),
  calcCompany(53, '대웅제약(주)', '의료/제약', '제약', '서울 강남구', 'private', 2200, 15, '인사팀'),

  // ── 통신 ──
  calcCompany(54, 'SK텔레콤(주)', '통신', '통신', '서울 중구', 'private', 5200, 88, '인사부'),
  calcCompany(55, 'KT(주)', '통신', '통신', '경기 성남시', 'private', 22000, 548, '인사팀'),
  calcCompany(56, 'LG유플러스(주)', '통신', '통신', '서울 마포구', 'private', 8500, 148, 'HR팀'),

  // ── 에너지/유틸리티 ──
  calcCompany(57, '한국전력공사', '에너지/유틸리티', '에너지', '전남 나주시', 'public', 25000, 882, '인사부'),
  calcCompany(58, '한국가스공사', '에너지/유틸리티', '에너지', '대구광역시', 'public', 3800, 128, '인사팀'),
  calcCompany(59, '한국수자원공사', '에너지/유틸리티', '에너지', '대전광역시', 'public', 6200, 218, '인사부'),
  calcCompany(60, 'GS칼텍스(주)', '에너지/유틸리티', '정유', '전남 여수시', 'private', 3800, 18, 'HR팀'),
  calcCompany(61, 'SK이노베이션(주)', '에너지/유틸리티', '정유', '서울 종로구', 'private', 4200, 28, '인사부'),

  // ── 서비스업 ──
  calcCompany(62, '호텔신라(주)', '서비스업', '숙박', '서울 중구', 'private', 2800, 15, '인사팀'),
  calcCompany(63, '롯데호텔(주)', '서비스업', '숙박', '서울 중구', 'private', 3500, 22, '인사부'),
  calcCompany(64, '하나투어(주)', '서비스업', '여행', '서울 종로구', 'private', 1800, 8, 'HR팀'),
  calcCompany(65, '이랜드리테일', '서비스업', '패션', '서울 중구', 'private', 4200, 32, '인사부'),
  calcCompany(66, '아모레퍼시픽(주)', '서비스업', '화장품', '서울 용산구', 'private', 5800, 52, '인사팀'),
  calcCompany(67, 'CJ제일제당(주)', '서비스업', '식품', '서울 중구', 'private', 8500, 118, '인사부'),

  // ── 교육 ──
  calcCompany(68, '메가스터디교육', '교육', '교육', '서울 서초구', 'private', 1500, 0, 'HR팀'),
  calcCompany(69, '대교(주)', '교육', '교육', '서울 영등포구', 'private', 3200, 15, '인사부'),
  calcCompany(70, '웅진씽크빅(주)', '교육', '교육', '서울 중구', 'private', 2800, 8, '인사팀'),

  // ── 항공/운수 ──
  calcCompany(71, '대한항공(주)', '항공/운수', '항공', '서울 강서구', 'private', 18500, 168, '인사부'),
  calcCompany(72, '아시아나항공(주)', '항공/운수', '항공', '서울 강서구', 'private', 8200, 52, '인사팀'),
  calcCompany(73, '제주항공(주)', '항공/운수', '항공', '제주특별자치도', 'private', 2800, 5, 'HR팀'),
  calcCompany(74, '코레일(한국철도)', '항공/운수', '철도', '대전광역시', 'public', 28000, 1008, '인사부'),

  // ── 제조업 추가 ──
  calcCompany(75, '한국항공우주산업', '제조업', '항공', '경남 사천시', 'public', 4200, 138, '인사팀'),
  calcCompany(76, '현대모비스(주)', '제조업', '자동차', '서울 강남구', 'private', 9500, 138, '인사부'),
  calcCompany(77, '만도(주)', '제조업', '자동차', '경기 평택시', 'private', 7200, 88, '인사팀'),
  calcCompany(78, '한온시스템(주)', '제조업', '자동차', '대전광역시', 'private', 5800, 52, 'HR팀'),
  calcCompany(79, '성우하이텍(주)', '제조업', '자동차', '부산광역시', 'private', 3200, 18, '인사부'),
  calcCompany(80, '현대위아(주)', '제조업', '자동차', '경남 창원시', 'private', 6800, 65, '인사팀'),
  calcCompany(81, '삼성전기(주)', '제조업', '전자', '경기 수원시', 'private', 9800, 125, '인사부'),
  calcCompany(82, 'LG이노텍(주)', '제조업', '전자', '서울 마포구', 'private', 8200, 98, 'HR팀'),
  calcCompany(83, 'SK하이닉스(주)', '제조업', '반도체', '경기 이천시', 'private', 28000, 485, '인사팀'),
  calcCompany(84, '삼성전자 반도체', '제조업', '반도체', '경기 화성시', 'private', 42000, 862, '인사부'),
  calcCompany(85, 'DB하이텍(주)', '제조업', '반도체', '경기 부천시', 'private', 3100, 28, '인사팀'),
  calcCompany(86, '원익IPS(주)', '제조업', '반도체', '경기 평택시', 'private', 1800, 8, 'HR팀'),
  calcCompany(87, '한미반도체(주)', '제조업', '반도체', '경기 화성시', 'private', 1200, 0, '인사부'),
  calcCompany(88, '동국제강(주)', '제조업', '철강', '서울 강남구', 'private', 4800, 38, '인사팀'),
  calcCompany(89, '세아제강(주)', '제조업', '철강', '서울 강남구', 'private', 2200, 10, '인사부'),
  calcCompany(90, 'KCC(주)', '제조업', '화학', '서울 서초구', 'private', 5200, 42, 'HR팀'),
  calcCompany(91, '금호석유화학(주)', '제조업', '화학', '서울 강남구', 'private', 3800, 22, '인사팀'),
  calcCompany(92, '효성첨단소재(주)', '제조업', '화학', '서울 마포구', 'private', 2800, 8, '인사부'),
  calcCompany(93, '한화케미칼(주)', '제조업', '화학', '서울 중구', 'private', 4500, 28, '인사팀'),
  calcCompany(94, 'OCI(주)', '제조업', '화학', '서울 중구', 'private', 2100, 5, 'HR팀'),
  calcCompany(95, '영원무역(주)', '제조업', '섬유', '서울 강남구', 'private', 3800, 18, '인사부'),
  calcCompany(96, '한섬(주)', '제조업', '섬유', '서울 강남구', 'private', 2500, 12, '인사팀'),
  calcCompany(97, '태광산업(주)', '제조업', '섬유', '서울 중구', 'private', 4200, 25, '인사부'),
  calcCompany(98, '농심(주)', '제조업', '식품', '서울 동작구', 'private', 4800, 65, '인사팀'),
  calcCompany(99, '동원F&B(주)', '제조업', '식품', '서울 서초구', 'private', 3200, 28, 'HR팀'),
  calcCompany(100, 'CJ푸드빌(주)', '제조업', '식품', '서울 중구', 'private', 5500, 55, '인사부'),
  calcCompany(101, '빙그레(주)', '제조업', '식품', '경기 안양시', 'private', 2200, 15, '인사팀'),
  calcCompany(102, '하이트진로(주)', '제조업', '식품', '서울 강남구', 'private', 3800, 30, '인사부'),
  calcCompany(103, '오뚜기(주)', '제조업', '식품', '경기 안양시', 'private', 2800, 28, 'HR팀'),
  calcCompany(104, '롯데웰푸드(주)', '제조업', '식품', '서울 영등포구', 'private', 4200, 42, '인사팀'),

  // ── IT/소프트웨어 추가 ──
  calcCompany(105, '토스(비바리퍼블리카)', 'IT/소프트웨어', 'IT', '서울 강남구', 'private', 2200, 8, 'People팀'),
  calcCompany(106, '크래프톤(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 3200, 18, 'HR팀'),
  calcCompany(107, '컴투스(주)', 'IT/소프트웨어', 'IT', '서울 구로구', 'private', 1500, 0, '인사부'),
  calcCompany(108, '카카오게임즈(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 1800, 5, '인사팀'),
  calcCompany(109, '더존비즈온(주)', 'IT/소프트웨어', 'IT', '강원 춘천시', 'private', 2500, 12, 'HR팀'),
  calcCompany(110, 'KG이니시스(주)', 'IT/소프트웨어', 'IT', '서울 강남구', 'private', 1200, 0, '인사부'),
  calcCompany(111, '한글과컴퓨터(주)', 'IT/소프트웨어', 'IT', '서울 강남구', 'private', 1500, 5, '인사팀'),
  calcCompany(112, '삼성바이오로직스', 'IT/소프트웨어', 'IT', '인천광역시', 'private', 5800, 35, '인사부'),
  calcCompany(113, 'NHN(주)', 'IT/소프트웨어', 'IT', '경기 성남시', 'private', 3500, 22, 'HR팀'),
  calcCompany(114, '롯데정보통신(주)', 'IT/소프트웨어', 'IT', '서울 중구', 'private', 2800, 15, '인사팀'),

  // ── 금융/보험 추가 ──
  calcCompany(115, 'NH농협은행', '금융/보험', '금융', '서울 중구', 'public', 16000, 548, '인사부'),
  calcCompany(116, '카카오뱅크(주)', '금융/보험', '금융', '경기 성남시', 'private', 1500, 5, 'HR팀'),
  calcCompany(117, '토스뱅크(주)', '금융/보험', '금융', '서울 강남구', 'private', 1200, 0, '인사팀'),
  calcCompany(118, 'DB손해보험(주)', '금융/보험', '보험', '서울 강남구', 'private', 5200, 32, '인사부'),
  calcCompany(119, '현대해상화재보험', '금융/보험', '보험', '서울 종로구', 'private', 4800, 28, '인사팀'),
  calcCompany(120, '메리츠화재보험', '금융/보험', '보험', '서울 강남구', 'private', 3200, 12, 'HR팀'),
  calcCompany(121, '교보생명보험(주)', '금융/보험', '보험', '서울 종로구', 'private', 5800, 45, '인사부'),
  calcCompany(122, '삼성화재해상보험', '금융/보험', '보험', '서울 서초구', 'private', 6200, 58, '인사팀'),
  calcCompany(123, '키움증권(주)', '금융/보험', '증권', '서울 영등포구', 'private', 1800, 5, '인사부'),
  calcCompany(124, '삼성증권(주)', '금융/보험', '증권', '서울 서초구', 'private', 4200, 22, 'HR팀'),

  // ── 유통/물류 추가 ──
  calcCompany(125, 'SSG닷컴(주)', '유통/물류', '유통', '서울 중구', 'private', 3200, 15, '인사팀'),
  calcCompany(126, '홈플러스(주)', '유통/물류', '유통', '서울 강서구', 'private', 15000, 265, '인사부'),
  calcCompany(127, '코스트코코리아', '유통/물류', '유통', '경기 양평군', 'private', 4800, 28, 'HR팀'),
  calcCompany(128, '세이브존I&C', '유통/물류', '유통', '서울 구로구', 'private', 1800, 5, '인사팀'),
  calcCompany(129, '현대홈쇼핑(주)', '유통/물류', '유통', '서울 강서구', 'private', 2200, 10, '인사부'),
  calcCompany(130, 'CJ온스타일(주)', '유통/물류', '유통', '서울 마포구', 'private', 2800, 18, 'HR팀'),
  calcCompany(131, '롯데ON(주)', '유통/물류', '유통', '서울 중구', 'private', 1500, 0, '인사팀'),
  calcCompany(132, '한국도로공사', '유통/물류', '물류', '경북 김천시', 'public', 8200, 298, '인사부'),
  calcCompany(133, '인천국제공항공사', '유통/물류', '물류', '인천광역시', 'public', 1500, 52, '인사팀'),

  // ── 건설 추가 ──
  calcCompany(134, '현대엔지니어링(주)', '건설', '건설', '서울 종로구', 'private', 5200, 35, '인사부'),
  calcCompany(135, '한화건설(주)', '건설', '건설', '서울 중구', 'private', 3800, 18, 'HR팀'),
  calcCompany(136, '쌍용건설(주)', '건설', '건설', '서울 강남구', 'private', 2200, 5, '인사팀'),
  calcCompany(137, 'DL이앤씨(주)', '건설', '건설', '서울 종로구', 'private', 4500, 22, '인사부'),
  calcCompany(138, '태영건설(주)', '건설', '건설', '서울 영등포구', 'private', 2800, 8, 'HR팀'),
  calcCompany(139, 'HDC현대산업개발', '건설', '건설', '서울 용산구', 'private', 3500, 12, '인사팀'),
  calcCompany(140, '코오롱글로벌(주)', '건설', '건설', '서울 강남구', 'private', 2100, 5, '인사부'),

  // ── 의료/제약 추가 ──
  calcCompany(141, '분당서울대병원', '의료/제약', '의료', '경기 성남시', 'public', 5200, 162, '인사팀'),
  calcCompany(142, '서울대학교병원', '의료/제약', '의료', '서울 종로구', 'public', 9800, 328, '인사부'),
  calcCompany(143, '신촌세브란스병원', '의료/제약', '의료', '서울 서대문구', 'public', 6500, 205, 'HR팀'),
  calcCompany(144, '고려대의료원', '의료/제약', '의료', '서울 성북구', 'public', 5800, 178, '인사팀'),
  calcCompany(145, '한국노바티스(주)', '의료/제약', '제약', '서울 중구', 'private', 1500, 0, '인사부'),
  calcCompany(146, '종근당(주)', '의료/제약', '제약', '서울 종로구', 'private', 2500, 15, '인사팀'),
  calcCompany(147, '녹십자(주)', '의료/제약', '제약', '경기 용인시', 'private', 3200, 22, 'HR팀'),
  calcCompany(148, '동아ST(주)', '의료/제약', '제약', '서울 동대문구', 'private', 2800, 12, '인사부'),
  calcCompany(149, '한국화이자제약', '의료/제약', '제약', '서울 중구', 'private', 1200, 0, '인사팀'),
  calcCompany(150, '일동제약(주)', '의료/제약', '제약', '서울 서초구', 'private', 1800, 5, '인사부'),

  // ── 통신 추가 ──
  calcCompany(151, 'SK브로드밴드(주)', '통신', '통신', '서울 중구', 'private', 4200, 48, 'HR팀'),
  calcCompany(152, '에릭슨엘지(주)', '통신', '통신', '서울 강남구', 'private', 1200, 0, '인사팀'),
  calcCompany(153, '삼성네트웍스(주)', '통신', '통신', '서울 서초구', 'private', 1800, 5, '인사부'),

  // ── 에너지/유틸리티 추가 ──
  calcCompany(154, '한국남동발전(주)', '에너지/유틸리티', '에너지', '경남 진주시', 'public', 3200, 112, '인사팀'),
  calcCompany(155, '한국서부발전(주)', '에너지/유틸리티', '에너지', '충남 태안군', 'public', 2800, 98, '인사부'),
  calcCompany(156, '한국중부발전(주)', '에너지/유틸리티', '에너지', '서울 강남구', 'public', 2500, 88, 'HR팀'),
  calcCompany(157, '한국동서발전(주)', '에너지/유틸리티', '에너지', '울산광역시', 'public', 2200, 78, '인사팀'),
  calcCompany(158, '한국남부발전(주)', '에너지/유틸리티', '에너지', '부산광역시', 'public', 2800, 98, '인사부'),
  calcCompany(159, 'HD현대오일뱅크', '에너지/유틸리티', '정유', '충남 서산시', 'private', 3200, 12, '인사팀'),
  calcCompany(160, '현대코퍼레이션(주)', '에너지/유틸리티', '정유', '서울 종로구', 'private', 1500, 0, 'HR팀'),

  // ── 서비스업 추가 ──
  calcCompany(161, '파라다이스(주)', '서비스업', '숙박', '인천광역시', 'private', 2200, 8, '인사부'),
  calcCompany(162, '에버랜드(삼성물산)', '서비스업', '여가', '경기 용인시', 'private', 5200, 42, '인사팀'),
  calcCompany(163, '롯데월드(주)', '서비스업', '여가', '서울 송파구', 'private', 3500, 18, '인사부'),
  calcCompany(164, '이랜드월드(주)', '서비스업', '패션', '서울 중구', 'private', 6800, 68, 'HR팀'),
  calcCompany(165, 'LF(주)', '서비스업', '패션', '서울 마포구', 'private', 2800, 15, '인사팀'),
  calcCompany(166, '코오롱인더스트리', '서비스업', '패션', '서울 마포구', 'private', 5500, 48, '인사부'),
  calcCompany(167, '신세계인터내셔날', '서비스업', '패션', '서울 강남구', 'private', 2200, 10, '인사팀'),
  calcCompany(168, 'LG생활건강(주)', '서비스업', '화장품', '서울 종로구', 'private', 7200, 88, '인사부'),
  calcCompany(169, '에이블씨엔씨(주)', '서비스업', '화장품', '서울 강남구', 'private', 1200, 0, 'HR팀'),
  calcCompany(170, '코스맥스(주)', '서비스업', '화장품', '경기 성남시', 'private', 3800, 22, '인사팀'),
  calcCompany(171, '한국콜마(주)', '서비스업', '화장품', '서울 중구', 'private', 2500, 10, '인사부'),
  calcCompany(172, '동원산업(주)', '서비스업', '식품', '서울 서초구', 'private', 3200, 28, '인사팀'),
  calcCompany(173, '대상(주)', '서비스업', '식품', '서울 중구', 'private', 2800, 18, 'HR팀'),
  calcCompany(174, '사조대림(주)', '서비스업', '식품', '서울 영등포구', 'private', 1800, 5, '인사부'),

  // ── 교육 추가 ──
  calcCompany(175, '한국교육방송공사', '교육', '교육', '경기 고양시', 'public', 1800, 65, '인사팀'),
  calcCompany(176, '지학사(주)', '교육', '교육', '서울 마포구', 'private', 1200, 0, '인사부'),
  calcCompany(177, '천재교육(주)', '교육', '교육', '서울 마포구', 'private', 1500, 0, 'HR팀'),
  calcCompany(178, '비상교육(주)', '교육', '교육', '서울 구로구', 'private', 1200, 0, '인사팀'),
  calcCompany(179, 'YBM넷(주)', '교육', '교육', '서울 종로구', 'private', 1500, 5, '인사부'),

  // ── 공공기관 ──
  calcCompany(180, '한국토지주택공사', '공공기관', '공공', '경남 진주시', 'public', 9200, 328, '인사팀'),
  calcCompany(181, '국민건강보험공단', '공공기관', '공공', '강원 원주시', 'public', 15000, 545, '인사부'),
  calcCompany(182, '근로복지공단', '공공기관', '공공', '울산광역시', 'public', 6800, 245, 'HR팀'),
  calcCompany(183, '한국산업인력공단', '공공기관', '공공', '울산광역시', 'public', 2800, 102, '인사팀'),
  calcCompany(184, '한국철도공사', '공공기관', '공공', '대전광역시', 'public', 28000, 1008, '인사부'),
  calcCompany(185, '인천항만공사', '공공기관', '공공', '인천광역시', 'public', 1200, 42, '인사팀'),
  calcCompany(186, '부산항만공사', '공공기관', '공공', '부산광역시', 'public', 1500, 55, 'HR팀'),
  calcCompany(187, '한국공항공사', '공공기관', '공공', '서울 강서구', 'public', 2800, 102, '인사부'),
  calcCompany(188, '한국관광공사', '공공기관', '공공', '강원 원주시', 'public', 1200, 42, '인사팀'),
  calcCompany(189, '중소벤처기업진흥공단', '공공기관', '공공', '경남 진주시', 'public', 1800, 65, '인사부'),
  calcCompany(190, '한국무역보험공사', '공공기관', '공공', '서울 종로구', 'public', 1200, 45, 'HR팀'),
];

// 집계 헬퍼
export const SALES_DATA_YEAR = 2026;
export const MANDATORY_RATE_PRIVATE = 3.1;
export const MANDATORY_RATE_PUBLIC = 3.6;

export const priorityLabels: Record<string, string> = {
  A: 'A급 (즉시 컨택)',
  B: 'B급 (우선 검토)',
  C: 'C급 (관리 대상)',
};

export const priorityColors: Record<string, string> = {
  A: '#ef4444',
  B: '#f59e0b',
  C: '#3b82f6',
};

export const industries = [...new Set(companies.map((c) => c.industry))].sort();
export const regions = [...new Set(companies.map((c) => c.region.split(' ')[0]))].sort();
