import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import en from "./en.json";
import ru from "./ru.json";

export type Language = "en" | "ru";

type Dict = Record<string, any>;

const DICTS: Record<Language, Dict> = { en: en as Dict, ru: ru as Dict };

function getByPath(obj: Dict, path: string): any {
  const parts = path.split(".");
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object" || !(p in cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

function format(template: string, args: any[]): string {
  if (!args || args.length === 0) return template;
  return template.replace(/\{(\d+)\}/g, (_m, iStr) => {
    const i = Number(iStr);
    const val = args[i];
    return val == null ? "" : String(val);
  });
}

export type TranslateFunc = (keyOrText: string, ...args: any[]) => string;

interface I18nCtxValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslateFunc;
}

const I18nContext = createContext<I18nCtxValue | null>(null);

export const I18nProvider: React.FC<{ initialLanguage?: Language; children: React.ReactNode }> = ({
  initialLanguage = "en",
  children,
}) => {
  const [lang, setLang] = useState<Language>(initialLanguage);

  const t = useCallback<TranslateFunc>((keyOrText: string, ...args: any[]) => {
    const dict = DICTS[lang] as Dict;
    // Flat dictionary: keys are real English phrases. If missing, fall back to the provided key/text.
    const fromDict = (dict as any)?.[keyOrText];
    const base = typeof fromDict === "string" ? fromDict : keyOrText;
    return format(base, args);
  }, [lang]);

  const value = useMemo<I18nCtxValue>(() => ({ lang, setLang, t }), [lang, t]);

  // return without JSX to keep .ts extension safe
  return React.createElement(I18nContext.Provider, { value }, children as any);
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const useT = (): TranslateFunc => {
  return useI18n().t;
};
