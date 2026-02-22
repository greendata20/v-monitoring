import { useState, useMemo } from 'react';
import {
  companies, industries, regions,
  priorityColors,
  MANDATORY_RATE_PRIVATE, MANDATORY_RATE_PUBLIC,
  type Company,
} from '../../data/salesData';
import { getContact } from '../../hooks/useContactStore';
import ContactModal from './ContactModal';

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  none:       { label: '미컨택',   bg: 'bg-gray-100',   text: 'text-gray-500' },
  contacted:  { label: '컨택완료', bg: 'bg-blue-100',   text: 'text-blue-600' },
  meeting:    { label: '미팅완료', bg: 'bg-purple-100', text: 'text-purple-600' },
  contracted: { label: '계약진행', bg: 'bg-emerald-100',text: 'text-emerald-600' },
  rejected:   { label: '보류',     bg: 'bg-red-100',    text: 'text-red-500' },
};

type SortKey = 'gap' | 'employmentRate' | 'estimatedLevy' | 'totalWorkers' | 'name';
type SortDir = 'asc' | 'desc';

export default function CompanyTable() {
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('전체');
  const [filterRegion, setFilterRegion] = useState('전체');
  const [filterPriority, setFilterPriority] = useState<'전체' | 'A' | 'B' | 'C'>('전체');
  const [filterNamed, setFilterNamed] = useState(false);
  const [filterDeficit, setFilterDeficit] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('gap');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let list = [...companies];
    if (filterDeficit) list = list.filter((c) => c.gap > 0);
    if (filterNamed) list = list.filter((c) => c.isPubliclyNamed);
    if (filterIndustry !== '전체') list = list.filter((c) => c.industry === filterIndustry);
    if (filterRegion !== '전체') list = list.filter((c) => c.region.startsWith(filterRegion));
    if (filterPriority !== '전체') list = list.filter((c) => c.priority === filterPriority);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.industry.includes(q));
    }
    list.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [search, filterIndustry, filterRegion, filterPriority, filterNamed, filterDeficit, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleModalClose() {
    setSelectedCompany(null);
    setRefreshKey((k) => k + 1);
  }

  // refreshKey is read so React re-renders after contact save
  void refreshKey;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">기업별 장애인 고용 현황</h2>
          <p className="text-xs text-gray-400">
            전체 {companies.length}개사 | 부족 {companies.filter(c => c.gap > 0).length}개사 |
            명단공표 {companies.filter(c => c.isPubliclyNamed).length}개사
          </p>
        </div>
        <input
          type="text"
          placeholder="기업명 / 업종 검색..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-52"
        />
      </div>

      {/* 필터 바 */}
      <div className="flex flex-wrap gap-2 text-xs">
        {/* 업종 필터 */}
        <select
          value={filterIndustry}
          onChange={(e) => { setFilterIndustry(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option>전체</option>
          {industries.map((i) => <option key={i}>{i}</option>)}
        </select>

        {/* 지역 필터 */}
        <select
          value={filterRegion}
          onChange={(e) => { setFilterRegion(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option>전체</option>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>

        {/* 우선순위 필터 */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {(['전체', 'A', 'B', 'C'] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setFilterPriority(p); setPage(1); }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                filterPriority === p ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {p}급
            </button>
          ))}
        </div>

        {/* 토글 필터 */}
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterDeficit}
            onChange={(e) => { setFilterDeficit(e.target.checked); setPage(1); }}
            className="accent-blue-500"
          />
          <span className="text-gray-600">미달 기업만</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterNamed}
            onChange={(e) => { setFilterNamed(e.target.checked); setPage(1); }}
            className="accent-red-500"
          />
          <span className="text-gray-600">명단공표만</span>
        </label>

        <span className="ml-auto text-gray-400 self-center">총 {filtered.length}개사</span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-gray-500">
              <th className="text-left py-2 px-2">
                <button onClick={() => handleSort('name')} className="font-semibold hover:text-gray-800">
                  기업명 <SortIcon col="name" />
                </button>
              </th>
              <th className="text-left py-2 px-2 font-semibold">업종</th>
              <th className="text-left py-2 px-2 font-semibold hidden md:table-cell">지역</th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('totalWorkers')} className="font-semibold hover:text-gray-800">
                  근로자수 <SortIcon col="totalWorkers" />
                </button>
              </th>
              <th className="text-right py-2 px-2 font-semibold">의무/고용</th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('employmentRate')} className="font-semibold hover:text-gray-800">
                  고용률 <SortIcon col="employmentRate" />
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('gap')} className="font-semibold hover:text-gray-800">
                  부족 <SortIcon col="gap" />
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('estimatedLevy')} className="font-semibold hover:text-gray-800">
                  추정부담금 <SortIcon col="estimatedLevy" />
                </button>
              </th>
              <th className="text-center py-2 px-2 font-semibold">우선순위</th>
              <th className="text-center py-2 px-2 font-semibold">공표</th>
              <th className="text-center py-2 px-2 font-semibold">컨택</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => {
              const mandatoryRate = c.sector === 'public' ? MANDATORY_RATE_PUBLIC : MANDATORY_RATE_PRIVATE;
              const isBelow = c.employmentRate < mandatoryRate;
              return (
                <tr
                  key={c.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    c.isPubliclyNamed ? 'bg-red-50' : ''
                  }`}
                >
                  {/* 기업명 */}
                  <td className="py-2.5 px-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{c.name}</p>
                      {c.contact && <p className="text-gray-400 text-xs">{c.contact}</p>}
                    </div>
                  </td>
                  {/* 업종 */}
                  <td className="py-2.5 px-2 text-xs text-gray-500">{c.industryCode}</td>
                  {/* 지역 */}
                  <td className="py-2.5 px-2 text-xs text-gray-500 hidden md:table-cell">{c.region}</td>
                  {/* 근로자수 */}
                  <td className="py-2.5 px-2 text-right text-xs text-gray-600 font-mono">
                    {c.totalWorkers.toLocaleString()}
                  </td>
                  {/* 의무/고용 */}
                  <td className="py-2.5 px-2 text-right text-xs">
                    <span className="text-gray-500">{c.requiredCount}</span>
                    <span className="text-gray-300 mx-0.5">/</span>
                    <span className={c.hiredCount === 0 ? 'text-red-500 font-bold' : 'text-gray-700'}>{c.hiredCount}</span>
                  </td>
                  {/* 고용률 */}
                  <td className="py-2.5 px-2 text-right">
                    <span className={`font-bold text-sm ${
                      c.hiredCount === 0 ? 'text-red-600' :
                      isBelow ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {c.employmentRate}%
                    </span>
                  </td>
                  {/* 부족 */}
                  <td className="py-2.5 px-2 text-right">
                    {c.gap > 0
                      ? <span className="font-bold text-red-500 text-sm">-{c.gap}명</span>
                      : <span className="text-emerald-400 text-xs">달성</span>
                    }
                  </td>
                  {/* 추정부담금 */}
                  <td className="py-2.5 px-2 text-right text-xs">
                    {c.estimatedLevy > 0
                      ? <span className="text-amber-600 font-medium">{c.estimatedLevy.toLocaleString()}만원</span>
                      : <span className="text-gray-300">-</span>
                    }
                  </td>
                  {/* 우선순위 */}
                  <td className="py-2.5 px-2 text-center">
                    {c.gap > 0 ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                        style={{ backgroundColor: priorityColors[c.priority] }}
                      >
                        {c.priority}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  {/* 명단공표 */}
                  <td className="py-2.5 px-2 text-center">
                    {c.isPubliclyNamed
                      ? <span className="text-xs text-red-500 font-bold">공표</span>
                      : <span className="text-xs text-gray-200">-</span>
                    }
                  </td>
                  {/* 컨택 */}
                  <td className="py-2.5 px-2 text-center">
                    {(() => {
                      const rec = getContact(c.id);
                      if (!rec) {
                        return (
                          <button
                            onClick={() => setSelectedCompany(c)}
                            className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        );
                      }
                      const badge = STATUS_BADGE[rec.status] ?? STATUS_BADGE['none'];
                      return (
                        <button
                          onClick={() => setSelectedCompany(c)}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text} hover:opacity-80 transition-opacity`}
                        >
                          {badge.label}
                        </button>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            이전
          </button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}

      {/* 범례 */}
      <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-xs text-gray-400">
        <span>🔴 명단공표 (고용률 &lt;1.55%)</span>
        <span>A급: 부족 15명↑ or 미고용</span>
        <span>B급: 부족 6~14명</span>
        <span>C급: 부족 1~5명</span>
        <span>의무고용률: 민간 {MANDATORY_RATE_PRIVATE}%, 공공기관 {MANDATORY_RATE_PUBLIC}%</span>
      </div>

      {/* 컨택 모달 */}
      {selectedCompany && (
        <ContactModal company={selectedCompany} onClose={handleModalClose} />
      )}
    </div>
  );
}
