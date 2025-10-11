import React, {createContext, useCallback, useContext, useMemo} from "react";
import {useQuery} from "@realm/react";
import ruRu from "@ant-design/react-native/lib/locale-provider/ru_RU";
import enUs from "@ant-design/react-native/lib/locale-provider/en_US";
import en from "./en.json";
import ru from "./ru.json";
import {User} from "../realms/user.ts";

export type Language = "en" | "ru";

type Dict = Record<string, string>;

const DICTS: Record<Language, Dict> = {
    en,
    ru,
};

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
    t: TranslateFunc;
    pack: any,
}

const DIC = {
    en: enUs,
    ru: ruRu,
};

const I18nContext = createContext<I18nCtxValue | null>(null);

export const I18nProvider: React.FC<{ initialLanguage?: Language; children: React.ReactNode }> = ({
                                                                                                      initialLanguage = "en",
                                                                                                      children,
                                                                                                  }) => {
    const users = useQuery(User);
    const user = useMemo(() => users[0], [users]);
    console.log(user);
    const lang = useMemo<Language>(() => (user?.lang as Language) || initialLanguage, [initialLanguage, user.lang])

    const t = useCallback<TranslateFunc>((keyOrText: string, ...args: any[]) => {
        const dict = DICTS[lang] as Dict | undefined;
        const fromDict = dict?.[keyOrText];
        const base = typeof fromDict === "string" ? fromDict : keyOrText;
        return format(base, args);
    }, [lang]);

    const pack = useMemo(() => {
        return DIC[lang] || DIC.en
    }, [lang])

    const value = useMemo<I18nCtxValue>(() => ({lang, t, pack}), [lang, t, pack]);

    return React.createElement(I18nContext.Provider, {value}, children as any);
};

export const useI18n = () => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
};

export const useT = (): TranslateFunc => {
    return useI18n().t;
};

export const usePack = () => {
    return useI18n().pack;
};
