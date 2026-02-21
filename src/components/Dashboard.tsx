import { useState } from 'react';
import StatCard from './StatCard';
import DisabilityBarChart from './DisabilityBarChart';
import DisabilityPieChart from './DisabilityPieChart';
import YearlyTrendChart from './YearlyTrendChart';
import GenderChart from './GenderChart';
import EmploymentDashboard from './employment/EmploymentDashboard';
import GlobalDashboard from './global/GlobalDashboard';
import { TOTAL, DATA_YEAR, disabilityTypes, yearlyTrend } from '../data/disabilityData';

type Tab = 'registration' | 'employment' | 'global';

const prevTotal = yearlyTrend[yearlyTrend.length - 2].total;
const diff = TOTAL - prevTotal;
const topType = [...disabilityTypes].sort((a, b) => b.count - a.count)[0];

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'registration', label: '등록현황',    icon: '📋' },
  { id: 'employment',   label: '취업현황',    icon: '💼' },
  { id: 'global',       label: '글로벌 현황', icon: '🌍' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('registration');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                🇰🇷 대한민국 장애인 현황 분석 보드
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                출처: 보건복지부 · 한국장애인고용공단(KEAD) · {DATA_YEAR}년 기준
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {DATA_YEAR}년 최신 데이터
            </span>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── 등록현황 탭 ── */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            {/* 요약 카드 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="총 등록 장애인"
                value={`${(TOTAL / 10000).toFixed(1)}만 명`}
                sub={`${TOTAL.toLocaleString()}명`}
                accent="bg-blue-500"
                icon="👥"
              />
              <StatCard
                title="전년 대비 증가"
                value={`+${diff.toLocaleString()}명`}
                sub={`+${((diff / prevTotal) * 100).toFixed(2)}% 증가`}
                accent="bg-emerald-500"
                icon="📈"
              />
              <StatCard
                title="최다 등록 장애 유형"
                value={topType.name}
                sub={`${topType.count.toLocaleString()}명 (${((topType.count / TOTAL) * 100).toFixed(1)}%)`}
                accent="bg-violet-500"
                icon="🏷️"
              />
              <StatCard
                title="등록 장애 유형 수"
                value="15개 유형"
                sub="신체적 11종 · 정신적 4종"
                accent="bg-orange-500"
                icon="📊"
              />
            </section>

            {/* 메인 차트 2단 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DisabilityBarChart />
              </div>
              <div>
                <DisabilityPieChart />
              </div>
            </section>

            {/* 추이 + 성별 차트 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <YearlyTrendChart />
              <GenderChart />
            </section>

            {/* 상세 테이블 */}
            <section className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">장애 유형별 상세 현황</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 w-8">순위</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">장애 유형</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">분류</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">등록 인원</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">비율</th>
                      <th className="py-2 px-3 text-xs font-semibold text-gray-500">비율 그래프</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...disabilityTypes]
                      .sort((a, b) => b.count - a.count)
                      .map((d, i) => {
                        const pct = ((d.count / TOTAL) * 100).toFixed(1);
                        return (
                          <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                <span className="font-medium text-gray-800">{d.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                d.category === '신체적'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-purple-50 text-purple-600'
                              }`}>
                                {d.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-gray-700 text-xs">
                              {d.count.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-gray-700 text-xs w-16">
                              {pct}%
                            </td>
                            <td className="py-2.5 px-3 w-32 sm:w-48">
                              <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pct}%`, backgroundColor: d.color }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="text-center text-xs text-gray-400 pb-4">
              본 자료는 보건복지부 {DATA_YEAR}년 등록장애인 현황 통계를 기반으로 합니다.
            </footer>
          </div>
        )}

        {/* ── 취업현황 탭 ── */}
        {activeTab === 'employment' && <EmploymentDashboard />}

        {/* ── 글로벌 현황 탭 ── */}
        {activeTab === 'global' && <GlobalDashboard />}
      </main>
    </div>
  );
}
