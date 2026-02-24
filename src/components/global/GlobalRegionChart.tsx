import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend,
} from 'recharts';
import { useState } from 'react';
import { regionData } from '../../data/globalData';
import { useApp } from '../../contexts/AppContext';

type Mode = 'disabled' | 'rate' | 'employment';

const CustomTooltip = ({ active, payload, t }: {
  active?: boolean;
  payload?: Array<{ payload: typeof regionData[0]; value: number; dataKey: string }>;
  t: (key: string) => string;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm max-w-xs">
        <p className="font-bold text-gray-800">{d.region}</p>
        <p className="text-xs text-gray-400 mb-1">{d.regionEn}</p>
        <p className="text-xs text-gray-600">{t('global.regionTooltipPop')}: {d.population.toLocaleString()}백만 명</p>
        <p className="text-xs text-blue-500">{t('global.regionTooltipDisabled')}: {d.disabled}백만 명</p>
        <p className="text-xs text-purple-500">{t('global.regionTooltipRate')}: {d.disabilityRate}%</p>
        <p className="text-xs text-emerald-500">{t('global.regionTooltipEmpRate')}: {d.employmentRate}%</p>
      </div>
    );
  }
  return null;
};

const radarData = regionData.map((r) => ({
  region: r.region.split('·')[0], // 짧게
  장애비율: r.disabilityRate,
  고용률: r.employmentRate,
}));

export default function GlobalRegionChart() {
  const { t } = useApp();
  const [mode, setMode] = useState<Mode>('disabled');

  const sorted = [...regionData].sort((a, b) => {
    if (mode === 'disabled') return b.disabled - a.disabled;
    if (mode === 'rate') return b.disabilityRate - a.disabilityRate;
    return b.employmentRate - a.employmentRate;
  });

  const MODES: { id: Mode; label: string }[] = [
    { id: 'disabled',    label: t('global.regionModeDisabled') },
    { id: 'rate',        label: t('global.regionModeRate') },
    { id: 'employment',  label: t('global.regionModeEmployment') },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-bold text-gray-800">{t('global.regionTitle')}</h2>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                mode === m.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sorted} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={
              mode === 'disabled'
                ? (v) => `${v}M`
                : (v) => `${v}%`
            }
          />
          <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey={mode === 'disabled' ? 'disabled' : mode === 'rate' ? 'disabilityRate' : 'employmentRate'}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          >
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 지역 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-2">
        {regionData.map((r) => (
          <div key={r.region} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: r.color + '15', border: `1px solid ${r.color}30` }}>
            <p className="text-xs font-semibold text-gray-700 leading-tight">{r.region.replace('·', '\n')}</p>
            <p className="text-base font-bold mt-1" style={{ color: r.color }}>{r.disabled}M</p>
            <p className="text-xs text-gray-400">{r.disabilityRate}%</p>
          </div>
        ))}
      </div>

      {/* 레이더 차트 - 장애 비율 vs 고용률 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">{t('global.regionCardCompare')}</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis dataKey="region" tick={{ fontSize: 10, fill: '#64748b' }} />
            <Radar name={t('global.regionRadarRate')} dataKey="장애비율" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            <Radar name={t('global.regionRadarEmp')} dataKey="고용률" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
