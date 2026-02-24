import StatCard from '../StatCard';
import GlobalRegionChart from './GlobalRegionChart';
import GlobalTypeChart from './GlobalTypeChart';
import GlobalEmploymentChart from './GlobalEmploymentChart';
import MandatoryQuotaSection from './MandatoryQuotaSection';
import { useApp } from '../../contexts/AppContext';
import {
  GLOBAL_TOTAL_DISABLED,
  GLOBAL_DISABILITY_RATE,
  GLOBAL_DATA_YEAR,
  OECD_AVG_EMPLOYMENT_RATE,
  quotaCountries,
  countryEmployment,
  regionData,
} from '../../data/globalData';

const quotaCount = quotaCountries.length;
const topEmploymentCountry = [...countryEmployment].sort((a, b) => b.employmentRate - a.employmentRate)[0];
const totalPop = regionData.reduce((s, r) => s + r.population, 0);

export default function GlobalDashboard() {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('global.statTotal')}
          value={`${GLOBAL_TOTAL_DISABLED}천만 명`}
          sub={t('global.statTotalSub', { pop: totalPop.toLocaleString(), rate: GLOBAL_DISABILITY_RATE })}
          accent="bg-blue-500"
          icon="🌍"
        />
        <StatCard
          title={t('global.statQuotaCountries')}
          value={`${quotaCount}개국`}
          sub={t('global.statQuotaSub')}
          accent="bg-amber-500"
          icon="⚖️"
        />
        <StatCard
          title={t('global.statOecdAvg')}
          value={`${OECD_AVG_EMPLOYMENT_RATE}%`}
          sub={t('global.statOecdSub')}
          accent="bg-violet-500"
          icon="📊"
        />
        <StatCard
          title={t('global.statTopCountry')}
          value={topEmploymentCountry.country}
          sub={`${topEmploymentCountry.employmentRate}% · ${topEmploymentCountry.countryEn}`}
          accent="bg-emerald-500"
          icon="🏆"
        />
      </section>

      {/* 데이터 출처 배너 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <span>
          글로벌 데이터 출처: <strong>WHO World Report on Disability {GLOBAL_DATA_YEAR}</strong> ·
          <strong> ILO (국제노동기구) Disability and Work</strong> ·
          <strong> OECD Employment Outlook</strong>.
          국가별 장애 정의·측정 기준이 다르므로 직접 비교 시 유의가 필요합니다.
        </span>
      </div>

      {/* 지역별 + 유형별 차트 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlobalRegionChart />
        </div>
        <div>
          <GlobalTypeChart />
        </div>
      </section>

      {/* 국가별 고용률 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
          {t('global.sectionByCountry')}
        </h2>
        <GlobalEmploymentChart />
      </section>

      {/* 의무고용제 섹션 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
          {t('global.sectionQuota')}
        </h2>
        <MandatoryQuotaSection />
      </section>

      {/* 한국 vs 세계 비교 하이라이트 */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
        <h2 className="text-base font-bold text-gray-800 mb-3">{t('global.sectionKorea')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">{t('global.koEmpRate')}</p>
            <p className="text-xl font-bold text-red-500">37%</p>
            <p className="text-xs text-gray-400">{t('global.koEmpRateSub')}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">{t('global.koQuotaRate')}</p>
            <p className="text-xl font-bold text-amber-500">3.1%</p>
            <p className="text-xs text-gray-400">{t('global.koQuotaRateSub')}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">{t('global.koLevySystem')}</p>
            <p className="text-xl font-bold text-blue-500">운영 중</p>
            <p className="text-xs text-gray-400">{t('global.koLevySystemSub')}</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">
        {t('global.footer')}
      </footer>
    </div>
  );
}
