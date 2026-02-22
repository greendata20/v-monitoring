import { useState, useEffect } from 'react';
import type { Company } from '../../data/salesData';
import {
  getContact,
  saveContact,
  deleteContact,
  type ContactRecord,
} from '../../hooks/useContactStore';

const STATUS_OPTIONS: { value: ContactRecord['status']; label: string; color: string }[] = [
  { value: 'none',       label: '미컨택',   color: '#6b7280' },
  { value: 'contacted',  label: '컨택완료', color: '#3b82f6' },
  { value: 'meeting',    label: '미팅완료', color: '#8b5cf6' },
  { value: 'contracted', label: '계약진행', color: '#10b981' },
  { value: 'rejected',   label: '보류',     color: '#ef4444' },
];

interface Props {
  company: Company;
  onClose: () => void;
}

export default function ContactModal({ company, onClose }: Props) {
  const existing = getContact(company.id);

  const [contactName, setContactName] = useState(existing?.contactName ?? '');
  const [department, setDepartment] = useState(existing?.department ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [status, setStatus] = useState<ContactRecord['status']>(existing?.status ?? 'none');
  const [memo, setMemo] = useState(existing?.memo ?? '');

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSave() {
    saveContact({ companyId: company.id, contactName, department, email, phone, status, memo });
    onClose();
  }

  function handleDelete() {
    deleteContact(company.id);
    onClose();
  }

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">{company.name}</h2>
            <p className="text-xs text-gray-400">{company.industry} · {company.region}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-3">
          {/* 담당자명 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">담당자명</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="홍길동"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 부서 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">부서</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="인사팀"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 이메일 / 연락처 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hr@company.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* 컨택 상태 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">컨택 상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContactRecord['status'])}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ color: statusInfo.color }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} style={{ color: s.color }}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="컨택 내용, 다음 액션 등 자유 입력"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>
        </div>

        {/* 마지막 수정일 */}
        {existing?.updatedAt && (
          <p className="text-xs text-gray-400">
            마지막 수정: {new Date(existing.updatedAt).toLocaleString('ko-KR')}
          </p>
        )}

        {/* 버튼 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            저장
          </button>
          {existing && (
            <button
              onClick={handleDelete}
              className="px-4 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium py-2 rounded-lg transition-colors"
            >
              삭제
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
