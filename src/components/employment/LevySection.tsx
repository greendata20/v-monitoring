import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { levyData, levyYearlyData } from '../../data/employmentData';

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

// 미고용 사업체 비율 바 차트용 데이터
const zeroHireBarData = levyData.map((d) => ({
  name: d.sector,
  미고용: d.zeroHired,
  고용중: d.totalObligated - d.zeroHired,
  color: d.color,
}));

export default function LevySection() {
  const totalLevy = levyData.reduce((s, d) => s + d.levyAmount, 0);
  const latestYear = levyYearlyData[levyYearlyData.length - 1];
  const prevYear   = levyYearlyData[levyYearlyData.length - 2];
  const levyGrowth = latestYear.private - prevYear.private;

  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 flex items-start gap-2">
        <span className="text-base flex-shrink-0">⚠️</span>
        <span>
          <strong>고용부담금</strong>은 의무고용 인원을 채우지 못한 사업체가 납부하는 부담금입니다.
          장애인을 <strong>1명도 고용하지 않은 사업체</strong>는 가산금이 부과됩니다.
          국가·지방자치단체는 고용부담금 면제 대상입니다(장애인고용촉진법 제33조).
        </span>
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
              <p className="text-xs text-gray-500 mt-0.5">장애인 미고용 사업체</p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">의무고용 대상</span>
                  <span className="text-gray-600">{d.totalObligated.toLocaleString()}개소</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">미고용 비율</span>
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
            <span className="text-xs font-bold text-gray-700">고용부담금 총액 (2022)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalLevy.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">억 원</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">민간기업 + 공공기관 합산</p>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">민간기업</span>
              <span className="font-semibold text-blue-500">{latestYear.private.toLocaleString()}억 원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">공공기관</span>
              <span className="font-semibold text-emerald-500">{latestYear.public.toLocaleString()}억 원</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-1 mt-1">
              <span className="text-gray-500">전년 대비 증가</span>
              <span className="font-semibold text-red-500">+{levyGrowth.toLocaleString()}억 원</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏛️</span>
            <span className="text-xs font-bold text-gray-700">국가·지방자치단체</span>
          </div>
          <p className="text-2xl font-bold text-gray-400">면제</p>
          <p className="text-xs text-gray-500 mt-0.5">고용부담금 해당 없음</p>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            장애인고용촉진법 제33조에 따라 국가 및 지방자치단체는 고용부담금 납부 의무 면제. 미달 시 인사혁신처·행안부 점검 대상.
          </p>
        </div>
      </div>

      {/* 미고용 사업체 현황 바 차트 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">장애인 미고용(0명) vs 고용 중 사업체 수</h2>
        <p className="text-xs text-gray-400 mb-4">의무고용 대상 사업체 기준 (2022년)</p>
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
            <Bar dataKey="고용중" name="장애인 고용 중" fill="#86efac" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="미고용" name="장애인 0명 미고용" fill="#fca5a5" radius={[0, 4, 4, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 연도별 고용부담금 추이 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">연도별 고용부담금 추이 (2017~2025)</h2>
        <p className="text-xs text-gray-400 mb-4">부담금이 매년 증가한다는 것은 의무고용 미달 기업이 계속 늘거나 부담기초액이 인상되었음을 의미합니다.</p>
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
            <Line type="monotone" dataKey="private" name="민간기업" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="public"  name="공공기관" stroke="#10b981" strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
