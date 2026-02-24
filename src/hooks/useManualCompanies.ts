import { useState, useCallback } from 'react';
import type { Company } from '../data/salesData';

export interface ManualCompany extends Company {
  isManual: true;
}

export interface ManualCompanyInput {
  name: string;
  industry: string;
  region: string;
  sector: 'private' | 'public';
  totalWorkers: number;
  hiredCount: number;
  contact?: string;
  priorityOverride?: 'A' | 'B' | 'C';
}

const STORAGE_KEY = 'vdream_manual_companies';

// 2025년 부담기초액 (salesData.ts와 동일)
const LEVY_MONTHLY_75   = 1_258_000;
const LEVY_MONTHLY_50   = 1_333_480;
const LEVY_MONTHLY_25   = 1_509_600;
const LEVY_MONTHLY_LOW  = 1_761_200;
const LEVY_MONTHLY_ZERO = 2_096_270;

function levyMonthlyRate(hiredCount: number, requiredCount: number): number {
  if (hiredCount === 0) return LEVY_MONTHLY_ZERO;
  const ratio = hiredCount / requiredCount;
  if (ratio < 0.25) return LEVY_MONTHLY_LOW;
  if (ratio < 0.50) return LEVY_MONTHLY_25;
  if (ratio < 0.75) return LEVY_MONTHLY_50;
  return LEVY_MONTHLY_75;
}

function calcManualCompany(id: number, input: ManualCompanyInput): ManualCompany {
  const quota = input.sector === 'public' ? 0.038 : 0.031;
  const requiredCount = Math.ceil(input.totalWorkers * quota);
  const employmentRate = parseFloat(((input.hiredCount / input.totalWorkers) * 100).toFixed(2));
  const gap = Math.max(0, requiredCount - input.hiredCount);
  const isPubliclyNamed = employmentRate < 1.55;

  let estimatedLevy = 0;
  if (gap > 0) {
    const monthlyRate = levyMonthlyRate(input.hiredCount, requiredCount);
    estimatedLevy = Math.round((gap * monthlyRate * 12) / 10_000);
  }

  let autoPriority: 'A' | 'B' | 'C';
  if (gap >= 15 || input.hiredCount === 0) {
    autoPriority = 'A';
  } else if (gap >= 6) {
    autoPriority = 'B';
  } else {
    autoPriority = 'C';
  }

  return {
    id,
    name: input.name,
    industry: input.industry,
    industryCode: input.industry,
    region: input.region,
    sector: input.sector,
    totalWorkers: input.totalWorkers,
    requiredCount,
    hiredCount: input.hiredCount,
    employmentRate,
    gap,
    isPubliclyNamed,
    estimatedLevy,
    priority: input.priorityOverride ?? autoPriority,
    contact: input.contact,
    isManual: true,
  };
}

function readAll(): ManualCompany[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(data: ManualCompany[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function getManualCompanies(): ManualCompany[] {
  return readAll();
}

export function addManualCompany(input: ManualCompanyInput): ManualCompany {
  const all = readAll();
  const id = Date.now();
  const company = calcManualCompany(id, input);
  all.push(company);
  writeAll(all);
  return company;
}

export function removeManualCompany(id: number): void {
  const all = readAll().filter((c) => c.id !== id);
  writeAll(all);
}

export function useManualCompanies() {
  const [manualCompanies, setManualCompanies] = useState<ManualCompany[]>(() => readAll());

  const add = useCallback((input: ManualCompanyInput) => {
    const company = addManualCompany(input);
    setManualCompanies((prev) => [...prev, company]);
  }, []);

  const remove = useCallback((id: number) => {
    removeManualCompany(id);
    setManualCompanies((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { manualCompanies, addManualCompany: add, removeManualCompany: remove };
}
