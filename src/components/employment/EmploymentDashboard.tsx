import StatCard from '../StatCard';
import EmploymentByTypeChart from './EmploymentByTypeChart';
import EmploymentByRegionChart from './EmploymentByRegionChart';
import SectorComparisonChart from './SectorComparisonChart';
import LevySection from './LevySection';
import { useApp } from '../../contexts/AppContext';
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
  const { t } = useApp();

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('employment.statEmployed')}
          value={`${(TOTAL_EMPLOYED / 10000).toFixed(1)}만 명`}
          sub={`${TOTAL_EMPLOYED.toLocaleString()}명`}
          accent="bg-blue-500"
          icon="💼"
        />
        <StatCard
          title={t('employment.statTopRate')}
          value={topRateType.name}
          sub={t('employment.statTopRateSub', { rate: topRateType.employmentRate })}
          accent="bg-emerald-500"
          icon="🏆"
        />
        <StatCard
          title={t('employment.statTopRegion')}
          value={topRegion.region}
          sub={t('employment.statTopRegionSub', { rate: topRegion.employmentRate })}
          accent="bg-violet-500"
          icon="📍"
        />
        <StatCard
          title={t('employment.statZeroHired')}
          value={`${totalZero.toLocaleString()}개소`}
          sub={t('employment.statZeroHiredSub', { levy: totalLevy.toLocaleString() })}
          accent="bg-red-500"
          icon="⚠️"
        />
      </section>

      {/* 안내 배너 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <span>
          {t('employment.infoBanner', { year: EMPLOYMENT_YEAR, avgRate: avgRate.toFixed(1), growth: levyGrowth.toLocaleString() })}
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
          {t('employment.sectionSector')}
        </h2>
        <SectorComparisonChart />
      </section>

      {/* 고용부담금 섹션 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-red-500 rounded-full inline-block" />
          {t('employment.sectionLevy')}
        </h2>
        <LevySection />
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">
        {t('employment.footer', { year: EMPLOYMENT_YEAR })}
      </footer>
    </div>
  );
}
