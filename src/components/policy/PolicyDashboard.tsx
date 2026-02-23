import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  quotaHistory,
  quotaByYear,
  levyBaseByYear,
  levyTiers2025,
  policyTimeline,
  incentiveRates,
  supportPrograms,
  relatedLaws,
  type PolicyEvent,
  type SupportProgram,
} from '../../data/policyData';

// ── 색상 매핑 ──
const CATEGORY_CONFIG: Record<PolicyEvent['category'], { label: string; color: string; bg: string }> = {
  law:     { label: '법령 개정', color: '#6366f1', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  quota:   { label: '의무고용률', color: '#3b82f6', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  levy:    { label: '부담금',    color: '#ef4444', bg: 'bg-red-50 text-red-700 border-red-200' },
  support: { label: '지원제도',  color: '#10b981', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  plan:    { label: '예정·계획', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const PROGRAM_CATEGORY_COLOR: Record<SupportProgram['category'], string> = {
  '장려금':    'bg-violet-50 text-violet-700',
  '훈련/개발': 'bg-blue-50 text-blue-700',
  '시설/설비': 'bg-emerald-50 text-emerald-700',
  '컨설팅':    'bg-amber-50 text-amber-700',
  '채용지원':  'bg-pink-50 text-pink-700',
};

// ── 서브탭 ──
type SubTab = 'overview' | 'quota' | 'levy' | 'support' | 'timeline' | 'calculator';
const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
  { id: 'overview',    label: '전체 요약',    icon: '📌' },
  { id: 'quota',       label: '의무고용률',   icon: '📊' },
  { id: 'levy',        label: '부담금 제도',  icon: '💸' },
  { id: 'support',     label: '지원 프로그램', icon: '🤝' },
  { id: 'timeline',    label: '정책 타임라인', icon: '🗓️' },
  { id: 'calculator',  label: '부담금 계산기', icon: '🧮' },
];

// ── 부담기초액 차트 커스텀 Tooltip ──
const LevyBaseTooltip = ({
  active, payload, label,
}: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-gray-800 mb-1">{label}년</p>
        <p className="text-red-600">부담기초액: {payload[0].value.toLocaleString()}원/월·인</p>
        {label === '2025' && (
          <p className="text-gray-400 mt-1">* 5단계 차등 가중평균</p>
        )}
      </div>
    );
  }
  return null;
};

export default function PolicyDashboard() {
  const [subTab, setSubTab] = useState<SubTab>('overview');

  const currentQuota = quotaHistory[quotaHistory.length - 1];

  return (
    <div className="space-y-6">
      {/* 서브 탭 */}
      <div className="bg-white rounded-2xl shadow-sm px-4 py-2 flex gap-1 flex-wrap">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === t.id
                ? 'bg-indigo-500 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 전체 요약 ── */}
      {subTab === 'overview' && <OverviewSection currentQuota={currentQuota} />}

      {/* ── 의무고용률 ── */}
      {subTab === 'quota' && <QuotaSection />}

      {/* ── 부담금 제도 ── */}
      {subTab === 'levy' && <LevySection />}

      {/* ── 지원 프로그램 ── */}
      {subTab === 'support' && <SupportSection />}

      {/* ── 정책 타임라인 ── */}
      {subTab === 'timeline' && <TimelineSection />}

      {/* ── 부담금 계산기 ── */}
      {subTab === 'calculator' && <LevyCalculatorSection />}

      <footer className="text-center text-xs text-gray-400 pb-4">
        출처: 고용노동부 · 한국장애인고용공단(KEAD) · 장애인고용촉진 및 직업재활법 (2025년 기준)
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────────────
//  섹션 컴포넌트들
// ────────────────────────────────────────────────────────

function OverviewSection({ currentQuota }: { currentQuota: typeof quotaHistory[0] }) {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-xs text-indigo-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">📢</span>
        <span>
          이 섹션은 <strong>장애인 의무고용 관련 정책·제도 변화</strong>를 지속적으로 팔로업하기 위한 메뉴입니다.
          의무고용률, 부담기초액, 지원 프로그램, 주요 법령 개정 등을 한눈에 확인하세요.
        </span>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏢</span>
            <span className="text-xs font-bold text-gray-600">민간기업 의무고용률</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{currentQuota.private}%</p>
          <p className="text-xs text-gray-400 mt-1">50인 이상 사업체 · 2024년~현재</p>
          <div className="mt-2 text-xs text-gray-500">2019년 이후 동결 중</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏛️</span>
            <span className="text-xs font-bold text-gray-600">공공기관 의무고용률</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{currentQuota.public}%</p>
          <p className="text-xs text-gray-400 mt-1">공공기관·국가·지자체 · 2024년~현재</p>
          <div className="mt-2 text-xs text-emerald-600 font-medium">2022년 3.6% → 2024년 3.8%↑</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💸</span>
            <span className="text-xs font-bold text-gray-600">미고용 부담기초액 (2025)</span>
          </div>
          <p className="text-3xl font-bold text-red-600">209.6<span className="text-lg">만원</span></p>
          <p className="text-xs text-gray-400 mt-1">월/인 · 장애인 0명 완전미이행 시</p>
          <div className="mt-2 text-xs text-red-500">5단계 차등 부과 (2025년 신설)</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <span className="text-xs font-bold text-gray-600">고용장려금 최대 (2025)</span>
          </div>
          <p className="text-3xl font-bold text-violet-600">90<span className="text-lg">만원</span></p>
          <p className="text-xs text-gray-400 mt-1">월/인 · 중증장애인 여성 기준</p>
          <div className="mt-2 text-xs text-violet-600">의무고용률 초과 고용 시 지급</div>
        </div>
      </div>

      {/* 주요 정책 변화 요약 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">의무고용률 변경 이력 요약</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">적용 기간</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-blue-500">민간기업</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-emerald-500">공공기관</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-violet-500">국가·지자체</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">비고</th>
              </tr>
            </thead>
            <tbody>
              {quotaHistory.map((q, i) => (
                <tr
                  key={q.period}
                  className={`border-b border-slate-50 ${i === quotaHistory.length - 1 ? 'bg-blue-50' : 'hover:bg-slate-50'} transition-colors`}
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800 text-xs">
                    {q.period}
                    {i === quotaHistory.length - 1 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">현행</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-600 text-sm">{q.private}%</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-600 text-sm">{q.public}%</td>
                  <td className="py-2.5 px-3 text-center font-bold text-violet-600 text-sm">{q.government}%</td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">{q.note || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 관련 법령 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">주요 관련 법령</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedLaws.map((law) => (
            <div key={law.name} className="border border-slate-100 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-800 mb-1 leading-snug">{law.name}</p>
              <p className="text-xs text-gray-400 mb-3">
                제정 {law.enacted}년 · 최종개정 {law.lastAmended}년
              </p>
              <ul className="space-y-1">
                {law.keyPoints.map((pt) => (
                  <li key={pt} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuotaSection() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <span>
          의무고용률은 <strong>매 5년마다 고용노동부 장관이 고시</strong>합니다.
          공공기관은 민간보다 높은 의무고용률이 적용되며, 미달 시 국가·지자체는 인사혁신처 점검 대상,
          민간·공공기관은 고용부담금 납부 의무가 있습니다.
        </span>
      </div>

      {/* 연도별 의무고용률 차트 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">의무고용률 연도별 변화 (2010~2026)</h2>
        <p className="text-xs text-gray-400 mb-4">공공기관과 민간기업 의무고용률 격차가 지속 확대되는 추세입니다.</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={quotaByYear} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[2.0, 4.0]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [`${v ?? ''}%`]}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Line type="stepAfter" dataKey="private"    name="민간기업"     stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey="public"     name="공공기관"     stroke="#10b981" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey="government" name="국가·지자체"  stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 의무고용률 이력 상세 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">변경 이력 상세</h2>
        <div className="space-y-3">
          {[...quotaHistory].reverse().map((q, i) => (
            <div
              key={q.period}
              className={`flex items-start gap-4 p-4 rounded-xl border ${
                i === 0 ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex-shrink-0 text-center w-20">
                <p className="text-xs font-bold text-gray-600">{q.period}</p>
                {i === 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">현행</span>
                )}
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-0.5 whitespace-nowrap">민간기업</p>
                  <p className="text-lg font-bold text-blue-600">{q.private}%</p>
                </div>
                <div className="w-16 flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-0.5 whitespace-nowrap">공공기관</p>
                  <p className="text-lg font-bold text-emerald-600">{q.public}%</p>
                </div>
                <div className="w-20 flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-0.5 whitespace-nowrap">국가·지자체</p>
                  <p className="text-lg font-bold text-violet-600">{q.government}%</p>
                </div>
              </div>
              {q.note && (
                <div className="flex-shrink-0 max-w-48">
                  <p className="text-xs text-gray-500 leading-relaxed">{q.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 현행 기준 요약 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">현행 의무고용 기준 (2024년~)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              sector: '민간기업', rate: '3.1%', range: '상시근로자 50인 이상',
              levy: '미달 시 고용부담금 납부', color: 'border-blue-300 bg-blue-50', text: 'text-blue-700',
            },
            {
              sector: '공공기관', rate: '3.8%', range: '공공기관운영법 상 기관',
              levy: '미달 시 고용부담금 납부', color: 'border-emerald-300 bg-emerald-50', text: 'text-emerald-700',
            },
            {
              sector: '국가·지자체', rate: '3.8%', range: '상시근로자 50인 이상',
              levy: '부담금 면제 / 인사혁신처 점검', color: 'border-violet-300 bg-violet-50', text: 'text-violet-700',
            },
          ].map((s) => (
            <div key={s.sector} className={`rounded-xl border-2 p-4 ${s.color}`}>
              <p className={`text-sm font-bold ${s.text} mb-2`}>{s.sector}</p>
              <p className={`text-3xl font-bold ${s.text} mb-1`}>{s.rate}</p>
              <p className="text-xs text-gray-500 mb-2">{s.range}</p>
              <p className="text-xs text-gray-600 border-t border-white/60 pt-2">{s.levy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LevySection() {
  const barData = levyTiers2025.map((t) => ({
    name: t.label,
    amount: Math.round(t.monthlyRate / 10000),
    fill: t.color,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">⚠️</span>
        <span>
          2025년부터 <strong>고용부담금 부담기초액이 5단계 구간별 차등 적용</strong>으로 개편되었습니다.
          장애인을 전혀 고용하지 않은 사업체는 <strong>월 2,096,270원/인</strong>으로 최고 부담기초액이 적용됩니다.
        </span>
      </div>

      {/* 2025년 구간별 부담기초액 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">2025년 부담기초액 구간별 적용 기준</h2>
        <p className="text-xs text-gray-400 mb-5">이행률 = 실제 고용 장애인 수 ÷ 의무 고용 인원</p>

        {/* 구간 카드 */}
        <div className="space-y-3 mb-6">
          {levyTiers2025.map((t) => (
            <div key={t.tier} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: t.color }}
              >
                {t.tier}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-500 truncate">{t.condition}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-bold text-gray-900">
                  {(t.monthlyRate / 10000).toFixed(1)}
                  <span className="text-xs font-normal text-gray-400 ml-1">만원/월·인</span>
                </p>
                <p className="text-xs text-gray-400">연 {(t.monthlyRate * 12 / 10000).toLocaleString()}만원</p>
              </div>
            </div>
          ))}
        </div>

        {/* 구간별 바 차트 */}
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}만`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [`${v ?? ''}만원/월·인`, '부담기초액']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {barData.map((_entry, i) => (
                <rect key={i} fill={levyTiers2025[i].color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 부담기초액 연도별 변화 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">부담기초액 연도별 변화 (2017~2025)</h2>
        <p className="text-xs text-gray-400 mb-4">매년 최저임금 인상률을 반영해 고용노동부 장관이 고시합니다. 2025년은 5단계 구간 가중평균 기준.</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={levyBaseByYear} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<LevyBaseTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              name="부담기초액"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* 이력 테이블 */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-gray-500">연도</th>
                <th className="text-right py-2 px-3 text-gray-500">부담기초액 (원/월·인)</th>
                <th className="text-left py-2 px-3 text-gray-500">비고</th>
              </tr>
            </thead>
            <tbody>
              {[...levyBaseByYear].reverse().map((d, i) => (
                <tr key={d.year} className={`border-b border-slate-50 ${i === 0 ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                  <td className="py-2 px-3 font-medium text-gray-800">
                    {d.year}년
                    {i === 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">최신</span>}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-gray-700">
                    {d.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-gray-400">{d.note || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 부담금 계산 예시 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">부담금 계산 예시 (2025년)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: '상시근로자 200명 민간기업 (장애인 0명)',
              required: 7, hired: 0, rate: 0,
              tierLabel: '미고용', monthly: 2_096_270,
              color: 'border-red-200 bg-red-50',
            },
            {
              title: '상시근로자 500명 민간기업 (장애인 10명)',
              required: 16, hired: 10, rate: 62.5,
              tierLabel: '1/2~3/4', monthly: 1_333_480,
              color: 'border-amber-200 bg-amber-50',
            },
          ].map((ex) => {
            const gap = ex.required - ex.hired;
            const annual = Math.round(gap * ex.monthly * 12 / 10000);
            return (
              <div key={ex.title} className={`rounded-xl border p-4 ${ex.color}`}>
                <p className="text-sm font-bold text-gray-800 mb-3">{ex.title}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">의무고용 인원</span>
                    <span className="font-semibold">{ex.required}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">실제 고용 인원</span>
                    <span className="font-semibold">{ex.hired}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">부족 인원 (부담 대상)</span>
                    <span className="font-semibold text-red-600">{gap}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">이행률 구간</span>
                    <span className="font-semibold">{ex.tierLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">월 부담기초액</span>
                    <span className="font-semibold">{ex.monthly.toLocaleString()}원/인</span>
                  </div>
                  <div className="flex justify-between border-t border-white/60 pt-1.5 mt-1">
                    <span className="text-gray-700 font-bold">연간 부담금 추정</span>
                    <span className="font-bold text-red-600 text-sm">{annual.toLocaleString()}만원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SupportSection() {
  const [filter, setFilter] = useState<SupportProgram['category'] | 'all'>('all');
  const categories: Array<SupportProgram['category'] | 'all'> = ['all', '장려금', '시설/설비', '훈련/개발', '컨설팅', '채용지원'];

  const filtered = filter === 'all' ? supportPrograms : supportPrograms.filter((p) => p.category === filter);

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">💡</span>
        <span>
          한국장애인고용공단(KEAD)은 의무고용 달성을 지원하기 위해 다양한 <strong>재정적·비재정적 지원 프로그램</strong>을 운영합니다.
          부담금 납부보다 <strong>고용장려금 수령이 경제적으로 유리</strong>한 경우가 많습니다.
        </span>
      </div>

      {/* 고용장려금 단가 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">고용장려금 단가 (2025년 기준)</h2>
        <p className="text-xs text-gray-400 mb-4">의무고용률 초과 고용 시 지급. 중증·여성 우대 지급 구조.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {incentiveRates.map((r) => (
            <div key={`${r.type}-${r.gender}`} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: r.color }}
              >
                {r.gender[0]}
              </div>
              <p className="text-xs font-semibold text-gray-700">{r.type} · {r.gender}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {(r.monthlyAmount / 10000).toFixed(0)}
                <span className="text-xs font-normal text-gray-400">만원</span>
              </p>
              <p className="text-xs text-gray-400">월 지급</p>
              <p className="text-xs text-gray-500 mt-1">연 최대 {(r.annualAmount / 10000).toFixed(0)}만원</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-violet-50 rounded-xl p-3 text-xs text-violet-700 border border-violet-100">
          <strong>부담금 vs 장려금 비교:</strong> 의무고용률 1명 미달 시 연간 약 1,500만~2,500만원 부담금 납부 vs
          초과 고용 1명당 연간 최대 1,080만원 장려금 수령. 적극 고용 전략이 재무적으로 유리할 수 있습니다.
        </div>
      </div>

      {/* 지원 프로그램 목록 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">주요 지원 프로그램</h2>
          <div className="flex gap-1 flex-wrap justify-end">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filter === c ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? '전체' : c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.name} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{p.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROGRAM_CATEGORY_COLOR[p.category]}`}>
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium text-gray-600">대상:</span> {p.target}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mb-2">
                    <span className="text-gray-500 font-normal">지원규모:</span> {p.amount}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LevyCalculatorSection() {
  const [totalEmployees, setTotalEmployees] = useState(200);
  const [orgType, setOrgType] = useState<'private' | 'public'>('private');
  const [currentMild, setCurrentMild] = useState(0);
  const [currentSevere, setCurrentSevere] = useState(0);
  const [additionalMild, setAdditionalMild] = useState(0);
  const [additionalSevere, setAdditionalSevere] = useState(0);
  const [contractYear, setContractYear] = useState<1 | 3>(1);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('annual');
  const [taxRate, setTaxRate] = useState(0.20);

  const HOURLY_WAGE = 10_320; // 2026년 최저시급
  const DAYS_PER_MONTH = 22;
  const VDREAM_RATE = contractYear === 1 ? 500_000 : 370_000;
  const quotaRate = orgType === 'private' ? 0.031 : 0.038;
  const mandatoryCount = Math.floor(totalEmployees * quotaRate);

  const currentRecognized = currentMild + currentSevere * 2;
  const afterRecognized = currentRecognized + additionalMild + additionalSevere * 2;

  function getLevyRate(recognized: number): number {
    if (mandatoryCount <= 0 || recognized >= mandatoryCount) return 0;
    if (recognized === 0) return 2_096_270;
    const r = recognized / mandatoryCount;
    if (r < 0.25) return 1_761_200;
    if (r < 0.50) return 1_509_600;
    if (r < 0.75) return 1_333_480;
    return 1_258_000;
  }

  function getTierInfo(recognized: number) {
    if (mandatoryCount <= 0 || recognized >= mandatoryCount)
      return { label: '의무 달성 ✓', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
    if (recognized === 0)
      return { label: '미고용', bg: 'bg-red-50 border-red-200 text-red-700' };
    const r = recognized / mandatoryCount;
    if (r < 0.25) return { label: '이행률 1/4 미만', bg: 'bg-orange-50 border-orange-200 text-orange-700' };
    if (r < 0.50) return { label: '이행률 1/4~1/2', bg: 'bg-amber-50 border-amber-200 text-amber-700' };
    if (r < 0.75) return { label: '이행률 1/2~3/4', bg: 'bg-lime-50 border-lime-200 text-lime-700' };
    return { label: '이행률 3/4 이상', bg: 'bg-emerald-50 border-emerald-200 text-emerald-600' };
  }

  const currentShortfall = Math.max(0, mandatoryCount - currentRecognized);
  const afterShortfall = Math.max(0, mandatoryCount - afterRecognized);
  const currentMonthlyLevy = currentShortfall * getLevyRate(currentRecognized);
  const afterMonthlyLevy = afterShortfall * getLevyRate(afterRecognized);
  const currentAnnualLevy = currentMonthlyLevy * 12;
  const afterAnnualLevy = afterMonthlyLevy * 12;
  const levySaving = currentAnnualLevy - afterAnnualLevy;

  const totalAdditional = additionalMild + additionalSevere;
  const vdreamAnnual = totalAdditional * VDREAM_RATE * 12;
  const monthlyWagePerPerson = Math.round(HOURLY_WAGE * hoursPerDay * DAYS_PER_MONTH);
  const wageAnnual = totalAdditional * monthlyWagePerPerson * 12;
  const totalCostAfter = afterAnnualLevy + vdreamAnnual + wageAnnual;
  const netSaving = currentAnnualLevy - totalCostAfter;

  // 손금불산입 영향 (법인세율 적용)
  const currentLevyTaxBurden = currentAnnualLevy * taxRate;
  const currentEffectiveLevyCost = currentAnnualLevy * (1 + taxRate);
  const afterEffectiveLevyCost = afterAnnualLevy * (1 + taxRate);
  const vdreamTaxSaving = vdreamAnnual * taxRate;
  const wageTaxSaving = wageAnnual * taxRate;
  const effectiveTotalCostAfter = afterEffectiveLevyCost + vdreamAnnual * (1 - taxRate) + wageAnnual * (1 - taxRate);
  const effectiveNetSaving = currentEffectiveLevyCost - effectiveTotalCostAfter;

  // 계약 기간별 비교용 (1년 vs 3년)
  const vdreamAnnual1Y = totalAdditional * 500_000 * 12;
  const vdreamAnnual3Y = totalAdditional * 370_000 * 12;
  const totalCost1Y = afterAnnualLevy + vdreamAnnual1Y + wageAnnual;
  const totalCost3Y = afterAnnualLevy + vdreamAnnual3Y + wageAnnual;
  const netSaving1Y = currentAnnualLevy - totalCost1Y;
  const netSaving3Y = currentAnnualLevy - totalCost3Y;

  // 초과 고용 장려금 (의무 초과 인정인원 기준, 평균 단가 적용)
  const excessRecognized = Math.max(0, afterRecognized - mandatoryCount);
  const incentiveAnnual = excessRecognized * 675_000 * 12; // 평균 67.5만원/월·인

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`;
    if (abs >= 10_000) return `${Math.round(n / 10_000).toLocaleString()}만원`;
    return `${n.toLocaleString()}원`;
  };

  // 월/연 토글에 따라 금액 변환
  const display = (annual: number) => fmt(viewMode === 'monthly' ? Math.round(annual / 12) : annual);
  const periodLabel = viewMode === 'monthly' ? '월' : '연간';

  const currentTier = getTierInfo(currentRecognized);
  const afterTier = getTierInfo(afterRecognized);
  const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

  return (
    <div className="space-y-5">
      {/* 배너 */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🧮</span>
        <div>
          <p className="text-sm font-bold text-indigo-800 mb-0.5">장애인 의무고용 부담금 계산기</p>
          <p className="text-xs text-indigo-600">
            기업 현황을 입력하면 예상 부담금과 VDREAM 솔루션 연계 고용 시 비용 절감 효과를 실시간으로 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── 왼쪽: 입력 ── */}
        <div className="space-y-4">
          {/* 기업 정보 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>🏢</span> 기업 정보
            </h2>
            <div>
              <label className={labelCls}>상시근로자 수 (명)</label>
              <input
                type="number" min="50" step="10"
                value={totalEmployees}
                onChange={(e) => setTotalEmployees(Math.max(0, parseInt(e.target.value) || 0))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>기업 유형</label>
              <div className="flex gap-2">
                {([
                  { value: 'private' as const, label: '민간기업', desc: '3.1%', active: 'bg-blue-500 border-blue-500' },
                  { value: 'public' as const,  label: '공공기관', desc: '3.8%', active: 'bg-emerald-500 border-emerald-500' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOrgType(opt.value)}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                      orgType === opt.value
                        ? `${opt.active} text-white`
                        : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label} <span className="opacity-75">({opt.desc})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">의무고용 인원</span>
                <span className="text-xl font-bold text-indigo-600">{mandatoryCount}명</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {totalEmployees.toLocaleString()}명 × {(quotaRate * 100).toFixed(1)}% = {(totalEmployees * quotaRate).toFixed(2)} → 소수점 이하 버림
              </p>
            </div>
            <div>
              <label className={labelCls}>법인세율 <span className="text-amber-500 font-normal">(손금불산입 계산용)</span></label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { rate: 0.10, label: '10%', desc: '과표 2억 이하' },
                  { rate: 0.20, label: '20%', desc: '2억 ~ 200억' },
                  { rate: 0.22, label: '22%', desc: '200억 ~ 3,000억' },
                  { rate: 0.25, label: '25%', desc: '3,000억 초과' },
                ].map((opt) => (
                  <button
                    key={opt.rate}
                    onClick={() => setTaxRate(opt.rate)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border-2 transition-all ${
                      taxRate === opt.rate
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className={`text-xs mt-0.5 ${taxRate === opt.rate ? 'opacity-75' : 'text-gray-400'}`}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 현재 고용 현황 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>👥</span> 현재 장애인 고용 현황
            </h2>
            <p className="text-xs text-gray-400">중증장애인은 의무고용 인원 산정 시 <strong>2명으로 인정</strong>됩니다.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>경증 장애인 (명)</label>
                <input
                  type="number" min="0"
                  value={currentMild}
                  onChange={(e) => setCurrentMild(Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>중증 장애인 (명)</label>
                <input
                  type="number" min="0"
                  value={currentSevere}
                  onChange={(e) => setCurrentSevere(Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputCls}
                />
                <p className="text-xs text-violet-500 mt-1">× 2 = {currentSevere * 2}명 인정</p>
              </div>
            </div>
            <div className={`rounded-xl border px-4 py-3 flex items-center justify-between ${currentTier.bg}`}>
              <div>
                <p className="text-xs font-semibold">{currentTier.label}</p>
                <p className="text-xs opacity-70">인정인원 {currentRecognized}명 / 의무 {mandatoryCount}명</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70">{periodLabel} 부담금</p>
                <p className="text-sm font-bold">{display(currentAnnualLevy)}</p>
              </div>
            </div>
          </div>

          {/* VDREAM 솔루션 연계 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>🤝</span> VDREAM 솔루션 연계 고용 계획
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>추가 고용 경증 (명)</label>
                <input
                  type="number" min="0"
                  value={additionalMild}
                  onChange={(e) => setAdditionalMild(Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>추가 고용 중증 (명)</label>
                <input
                  type="number" min="0"
                  value={additionalSevere}
                  onChange={(e) => setAdditionalSevere(Math.max(0, parseInt(e.target.value) || 0))}
                  className={inputCls}
                />
                <p className="text-xs text-violet-500 mt-1">× 2 = {additionalSevere * 2}명 인정</p>
              </div>
            </div>
            <div>
              <label className={labelCls}>VDREAM 계약 기간</label>
              <div className="flex gap-2">
                {([
                  { value: 1 as const, label: '1년 계약', price: '월 500,000원/인' },
                  { value: 3 as const, label: '3년 계약', price: '월 370,000원/인', badge: true },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setContractYear(opt.value)}
                    className={`flex-1 py-2.5 px-2 text-xs font-semibold rounded-xl border-2 transition-all ${
                      contractYear === opt.value
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {opt.label}
                      {'badge' in opt && opt.badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${contractYear === opt.value ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                          절약
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 ${contractYear === opt.value ? 'opacity-75' : 'text-gray-400'}`}>{opt.price}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>하루 평균 근무시간</label>
              <div className="flex items-center gap-3">
                <input
                  type="number" min="1" max="8" step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Math.min(8, Math.max(1, parseFloat(e.target.value) || 4)))}
                  className="w-24 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-center font-bold"
                />
                <span className="text-sm text-gray-500">시간 / 일</span>
              </div>
              <div className="mt-2 bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                1인당 예상 월 인건비:{' '}
                <strong className="text-gray-700">{fmt(monthlyWagePerPerson)}</strong>
                <span className="text-gray-400 ml-1">(최저시급 10,320원 × {hoursPerDay}h × 22일)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 오른쪽: 결과 ── */}
        <div className="space-y-4">
          {/* 이행률 변화 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">이행률 구간 변화</h2>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1.5 transition-colors ${viewMode === 'monthly' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:bg-slate-50'}`}
                >
                  월별
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-3 py-1.5 transition-colors ${viewMode === 'annual' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:bg-slate-50'}`}
                >
                  연간
                </button>
              </div>
            </div>
            <div className="flex items-stretch gap-3">
              <div className={`flex-1 rounded-xl border-2 px-4 py-3 ${currentTier.bg}`}>
                <p className="text-xs mb-1.5 opacity-70">현재</p>
                <p className="text-sm font-bold">{currentTier.label}</p>
                <p className="text-xs mt-1 opacity-70">
                  {mandatoryCount > 0 ? ((currentRecognized / mandatoryCount) * 100).toFixed(0) : 0}% 이행
                </p>
                <div className="mt-2 pt-2 border-t border-current/20">
                  <p className="text-xs opacity-60">{periodLabel} 부담금</p>
                  <p className="text-base font-bold">{display(currentAnnualLevy)}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
                <div className="text-gray-300 text-lg">→</div>
                {currentAnnualLevy > afterAnnualLevy && (
                  <span className="text-xs font-bold text-emerald-500 whitespace-nowrap">
                    -{display(currentAnnualLevy - afterAnnualLevy)}
                  </span>
                )}
              </div>
              <div className={`flex-1 rounded-xl border-2 px-4 py-3 ${afterTier.bg}`}>
                <p className="text-xs mb-1.5 opacity-70">고용 후</p>
                <p className="text-sm font-bold">{afterTier.label}</p>
                <p className="text-xs mt-1 opacity-70">
                  {mandatoryCount > 0 ? Math.min(100, (afterRecognized / mandatoryCount) * 100).toFixed(0) : 100}% 이행
                </p>
                <div className="mt-2 pt-2 border-t border-current/20">
                  <p className="text-xs opacity-60">{periodLabel} 부담금</p>
                  <p className="text-base font-bold">{display(afterAnnualLevy)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 비용 비교 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-800">비용 비교 분석</h2>

            {/* 현재 */}
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-xs font-semibold text-red-500 mb-2">현재 (VDREAM 고용 전)</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">의무고용 부담금 ({periodLabel})</p>
                  <p className="text-xs text-gray-400">
                    부족 {currentShortfall}명 × {(getLevyRate(currentRecognized) / 10000).toFixed(1)}만원
                    {viewMode === 'annual' ? ' × 12개월' : '/월'}
                  </p>
                </div>
                <p className="text-2xl font-bold text-red-600">{display(currentAnnualLevy)}</p>
              </div>
            </div>

            {/* 고용 후 */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-600 mb-2">VDREAM 솔루션 고용 후</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">의무고용 부담금</span>
                  <span className="font-semibold text-gray-800">{display(afterAnnualLevy)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">VDREAM 솔루션 비용</p>
                    <p className="text-gray-400">
                      {totalAdditional}명 × {(VDREAM_RATE / 10000).toFixed(0)}만원/월
                      {viewMode === 'annual' && ' × 12개월'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">{display(vdreamAnnual)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600">장애인 인건비</p>
                    <p className="text-gray-400">
                      {totalAdditional}명 × {fmt(monthlyWagePerPerson)}/월
                      {viewMode === 'annual' && ' × 12개월'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">{display(wageAnnual)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-2">
                  <span className="font-bold text-gray-700">총 {periodLabel} 비용</span>
                  <span className="text-lg font-bold text-blue-700">{display(totalCostAfter)}</span>
                </div>
              </div>
            </div>

            {/* 순 절감 */}
            <div className={`rounded-xl border-2 p-4 ${netSaving >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-orange-50 border-orange-300'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-bold ${netSaving >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                  {netSaving >= 0 ? '✅' : '⚠️'} {periodLabel} 순 {netSaving >= 0 ? '절감 효과' : '추가 비용'}
                </p>
                <p className={`text-2xl font-bold ${netSaving >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {netSaving >= 0 ? '+' : ''}{display(netSaving)}
                </p>
              </div>
              <div className="space-y-1.5 text-xs border-t border-black/10 pt-3">
                <div className="flex justify-between text-gray-600">
                  <span>부담금 절감</span>
                  <span className="font-semibold text-emerald-600">+{display(levySaving)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VDREAM 솔루션 비용</span>
                  <span className="font-semibold text-red-500">-{display(vdreamAnnual)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>장애인 인건비</span>
                  <span className="font-semibold text-red-500">-{display(wageAnnual)}</span>
                </div>
              </div>
              {netSaving < 0 && (
                <p className="text-xs text-orange-600 mt-2 pt-2 border-t border-orange-200">
                  부담금 외 명단공표 회피, ESG 경영, 정부 지원 혜택 등 비재무적 효과를 종합적으로 고려해 주세요.
                </p>
              )}
            </div>

            {/* 고용장려금 안내 */}
            {excessRecognized > 0 && (
              <div className="rounded-xl bg-violet-50 border border-violet-200 p-3">
                <p className="text-xs font-semibold text-violet-700 mb-1">💰 추가 고용장려금 수령 가능</p>
                <p className="text-xs text-violet-600">
                  의무 초과 인정인원 {excessRecognized}명 → {periodLabel} 최대{' '}
                  <strong>{display(incentiveAnnual)}</strong> 장려금 수령 예상
                </p>
                <p className="text-xs text-violet-400 mt-1">
                  * 중증여성 90만원 ~ 경증남성 45만원/월 기준, 성별·장애 유형에 따라 상이
                </p>
              </div>
            )}
          </div>

          {/* 1년 vs 3년 계약 비교 */}
          {totalAdditional > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-3">계약 기간별 비교</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: '1년 계약',
                    rate: 500_000,
                    vdream: vdreamAnnual1Y,
                    total: totalCost1Y,
                    net: netSaving1Y,
                    isSelected: contractYear === 1,
                    color: 'border-slate-300',
                    headerBg: 'bg-slate-100 text-slate-700',
                    netColor: netSaving1Y >= 0 ? 'text-emerald-600' : 'text-orange-500',
                  },
                  {
                    label: '3년 계약',
                    rate: 370_000,
                    vdream: vdreamAnnual3Y,
                    total: totalCost3Y,
                    net: netSaving3Y,
                    isSelected: contractYear === 3,
                    color: 'border-indigo-300',
                    headerBg: 'bg-indigo-500 text-white',
                    netColor: netSaving3Y >= 0 ? 'text-emerald-600' : 'text-orange-500',
                  },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    className={`rounded-xl border-2 overflow-hidden ${opt.color} ${opt.isSelected ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
                  >
                    <div className={`px-3 py-2 flex items-center justify-between ${opt.headerBg}`}>
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className="text-xs opacity-80">{(opt.rate / 10000).toFixed(0)}만원/월·인</span>
                    </div>
                    <div className="px-3 py-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>솔루션 비용</span>
                        <span className="font-medium text-gray-700">{display(opt.vdream)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>인건비</span>
                        <span className="font-medium text-gray-700">{display(wageAnnual)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>부담금</span>
                        <span className="font-medium text-gray-700">{display(afterAnnualLevy)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 text-gray-700">
                        <span className="font-semibold">총 {periodLabel} 비용</span>
                        <span className="font-bold">{display(opt.total)}</span>
                      </div>
                      <div className={`flex justify-between font-bold pt-0.5 ${opt.netColor}`}>
                        <span>순 절감</span>
                        <span>{opt.net >= 0 ? '+' : ''}{display(opt.net)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 절감 차이 요약 */}
              <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-700 flex items-center justify-between">
                <span>3년 계약 선택 시 1년 계약 대비</span>
                <span className="font-bold">
                  {periodLabel} {display(vdreamAnnual1Y - vdreamAnnual3Y)} 추가 절감
                </span>
              </div>
            </div>
          )}

          {/* 손금불산입 영향 분석 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span>⚖️</span>
              <h2 className="text-sm font-bold text-gray-800">손금불산입 영향 분석</h2>
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">법인세 {(taxRate * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
              고용부담금은 세무상 <strong>손금불산입</strong> 항목입니다. 비용으로 인정받지 못해 부담금액의 <strong>{(taxRate * 100).toFixed(0)}%</strong>만큼 법인세를 추가 납부하게 됩니다.
            </div>

            {/* 현재 실질 부담 */}
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-1.5 text-xs">
              <p className="font-semibold text-red-600 mb-1">현재 실질 부담 ({periodLabel})</p>
              <div className="flex justify-between text-gray-600">
                <span>명목 부담금</span>
                <span className="font-medium">{display(currentAnnualLevy)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>손금불산입 추가 세부담 (+{(taxRate * 100).toFixed(0)}%)</span>
                <span className="font-medium">+{display(currentLevyTaxBurden)}</span>
              </div>
              <div className="flex justify-between font-bold text-red-700 border-t border-red-200 pt-1.5">
                <span>실질 총 부담</span>
                <span className="text-base">{display(currentEffectiveLevyCost)}</span>
              </div>
            </div>

            {/* 고용 후 실질 비용 */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 space-y-1.5 text-xs">
              <p className="font-semibold text-blue-600 mb-1">VDREAM 고용 후 실질 비용 ({periodLabel})</p>
              <div className="flex justify-between text-gray-600">
                <span>부담금 (손금불산입 포함)</span>
                <span className="font-medium">{display(afterEffectiveLevyCost)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VDREAM 비용</span>
                <span className="font-medium">{display(vdreamAnnual)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-2">
                <span>└ 손금산입 절세효과 (-{(taxRate * 100).toFixed(0)}%)</span>
                <span>-{display(vdreamTaxSaving)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>인건비</span>
                <span className="font-medium">{display(wageAnnual)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-2">
                <span>└ 손금산입 절세효과 (-{(taxRate * 100).toFixed(0)}%)</span>
                <span>-{display(wageTaxSaving)}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-700 border-t border-blue-200 pt-1.5">
                <span>실질 총 비용</span>
                <span className="text-base">{display(effectiveTotalCostAfter)}</span>
              </div>
            </div>

            {/* 세후 실질 순 절감 */}
            <div className={`rounded-xl border-2 p-3 ${effectiveNetSaving >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-orange-50 border-orange-300'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold ${effectiveNetSaving >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                    세후 실질 순 절감 ({periodLabel})
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    명목 기준 {display(netSaving)} 대비{' '}
                    <span className="text-emerald-600 font-semibold">+{display(Math.abs(effectiveNetSaving - netSaving))}</span> 추가 유리
                  </p>
                </div>
                <p className={`text-xl font-bold ${effectiveNetSaving >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {effectiveNetSaving >= 0 ? '+' : ''}{display(effectiveNetSaving)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              ※ 지방소득세(법인세의 10%) 포함 시 실효세율 {((taxRate * 1.1) * 100).toFixed(1)}% 적용 가능
            </p>
          </div>

          {/* 명단공표 리스크 */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">📋 명단공표 리스크</p>
            {mandatoryCount > 0 && currentRecognized / mandatoryCount < 0.5 ? (
              <div className="space-y-1.5 text-xs">
                <p className="text-red-500 font-semibold">
                  현재 이행률 {((currentRecognized / mandatoryCount) * 100).toFixed(0)}% — 명단공표 대상 위험 (이행률 50% 미만)
                </p>
                {afterRecognized / mandatoryCount >= 0.5 ? (
                  <p className="text-emerald-600">
                    ✓ 추가 고용 후 이행률 {Math.min(100, (afterRecognized / mandatoryCount) * 100).toFixed(0)}% — 명단공표 위험 해소
                  </p>
                ) : (
                  <p className="text-orange-500">
                    추가 고용 후에도 이행률 {Math.min(100, (afterRecognized / mandatoryCount) * 100).toFixed(0)}% — 명단공표 위험 지속
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">현재 이행률 50% 이상 — 명단공표 대상 아님</p>
            )}
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">※ 계산 기준 안내</p>
        <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
          <li>의무고용 인원: 상시근로자 수 × 의무고용률 (소수점 이하 버림)</li>
          <li>부담기초액: 2025년 기준 5단계 차등 적용 (이행률 구간에 따라 산정)</li>
          <li>최저시급: 2026년 기준 10,320원 적용</li>
          <li>인건비: 최저시급 × 하루 근무시간 × 22일 (월 평균, 주휴수당 미포함)</li>
          <li>VDREAM 솔루션 비용: 실제 고용 인원 기준 (중증 2배 인정 미적용)</li>
          <li>고용장려금: 의무고용률 초과 인원에 대해서만 지급 (인정인원 기준), 성별·유형별 단가 상이</li>
          <li>본 계산기는 참고용이며, 정확한 부담금은 KEAD 확인을 권장합니다.</li>
        </ul>
      </div>
    </div>
  );
}

function TimelineSection() {
  const [filterCat, setFilterCat] = useState<PolicyEvent['category'] | 'all'>('all');
  const categories: Array<PolicyEvent['category'] | 'all'> = ['all', 'law', 'quota', 'levy', 'support', 'plan'];

  const filtered = [...policyTimeline]
    .filter((e) => filterCat === 'all' || e.category === filterCat)
    .sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
        <span className="text-base flex-shrink-0">🗓️</span>
        <span>
          장애인 고용 관련 <strong>주요 법령·제도 변화 이력</strong>과 <strong>예정된 정책 변화</strong>를 확인하세요.
          <span className="ml-1 px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-medium">예정·계획</span>
          으로 표시된 항목은 미확정 사항으로 변경될 수 있습니다.
        </span>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((c) => {
          const isActive = filterCat === c;
          return (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isActive
                  ? c === 'all'
                    ? 'bg-gray-600 text-white border-gray-600'
                    : `border-transparent text-white`
                  : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'
              }`}
              style={isActive && c !== 'all' ? { backgroundColor: CATEGORY_CONFIG[c].color, borderColor: CATEGORY_CONFIG[c].color } : {}}
            >
              {c === 'all' ? '전체' : CATEGORY_CONFIG[c].label}
            </button>
          );
        })}
      </div>

      {/* 타임라인 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="relative">
          {/* 세로 선 */}
          <div className="absolute left-[76px] top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            {filtered.map((event, idx) => {
              const cfg = CATEGORY_CONFIG[event.category];
              const isFuture = event.year > 2025 || (event.year === 2025 && (event.month ?? 0) > 2);
              return (
                <div key={idx} className="flex gap-4">
                  {/* 날짜 */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <p className="text-xs font-bold text-gray-700">{event.year}</p>
                    {event.month && <p className="text-xs text-gray-400">{event.month}월</p>}
                  </div>

                  {/* 도트 */}
                  <div className="flex-shrink-0 relative z-10 mt-0.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: cfg.color }}
                    />
                  </div>

                  {/* 내용 */}
                  <div className={`flex-1 pb-2 rounded-xl p-3 border ${isFuture ? 'border-dashed' : ''} ${
                    event.impact === 'high' ? 'border-slate-200' : 'border-slate-100'
                  } bg-slate-50`}>
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <p className={`text-sm font-bold ${isFuture ? 'text-gray-500' : 'text-gray-800'}`}>
                        {event.title}
                      </p>
                      <div className="flex gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                        {event.impact === 'high' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100 font-medium">
                            중요
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                            미확정
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
