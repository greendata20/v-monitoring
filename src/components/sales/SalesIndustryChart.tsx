import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { companies } from '../../data/salesData';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { industry: string; total: number; gap: number; aCount: number; levy: number }; value: number }>;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{d.industry}</p>
        <p className="text-xs text-gray-500 mb-1">총 {d.total}개사 중 부족 기업</p>
        <p className="text-blue-500 font-semibold">부족 인원 합계: <span className="text-red-500">{d.gap.toLocaleString()}명</span></p>
        <p className="text-xs text-amber-600 mt-1">추정 부담금: 연 {(d.levy / 10000).toFixed(1)}억원</p>
        <p className="text-xs text-red-400">A급 기업: {d.aCount}개사</p>
      </div>
    );
  }
  return null;
};

export default function SalesIndustryChart() {
  const deficitCompanies = companies.filter((c) => c.gap > 0);

  const byIndustry = deficitCompanies.reduce<
    Record<string, { industry: string; total: number; gap: number; aCount: number; levy: number }>
  >((acc, c) => {
    if (!acc[c.industry]) {
      acc[c.industry] = { industry: c.industry, total: 0, gap: 0, aCount: 0, levy: 0 };
    }
    acc[c.industry].total += 1;
    acc[c.industry].gap += c.gap;
    acc[c.industry].aCount += c.priority === 'A' ? 1 : 0;
    acc[c.industry].levy += c.estimatedLevy;
    return acc;
  }, {});

  const data = Object.values(byIndustry).sort((a, b) => b.gap - a.gap);

  const COLORS = [
    '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981',
    '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#6366f1',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-800 mb-1">업종별 장애인 고용 부족 현황</h2>
      <p className="text-xs text-gray-400 mb-4">의무고용 미달 기업 기준, 막대는 부족 인원 합계</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 50, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="industry"
            tick={{ fontSize: 11, fill: '#64748b' }}
            angle={-30}
            textAnchor="end"
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => `${v}명`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="gap" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((_entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList dataKey="gap" position="top" style={{ fontSize: 10, fill: '#64748b' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
