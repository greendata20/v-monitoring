import StatCard from '../StatCard';
import CompanyTable from './CompanyTable';
import SalesIndustryChart from './SalesIndustryChart';
import {
  companies, SALES_DATA_YEAR, priorityColors, priorityLabels,
} from '../../data/salesData';

const deficitCompanies = companies.filter((c) => c.gap > 0);
const namedCompanies = companies.filter((c) => c.isPubliclyNamed);
const totalGap = deficitCompanies.reduce((s, c) => s + c.gap, 0);
const totalLevy = deficitCompanies.reduce((s, c) => s + c.estimatedLevy, 0);
const aCount = companies.filter((c) => c.priority === 'A').length;
const bCount = companies.filter((c) => c.priority === 'B').length;

const topLevy = [...deficitCompanies].sort((a, b) => b.estimatedLevy - a.estimatedLevy).slice(0, 10);

export default function SalesDashboard() {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">⚠️</span>
        <span>
          본 데이터는 <strong>KEAD 장애인고용현황 공시자료</strong> 형식 기반의 시뮬레이션 데이터입니다.
          실제 영업 활동 전에는 <strong>공공데이터포털(data.go.kr)</strong> 또는
          <strong> 한국장애인고용공단 홈페이지</strong>의 최신 명단공표 자료를 반드시 확인하세요.
          고용부담금 추정액은 법령 기준(2025년) 단가로 계산됩니다.
        </span>
      </div>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="분석 기업 수"
          value={`${companies.length}개사`}
          sub={`미달 ${deficitCompanies.length}개사 (${((deficitCompanies.length / companies.length) * 100).toFixed(0)}%)`}
          accent="bg-blue-500"
          icon="🏢"
        />
        <StatCard
          title="총 부족 인원"
          value={`${totalGap.toLocaleString()}명`}
          sub={`A급 ${aCount}개사 · B급 ${bCount}개사`}
          accent="bg-red-500"
          icon="🎯"
        />
        <StatCard
          title="연간 추정 부담금"
          value={`${(totalLevy / 10000).toFixed(0)}억원`}
          sub={`미달 ${deficitCompanies.length}개사 합계`}
          accent="bg-amber-500"
          icon="💰"
        />
        <StatCard
          title="명단공표 기업"
          value={`${namedCompanies.length}개사`}
          sub="고용률 1.55% 미만 (KEAD 공표)"
          accent="bg-violet-500"
          icon="📢"
        />
      </section>

      {/* 우선순위 현황 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['A', 'B', 'C'] as const).map((p) => {
          const list = companies.filter((c) => c.priority === p);
          const pGap = list.reduce((s, c) => s + c.gap, 0);
          const pLevy = list.reduce((s, c) => s + c.estimatedLevy, 0);
          return (
            <div
              key={p}
              className="bg-white rounded-2xl shadow-sm p-4 border-l-4"
              style={{ borderColor: priorityColors[p] }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-bold text-white px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: priorityColors[p] }}
                >
                  {p}급
                </span>
                <span className="text-xl font-bold text-gray-800">{list.length}개사</span>
              </div>
              <p className="text-xs text-gray-500">{priorityLabels[p]}</p>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-gray-600">부족 인원: <span className="font-semibold">{pGap}명</span></p>
                <p className="text-xs text-gray-600">추정 부담금: <span className="font-semibold">{(pLevy / 10000).toFixed(1)}억원/년</span></p>
              </div>
              {p === 'A' && (
                <p className="text-xs text-red-400 mt-2 font-medium">⚡ 부족 15명↑ 또는 미고용 기업</p>
              )}
              {p === 'B' && (
                <p className="text-xs text-amber-500 mt-2 font-medium">🔔 부족 6~14명 기업</p>
              )}
              {p === 'C' && (
                <p className="text-xs text-blue-400 mt-2 font-medium">📋 부족 1~5명 기업</p>
              )}
            </div>
          );
        })}
      </section>

      {/* TOP 5 부담금 기업 + 업종 차트 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP 5 */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-800 mb-1">추정 부담금 TOP 10 기업</h2>
          <p className="text-xs text-gray-400 mb-4">연간 고용부담금 추정액 기준</p>
          <div className="space-y-3">
            {topLevy.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-gray-500 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold text-white ml-2 flex-shrink-0"
                      style={{ backgroundColor: priorityColors[c.priority] }}
                    >
                      {c.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-400">{c.industry} · 부족 {c.gap}명</p>
                    <p className="text-xs font-bold text-amber-600">{c.estimatedLevy.toLocaleString()}만원</p>
                  </div>
                  <div className="mt-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${Math.min(100, (c.estimatedLevy / topLevy[0].estimatedLevy) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 업종 차트 */}
        <SalesIndustryChart />
      </section>

      {/* 명단공표 기업 목록 */}
      {namedCompanies.length > 0 && (
        <section className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-1">📢 KEAD 명단공표 기업 ({namedCompanies.length}개사)</h2>
          <p className="text-xs text-gray-500 mb-3">
            고용률 1.55% 미만 기업 — KEAD가 매년 1월 공표, 즉각적인 컨택이 필요합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {namedCompanies.map((c) => (
              <div key={c.id} className="bg-white rounded-xl p-3 border border-red-100">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 text-xs">{c.name}</p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold text-white"
                    style={{ backgroundColor: priorityColors[c.priority] }}
                  >
                    {c.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{c.industry} · {c.region}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-red-500 font-bold">{c.employmentRate}% (목표: {c.sector === 'public' ? 3.6 : 3.1}%)</span>
                  <span className="text-xs text-amber-600 font-medium">부족 {c.gap}명</span>
                </div>
                {c.estimatedLevy > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">추정 부담금: {c.estimatedLevy.toLocaleString()}만원/년</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 전체 기업 테이블 */}
      <CompanyTable />

      {/* 부담금 안내 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-800">💡 고용부담금 제도 안내</h2>
          <span className="text-xs text-gray-400">{SALES_DATA_YEAR}년 고용노동부 고시 기준</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          부담금 = 미달인원 × 부담기초액(이행 수준별) × 12개월 | 최저임금 월환산액 10,030원 × 209시간 = 2,096,270원
        </p>

        {/* 부담기초액 구간 테이블 */}
        <div className="bg-white rounded-xl overflow-hidden mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">의무고용 이행 수준</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">부담기초액 (월/인)</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">연간 (인당)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { level: '3/4 이상 이행',        monthly: '1,258,000원', annual: '약 1,510만원', color: 'text-emerald-600', bg: '' },
                { level: '1/2 이상 ~ 3/4 미만',  monthly: '1,333,480원', annual: '약 1,600만원', color: 'text-blue-600',    bg: '' },
                { level: '1/4 이상 ~ 1/2 미만',  monthly: '1,509,600원', annual: '약 1,812만원', color: 'text-amber-600',   bg: '' },
                { level: '1/4 미만',             monthly: '1,761,200원', annual: '약 2,113만원', color: 'text-orange-600',  bg: '' },
                { level: '장애인 미고용 (0명)',   monthly: '2,096,270원', annual: '약 2,516만원', color: 'text-red-600 font-bold', bg: 'bg-red-50' },
              ].map((row) => (
                <tr key={row.level} className={`border-b border-slate-50 last:border-0 ${row.bg}`}>
                  <td className="px-3 py-2 text-gray-700">{row.level}</td>
                  <td className={`px-3 py-2 text-right font-mono ${row.color}`}>{row.monthly}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${row.color}`}>{row.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 명단공표 + 장려금 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">명단공표 기준</p>
            <p className="text-xl font-bold text-amber-500">1.55%</p>
            <p className="text-xs text-gray-400">의무고용률 50% 미만 시 KEAD 공표 (매년 1월)</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">고용장려금 (혜택)</p>
            <p className="text-xl font-bold text-emerald-500">최대 80만원</p>
            <p className="text-xs text-gray-400">장애인 고용 시 월/인당 · 부담금 면제 + 장려금 동시 수령</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          ※ 중증장애인 1명 고용 시 2명으로 인정(더블카운트). 장애인 직무지원 서비스 연계 시 고용 유지율 향상 효과.
        </p>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">
        본 자료는 KEAD 공시자료 형식 기반 시뮬레이션입니다. 실제 영업 전 공공데이터포털(data.go.kr) 최신 자료를 확인하세요.
      </footer>
    </div>
  );
}
