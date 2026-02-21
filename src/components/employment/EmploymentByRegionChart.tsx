import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { employmentByRegion } from '../../data/employmentData';

type SortMode = 'employed' | 'rate';

const REGION_COLORS = [
  '#3b82f6','#06b6d4','#8b5cf6','#10b981','#f59e0b',
  '#ef4444','#ec4899','#f97316','#14b8a6','#84cc16',
  '#6366f1','#a78bfa','#fb923c','#f43f5e','#94a3b8',
  '#0ea5e9','#22d3ee',
];

const avgRate =
  employmentByRegion.reduce((s, r) => s + r.employmentRate, 0) /
  employmentByRegion.length;

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: typeof employmentByRegion[0]; dataKey: string; value: number }>;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.region}</p>
        <p className="text-gray-600">취업자 수: {d.employed.toLocaleString()}명</p>
        <p className="text-blue-500 font-semibold">고용률: {d.employmentRate}%</p>
        <p className="text-xs text-gray-400 mt-1">
          {d.employmentRate >= avgRate ? '▲ 전국 평균 이상' : '▼ 전국 평균 미만'}
        </p>
      </div>
    );
  }
  return null;
};

export default function EmploymentByRegionChart() {
  const [sort, setSort] = useState<SortMode>('employed');

  const sorted = [...employmentByRegion].sort((a, b) =>
    sort === 'employed' ? b.employed - a.employed : b.employmentRate - a.employmentRate
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base font-bold text-gray-800">시도별 장애인 취업현황</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            전국 평균 고용률 <span className="font-semibold text-gray-600">{avgRate.toFixed(1)}%</span>
          </span>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            <button
              onClick={() => setSort('employed')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                sort === 'employed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              취업자 수
            </button>
            <button
              onClick={() => setSort('rate')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                sort === 'rate' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              고용률
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sorted} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="short"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            tickFormatter={
              sort === 'employed'
                ? (v) => `${(v / 10000).toFixed(0)}만`
                : (v) => `${v}%`
            }
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          {sort === 'rate' && (
            <ReferenceLine
              y={avgRate}
              stroke="#f59e0b"
              strokeDasharray="5 3"
              label={{ value: '평균', position: 'right', fontSize: 10, fill: '#f59e0b' }}
            />
          )}
          <Bar
            dataKey={sort === 'employed' ? 'employed' : 'employmentRate'}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          >
            {sorted.map((_, i) => (
              <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 지역 카드 그리드 */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
        {employmentByRegion.map((r, i) => (
          <div key={r.region} className="text-center bg-slate-50 rounded-lg px-2 py-2">
            <p className="text-xs font-semibold text-gray-700">{r.region}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: REGION_COLORS[i % REGION_COLORS.length] }}>
              {r.employmentRate}%
            </p>
            <p className="text-xs text-gray-400">{(r.employed / 10000).toFixed(1)}만</p>
          </div>
        ))}
      </div>
    </div>
  );
}
