import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { yearlyTrend } from '../data/disabilityData';

const formatY = (v: number) => `${(v / 10000).toFixed(0)}만`;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
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

export default function YearlyTrendChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-800 mb-4">연도별 등록장애인 추이 (2016~2025)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={yearlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
          <Line
            type="monotone" dataKey="total" name="전체"
            stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }}
          />
          <Line
            type="monotone" dataKey="physical" name="신체적 장애"
            stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3"
          />
          <Line
            type="monotone" dataKey="mental" name="정신적 장애"
            stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
