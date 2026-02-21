import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { disabilityTypes } from '../data/disabilityData';

const formatCount = (v: number) => `${(v / 10000).toFixed(1)}만`;

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof disabilityTypes[0]; value: number }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.name}</p>
        <p className="text-gray-600">{payload[0].value.toLocaleString()}명</p>
        <p className={`text-xs mt-1 ${d.category === '신체적' ? 'text-blue-500' : 'text-purple-500'}`}>
          {d.category} 장애
        </p>
      </div>
    );
  }
  return null;
};

export default function DisabilityBarChart() {
  const sorted = [...disabilityTypes].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-800 mb-4">장애 유형별 등록 인원</h2>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tickFormatter={formatCount}
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
            width={72}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {sorted.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              formatter={(v: unknown) => `${(Number(v) / 10000).toFixed(1)}만`}
              style={{ fontSize: 11, fill: '#94a3b8' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
