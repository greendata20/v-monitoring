import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { employmentByType } from '../../data/employmentData';
import { useApp } from '../../contexts/AppContext';

type ViewMode = 'count' | 'rate';

const CustomTooltip = ({
  active, payload, t,
}: {
  active?: boolean;
  payload?: Array<{ payload: typeof employmentByType[0]; value: number; dataKey: string }>;
  t: (key: string) => string;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.name}</p>
        <p className="text-gray-600">{t('employment.byTypeTooltipCount')}: {d.employed.toLocaleString()}명</p>
        <p className="text-blue-500 font-semibold">{t('employment.byTypeTooltipRate')}: {d.employmentRate}%</p>
        <p className={`text-xs mt-1 ${d.category === '신체적' ? 'text-blue-400' : 'text-purple-400'}`}>
          {d.category} {t('employment.byTypeDisability')}
        </p>
      </div>
    );
  }
  return null;
};

export default function EmploymentByTypeChart() {
  const { t } = useApp();
  const [mode, setMode] = useState<ViewMode>('count');

  const sorted = [...employmentByType].sort((a, b) =>
    mode === 'count' ? b.employed - a.employed : b.employmentRate - a.employmentRate
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">{t('employment.byTypeTitle')}</h2>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
          <button
            onClick={() => setMode('count')}
            className={`px-3 py-1.5 font-medium transition-colors ${
              mode === 'count' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {t('employment.byTypeCount')}
          </button>
          <button
            onClick={() => setMode('rate')}
            className={`px-3 py-1.5 font-medium transition-colors ${
              mode === 'rate' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {t('employment.byTypeRate')}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={440}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 70, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tickFormatter={mode === 'count'
              ? (v) => `${(v / 10000).toFixed(0)}만`
              : (v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={76}
          />
          <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey={mode === 'count' ? 'employed' : 'employmentRate'}
            radius={[0, 6, 6, 0]}
            maxBarSize={20}
          >
            {sorted.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
            <LabelList
              dataKey={mode === 'count' ? 'employed' : 'employmentRate'}
              position="right"
              formatter={(v: unknown) =>
                mode === 'count'
                  ? `${(Number(v) / 10000).toFixed(1)}만`
                  : `${Number(v)}%`
              }
              style={{ fontSize: 11, fill: '#94a3b8' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
