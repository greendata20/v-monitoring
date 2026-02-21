import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { useState } from 'react';
import { countryEmployment, OECD_AVG_EMPLOYMENT_RATE } from '../../data/globalData';

type Filter = 'all' | 'quota' | 'noquota';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: typeof countryEmployment[0]; value: number }>;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.country}</p>
        <p className="text-xs text-gray-400 mb-1">{d.countryEn} · {d.region}</p>
        <p className="font-semibold text-blue-500">{d.employmentRate}%</p>
        <p className={`text-xs mt-1 font-medium ${d.hasQuota ? 'text-amber-500' : 'text-emerald-500'}`}>
          {d.hasQuota ? '⚖️ 의무고용제 시행국' : '🛡️ 차별금지법 방식'}
        </p>
        {d.country === '한국' && (
          <p className="text-xs text-red-400 mt-0.5">← 현재 위치</p>
        )}
      </div>
    );
  }
  return null;
};

export default function GlobalEmploymentChart() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = countryEmployment
    .filter((c) => {
      if (filter === 'quota') return c.hasQuota;
      if (filter === 'noquota') return !c.hasQuota;
      return true;
    })
    .sort((a, b) => b.employmentRate - a.employmentRate);

  const aboveAvg = filtered.filter((c) => c.employmentRate >= OECD_AVG_EMPLOYMENT_RATE).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div>
          <h2 className="text-base font-bold text-gray-800">국가별 장애인 고용률 비교</h2>
          <p className="text-xs text-gray-400">OECD + 주요국 기준, 최근 연도 추계</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-gray-500">의무고용제 시행</span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0 ml-1" />
            <span className="text-gray-500">차별금지법 방식</span>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            {([['all', '전체'], ['quota', '의무고용제'], ['noquota', '차별금지']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  filter === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs mb-3">
        <span className="text-gray-500">
          OECD 평균 <strong className="text-orange-500">{OECD_AVG_EMPLOYMENT_RATE}%</strong> 기준선
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-emerald-500">{aboveAvg}개국</span>
        <span className="text-gray-500">평균 이상 /</span>
        <span className="text-red-400">{filtered.length - aboveAvg}개국</span>
        <span className="text-gray-500">평균 미만</span>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(320, filtered.length * 28)}>
        <BarChart
          data={filtered}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            domain={[0, 80]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="country"
            tick={({ x, y, payload }) => {
              const d = filtered.find((c) => c.country === payload.value);
              const isKorea = payload.value === '한국';
              return (
                <text x={x} y={y} dy={4} textAnchor="end" fontSize={isKorea ? 13 : 12}
                  fontWeight={isKorea ? 'bold' : 'normal'}
                  fill={isKorea ? '#ef4444' : '#64748b'}>
                  {payload.value}{d?.hasQuota ? '' : ''}
                </text>
              );
            }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <ReferenceLine
            x={OECD_AVG_EMPLOYMENT_RATE}
            stroke="#f59e0b"
            strokeDasharray="5 3"
            label={{ value: `OECD 평균 ${OECD_AVG_EMPLOYMENT_RATE}%`, position: 'top', fontSize: 10, fill: '#f59e0b' }}
          />
          <Bar dataKey="employmentRate" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {filtered.map((entry, i) => {
              const isKorea = entry.country === '한국';
              const baseColor = entry.hasQuota ? '#f59e0b' : '#10b981';
              return <Cell key={i} fill={isKorea ? '#ef4444' : baseColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3 text-center">
        🔴 한국 &nbsp;|&nbsp; 🟡 의무고용제 시행국 &nbsp;|&nbsp; 🟢 차별금지법 방식 국가
      </p>
    </div>
  );
}
