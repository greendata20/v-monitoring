import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { disabilityTypes, TOTAL } from '../data/disabilityData';

// 상위 7개 + 기타로 묶기
const TOP_N = 7;
const sorted = [...disabilityTypes].sort((a, b) => b.count - a.count);
const topItems = sorted.slice(0, TOP_N);
const othersCount = sorted.slice(TOP_N).reduce((s, d) => s + d.count, 0);
const pieData = [
  ...topItems,
  { id: 'others', name: '기타', count: othersCount, color: '#cbd5e1', category: '신체적' as const },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof pieData[0]; value: number }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const pct = ((d.count / TOTAL) * 100).toFixed(1);
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.name}</p>
        <p className="text-gray-600">{d.count.toLocaleString()}명</p>
        <p className="text-blue-500 font-semibold">{pct}%</p>
      </div>
    );
  }
  return null;
};

export default function DisabilityPieChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-800 mb-2">장애 유형 비율 (상위 7개)</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={110}
            innerRadius={55}
            paddingAngle={2}
          >
            {pieData.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
