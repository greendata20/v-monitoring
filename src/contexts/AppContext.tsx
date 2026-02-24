import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

interface AppContextType {
  lang: Lang;
  isDark: boolean;
  setLang: (l: Lang) => void;
  toggleDark: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('vdream_lang') as Lang) || 'ko';
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('vdream_dark');
    if (saved !== null) return saved === 'true';
    return false; // 기본값: 라이트 모드
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('vdream_dark', String(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('vdream_lang', lang);
    document.documentElement.lang = lang === 'ja' ? 'ja' : lang === 'en' ? 'en' : 'ko';
  }, [lang]);

  function setLang(l: Lang) { setLangState(l); }
  function toggleDark() { setIsDark(d => !d); }

  function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = translations[lang];
    for (const k of keys) {
      if (obj == null) return key;
      obj = obj[k];
    }
    if (typeof obj !== 'string') return key;
    if (!params) return obj;
    return obj.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  }

  return (
    <AppContext.Provider value={{ lang, isDark, setLang, toggleDark, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
