import { useState } from 'react';
import StatCard from './StatCard';
import DisabilityBarChart from './DisabilityBarChart';
import DisabilityPieChart from './DisabilityPieChart';
import YearlyTrendChart from './YearlyTrendChart';
import GenderChart from './GenderChart';
import EmploymentDashboard from './employment/EmploymentDashboard';
import GlobalDashboard from './global/GlobalDashboard';
import SalesDashboard from './sales/SalesDashboard';
import PolicyDashboard from './policy/PolicyDashboard';
import { TOTAL, DATA_YEAR, disabilityTypes, yearlyTrend } from '../data/disabilityData';
import { useApp } from '../contexts/AppContext';
import type { Lang } from '../i18n/translations';

type Tab = 'registration' | 'employment' | 'global' | 'sales' | 'policy';

const prevTotal = yearlyTrend[yearlyTrend.length - 2].total;
const diff = TOTAL - prevTotal;
const topType = [...disabilityTypes].sort((a, b) => b.count - a.count)[0];

const TAB_IDS: { id: Tab; key: string; icon: string }[] = [
  { id: 'registration', key: 'nav.registration', icon: '📋' },
  { id: 'employment',   key: 'nav.employment',   icon: '💼' },
  { id: 'global',       key: 'nav.global',       icon: '🌍' },
  { id: 'sales',        key: 'nav.sales',        icon: '🎯' },
  { id: 'policy',       key: 'nav.policy',       icon: '🏛️' },
];

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'ko', label: '한' },
  { value: 'ja', label: '日' },
  { value: 'en', label: 'EN' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('registration');
  const { t, lang, setLang, isDark, toggleDark } = useApp();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-3">
            {/* Left: logo + title */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="VDREAM"
                  className="h-9 w-auto object-contain flex-shrink-0 self-center"
                />
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight self-center">
                  {t('header.title')}
                </h1>
              </div>
              <p className="text-xs text-gray-400">
                {t('header.source')} · {DATA_YEAR}년 {t('header.yearBasis')} · {t('header.internalUse')}
              </p>
            </div>

            {/* Right: lang switcher + dark toggle + badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Language switcher */}
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-bold">
                {LANG_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLang(value)}
                    className={`px-2.5 py-1.5 transition-colors ${
                      lang === value
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                title={isDark ? t('ui.lightMode') : t('ui.darkMode')}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-slate-100 transition-colors text-base"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Latest data badge */}
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {DATA_YEAR}년 {t('header.latestData')}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="tab-nav -mx-4 sm:mx-0 flex gap-0.5 sm:gap-1 overflow-x-auto px-4 sm:px-0 pb-px">
            {TAB_IDS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex-shrink-0 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1 sm:mr-1.5">{tab.icon}</span>
                {t(tab.key)}
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
                title={t('registration.statTotal')}
                value={`${(TOTAL / 10000).toFixed(1)}만 명`}
                sub={`${TOTAL.toLocaleString()}명`}
                accent="bg-blue-500"
                icon="👥"
              />
              <StatCard
                title={t('registration.statYoY')}
                value={`+${diff.toLocaleString()}명`}
                sub={t('registration.statYoYSub', { pct: ((diff / prevTotal) * 100).toFixed(2) })}
                accent="bg-emerald-500"
                icon="📈"
              />
              <StatCard
                title={t('registration.statTopType')}
                value={topType.name}
                sub={`${topType.count.toLocaleString()}명 (${((topType.count / TOTAL) * 100).toFixed(1)}%)`}
                accent="bg-violet-500"
                icon="🏷️"
              />
              <StatCard
                title={t('registration.statTypeCount')}
                value={t('registration.statTypeCountVal')}
                sub={t('registration.statTypeCountSub')}
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
              <h2 className="text-base font-bold text-gray-800 mb-4">{t('registration.tableTitle')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 w-8">{t('registration.colRank')}</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{t('registration.colType')}</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{t('registration.colCategory')}</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">{t('registration.colCount')}</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">{t('registration.colRatio')}</th>
                      <th className="py-2 px-3 text-xs font-semibold text-gray-500">{t('registration.colGraph')}</th>
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
                                {d.category === '신체적' ? t('registration.catPhysical') : t('registration.catMental')}
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
              {t('registration.footer', { year: DATA_YEAR })}
            </footer>
          </div>
        )}

        {/* ── 취업현황 탭 ── */}
        {activeTab === 'employment' && <EmploymentDashboard />}

        {/* ── 글로벌 현황 탭 ── */}
        {activeTab === 'global' && <GlobalDashboard />}

        {/* ── 영업 대상 탭 ── */}
        {activeTab === 'sales' && <SalesDashboard />}

        {/* ── 정책/제도 탭 ── */}
        {activeTab === 'policy' && <PolicyDashboard />}
      </main>
    </div>
  );
}
