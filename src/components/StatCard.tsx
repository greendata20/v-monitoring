interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  accent?: string;
  icon: string;
}

export default function StatCard({ title, value, sub, accent = 'bg-blue-500', icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className={`${accent} text-white rounded-xl w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
