import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { levyData, levyYearlyData } from '../../data/employmentData';
import { useApp } from '../../contexts/AppContext';

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800 mb-1">{label}년</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="text-xs">
            {p.name}: {p.value.toLocaleString()}억 원
          </p>
        ))}
        <p className="text-gray-400 text-xs mt-1 border-t border-gray-100 pt-1">
          합계: {payload.reduce((s, p) => s + p.value, 0).toLocaleString()}억 원
        </p>
      </div>
    );
  }
  return null;
};

export default function LevySection() {
  const { t } = useApp();

  // 미고용 사업체 비율 바 차트용 데이터
  const zeroHireBarData = levyData.map((d) => ({
    name: d.sector,
    미고용: d.zeroHired,
    고용중: d.totalObligated - d.zeroHired,
    color: d.color,
  }));

  const totalLevy = levyData.reduce((s, d) => s + d.levyAmount, 0);
  const latestYear = levyYearlyData[levyYearlyData.length - 1];
  const prevYear   = levyYearlyData[levyYearlyData.length - 2];
  const levyGrowth = latestYear.private - prevYear.private;

  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 flex items-start gap-2">
        <span className="text-base flex-shrink-0">⚠️</span>
        <span>{t('employment.levyBanner')}</span>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {levyData.map((d) => {
          const zeroRate = ((d.zeroHired / d.totalObligated) * 100).toFixed(1);
          return (
            <div key={d.sector} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-bold text-gray-700">{d.sector}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {d.zeroHired.toLocaleString()}
                <span className="text-sm font-normal text-gray-400 ml-1">개소</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t('employment.levyZeroHire')}</p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('employment.levyObligated')}</span>
                  <span className="text-gray-600">{d.totalObligated.toLocaleString()}개소</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('employment.levyZeroRate')}</span>
                  <span className="font-semibold text-red-500">{zeroRate}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${zeroRate}%` }} />
                </div>
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <span className="text-xs font-bold text-gray-700">{t('employment.levyTotalTitle')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalLevy.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">억 원</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{t('employment.levyMixed')}</p>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('employment.levyTrendPrivate')}</span>
              <span className="font-semibold text-blue-500">{latestYear.private.toLocaleString()}억 원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('employment.levyTrendPublic')}</span>
              <span className="font-semibold text-emerald-500">{latestYear.public.toLocaleString()}억 원</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-1 mt-1">
              <span className="text-gray-500">{t('employment.levyTrendGrowth')}</span>
              <span className="font-semibold text-red-500">+{levyGrowth.toLocaleString()}억 원</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏛️</span>
            <span className="text-xs font-bold text-gray-700">{t('employment.levyGovTitle')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-400">{t('employment.levyGovExempt')}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('employment.levyGovExemptSub')}</p>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            {t('employment.levyGovNote')}
          </p>
        </div>
      </div>

      {/* 미고용 사업체 현황 바 차트 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">{t('employment.levyChartTitle')}</h2>
        <p className="text-xs text-gray-400 mb-4">{t('employment.levyChartSub')}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={zeroHireBarData} layout="vertical" margin={{ top: 0, right: 80, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v.toLocaleString()}개`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Bar dataKey="고용중" name={t('employment.levyChartHiring')} fill="#86efac" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="미고용" name={t('employment.levyChartZero')} fill="#fca5a5" radius={[0, 4, 4, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 연도별 고용부담금 추이 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">{t('employment.levyTrendTitle')}</h2>
        <p className="text-xs text-gray-400 mb-4">{t('employment.levyTrendSub')}</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={levyYearlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${v.toLocaleString()}억`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Line type="monotone" dataKey="private" name={t('employment.levyTrendPrivate')} stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="public"  name={t('employment.levyTrendPublic')} stroke="#10b981" strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
