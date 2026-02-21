import StatCard from '../StatCard';
import GlobalRegionChart from './GlobalRegionChart';
import GlobalTypeChart from './GlobalTypeChart';
import GlobalEmploymentChart from './GlobalEmploymentChart';
import MandatoryQuotaSection from './MandatoryQuotaSection';
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
  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="전세계 장애인 수 (추계)"
          value={`${GLOBAL_TOTAL_DISABLED}천만 명`}
          sub={`세계 인구 ${totalPop.toLocaleString()}M 중 ${GLOBAL_DISABILITY_RATE}%`}
          accent="bg-blue-500"
          icon="🌍"
        />
        <StatCard
          title="의무고용제 시행 국가"
          value={`${quotaCount}개국`}
          sub="부담금·강제 의무·정부한정 포함"
          accent="bg-amber-500"
          icon="⚖️"
        />
        <StatCard
          title="OECD 장애인 평균 고용률"
          value={`${OECD_AVG_EMPLOYMENT_RATE}%`}
          sub="한국 37% (OECD 평균 하회)"
          accent="bg-violet-500"
          icon="📊"
        />
        <StatCard
          title="고용률 최상위국"
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
          국가별 장애인 고용률 비교
        </h2>
        <GlobalEmploymentChart />
      </section>

      {/* 의무고용제 섹션 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
          장애인 의무고용제도 국제 비교
        </h2>
        <MandatoryQuotaSection />
      </section>

      {/* 한국 vs 세계 비교 하이라이트 */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
        <h2 className="text-base font-bold text-gray-800 mb-3">🇰🇷 한국 위치 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">장애인 고용률</p>
            <p className="text-xl font-bold text-red-500">37%</p>
            <p className="text-xs text-gray-400">OECD 평균 47% 대비 <span className="text-red-400 font-semibold">-10%p</span></p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">의무고용률 (민간)</p>
            <p className="text-xl font-bold text-amber-500">3.1%</p>
            <p className="text-xs text-gray-400">이탈리아 7%, 프랑스·폴란드 6% 대비 낮음</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500">고용부담금 제도</p>
            <p className="text-xl font-bold text-blue-500">운영 중</p>
            <p className="text-xs text-gray-400">독일·프랑스·일본 등과 유사한 부담금 방식</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">
        본 자료는 WHO · ILO · OECD 공개 통계를 기반으로 하며, 국가별 측정 기준 차이로 인한 직접 비교에는 한계가 있습니다.
      </footer>
    </div>
  );
}
