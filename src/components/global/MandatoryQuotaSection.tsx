import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { quotaCountries, nonQuotaCountries } from '../../data/globalData';
import { useApp } from '../../contexts/AppContext';

const SYSTEM_BADGE: Record<string, string> = {
  '부담금': 'bg-amber-50 text-amber-700',
  '의무':   'bg-red-50 text-red-600',
  '정부만': 'bg-blue-50 text-blue-600',
};

const CustomTooltip = ({ active, payload, t }: {
  active?: boolean;
  payload?: Array<{ payload: typeof quotaCountries[0]; value: number }>;
  t: (key: string) => string;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm max-w-xs">
        <p className="font-bold text-gray-800">{d.country} ({d.countryEn})</p>
        <p className="text-blue-500 font-semibold">{t('global.quotaTooltipRate')}: {d.quotaRate}</p>
        <p className="text-xs text-gray-600 mt-1">{d.note}</p>
        <p className="text-xs text-gray-400 mt-0.5">{t('global.quotaTooltipYear')}: {d.lawYear}년 · {t('global.quotaColMin')} {d.companySizeMin || t('global.quotaTooltipNoLimit')}인 이상</p>
      </div>
    );
  }
  return null;
};

export default function MandatoryQuotaSection() {
  const { t } = useApp();
  const sorted = [...quotaCountries].sort((a, b) => b.quotaRateNum - a.quotaRateNum);

  return (
    <div className="space-y-6">
      {/* 의무고용률 막대 차트 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">{t('global.quotaChartTitle')}</h2>
        <p className="text-xs text-gray-400 mb-4">
          {t('global.quotaChartLegend')}
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sorted} margin={{ top: 0, right: 60, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="country"
              tick={{ fontSize: 12, fill: '#64748b' }}
              angle={-30}
              textAnchor="end"
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 8]}
            />
            <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="quotaRateNum" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {sorted.map((entry, i) => {
                const color =
                  entry.country === '한국' ? '#ef4444' :
                  entry.system === '부담금' ? '#f59e0b' :
                  entry.system === '의무'   ? '#ef4444' : '#3b82f6';
                return <Cell key={i} fill={color} />;
              })}
              <LabelList
                dataKey="quotaRate"
                position="top"
                style={{ fontSize: 10, fill: '#64748b' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">{t('global.quotaTableTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColCountry')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColRegion')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColRate')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColMin')}</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColSystem')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">{t('global.quotaColYear')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">{t('global.quotaColNote')}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.country}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${d.country === '한국' ? 'bg-red-50' : ''}`}>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor:
                        d.country === '한국' ? '#ef4444' :
                        d.system === '부담금' ? '#f59e0b' :
                        d.system === '의무' ? '#ef4444' : '#3b82f6'
                      }} />
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{d.country}</p>
                        <p className="text-gray-400 text-xs">{d.countryEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">{d.region}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-bold text-sm" style={{
                      color: d.country === '한국' ? '#ef4444' :
                        d.system === '부담금' ? '#f59e0b' :
                        d.system === '의무' ? '#ef4444' : '#3b82f6'
                    }}>
                      {d.quotaRate}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs text-gray-600">
                    {d.companySizeMin ? `${d.companySizeMin}${t('global.quotaMinSuffix')}` : t('global.quotaNoMin')}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SYSTEM_BADGE[d.system]}`}>
                      {d.system}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs text-gray-500">{d.lawYear}년</td>
                  <td className="py-2.5 px-3 text-xs text-gray-400 hidden lg:table-cell">{d.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 의무고용제 미시행국 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-1">{t('global.nonQuotaTitle')}</h2>
        <p className="text-xs text-gray-400 mb-4">
          {t('global.nonQuotaSub')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nonQuotaCountries.map((c) => (
            <div key={c.country} className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-800 text-sm">{c.country}</p>
                <span className="text-xs text-gray-400">{c.region}</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">{c.law} ({c.lawYear})</p>
              <p className="text-xs text-gray-500 mt-1">{c.approach}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
