export interface ContactRecord {
  companyId: number;
  contactName: string;
  department: string;
  email: string;
  phone: string;
  status: 'none' | 'contacted' | 'meeting' | 'contracted' | 'rejected';
  memo: string;
  updatedAt: string;
}

const STORAGE_KEY = 'vdream_contacts';

function readAll(): Record<number, ContactRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<number, ContactRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function getContact(companyId: number): ContactRecord | null {
  const all = readAll();
  return all[companyId] ?? null;
}

export function saveContact(record: Omit<ContactRecord, 'updatedAt'>): void {
  const all = readAll();
  all[record.companyId] = { ...record, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export function deleteContact(companyId: number): void {
  const all = readAll();
  delete all[companyId];
  writeAll(all);
}

export function getAllContacts(): ContactRecord[] {
  return Object.values(readAll());
}
