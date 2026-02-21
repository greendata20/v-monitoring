import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { globalDisabilityTypes, GLOBAL_TOTAL_DISABLED } from '../../data/globalData';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: typeof globalDisabilityTypes[0]; value: number }>;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm max-w-xs">
        <p className="font-bold text-gray-800">{d.name}</p>
        <p className="text-xs text-gray-500 mb-1">{d.desc}</p>
        <p className="text-blue-500 font-semibold">{d.count}백만 명</p>
        <p className="text-xs text-gray-400">{d.pct}%</p>
      </div>
    );
  }
  return null;
};

export default function GlobalTypeChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-800 mb-1">전세계 장애 유형별 분포</h2>
      <p className="text-xs text-gray-400 mb-3">WHO GBD 기준 YLD 비중 적용 추계 (총 {GLOBAL_TOTAL_DISABLED}억 명)</p>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={globalDisabilityTypes}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="44%"
            outerRadius={95}
            innerRadius={48}
            paddingAngle={2}
          >
            {globalDisabilityTypes.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 상세 리스트 */}
      <div className="mt-3 space-y-1.5">
        {[...globalDisabilityTypes].sort((a, b) => b.count - a.count).map((t) => (
          <div key={t.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
            <span className="text-gray-700 font-medium w-24 flex-shrink-0">{t.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
            </div>
            <span className="text-gray-500 w-12 text-right">{t.count}M</span>
            <span className="font-semibold w-10 text-right" style={{ color: t.color }}>{t.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
