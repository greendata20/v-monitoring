import StatCard from '../StatCard';
import EmploymentByTypeChart from './EmploymentByTypeChart';
import EmploymentByRegionChart from './EmploymentByRegionChart';
import SectorComparisonChart from './SectorComparisonChart';
import LevySection from './LevySection';
import {
  TOTAL_EMPLOYED,
  EMPLOYMENT_YEAR,
  employmentByType,
  employmentByRegion,
  levyData,
  levyYearlyData,
} from '../../data/employmentData';

const topRateType  = [...employmentByType].sort((a, b) => b.employmentRate - a.employmentRate)[0];
const topRegion    = [...employmentByRegion].sort((a, b) => b.employmentRate - a.employmentRate)[0];
const avgRate      = employmentByRegion.reduce((s, r) => s + r.employmentRate, 0) / employmentByRegion.length;
const totalLevy    = levyData.reduce((s, d) => s + d.levyAmount, 0);
const totalZero    = levyData.reduce((s, d) => s + d.zeroHired, 0);
const latestLevy   = levyYearlyData[levyYearlyData.length - 1];
const prevLevy     = levyYearlyData[levyYearlyData.length - 2];
const levyGrowth   = latestLevy.private + latestLevy.public - prevLevy.private - prevLevy.public;

export default function EmploymentDashboard() {
  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="장애인 취업자 수 (추정)"
          value={`${(TOTAL_EMPLOYED / 10000).toFixed(1)}만 명`}
          sub={`${TOTAL_EMPLOYED.toLocaleString()}명`}
          accent="bg-blue-500"
          icon="💼"
        />
        <StatCard
          title="최고 고용률 장애 유형"
          value={topRateType.name}
          sub={`고용률 ${topRateType.employmentRate}%`}
          accent="bg-emerald-500"
          icon="🏆"
        />
        <StatCard
          title="고용률 최상위 지역"
          value={topRegion.region}
          sub={`고용률 ${topRegion.employmentRate}%`}
          accent="bg-violet-500"
          icon="📍"
        />
        <StatCard
          title="장애인 미고용 사업체 (민간+공공)"
          value={`${totalZero.toLocaleString()}개소`}
          sub={`고용부담금 ${totalLevy.toLocaleString()}억 원 납부`}
          accent="bg-red-500"
          icon="⚠️"
        />
      </section>

      {/* 안내 배너 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
        <span className="text-base">ℹ️</span>
        <span>
          취업현황 데이터는 <strong>한국장애인고용공단(KEAD) {EMPLOYMENT_YEAR}년 장애인 경제활동 실태조사</strong>를 기반으로 합니다.
          전국 평균 고용률은 <strong>{avgRate.toFixed(1)}%</strong>이며, 고용부담금은 전년 대비 <strong>{levyGrowth.toLocaleString()}억 원</strong> 증가했습니다.
        </span>
      </div>

      {/* 유형별 + 지역별 차트 */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EmploymentByTypeChart />
        <EmploymentByRegionChart />
      </section>

      {/* 사기업·공공기관 섹션 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
          사업체 유형별 장애인 고용 현황
        </h2>
        <SectorComparisonChart />
      </section>

      {/* 고용부담금 섹션 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-red-500 rounded-full inline-block" />
          장애인 미고용 현황 · 고용부담금
        </h2>
        <LevySection />
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">
        본 자료는 한국장애인고용공단(KEAD) {EMPLOYMENT_YEAR}년 장애인 경제활동 실태조사 및 의무고용 현황을 기반으로 합니다.
      </footer>
    </div>
  );
}
