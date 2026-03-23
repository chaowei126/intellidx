"use client";

import { useI18n } from '../lib/i18n/I18nContext';
import { Language } from '../lib/i18n/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-800 p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_#27272a] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[2px_2px_0px_0px_#27272a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      {(['en', 'zh', 'ja'] as Language[]).map((lang) => (
        <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`w-12 h-10 flex items-center justify-center font-space font-bold text-sm uppercase transition-colors ${
                language === lang 
                ? 'bg-neon-lime text-zinc-950 border-2 border-neon-lime' 
                : 'text-zinc-600 dark:text-zinc-400 border-2 border-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
        >
            {lang}
        </button>
      ))}
    </div>
  );
}
