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
type SubTab = 'overview' | 'quota' | 'levy' | 'support' | 'timeline';
const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
  { id: 'overview',  label: '전체 요약',    icon: '📌' },
  { id: 'quota',     label: '의무고용률',   icon: '📊' },
  { id: 'levy',      label: '부담금 제도',  icon: '💸' },
  { id: 'support',   label: '지원 프로그램', icon: '🤝' },
  { id: 'timeline',  label: '정책 타임라인', icon: '🗓️' },
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
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">민간기업</p>
                  <p className="text-lg font-bold text-blue-600">{q.private}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">공공기관</p>
                  <p className="text-lg font-bold text-emerald-600">{q.public}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">국가·지자체</p>
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
