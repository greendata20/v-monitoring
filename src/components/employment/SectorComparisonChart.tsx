import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { sectorData, sectorYearlyTrend } from '../../data/employmentData';

// 집계 고용률 = 장애인 고용자 수 / 전체 근로자 수 × 100
const calcRate = (s: typeof sectorData[0]) =>
  parseFloat(((s.employed / s.totalWorkers) * 100).toFixed(2));

const CustomTrendTooltip = ({
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
            {p.name}: {p.value.toLocaleString()}명
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SectorComparisonChart() {
  return (
    <div className="space-y-6">
      {/* 사업체별 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sectorData.map((s) => {
          const rate = calcRate(s);
          return (
            <div key={s.sector} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm font-bold text-gray-800">
                  {s.sector.replace('\n', ' ')}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {s.employed.toLocaleString()}
                <span className="text-sm font-normal text-gray-400 ml-1">명</span>
              </p>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">전체 근로자</span>
                  <span className="text-gray-600">{s.totalWorkers.toLocaleString()}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">집계 장애인 고용 비율</span>
                  <span className="font-semibold" style={{ color: s.color }}>{rate}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(rate * 20, 100)}%`, backgroundColor: s.color }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  ※ 전체 근로자 대비 비율 (개별 사업장 의무고용률과 무관)
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 연도별 추이 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">사업체 유형별 고용 장애인 수 추이 (2017~2025)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={sectorYearlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTrendTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Line type="monotone" dataKey="private"    name="민간기업"        stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="government" name="국가·지방자치단체" stroke="#8b5cf6" strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="public"     name="공공기관"        stroke="#10b981" strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
