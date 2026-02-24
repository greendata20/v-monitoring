import { useState, useMemo } from 'react';
import {
  companies, industries, regions,
  priorityColors,
  MANDATORY_RATE_PRIVATE, MANDATORY_RATE_PUBLIC,
  type Company,
} from '../../data/salesData';
import { getContact } from '../../hooks/useContactStore';
import ContactModal from './ContactModal';
import { useApp } from '../../contexts/AppContext';
import type { ManualCompany, ManualCompanyInput } from '../../hooks/useManualCompanies';

type SortKey = 'gap' | 'employmentRate' | 'estimatedLevy' | 'totalWorkers' | 'name';
type SortDir = 'asc' | 'desc';

// 자동계산 미리보기 (useManualCompanies와 동일 로직)
function calcPreviewLevy(hired: number, required: number): number {
  if (hired === 0) return 2_096_270;
  const r = hired / required;
  if (r < 0.25) return 1_761_200;
  if (r < 0.50) return 1_509_600;
  if (r < 0.75) return 1_333_480;
  return 1_258_000;
}

interface Props {
  manualCompanies: ManualCompany[];
  onAdd: (input: ManualCompanyInput) => void;
  onRemove: (id: number) => void;
}

export default function CompanyTable({ manualCompanies, onAdd, onRemove }: Props) {
  const { t } = useApp();

  const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
    none:       { label: t('sales.contactNone'),       bg: 'bg-gray-100',    text: 'text-gray-500' },
    contacted:  { label: t('sales.contactContacted'),  bg: 'bg-blue-100',    text: 'text-blue-600' },
    meeting:    { label: t('sales.contactMeeting'),    bg: 'bg-purple-100',  text: 'text-purple-600' },
    contracted: { label: t('sales.contactContracted'), bg: 'bg-emerald-100', text: 'text-emerald-600' },
    rejected:   { label: t('sales.contactRejected'),   bg: 'bg-red-100',     text: 'text-red-500' },
  };

  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('전체');
  const [filterRegion, setFilterRegion] = useState('전체');
  const [filterPriority, setFilterPriority] = useState<'전체' | 'A' | 'B' | 'C'>('전체');
  const [filterNamed, setFilterNamed] = useState(false);
  const [filterDeficit, setFilterDeficit] = useState(true);
  const [filterManual, setFilterManual] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('gap');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 기업 추가 폼 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formRegion, setFormRegion] = useState('서울');
  const [formSector, setFormSector] = useState<'private' | 'public'>('private');
  const [formWorkers, setFormWorkers] = useState(50);
  const [formHired, setFormHired] = useState(0);
  const [formContact, setFormContact] = useState('');
  const [formPriority, setFormPriority] = useState<'' | 'A' | 'B' | 'C'>('');

  const allCompanies = useMemo(() => [...companies, ...manualCompanies], [manualCompanies]);

  // 자동계산 미리보기
  const preview = useMemo(() => {
    if (formWorkers <= 0) return null;
    const quota = formSector === 'public' ? 0.038 : 0.031;
    const req = Math.ceil(formWorkers * quota);
    const rate = parseFloat(((formHired / formWorkers) * 100).toFixed(2));
    const gap = Math.max(0, req - formHired);
    let levy = 0;
    if (gap > 0) {
      levy = Math.round((gap * calcPreviewLevy(formHired, req) * 12) / 10_000);
    }
    let auto: 'A' | 'B' | 'C';
    if (gap >= 15 || formHired === 0) auto = 'A';
    else if (gap >= 6) auto = 'B';
    else auto = 'C';
    return { req, rate, gap, levy, auto };
  }, [formWorkers, formHired, formSector]);

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
    let list: (Company | ManualCompany)[] = [...companies, ...manualCompanies];
    if (filterManual) list = list.filter((c) => (c as ManualCompany).isManual === true);
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
  }, [search, filterIndustry, filterRegion, filterPriority, filterNamed, filterDeficit, filterManual, sortKey, sortDir, manualCompanies]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleModalClose() {
    setSelectedCompany(null);
    setRefreshKey((k) => k + 1);
  }

  void refreshKey;

  function handleAdd() {
    if (!formName.trim() || formWorkers <= 0) return;
    onAdd({
      name: formName.trim(),
      industry: formIndustry.trim() || '기타',
      region: formRegion,
      sector: formSector,
      totalWorkers: formWorkers,
      hiredCount: formHired,
      contact: formContact.trim() || undefined,
      priorityOverride: formPriority || undefined,
    });
    setFormName('');
    setFormIndustry('');
    setFormRegion('서울');
    setFormSector('private');
    setFormWorkers(50);
    setFormHired(0);
    setFormContact('');
    setFormPriority('');
    setShowAddForm(false);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">{t('sales.tableTitle')}</h2>
          <p className="text-xs text-gray-400">
            {t('sales.tableSub', {
              total: allCompanies.length,
              deficit: allCompanies.filter(c => c.gap > 0).length,
              named: allCompanies.filter(c => c.isPubliclyNamed).length,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('sales.searchPlaceholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-48"
          />
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors whitespace-nowrap"
          >
            {t('sales.addCompanyBtn')}
          </button>
        </div>
      </div>

      {/* 기업 추가 폼 (컬랩서블) */}
      {showAddForm && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-emerald-800">{t('sales.addCompanyTitle')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 기업명 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyNameLabel')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="예: 홍길동(주)"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            {/* 업종 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyIndustryLabel')}
              </label>
              <input
                type="text"
                list="industry-list"
                value={formIndustry}
                onChange={(e) => setFormIndustry(e.target.value)}
                placeholder="예: 제조업"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <datalist id="industry-list">
                {industries.map((i) => <option key={i} value={i} />)}
              </datalist>
            </div>

            {/* 지역 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyRegionLabel')}
              </label>
              <select
                value={formRegion}
                onChange={(e) => setFormRegion(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* 부문 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanySectorLabel')}
              </label>
              <select
                value={formSector}
                onChange={(e) => setFormSector(e.target.value as 'private' | 'public')}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="private">{t('sales.addCompanySectorPrivate')}</option>
                <option value="public">{t('sales.addCompanySectorPublic')}</option>
              </select>
            </div>

            {/* 담당 부서 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyContactLabel')}
              </label>
              <input
                type="text"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="예: HR팀, 인사부"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            {/* 근로자수 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyWorkersLabel')} <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={50}
                value={formWorkers}
                onChange={(e) => setFormWorkers(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            {/* 장애인 근로자수 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyHiredLabel')} <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={formHired}
                onChange={(e) => setFormHired(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            {/* 우선순위 override */}
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                {t('sales.addCompanyPriorityLabel')}
                {preview && (
                  <span className="ml-1 text-gray-400">(자동: {preview.auto})</span>
                )}
              </label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as '' | 'A' | 'B' | 'C')}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="">자동</option>
                <option value="A">A급</option>
                <option value="B">B급</option>
                <option value="C">C급</option>
              </select>
            </div>
          </div>

          {/* 자동계산 미리보기 */}
          {preview && (
            <div className="bg-white rounded-lg border border-emerald-100 px-4 py-3">
              <p className="text-xs font-semibold text-emerald-700 mb-2">{t('sales.addCompanyPreviewTitle')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-400">의무고용인원</p>
                  <p className="font-bold text-gray-800">{preview.req}명</p>
                </div>
                <div>
                  <p className="text-gray-400">고용률</p>
                  <p className={`font-bold ${preview.rate < 1.55 ? 'text-red-500' : preview.rate < (formSector === 'public' ? 3.8 : 3.1) ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {preview.rate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">부족인원</p>
                  <p className={`font-bold ${preview.gap > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {preview.gap > 0 ? `-${preview.gap}명` : '달성'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">추정부담금</p>
                  <p className="font-bold text-amber-600">
                    {preview.levy > 0 ? `${preview.levy.toLocaleString()}만원` : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {t('sales.addCompanyCancel')}
            </button>
            <button
              onClick={handleAdd}
              disabled={!formName.trim() || formWorkers <= 0}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('sales.addCompanySave')}
            </button>
          </div>
        </div>
      )}

      {/* 필터 바 */}
      <div className="flex flex-wrap gap-2 text-xs">
        {/* 업종 필터 */}
        <select
          value={filterIndustry}
          onChange={(e) => { setFilterIndustry(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="전체">{t('policy.supportFilterAll')}</option>
          {industries.map((i) => <option key={i}>{i}</option>)}
        </select>

        {/* 지역 필터 */}
        <select
          value={filterRegion}
          onChange={(e) => { setFilterRegion(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="전체">{t('policy.supportFilterAll')}</option>
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
          <span className="text-gray-600">{t('sales.filterDeficit')}</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterNamed}
            onChange={(e) => { setFilterNamed(e.target.checked); setPage(1); }}
            className="accent-red-500"
          />
          <span className="text-gray-600">{t('sales.filterNamed')}</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterManual}
            onChange={(e) => { setFilterManual(e.target.checked); setPage(1); }}
            className="accent-emerald-500"
          />
          <span className="text-emerald-700 font-medium">{t('sales.filterManual')}</span>
        </label>

        <span className="ml-auto text-gray-400 self-center">{t('sales.totalCount', { n: filtered.length })}</span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-gray-500">
              <th className="text-left py-2 px-2">
                <button onClick={() => handleSort('name')} className="font-semibold hover:text-gray-800">
                  {t('sales.colName')} <SortIcon col="name" />
                </button>
              </th>
              <th className="text-left py-2 px-2 font-semibold">{t('sales.colIndustry')}</th>
              <th className="text-left py-2 px-2 font-semibold hidden md:table-cell">{t('sales.colRegion')}</th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('totalWorkers')} className="font-semibold hover:text-gray-800">
                  {t('sales.colWorkers')} <SortIcon col="totalWorkers" />
                </button>
              </th>
              <th className="text-right py-2 px-2 font-semibold">{t('sales.colMandatoryHired')}</th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('employmentRate')} className="font-semibold hover:text-gray-800">
                  {t('sales.colEmpRate')} <SortIcon col="employmentRate" />
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('gap')} className="font-semibold hover:text-gray-800">
                  {t('sales.colShortfall')} <SortIcon col="gap" />
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => handleSort('estimatedLevy')} className="font-semibold hover:text-gray-800">
                  {t('sales.colLevy')} <SortIcon col="estimatedLevy" />
                </button>
              </th>
              <th className="text-center py-2 px-2 font-semibold">{t('sales.colPriority')}</th>
              <th className="text-center py-2 px-2 font-semibold">{t('sales.colNamed')}</th>
              <th className="text-center py-2 px-2 font-semibold">{t('sales.colContact')}</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => {
              const mandatoryRate = c.sector === 'public' ? MANDATORY_RATE_PUBLIC : MANDATORY_RATE_PRIVATE;
              const isBelow = c.employmentRate < mandatoryRate;
              const isManual = (c as ManualCompany).isManual === true;
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
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-800 text-xs">{c.name}</p>
                        {isManual && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium flex-shrink-0">
                            {t('sales.manualBadge')}
                          </span>
                        )}
                      </div>
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
                      : <span className="text-emerald-400 text-xs">{t('sales.achieved')}</span>
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
                      ? <span className="text-xs text-red-500 font-bold">{t('sales.namedBadge')}</span>
                      : <span className="text-xs text-gray-200">-</span>
                    }
                  </td>
                  {/* 컨택 + 삭제 */}
                  <td className="py-2.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
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
                      {isManual && (
                        <button
                          onClick={() => onRemove(c.id)}
                          title={t('sales.deleteManual')}
                          className="text-gray-300 hover:text-red-400 transition-colors leading-none"
                        >
                          🗑
                        </button>
                      )}
                    </div>
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
            {t('sales.prevPage')}
          </button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            {t('sales.nextPage')}
          </button>
        </div>
      )}

      {/* 범례 */}
      <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-xs text-gray-400">
        <span>{t('sales.legendNamed')}</span>
        <span>{t('sales.legendA')}</span>
        <span>{t('sales.legendB')}</span>
        <span>{t('sales.legendC')}</span>
        <span>{t('sales.legendMandatoryRate', { private: MANDATORY_RATE_PRIVATE, public: MANDATORY_RATE_PUBLIC })}</span>
        <span>{t('sales.legendLevy')}</span>
      </div>

      {/* 컨택 모달 */}
      {selectedCompany && (
        <ContactModal company={selectedCompany} onClose={handleModalClose} />
      )}
    </div>
  );
}
